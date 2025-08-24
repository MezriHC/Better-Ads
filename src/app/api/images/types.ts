export interface GeneratedImage {
  id: string;
  url: string;
  selected: boolean;
  loading?: boolean;
}

export interface ChatMessage {
  text: string;
  images: File[];
  timestamp: number;
  selectedImage?: string;
  generatedImages?: GeneratedImage[];
  isGenerating?: boolean;
}

export interface ImageGenerationRequest {
  prompt: string;
  imageUrl?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  guidanceScale?: number;
  numImages?: number;
}

export interface ImageGenerationResponse {
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  seed: number;
  hasNsfwConcepts: boolean[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
}