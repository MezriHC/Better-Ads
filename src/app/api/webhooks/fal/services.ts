import { AvatarStatus } from '@prisma/client';
import { prisma } from '../../../_shared/database/client';
import { minioService } from '../../../_shared/lib/minio';

interface FalWebhookEvent {
  request_id: string;
  status: 'completed' | 'failed' | 'in_progress';
  data?: {
    video?: {
      url: string;
    };
  };
  error?: string;
}

/**
 * Traite un événement webhook de fal.ai
 */
export async function processWebhookEvent(event: FalWebhookEvent) {
  const { request_id, status, data, error } = event;

  console.log(`🔄 Traitement webhook pour request_id: ${request_id}, status: ${status}`);

  try {
    // Trouver l'avatar correspondant au request_id
    const avatar = await prisma.avatar.findUnique({
      where: {
        falRequestId: request_id
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    if (!avatar) {
      console.warn(`⚠️ Aucun avatar trouvé pour request_id: ${request_id}`);
      return;
    }

    console.log(`📍 Avatar trouvé: ${avatar.id} (${avatar.name})`);

    // Traiter selon le statut
    switch (status) {
      case 'completed':
        await handleCompletedGeneration(avatar, data);
        break;
        
      case 'failed':
        await handleFailedGeneration(avatar, error);
        break;
        
      case 'in_progress':
        console.log(`⏳ Génération en cours pour l'avatar ${avatar.id}`);
        // Rien à faire, l'avatar reste en PENDING
        break;
        
      default:
        console.warn(`❓ Statut webhook inconnu: ${status}`);
    }

  } catch (error) {
    console.error('❌ Erreur lors du traitement du webhook:', error);
    throw error;
  }
}

/**
 * Traite une génération réussie
 */
async function handleCompletedGeneration(
  avatar: { 
    id: string; 
    name: string; 
    user: { id: string; email: string } 
  }, 
  data: { video?: { url: string } }
) {
  try {
    console.log(`✅ Génération réussie pour l'avatar ${avatar.id}`);

    if (!data?.video?.url) {
      throw new Error('Aucune URL de vidéo dans les données de completion');
    }

    const videoUrl = data.video.url;
    console.log(`📹 URL de la vidéo générée: ${videoUrl}`);

    // Générer le chemin final pour la vidéo
    const userId = avatar.user.id || avatar.user.email;
    const finalVideoPath = minioService.generateAvatarPath(
      userId,
      avatar.id,
      'video',
      'mp4'
    );

    // Télécharger et stocker la vidéo dans MinIO
    console.log(`🔄 Téléchargement de la vidéo vers: ${finalVideoPath}`);
    await minioService.uploadFromUrl(
      videoUrl,
      finalVideoPath,
      'video/mp4'
    );

    // Mettre à jour l'avatar en base
    await prisma.avatar.update({
      where: { id: avatar.id },
      data: {
        status: AvatarStatus.SUCCEEDED,
        videoStoragePath: finalVideoPath,
        updatedAt: new Date()
      }
    });

    console.log(`🎉 Avatar ${avatar.id} finalisé avec succès !`);

  } catch (error) {
    console.error(`❌ Erreur lors de la finalisation de l'avatar ${avatar.id}:`, error);
    
    // Marquer l'avatar comme échoué
    await prisma.avatar.update({
      where: { id: avatar.id },
      data: {
        status: AvatarStatus.FAILED,
        updatedAt: new Date()
      }
    });
    
    throw error;
  }
}

/**
 * Traite une génération échouée
 */
async function handleFailedGeneration(
  avatar: { id: string; name: string }, 
  error?: string
) {
  try {
    console.log(`❌ Génération échouée pour l'avatar ${avatar.id}:`, error || 'Erreur inconnue');

    // Mettre à jour l'avatar en base
    await prisma.avatar.update({
      where: { id: avatar.id },
      data: {
        status: AvatarStatus.FAILED,
        updatedAt: new Date()
      }
    });

    console.log(`💥 Avatar ${avatar.id} marqué comme échoué`);

  } catch (dbError) {
    console.error(`❌ Erreur lors de la mise à jour de l'avatar échoué ${avatar.id}:`, dbError);
    throw dbError;
  }
}