import { AvatarType, AvatarStatus } from '@prisma/client';
import { prisma } from '../../_shared/database/client';
import { generateVideoFromImage } from '../../_shared/lib/seedance';
import { minioService } from '../../_shared/lib/minio';

export interface CreateAvatarParams {
  name: string;
  imageUrl: string; // Chemin temporaire dans MinIO
  projectId: string;
  userId: string;
}

/**
 * Crée un nouvel avatar et lance la génération vidéo
 */
export async function createAvatar(params: CreateAvatarParams) {
  const { name, imageUrl, projectId, userId } = params;

  try {
    console.log('🚀 Début de la création d\'avatar:', { name, imageUrl, projectId, userId });

    // 1. Résoudre l'userId : si c'est un email, trouver l'ID Prisma correspondant
    let resolvedUserId = userId;
    
    if (userId.includes('@')) {
      // C'est un email de session, récupérer l'ID Prisma
      const user = await prisma.user.findUnique({
        where: { email: userId },
        select: { id: true }
      });
      
      if (!user) {
        throw new Error('Utilisateur introuvable');
      }
      
      resolvedUserId = user.id;
      console.log('🔄 Résolution userId:', { email: userId, prismaId: resolvedUserId });
    }

    // 2. Vérifier que le projet appartient bien à l'utilisateur
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: resolvedUserId
      }
    });

    if (!project) {
      throw new Error('Projet introuvable ou non autorisé');
    }

    // 3. Créer l'avatar en base avec statut PENDING
    const avatar = await prisma.avatar.create({
      data: {
        name,
        type: AvatarType.PRIVATE,
        status: AvatarStatus.PENDING,
        imageStoragePath: imageUrl, // Chemin temporaire pour l'instant
        userId: resolvedUserId, // Utiliser l'ID Prisma résolu
        projectId
      }
    });

    console.log(`✅ Avatar créé en base: ${avatar.id}`);

    // 3. Déplacer l'image vers son emplacement final
    const finalImagePath = minioService.generateAvatarPath(
      userId,
      avatar.id,
      'image',
      'jpg'
    );

    // Utiliser directement l'URL de l'image pour Seedance
    // Si c'est une URL fal.ai (image générée), l'utiliser directement
    // Sinon, générer l'URL publique MinIO
    let seedanceImageUrl: string;
    if (imageUrl.startsWith('https://fal.media/') || imageUrl.startsWith('http')) {
      seedanceImageUrl = imageUrl; // URL directe
    } else {
      seedanceImageUrl = minioService.getPublicUrl(imageUrl); // URL MinIO
    }

    console.log('🖼️ URL image pour Seedance:', seedanceImageUrl);

    // 4. Lancer la génération vidéo avec Seedance
    console.log('🎬 Lancement de la génération vidéo...');
    const videoResult = await generateVideoFromImage(
      `This person is speaking naturally as an avatar named ${name}. Show them talking with natural facial expressions and mouth movements.`,
      seedanceImageUrl
    );

    if (!videoResult) {
      // Échec de la génération, mettre à jour le statut
      await prisma.avatar.update({
        where: { id: avatar.id },
        data: { status: AvatarStatus.FAILED }
      });
      throw new Error('Échec du lancement de la génération vidéo');
    }

    // 5. Mettre à jour l'avatar avec le requestId pour le suivi
    const updatedAvatar = await prisma.avatar.update({
      where: { id: avatar.id },
      data: {
        falRequestId: videoResult.requestId,
        imageStoragePath: finalImagePath
      }
    });

    console.log(`✅ Avatar mis à jour avec requestId: ${videoResult.requestId}`);

    // 6. Si la génération est immédiate (Seedance synchrone), traiter le résultat
    if (videoResult.videoUrl) {
      console.log('📹 Vidéo générée immédiatement, téléchargement...');
      
      try {
        // Générer le chemin final pour la vidéo
        const finalVideoPath = minioService.generateAvatarPath(
          userId,
          avatar.id,
          'video',
          'mp4'
        );

        // Télécharger et stocker la vidéo
        await minioService.uploadFromUrl(
          videoResult.videoUrl,
          finalVideoPath,
          'video/mp4'
        );

        // CRITICAL: Stocker aussi l'image dans MinIO selon Plan.md
        console.log('🖼️ Stockage de l\'image dans MinIO...');
        await minioService.uploadFromUrl(
          seedanceImageUrl,
          finalImagePath,
          'image/jpeg'
        );
        console.log('✅ Image stockée dans MinIO:', finalImagePath);
        
        // Mettre à jour l'avatar avec le statut SUCCEEDED
        const finalAvatar = await prisma.avatar.update({
          where: { id: avatar.id },
          data: {
            status: AvatarStatus.SUCCEEDED,
            videoStoragePath: finalVideoPath
          }
        });

        console.log(`✅ Avatar finalisé avec succès: ${finalAvatar.id}`);
        return finalAvatar;

      } catch (storageError) {
        console.error('❌ Erreur lors du stockage:', storageError);
        
        // Marquer comme échoué
        await prisma.avatar.update({
          where: { id: avatar.id },
          data: { status: AvatarStatus.FAILED }
        });
        
        throw new Error('Erreur lors du stockage de la vidéo');
      }
    }

    // Si génération asynchrone, retourner l'avatar en attente
    return updatedAvatar;

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'avatar:', error);
    throw error;
  }
}

/**
 * Récupère un avatar par son ID
 */
export async function getAvatarById(avatarId: string, userId: string) {
  // Résoudre l'userId si c'est un email
  let resolvedUserId = userId;
  
  if (userId.includes('@')) {
    const user = await prisma.user.findUnique({
      where: { email: userId },
      select: { id: true }
    });
    
    if (!user) {
      throw new Error('Utilisateur introuvable');
    }
    
    resolvedUserId = user.id;
  }

  const avatar = await prisma.avatar.findFirst({
    where: {
      id: avatarId,
      userId: resolvedUserId // Sécurité : l'utilisateur ne peut voir que ses avatars
    },
    include: {
      project: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  if (!avatar) {
    throw new Error('Avatar introuvable');
  }

  return avatar;
}