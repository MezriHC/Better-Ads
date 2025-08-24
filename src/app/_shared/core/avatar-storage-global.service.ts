import * as Minio from 'minio';

interface AvatarUploadOptions {
  userId: string;
  videoUrl: string;
  filename?: string;
  isPublic?: boolean;
}

interface StoredAvatar {
  id: string;
  url: string;
  path: string;
  bucket: string;
  size: number;
  uploadedAt: string;
}

class AvatarStorageService {
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

  async uploadAvatarFromUrl(options: AvatarUploadOptions): Promise<StoredAvatar> {
    const { userId, videoUrl, filename, isPublic = false } = options;
    
    try {
      const videoId = filename || `avatar_${Date.now()}`;
      const folderPath = isPublic 
        ? 'videos/avatars/public' 
        : 'videos/avatars/private';
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
      throw new Error(`Avatar upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPresignedUrl(objectPath: string, expiresIn: number = 24 * 60 * 60): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(this.bucket, objectPath, expiresIn);
    } catch (error) {
      throw new Error(`Failed to generate presigned URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteAvatar(objectPath: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucket, objectPath);
    } catch (error) {
      throw new Error(`Failed to delete avatar: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listUserAvatars(userId: string, isPublic: boolean = false): Promise<string[]> {
    try {
      const folderPath = isPublic 
        ? `videos/avatars/public/${userId}/` 
        : `videos/avatars/private/${userId}/`;
      
      const objectsStream = this.minioClient.listObjects(this.bucket, folderPath);
      const objects: string[] = [];
      
      for await (const obj of objectsStream) {
        objects.push(obj.name);
      }
      
      return objects;
    } catch (error) {
      throw new Error(`Failed to list user avatars: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAvatarStats(objectPath: string): Promise<{ size: number; lastModified: Date; etag: string }> {
    try {
      return await this.minioClient.statObject(this.bucket, objectPath);
    } catch (error) {
      throw new Error(`Failed to get avatar stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  generateAvatarId(): string {
    return `avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const avatarStorageService = new AvatarStorageService();