/**
 * Service d'upload d'images TEMPORAIRE
 * Workflow CORRECT : Image reste en mémoire jusqu'à génération réussie
 * Ensuite image + vidéo uploadées ENSEMBLE dans MinIO
 */

export interface ImageUploadResult {
  displayUrl: string; // URL temporaire pour affichage frontend (blob ou base64)
  originalFile: File; // Fichier original à utiliser pour génération + stockage final
}

/**
 * Prépare une image pour l'affichage et la génération d'avatar
 * L'image n'est PAS uploadée vers MinIO immédiatement
 * @param file - Fichier image sélectionné
 * @returns Résultat avec URL temporaire et fichier original
 */
export async function prepareImageForAvatar(file: File): Promise<ImageUploadResult | null> {
  try {
    console.log('🖼️ Préparation image pour avatar:', file.name, file.type);

    // Validation du fichier
    if (!file.type.startsWith('image/')) {
      throw new Error('Le fichier doit être une image');
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB max
      throw new Error('La taille du fichier ne peut pas dépasser 10MB');
    }

    // Créer une URL temporaire pour l'affichage (Object URL)
    const displayUrl = URL.createObjectURL(file);
    
    console.log('✅ Image préparée pour génération d\'avatar');

    return {
      displayUrl, // URL blob temporaire pour affichage
      originalFile: file // Fichier original pour génération + stockage final
    };

  } catch (error) {
    console.error('❌ Erreur préparation image:', error);
    return null;
  }
}

/**
 * Nettoie l'URL temporaire quand elle n'est plus nécessaire
 * @param displayUrl - URL blob à nettoyer
 */
export function cleanupImageUrl(displayUrl: string) {
  if (displayUrl.startsWith('blob:')) {
    URL.revokeObjectURL(displayUrl);
    console.log('🧹 URL temporaire nettoyée');
  }
}