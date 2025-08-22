import { fal } from '@fal-ai/client';

/**
 * Interface pour les résultats Seedance
 */
interface SeedanceVideoResult {
  data: {
    video: {
      url: string;
    };
    seed: number;
  };
  request_id?: string;
}

/**
 * Génère une vidéo à partir d'un prompt texte avec Seedance
 * Paramètres économiques pour les tests : durée courte, qualité basse
 * @param prompt - Prompt de description pour la vidéo
 * @returns Objet avec videoUrl et requestId ou null en cas d'erreur
 */
export async function generateVideoFromText(prompt: string): Promise<{ videoUrl: string; requestId: string } | null> {
  try {
    console.log('=== SEEDANCE TEXT-TO-VIDEO ===');
    console.log('Prompt:', prompt);
    
    const result = await fal.subscribe('fal-ai/bytedance/seedance/v1/pro/text-to-video', {
      input: {
        prompt: prompt,
        aspect_ratio: "9:16", // Format story
        resolution: "480p", // Qualité basse pour économiser
        duration: "3", // Durée courte pour économiser
        camera_fixed: true, // Caméra fixe pour plus de stabilité
      },
    }) as SeedanceVideoResult;

    console.log('Seedance result:', result);

    if (result && result.data && result.data.video && result.data.video.url) {
      console.log('✅ Vidéo générée avec succès:', result.data.video.url);
      // Note: Seedance via fal.ai utilise l'ID de request fal.ai comme requestId
      return {
        videoUrl: result.data.video.url,
        requestId: result.request_id || `seedance-${Date.now()}`
      };
    }
    
    console.warn('⚠️ Pas de vidéo dans la réponse Seedance');
    return null;
  } catch (error) {
    console.error('❌ Erreur Seedance:', error);
    return null;
  }
}

/**
 * Génère une vidéo à partir d'une image de référence + prompt  
 * Utilise le VRAI modèle image-to-video de Seedance
 * @param prompt - Prompt de description pour l'avatar parlant
 * @param imageUrl - URL de l'image de référence pour créer l'avatar
 * @returns URL de la vidéo générée ou null en cas d'erreur
 */
export async function generateVideoFromImage(prompt: string, imageUrl: string): Promise<{ videoUrl: string; requestId: string } | null> {
  try {
    console.log('=== SEEDANCE IMAGE-TO-VIDEO (VRAI MODÈLE) ===');
    console.log('Prompt:', prompt);
    console.log('Image URL:', imageUrl);
    
    // Utiliser le vrai modèle image-to-video avec l'image en entrée
    const result = await fal.subscribe('fal-ai/bytedance/seedance/v1/pro/image-to-video', {
      input: {
        prompt: `${prompt}. Create a talking avatar video from this person. The person should be speaking naturally with facial expressions and mouth movements.`,
        image_url: imageUrl,
        resolution: "480p", // Qualité la plus basse pour économiser
        duration: "3", // Durée la plus courte pour économiser
        camera_fixed: true, // Caméra fixe pour l'avatar
        enable_safety_checker: true
      },
    }) as SeedanceVideoResult;

    console.log('Seedance IMAGE-TO-VIDEO result:', result);

    if (result && result.data && result.data.video && result.data.video.url) {
      console.log('✅ Avatar parlant généré avec succès:', result.data.video.url);
      return {
        videoUrl: result.data.video.url,
        requestId: result.request_id || `seedance-i2v-${Date.now()}`
      };
    }
    
    console.warn('⚠️ Pas de vidéo dans la réponse Seedance image-to-video');
    return null;
  } catch (error) {
    console.error('❌ Erreur Seedance image-to-video:', error);
    console.error('❌ Error body:', (error as any)?.body);
    console.error('❌ Error status:', (error as any)?.status);
    return null;
  }
}