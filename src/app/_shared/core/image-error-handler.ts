export class ImageGenerationError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'ImageGenerationError';
  }
}

export class ImageUploadError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'ImageUploadError';
  }
}

export const handleImageError = (error: unknown): string => {
  if (error instanceof ImageGenerationError) {
    return `Generation failed: ${error.message}`;
  }
  
  if (error instanceof ImageUploadError) {
    return `Upload failed: ${error.message}`;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};