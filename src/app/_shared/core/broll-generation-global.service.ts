interface BRollTextToVideoRequest {
  prompt: string;
  aspectRatio?: "21:9" | "16:9" | "4:3" | "1:1" | "3:4" | "9:16";
  resolution?: "480p" | "720p" | "1080p";
  duration?: "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";
  cameraFixed?: boolean;
  seed?: number;
  enableSafetyChecker?: boolean;
}

interface BRollImageToVideoRequest {
  prompt: string;
  imageUrl: string;
  resolution?: "480p" | "720p" | "1080p";
  duration?: "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";
  cameraFixed?: boolean;
  seed?: number;
  enableSafetyChecker?: boolean;
}

interface BRollGenerationResponse {
  video: {
    url: string;
  };
  seed: number;
}

interface GeneratedBRoll {
  videoUrl: string;
  seed: number;
}

class BRollGenerationService {
  async generateTextToVideo(request: BRollTextToVideoRequest): Promise<GeneratedBRoll> {
    try {
      const { fal } = await import('@fal-ai/client');
      
      fal.config({
        credentials: process.env.FAL_AI_API_KEY
      });

      const result = await fal.subscribe("fal-ai/bytedance/seedance/v1/pro/text-to-video", {
        input: {
          prompt: request.prompt,
          aspect_ratio: request.aspectRatio || "16:9",
          resolution: request.resolution || "1080p",
          duration: request.duration || "5",
          camera_fixed: request.cameraFixed || false,
          seed: request.seed
        },
        logs: true,
      });

      const data = result.data as BRollGenerationResponse;

      return {
        videoUrl: data.video.url,
        seed: data.seed || 0
      };
    } catch (error) {
      console.error('Erreur génération text-to-video:', error);
      throw new Error(`Échec génération vidéo B-roll: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  async generateImageToVideo(request: BRollImageToVideoRequest): Promise<GeneratedBRoll> {
    try {
      const { fal } = await import('@fal-ai/client');
      
      fal.config({
        credentials: process.env.FAL_AI_API_KEY
      });

      const result = await fal.subscribe("fal-ai/bytedance/seedance/v1/pro/image-to-video", {
        input: {
          prompt: request.prompt,
          image_url: request.imageUrl,
          resolution: request.resolution || "1080p",
          duration: request.duration || "5",
          camera_fixed: request.cameraFixed || false,
          seed: request.seed
        },
        logs: true,
      });

      const data = result.data as BRollGenerationResponse;

      return {
        videoUrl: data.video.url,
        seed: data.seed || 0
      };
    } catch (error) {
      console.error('Erreur génération image-to-video:', error);
      throw new Error(`Échec génération vidéo B-roll: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  async generateBRoll(request: BRollTextToVideoRequest | BRollImageToVideoRequest): Promise<GeneratedBRoll> {
    if ('imageUrl' in request && request.imageUrl) {
      return this.generateImageToVideo(request as BRollImageToVideoRequest);
    } else {
      return this.generateTextToVideo(request as BRollTextToVideoRequest);
    }
  }
}

export const brollGenerationService = new BRollGenerationService();
export type { BRollTextToVideoRequest, BRollImageToVideoRequest, GeneratedBRoll };