import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/app/_shared/lib/auth'
import { prisma } from '@/src/app/_shared/database/client'
import { Client } from 'minio'
import { getUserIdFromSession } from '@/src/app/_shared/types/api'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    const userId = getUserIdFromSession(session)
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { videoUrl, prompt, avatarImageUrl, projectId } = await request.json()

    if (!videoUrl || !prompt || !projectId) {
      return NextResponse.json({ 
        error: 'URL vidéo, prompt et ID projet requis' 
      }, { status: 400 })
    }

    console.log('Starting video download and upload process...')

    // 1. Télécharger la vidéo depuis fal.ai
    const videoResponse = await fetch(videoUrl)
    if (!videoResponse.ok) {
      throw new Error('Impossible de télécharger la vidéo depuis fal.ai')
    }
    const videoBuffer = await videoResponse.arrayBuffer()
    console.log('Video downloaded from fal.ai, size:', videoBuffer.byteLength)

    // 2. Upload vers MinIO
    const videoFileName = `video-${Date.now()}.mp4`
    const minioVideoUrl = await uploadToMinIO(videoBuffer, videoFileName, userId, projectId)
    console.log('Video uploaded to MinIO:', minioVideoUrl)

    // 3. Upload thumbnail vers MinIO si fourni
    let minioThumbnailUrl = ''
    if (avatarImageUrl) {
      const thumbnailResponse = await fetch(avatarImageUrl)
      if (thumbnailResponse.ok) {
        const thumbnailBuffer = await thumbnailResponse.arrayBuffer()
        const thumbnailFileName = `thumbnail-${Date.now()}.jpg`
        minioThumbnailUrl = await uploadToMinIO(thumbnailBuffer, thumbnailFileName, userId, projectId)
        console.log('Thumbnail uploaded to MinIO:', minioThumbnailUrl)
      }
    }

    // 4. Créer l'avatar en base
    const avatar = await prisma.avatar.create({
      data: {
        title: prompt.slice(0, 50) + "...",
        videoUrl: minioVideoUrl, // URL de la vidéo générée
        posterUrl: minioThumbnailUrl || avatarImageUrl || "",
        visibility: "private",
        userId: userId,
        projectId: projectId,
        status: "ready",
        metadata: {
          prompt,
          originalVideoUrl: videoUrl,
          avatarImageUrl: avatarImageUrl,
          createdAt: new Date().toISOString()
        }
      }
    })

    // 5. Créer la vidéo générée en base
    const video = await prisma.video.create({
      data: {
        userId: userId,
        avatarId: avatar.id,
        videoUrl: minioVideoUrl, // URL MinIO, pas fal.ai
        thumbnailUrl: minioThumbnailUrl || "", // Utiliser seulement l'URL MinIO, pas l'avatar original
        status: "ready",
        scriptText: prompt,
        ttsVoiceId: "default",
        projectId: projectId
      }
    })

    console.log('Video and avatar saved to database')

    return NextResponse.json({ 
      success: true, 
      video: {
        id: video.id,
        url: minioVideoUrl,
        thumbnailUrl: minioThumbnailUrl || avatarImageUrl,
        avatarId: avatar.id,
        prompt: video.scriptText
      }
    })

  } catch (error) {
    console.error('Erreur sauvegarde vidéo:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de la sauvegarde',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

// Fonction d'upload vers MinIO
async function uploadToMinIO(buffer: ArrayBuffer, fileName: string, userId: string, projectId: string): Promise<string> {
  // Configuration MinIO
  const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT?.replace('https://', '') || 'localhost',
    port: 443,
    useSSL: true,
    accessKey: process.env.MINIO_ACCESS_KEY || '',
    secretKey: process.env.MINIO_SECRET_KEY || '',
  })

  const bucketName = 'mini-prod-media'
  const objectPath = `videos/generated/${userId}/${projectId}/${fileName}`
  
  // Upload vers MinIO
  await minioClient.putObject(
    bucketName,
    objectPath,
    Buffer.from(buffer),
    buffer.byteLength,
    {
      'Content-Type': fileName.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
    }
  )

  // Retourner l'URL publique
  return `${process.env.MINIO_ENDPOINT}/${bucketName}/${objectPath}`
}
