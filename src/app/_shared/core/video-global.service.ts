export interface VideoGenerationRequest {
  prompt: string;
  imageUrl: string;
  resolution?: '480p' | '720p' | '1080p';
  duration?: '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  cameraFixed?: boolean;
  seed?: number;
}

export interface VideoGenerationResponse {
  video: {
    url: string;
  };
  seed: number;
}

export interface GeneratedVideo {
  id: string;
  url: string;
  seedUsed?: number;
  loading?: boolean;
}

class VideoGlobalService {
  private readonly baseUrl = 'https://fal.run/fal-ai';
  private readonly imageToVideoEndpoint = 'bytedance/seedance/v1/pro/image-to-video';

  async generateImageToVideo(request: VideoGenerationRequest): Promise<GeneratedVideo> {
    if (!request.imageUrl) {
      throw new Error('Image URL is required for image-to-video generation');
    }

    const response = await fetch(`${this.baseUrl}/${this.imageToVideoEndpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        image_url: request.imageUrl,
        resolution: request.resolution || '1080p',
        duration: request.duration || '5',
        camera_fixed: request.cameraFixed || false,
        seed: request.seed || -1,
        enable_safety_checker: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || errorData.message || response.statusText;
      throw new Error(`Video generation failed: ${errorMessage}`);
    }

    const data: VideoGenerationResponse = await response.json();
    
    return {
      id: `video_${Date.now()}`,
      url: data.video.url,
      seedUsed: data.seed,
      loading: false,
    };
  }
}

export const videoGlobalService = new VideoGlobalService();