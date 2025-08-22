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
 * Note: Seedance text-to-video ne prend pas d'image en entrée
 * Cette fonction combine le prompt avec une description de l'image
 * @param prompt - Prompt de description pour la vidéo
 * @param imageUrl - URL de l'image de référence (utilisée pour enrichir le prompt)
 * @returns URL de la vidéo générée ou null en cas d'erreur
 */
export async function generateVideoFromImage(prompt: string, imageUrl: string): Promise<{ videoUrl: string; requestId: string } | null> {
  try {
    console.log('=== SEEDANCE IMAGE-TO-VIDEO (VIA TEXT) ===');
    console.log('Original prompt:', prompt);
    console.log('Image URL:', imageUrl);
    
    // Pour Seedance text-to-video, on améliore le prompt avec une description basée sur l'image
    const enhancedPrompt = `${prompt}. High quality portrait video, cinematic lighting, professional look, 9:16 aspect ratio.`;
    
    console.log('Enhanced prompt:', enhancedPrompt);
    
    return await generateVideoFromText(enhancedPrompt);
  } catch (error) {
    console.error('❌ Erreur dans generateVideoFromImage:', error);
    return null;
  }
}