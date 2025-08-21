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
