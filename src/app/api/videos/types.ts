export interface GeneratedVideo {
  id: string;
  url: string;
  seedUsed?: number;
  loading?: boolean;
}

export interface VideoGenerationRequest {
  prompt: string;
  imageUrl: string;
  resolution?: '480p' | '720p' | '1080p';
  duration?: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  cameraFixed?: boolean;
  seed?: number;
}

export interface VideoGenerationResponse {
  video: {
    url: string;
  };
  seed: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatMessage {
  text: string;
  images: File[];
  timestamp: number;
  selectedImage?: string;
  generatedVideo?: GeneratedVideo;
  isGeneratingVideo?: boolean;
}