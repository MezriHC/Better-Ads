import { AvatarType, AvatarStatus } from '@prisma/client';
import { prisma } from '../../_shared/database/client';
import { falAiService } from '../../_shared/lib/falAi';
import { minioService } from '../../_shared/lib/minio';
import { logger } from '../../_shared/utils/logger';

export interface CreateAvatarParams {
  name: string;
  imageUrl: string; // URL fal.ai (générée) ou blob URL (uploadée)
  projectId: string;
  userId: string;
  imageFile?: File; // Fichier original si image uploadée
}

/**
 * Crée un nouvel avatar et lance la génération vidéo
 */
export async function createAvatar(params: CreateAvatarParams) {
  const { name, imageUrl, projectId, userId, imageFile } = params;

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

    // 4. Vérifier que l'image est accessible pour fal.ai
    let finalImageUrl = imageUrl;
    if (imageUrl.startsWith('https://fal.media')) {
      logger.server.info('📥 URL fal.media détectée. Rapatriement vers MinIO...');
      const tempKey = minioService.generateTempUploadPath(resolvedUserId, 'jpg');
      
      await minioService.uploadFromUrl(imageUrl, tempKey, 'image/jpeg');
      
      const useSSL = process.env.MINIO_USE_SSL === 'true';
      const protocol = useSSL ? 'https' : 'http';
      finalImageUrl = `${protocol}://${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/${tempKey}`;

      logger.server.info(`✅ Image rapatriée et nouvelle URL publique : ${finalImageUrl}`);
    }

    if (finalImageUrl.startsWith('blob:') || finalImageUrl.startsWith('http://localhost')) {
      logger.server.error('❌ URL blob ou localhost détectée - non accessible par fal.ai');
      await prisma.avatar.update({
        where: { id: avatar.id },
        data: { status: AvatarStatus.FAILED }
      });
      throw new Error('URL d\'image non accessible par fal.ai. L\'image doit être uploadée sur MinIO d\'abord.');
    }
    
    logger.server.info('✅ URL d\'image valide pour fal.ai:', finalImageUrl);

    // 5. Lancer la génération vidéo avec fal.ai
    logger.server.info('🎬 Lancement de la génération vidéo...');
    
    try {
      const falResult = await falAiService.generateVideoFromImage({
        imageUrl: finalImageUrl,
        prompt: `This person is speaking naturally as an avatar named ${name}. Show them talking with natural facial expressions and mouth movements.`,
      });

      if (!falResult?.requestId) {
        logger.server.error('❌ Pas de requestId retourné par fal.ai');
        await prisma.avatar.update({
          where: { id: avatar.id },
          data: { status: AvatarStatus.FAILED }
        });
        throw new Error('Échec du lancement de la génération vidéo');
      }

      // 6. Mettre à jour l'avatar avec le requestId pour le suivi
      const updatedAvatar = await prisma.avatar.update({
        where: { id: avatar.id },
        data: { 
          falRequestId: falResult.requestId,
          status: AvatarStatus.PENDING,
          imageStoragePath: finalImagePath
        }
      });

      logger.server.info('✅ Avatar mis à jour avec requestId fal.ai:', falResult.requestId);
      return updatedAvatar;

    } catch (error: any) {
      logger.server.error('❌ Erreur fal.ai:', error);
      if (error && typeof error === 'object' && 'body' in error) {
        logger.server.error('❌ Corps de l\'erreur fal.ai:', JSON.stringify(error.body, null, 2));
      }
      await prisma.avatar.update({
        where: { id: avatar.id },
        data: { status: AvatarStatus.FAILED }
      });
      throw new Error('Échec du lancement de la génération vidéo');
    }

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
