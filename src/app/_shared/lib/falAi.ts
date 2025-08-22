import { fal } from '@fal-ai/client';

/**
 * Génère des images à partir d'un prompt texte.
 */
interface FalImageResult {
  data: {
    images: Array<{ url: string }>;
  };
}

export async function generateImageFromText(prompt: string): Promise<string[] | null> {
  try {
    const result = await fal.subscribe('fal-ai/flux-pro/kontext/max/text-to-image', {
      input: {
        prompt: prompt,
        num_images: 4,
        guidance_scale: 3.5, // Valeur par défaut pour text-to-image
        aspect_ratio: "9:16", // Format story
        output_format: "jpeg",
        safety_tolerance: "2"
      },
    }) as FalImageResult;

    if (result && result.data && result.data.images && result.data.images.length > 0) {
      const imageUrls = result.data.images.map((image) => image.url);
      return imageUrls;
    }
    return null;
  } catch {
    // En production, logguer sur un service de monitoring
    return null;
  }
}

/**
 * Modifie une image existante à partir d'un prompt texte.
 */
export async function modifyImage(prompt: string, imageUrl: string): Promise<string[] | null> {
  try {
    const result = await fal.subscribe('fal-ai/flux-pro/kontext/max', {
      input: {
        prompt: prompt,
        image_url: imageUrl,
        num_images: 4,
        guidance_scale: 7.5, // Plus élevé pour mieux suivre le prompt de modification
        aspect_ratio: "9:16", // Format story
        output_format: "jpeg",
        safety_tolerance: "2"
      },
    }) as FalImageResult;

    if (result && result.data && result.data.images && result.data.images.length > 0) {
      const imageUrls = result.data.images.map((image) => image.url);
      return imageUrls;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Génère une vidéo à partir d'une image (image-to-video)
 */
async function generateVideoFromImage({ imageUrl, prompt }: { imageUrl: string, prompt: string }) {
  try {
    console.log('=== FAL.AI SEEDANCE IMAGE-TO-VIDEO ===');
    console.log('Prompt:', prompt);
    console.log('Image URL:', imageUrl);

    const result = await fal.subscribe('fal-ai/bytedance/seedance/v1/pro/image-to-video', {
      input: {
        prompt: prompt,
        image_url: imageUrl,
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log('Queue update:', update);
      }
    });

    console.log('✅ Résultat fal.ai image-to-video:', result);
    return result;
  } catch (error: any) {
    console.error('❌ Erreur fal.ai image-to-video:', error);
    if (error && typeof error === 'object' && 'body' in error) {
      console.error('❌ Corps de l\'erreur fal.ai:', JSON.stringify(error.body, null, 2));
    }
    throw error;
  }
}

/**
 * Récupère le résultat d'une génération vidéo en cours
 */
async function getResult(requestId: string) {
  try {
    console.log('🔍 Récupération du résultat fal.ai pour request_id:', requestId);
    
    const result = await fal.queue.result('fal-ai/stable-video', {
      requestId
    });

    console.log('✅ Résultat récupéré:', result);
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du résultat:', error);
    throw error;
  }
}

export const falAiService = {
  generateImageFromText,
  modifyImage,
  generateVideoFromImage,
  getResult
};
