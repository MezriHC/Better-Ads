interface ImageGenerationRequest {
  prompt: string;
  imageUrl?: string;
  aspectRatio?: string;
  guidanceScale?: number;
  numImages?: number;
}

interface ImageGenerationResponse {
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  seed: number;
  hasNsfwConcepts: boolean[];
}

interface GeneratedImage {
  id: string;
  url: string;
  selected: boolean;
  loading?: boolean;
}

class ImageGenerationService {
  private readonly baseUrl = 'https://fal.run/fal-ai';
  private readonly textToImageEndpoint = 'flux-pro/kontext/text-to-image';
  private readonly imageToImageEndpoint = 'flux-pro/kontext';

  async generateTextToImage(request: ImageGenerationRequest): Promise<GeneratedImage[]> {
    const response = await fetch(`${this.baseUrl}/${this.textToImageEndpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        aspect_ratio: request.aspectRatio || '9:16',
        guidance_scale: request.guidanceScale || 3.5,
        num_images: request.numImages || 1,
        output_format: 'jpeg',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Text-to-image generation failed: ${response.statusText}. ${errorData.detail || ''}`);
    }

    const data: ImageGenerationResponse = await response.json();
    
    return data.images.map((img, index) => ({
      id: `img_${Date.now()}_${index}`,
      url: img.url,
      selected: false,
    }));
  }

  async generateImageToImage(request: ImageGenerationRequest): Promise<GeneratedImage[]> {
    if (!request.imageUrl) {
      throw new Error('Reference image URL is required for image-to-image generation');
    }

    const response = await fetch(`${this.baseUrl}/${this.imageToImageEndpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        image_url: request.imageUrl,
        aspect_ratio: request.aspectRatio || '9:16',
        guidance_scale: request.guidanceScale || 3.5,
        num_images: request.numImages || 1,
        output_format: 'jpeg',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Image-to-image generation failed: ${response.statusText}. ${errorData.detail || ''}`);
    }

    const data: ImageGenerationResponse = await response.json();
    
    return data.images.map((img, index) => ({
      id: `img_${Date.now()}_${index}`,
      url: img.url,
      selected: false,
    }));
  }

  async generateImages(request: ImageGenerationRequest): Promise<GeneratedImage[]> {
    return request.imageUrl 
      ? this.generateImageToImage(request)
      : this.generateTextToImage(request);
  }
}

export const imageGenerationService = new ImageGenerationService();