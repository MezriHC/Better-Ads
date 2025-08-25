import * as Minio from 'minio';

interface BRollUploadOptions {
  userId: string;
  videoUrl: string;
  filename?: string;
  isPublic?: boolean;
}

interface StoredBRoll {
  id: string;
  url: string;
  path: string;
  bucket: string;
  size: number;
  uploadedAt: string;
  thumbnailUrl?: string;
}

class BRollStorageService {
  private minioClient: Minio.Client;
  private bucket = 'better-ads';

  constructor() {
    if (!process.env.MINIO_ACCESS_KEY || !process.env.MINIO_SECRET_KEY) {
      throw new Error('MINIO_ACCESS_KEY and MINIO_SECRET_KEY environment variables are required');
    }

    this.minioClient = new Minio.Client({
      endPoint: 'minioapi.trybetterads.com',
      port: 443,
      useSSL: true,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  async uploadBRollFromUrl(options: BRollUploadOptions): Promise<StoredBRoll> {
    const { userId, videoUrl, filename, isPublic = false } = options;
    
    try {
      const videoId = filename || this.generateBRollId();
      const folderPath = isPublic 
        ? 'videos/broll/public' 
        : 'videos/broll/private';
      const objectPath = `${folderPath}/${userId}/${videoId}.mp4`;
      
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }
      
      const videoBuffer = await response.arrayBuffer();
      const videoStream = Buffer.from(videoBuffer);
      
      const uploadInfo = await this.minioClient.putObject(
        this.bucket,
        objectPath,
        videoStream,
        videoStream.length,
        {
          'Content-Type': 'video/mp4',
          'User-ID': userId,
          'Original-URL': videoUrl,
          'Upload-Date': new Date().toISOString(),
        }
      );

      return {
        id: videoId,
        url: await this.getPresignedUrl(objectPath),
        path: objectPath,
        bucket: this.bucket,
        size: videoStream.length,
        uploadedAt: new Date().toISOString(),
      };
      
    } catch (error) {
      throw new Error(`B-Roll upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPresignedUrl(objectPath: string, expiresIn: number = 24 * 60 * 60): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(this.bucket, objectPath, expiresIn);
    } catch (error) {
      throw new Error(`Failed to generate presigned URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteBRoll(objectPath: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucket, objectPath);
    } catch (error) {
      throw new Error(`Failed to delete B-Roll: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listUserBRolls(userId: string, isPublic: boolean = false): Promise<string[]> {
    try {
      const folderPath = isPublic 
        ? `videos/broll/public/${userId}/` 
        : `videos/broll/private/${userId}/`;
      
      const objectsStream = this.minioClient.listObjects(this.bucket, folderPath);
      const objects: string[] = [];
      
      for await (const obj of objectsStream) {
        objects.push(obj.name);
      }
      
      return objects;
    } catch (error) {
      throw new Error(`Failed to list user B-Rolls: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getBRollStats(objectPath: string): Promise<{ size: number; lastModified: Date; etag: string }> {
    try {
      return await this.minioClient.statObject(this.bucket, objectPath);
    } catch (error) {
      throw new Error(`Failed to get B-Roll stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  generateBRollId(): string {
    return `broll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const brollStorageService = new BRollStorageService();
export type { BRollUploadOptions, StoredBRoll };