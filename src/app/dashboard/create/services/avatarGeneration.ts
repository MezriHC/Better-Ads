/**
 * Service de génération d'avatars
 * Remplace mockGeneration.ts avec de vraies APIs
 */

import { CreateAvatarRequest, UploadRequest, UploadResponse } from '../../../_shared/types/common';

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
 * 3. Lancement de la génération vidéo Seedance
 */
export async function generateAvatar(
  name: string,
  imageFile: File | string, // File pour upload, string pour URL existante
  projectId: string
): Promise<AvatarGenerationResult> {
  let imageUrl: string;

  try {
    // Étape 1: Upload de l'image si nécessaire
    if (typeof imageFile === 'string') {
      // L'image est déjà une URL (image générée par fal.ai)
      imageUrl = imageFile;
    } else {
      // Upload de l'image vers MinIO
      console.log('📤 Upload de l\'image vers MinIO...');
      
      // Demander une URL d'upload signée
      const uploadRequest: UploadRequest = {
        fileName: imageFile.name,
        contentType: imageFile.type
      };

      const uploadResponse = await fetch('/api/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadRequest),
      });

      if (!uploadResponse.ok) {
        throw new Error('Échec de la demande d\'upload');
      }

      const uploadData: UploadResponse = await uploadResponse.json();

      // Upload direct vers MinIO avec l'URL signée
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile);

      const minioUploadResponse = await fetch(uploadData.uploadUrl, {
        method: 'PUT',
        body: imageFile,
        headers: {
          'Content-Type': imageFile.type,
        },
      });

      if (!minioUploadResponse.ok) {
        throw new Error('Échec de l\'upload vers MinIO');
      }

      imageUrl = uploadData.filePath;
      console.log('✅ Image uploadée vers MinIO:', imageUrl);
    }

    // Étape 2: Créer l'avatar et lancer la génération vidéo
    console.log('🎬 Création de l\'avatar et lancement de la génération...');
    
    const avatarRequest: CreateAvatarRequest = {
      name,
      imageUrl,
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