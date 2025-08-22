import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Service pour la gestion des fichiers MinIO/S3
 * Génère des URLs signées pour uploads sécurisés et gestion des fichiers
 */
export class MinioService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.MINIO_BUCKET_NAME || 'better-ads';
    
    const useSSL = process.env.MINIO_USE_SSL === 'true';
    const protocol = useSSL ? 'https' : 'http';
    const port = process.env.MINIO_PORT || (useSSL ? '443' : '9000');
    
    this.s3Client = new S3Client({
      endpoint: `${protocol}://${process.env.MINIO_ENDPOINT}:${port}`,
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY!,
        secretAccessKey: process.env.MINIO_SECRET_KEY!,
      },
      forcePathStyle: true,
    });
  }

  /**
   * Génère une URL signée pour l'upload d'un fichier
   * @param key - Chemin du fichier dans le bucket
   * @param contentType - Type MIME du fichier
   * @param expiresIn - Durée de validité en secondes (défaut: 1 heure)
   */
  async generateUploadUrl(
    key: string, 
    contentType: string, 
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      console.log(`✅ URL d'upload générée pour: ${key}`);
      return signedUrl;
    } catch (error) {
      console.error('❌ Erreur lors de la génération de l\'URL d\'upload:', error);
      throw new Error(`Impossible de générer l'URL d'upload: ${error}`);
    }
  }

  /**
   * Génère une URL signée pour le téléchargement d'un fichier
   * @param key - Chemin du fichier dans le bucket
   * @param expiresIn - Durée de validité en secondes (défaut: 1 heure)
   */
  async generateDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      console.log(`✅ URL de téléchargement générée pour: ${key}`);
      return signedUrl;
    } catch (error) {
      console.error('❌ Erreur lors de la génération de l\'URL de téléchargement:', error);
      throw new Error(`Impossible de générer l'URL de téléchargement: ${error}`);
    }
  }

  /**
   * Upload un fichier depuis une URL vers MinIO
   * @param sourceUrl - URL source du fichier à télécharger
   * @param destinationKey - Chemin de destination dans le bucket
   * @param contentType - Type MIME du fichier
   */
  async uploadFromUrl(
    sourceUrl: string, 
    destinationKey: string, 
    contentType: string
  ): Promise<void> {
    try {
      console.log(`🔄 Téléchargement depuis: ${sourceUrl}`);
      
      // Télécharger le fichier depuis l'URL source
      const response = await fetch(sourceUrl);
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      const fileBuffer = await response.arrayBuffer();
      
      // Uploader vers MinIO
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: destinationKey,
        Body: Buffer.from(fileBuffer),
        ContentType: contentType,
      });

      await this.s3Client.send(command);
      console.log(`✅ Fichier uploadé vers: ${destinationKey}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload depuis URL:', error);
      throw new Error(`Impossible d'uploader le fichier: ${error}`);
    }
  }

  /**
   * Supprime un fichier du bucket
   * @param key - Chemin du fichier dans le bucket
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      console.log(`✅ Fichier supprimé: ${key}`);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      throw new Error(`Impossible de supprimer le fichier: ${error}`);
    }
  }

  /**
   * Upload un fichier File directement vers MinIO
   * @param file - Fichier à uploader
   * @param destinationKey - Chemin de destination dans le bucket
   */
  async uploadFile(file: File, destinationKey: string): Promise<void> {
    try {
      console.log(`📤 Upload fichier direct: ${file.name} vers ${destinationKey}`);
      
      // Convertir File en Buffer
      const fileBuffer = await file.arrayBuffer();
      
      // Uploader vers MinIO
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: destinationKey,
        Body: new Uint8Array(fileBuffer),
        ContentType: file.type,
        ContentLength: file.size
      });

      await this.s3Client.send(command);
      console.log(`✅ Fichier uploadé vers: ${destinationKey}`);
    } catch (error) {
      console.error(`❌ Erreur upload fichier: ${error}`);
      throw new Error(`Impossible d'uploader le fichier: ${error}`);
    }
  }

  /**
   * Génère un chemin unique pour un fichier d'avatar
   * @param userId - ID de l'utilisateur
   * @param avatarId - ID de l'avatar
   * @param fileType - Type de fichier ('image' ou 'video')
   * @param extension - Extension du fichier
   */
  generateAvatarPath(
    userId: string, 
    avatarId: string, 
    fileType: 'image' | 'video',
    extension: string
  ): string {
    return `private/${userId}/avatars/${avatarId}/${fileType}.${extension}`;
  }

  /**
   * Génère un chemin unique pour un fichier temporaire d'upload
   * @param userId - ID de l'utilisateur
   * @param extension - Extension du fichier
   */
  generateTempUploadPath(userId: string, extension: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    return `temp/uploads/${userId}/${timestamp}-${randomId}.${extension}`;
  }

  /**
   * Génère l'URL publique d'un fichier (via le proxy Next.js)
   * @param key - Chemin du fichier dans le bucket
   */
  getPublicUrl(key: string): string {
    const baseUrl = process.env.MINIO_PUBLIC_URL || 'http://localhost:3000/api/media';
    return `${baseUrl}/${key}`;
  }
}

// Instance singleton
export const minioService = new MinioService();