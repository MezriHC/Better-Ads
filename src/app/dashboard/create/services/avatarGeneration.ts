/**
 * Service de génération d'avatars
 * Remplace mockGeneration.ts avec de vraies APIs
 */

import { CreateAvatarRequest } from '../../../_shared/types/common';

export interface AvatarGenerationResult {
  id: string;
  title: string;
  imageUrl: string;
  videoStoragePath?: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  projectId: string;
  createdAt: string;
}

/**
 * Génère un avatar réel via le workflow complet Plan.md
 * 1. Upload de l'image vers MinIO
 * 2. Création de l'avatar en base
 * 3. Lancement de la génération vidéo fal.ai
 */
export async function generateAvatar(
  name: string,
  imageFile: File | string, // File pour upload, string pour URL existante
  projectId: string
): Promise<AvatarGenerationResult> {
  let finalImageUrl: string;

  try {
    // Étape 1: Préparer l'image selon son type
    if (typeof imageFile === 'string') {
      // L'image est déjà une URL (image générée par fal.ai)
      finalImageUrl = imageFile;
      console.log('🖼️ Image générée par fal.ai, URL prête:', finalImageUrl);
    } else {
      // Image uploadée : WORKFLOW PLAN.MD - Upload vers MinIO d'abord
      console.log('� Upload de l\'image vers MinIO...');
      
      // 1. Demander URL d'upload sécurisée à notre backend
      const uploadResponse = await fetch('/api/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: imageFile.name,
          fileType: imageFile.type,
          fileSize: imageFile.size
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL from server');
      }

      const { uploadUrl, publicUrl } = await uploadResponse.json();
      
      // 2. Upload directement vers MinIO avec l'URL signée
      const minioResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: imageFile,
        headers: {
          'Content-Type': imageFile.type,
        },
      });

      if (!minioResponse.ok) {
        throw new Error('Failed to upload image to MinIO');
      }

      // 3. Utiliser l'URL publique retournée par le backend
      finalImageUrl = publicUrl;
      console.log('✅ Image uploadée sur MinIO:', finalImageUrl);
    }

    // Étape 2: Créer l'avatar avec l'URL accessible (Plan.md workflow)
    console.log('🎬 Création de l\'avatar avec URL accessible...');
    
    const avatarRequest: CreateAvatarRequest = {
      name,
      imageUrl: finalImageUrl, // URL MinIO ou fal.ai - accessible publiquement
      projectId
    };

    const avatarResponse = await fetch('/api/avatars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(avatarRequest),
    });

    if (!avatarResponse.ok) {
      const errorData = await avatarResponse.json();
      throw new Error(errorData.error || 'Échec de la création d\'avatar');
    }

    const avatar = await avatarResponse.json();
    
    console.log('✅ Avatar créé avec succès:', avatar.id);

    return {
      id: avatar.id,
      title: avatar.name,
      imageUrl: avatar.imageStoragePath,
      status: avatar.status === 'PENDING' ? 'processing' : 'ready',
      projectId: avatar.projectId,
      createdAt: avatar.createdAt
    };

  } catch (error) {
    console.error('❌ Erreur lors de la génération d\'avatar:', error);
    throw error;
  }
}

/**
 * Vérifie le statut d'un avatar en cours de génération
 */
export async function checkAvatarStatus(avatarId: string): Promise<AvatarGenerationResult | null> {
  try {
    const response = await fetch(`/api/avatars/${avatarId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`⚠️ Avatar ${avatarId} non trouvé (peut-être supprimé)`);
        return null;
      }
      throw new Error(`Erreur ${response.status} lors de la vérification du statut`);
    }

    const avatar = await response.json();

    return {
      id: avatar.id,
      title: avatar.name,
      imageUrl: avatar.imageStoragePath,
      videoStoragePath: avatar.videoStoragePath,
      status: avatar.status === 'PENDING' ? 'processing' : 
              avatar.status === 'SUCCEEDED' ? 'ready' : 'failed',
      projectId: avatar.projectId,
      createdAt: avatar.createdAt
    };

  } catch (error) {
    console.error('❌ Erreur lors de la vérification du statut:', error);
    return null;
  }
}

/**
 * Polling pour attendre la fin de génération d'un avatar
 */
export async function waitForAvatarCompletion(
  avatarId: string,
  onProgress?: (status: string) => void,
  maxWaitTime: number = 300000 // 5 minutes
): Promise<AvatarGenerationResult | null> {
  const startTime = Date.now();
  const pollInterval = 3000; // 3 secondes

  return new Promise((resolve) => {
    const poll = async () => {
      // Vérifier le timeout
      if (Date.now() - startTime > maxWaitTime) {
        console.warn('⏰ Timeout atteint pour la génération d\'avatar');
        resolve(null);
        return;
      }

      const status = await checkAvatarStatus(avatarId);
      
      if (!status) {
        resolve(null);
        return;
      }

      onProgress?.(status.status);

      if (status.status === 'ready' || status.status === 'failed') {
        resolve(status);
        return;
      }

      // Continuer le polling
      setTimeout(poll, pollInterval);
    };

    poll();
  });
}
