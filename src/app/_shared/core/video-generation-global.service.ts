interface VideoGenerationRequest {
  prompt: string;
  imageUrl: string;
  resolution?: "480p" | "720p" | "1080p";
  duration?: "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";
  cameraFixed?: boolean;
  seed?: number;
  enableSafetyChecker?: boolean;
}

interface VideoGenerationResponse {
  video: {
    url: string;
  };
  seed: number;
}

interface GeneratedVideo {
  id: string;
  url: string;
  posterUrl?: string;
  status: "processing" | "ready" | "failed";
  createdAt: string;
  metadata?: {
    resolution: string;
    duration: string;
    seed: number;
  };
}

class VideoGenerationService {
  private readonly modelId = 'fal-ai/bytedance/seedance/v1/pro/image-to-video';

  async generateImageToVideo(request: VideoGenerationRequest): Promise<GeneratedVideo> {
    try {
      // Import dynamique du client fal.ai pour éviter les erreurs de configuration
      const { fal } = await import('@fal-ai/client');
      
      // Configuration de l'API key - Méthode recommandée par fal.ai
      const apiKey = process.env.FAL_AI_API_KEY;
      
      if (!apiKey) {
        throw new Error('FAL_AI_API_KEY environment variable is not set');
      }
      
      // Configuration manuelle du client fal.ai
      fal.config({
        credentials: apiKey
      });
      
      // Appel au modèle Seedance via le client fal.ai
      const result = await fal.subscribe(this.modelId, {
        input: {
          prompt: request.prompt,
          image_url: request.imageUrl,
          resolution: request.resolution || '1080p',
          duration: request.duration || '5',
          camera_fixed: request.cameraFixed || false,
          seed: request.seed,
        },
        logs: true,
      });

      const data = result.data as VideoGenerationResponse;
      
      return {
        id: `video_${Date.now()}`,
        url: data.video.url,
        posterUrl: request.imageUrl,
        status: "ready",
        createdAt: new Date().toISOString(),
        metadata: {
          resolution: request.resolution || '1080p',
          duration: request.duration || '5',
          seed: data.seed,
        }
      };
    } catch (error) {
      throw new Error(`Image-to-video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const videoGenerationService = new VideoGenerationService();