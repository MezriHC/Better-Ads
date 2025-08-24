interface UploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
}

class ImageUploadService {
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  validateFile(file: File): void {
    if (!this.allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    if (file.size > this.maxFileSize) {
      throw new Error('File size exceeds 10MB limit.');
    }
  }

  async uploadToFal(file: File): Promise<UploadResponse> {
    this.validateFile(file);

    try {
      // Import dynamique du client fal.ai pour éviter les erreurs de configuration
      const { fal } = await import('@fal-ai/client');
      
      // Configuration de l'API key via variable d'environnement
      process.env.FAL_KEY = process.env.FAL_AI_API_KEY;
      
      // Upload du fichier
      const url = await fal.storage.upload(file);
      
      return {
        url,
        fileName: file.name,
        fileSize: file.size,
      };
    } catch (error) {
      throw new Error(`Upload to fal.ai failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  createObjectUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  revokeObjectUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}

export const imageUploadService = new ImageUploadService();