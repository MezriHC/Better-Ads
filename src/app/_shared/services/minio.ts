import { Client } from 'minio'

export class MinIOService {
  private client: Client
  private bucketName: string

  constructor() {
    if (!process.env.MINIO_ENDPOINT) {
      throw new Error('MINIO_ENDPOINT is required')
    }
    if (!process.env.MINIO_ACCESS_KEY) {
      throw new Error('MINIO_ACCESS_KEY is required')
    }
    if (!process.env.MINIO_SECRET_KEY) {
      throw new Error('MINIO_SECRET_KEY is required')
    }
    if (!process.env.MINIO_BUCKET_NAME) {
      throw new Error('MINIO_BUCKET_NAME is required')
    }

    this.client = new Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT || '443'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    })

    this.bucketName = process.env.MINIO_BUCKET_NAME
  }

  async ensureBucketExists(): Promise<void> {
    const exists = await this.client.bucketExists(this.bucketName)
    if (!exists) {
      await this.client.makeBucket(this.bucketName, 'us-east-1')
    }
  }

  async uploadFile(
    objectName: string, 
    buffer: Buffer, 
    contentType: string = 'application/octet-stream'
  ): Promise<string> {
    await this.ensureBucketExists()
    
    await this.client.putObject(
      this.bucketName,
      objectName,
      buffer,
      buffer.length,
      { 'Content-Type': contentType }
    )

    return `https://${process.env.MINIO_ENDPOINT}/${this.bucketName}/${objectName}`
  }

  async downloadFile(objectName: string): Promise<Buffer> {
    const stream = await this.client.getObject(this.bucketName, objectName)
    const chunks: Uint8Array[] = []
    
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    
    return Buffer.concat(chunks)
  }

  async deleteFile(objectName: string): Promise<void> {
    await this.client.removeObject(this.bucketName, objectName)
  }

  async fileExists(objectName: string): Promise<boolean> {
    try {
      await this.client.statObject(this.bucketName, objectName)
      return true
    } catch {
      return false
    }
  }

  generateUrl(objectName: string): string {
    return `https://${process.env.MINIO_ENDPOINT}/${this.bucketName}/${objectName}`
  }

  extractObjectPath(url: string): string | null {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/')
      if (pathParts[1] === this.bucketName) {
        return pathParts.slice(2).join('/')
      }
      return null
    } catch {
      return null
    }
  }

  getBucketName(): string {
    return this.bucketName
  }

  getClient(): Client {
    return this.client
  }
}

export const minioService = new MinIOService()