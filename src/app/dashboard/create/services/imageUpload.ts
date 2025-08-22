/**
 * Service d'upload d'images vers MinIO
 * Workflow complet : demande URL signée → upload direct → retour chemin
 */

export interface UploadRequest {
  fileName: string;
  contentType: string;
}

export interface UploadResponse {
  uploadUrl: string;
  filePath: string;
  expiresIn: number;
}

export interface ImageUploadResult {
  displayUrl: string; // URL pour affichage frontend via proxy
  storagePath: string; // Chemin MinIO pour le backend
}

/**
 * Upload une image vers MinIO via URL signée
 * @param file - Fichier image à uploader
 * @returns Résultat avec URL d'affichage et chemin stockage ou null en cas d'erreur
 */
export async function uploadImageToMinio(file: File): Promise<ImageUploadResult | null> {
  try {
    console.log('📤 Début upload image:', file.name, file.type);

    // 1. Demander une URL d'upload signée
    const uploadRequest: UploadRequest = {
      fileName: file.name,
      contentType: file.type
    };

    const uploadResponse = await fetch('/api/uploads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadRequest),
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(errorData.error || 'Échec de la demande d\'upload');
    }

    const uploadData: UploadResponse = await uploadResponse.json();
    console.log('✅ URL signée obtenue:', uploadData.filePath);

    // 2. Upload direct vers MinIO avec l'URL signée
    const minioUploadResponse = await fetch(uploadData.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!minioUploadResponse.ok) {
      throw new Error(`Échec upload MinIO: ${minioUploadResponse.status}`);
    }

    console.log('✅ Image uploadée vers MinIO:', uploadData.filePath);

    // 3. Retourner les deux URLs nécessaires
    return {
      displayUrl: `/api/media/${uploadData.filePath}`, // Pour affichage frontend
      storagePath: uploadData.filePath // Pour backend (avatar service)
    };

  } catch (error) {
    console.error('❌ Erreur upload image:', error);
    return null;
  }
}