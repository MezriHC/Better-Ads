import { modifyImage } from '../../../_shared/lib/falAi';
import { ImageToImageRequest } from './types';

export async function handleImageToImageGeneration(data: ImageToImageRequest) {
  const { prompt, imageUrl } = data;

  console.log('--- IMAGE-TO-IMAGE GENERATION ---');
  console.log('Prompt:', prompt);
  console.log('Reference Image URL:', imageUrl);

  const imageUrls = await modifyImage(prompt, imageUrl);

  if (!imageUrls || imageUrls.length === 0) {
    throw new Error('La modification de l\'image a échoué au niveau du service fal.ai.');
  }

  return { imageUrls };
}
