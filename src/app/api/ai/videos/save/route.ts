import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/app/_shared/lib/auth'
import { prisma } from '@/src/app/_shared/database/client'
import { getUserIdFromSession } from '@/src/app/_shared/types/api'
import { minioService } from '../../../../_shared/services/minio'
import { downloadWithRetry, createApiError, validateRequiredFields, sanitizeString } from '../../../../_shared/utils/api-helpers'

export async function POST(request: NextRequest) {
  let minioVideoUrl = ''
  let minioThumbnailUrl = ''
  
  try {
    const session = await getServerSession(authOptions)
    
    const userId = getUserIdFromSession(session)
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const body = await request.json()
    
    // Validation des champs requis
    const validationError = validateRequiredFields(body, ['videoUrl', 'prompt', 'projectId'])
    if (validationError) {
      return createApiError(validationError, undefined, 400, 'VALIDATION_ERROR')
    }

    const { videoUrl, prompt, avatarImageUrl, projectId } = body
    const sanitizedPrompt = sanitizeString(prompt, 500)

    console.log('Starting video download and upload process...')

    // 1. Télécharger la vidéo depuis fal.ai avec retry
    const videoBuffer = await downloadWithRetry(videoUrl, {
      maxSize: 200 * 1024 * 1024, // 200MB max pour vidéos
      timeout: 90000, // 90 secondes
      retryOptions: { maxRetries: 3, baseDelay: 2000 }
    })
    console.log('Video downloaded from fal.ai, size:', videoBuffer.byteLength)

    // 2. Upload vers MinIO
    const videoFileName = `video-${Date.now()}.mp4`
    
    minioVideoUrl = await uploadToMinIO(videoBuffer, videoFileName, userId, projectId)
    console.log('Video uploaded to MinIO:', minioVideoUrl)

    // 3. Upload thumbnail vers MinIO si fourni
    if (avatarImageUrl) {
      try {
        const thumbnailBuffer = await downloadWithRetry(avatarImageUrl, {
          maxSize: 10 * 1024 * 1024, // 10MB max pour images
          timeout: 30000,
          retryOptions: { maxRetries: 2 }
        })
        const thumbnailFileName = `thumbnail-${Date.now()}.jpg`
        minioThumbnailUrl = await uploadToMinIO(thumbnailBuffer, thumbnailFileName, userId, projectId)
        console.log('Thumbnail uploaded to MinIO:', minioThumbnailUrl)
      } catch (thumbnailError) {
        console.warn('Impossible de télécharger le thumbnail, continué sans:', thumbnailError)
      }
    }

    // 4. Utiliser une transaction atomique pour créer avatar et vidéo
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'avatar en base
      const avatar = await tx.avatar.create({
        data: {
          title: sanitizedPrompt.slice(0, 50) + (sanitizedPrompt.length > 50 ? "..." : ""),
          videoUrl: minioVideoUrl,
          posterUrl: minioThumbnailUrl || avatarImageUrl || "",
          visibility: "private",
          userId: userId,
          projectId: projectId,
          status: "ready",
          metadata: {
            prompt: sanitizedPrompt,
            originalVideoUrl: videoUrl,
            avatarImageUrl: avatarImageUrl,
            createdAt: new Date().toISOString()
          }
        }
      })

      // Créer la vidéo générée en base
      const video = await tx.video.create({
        data: {
          userId: userId,
          avatarId: avatar.id,
          videoUrl: minioVideoUrl,
          thumbnailUrl: minioThumbnailUrl || "",
          status: "ready",
          scriptText: sanitizedPrompt,
          ttsVoiceId: "default",
          projectId: projectId
        }
      })

      return { avatar, video }
    })

    console.log('Video and avatar saved to database')

    return NextResponse.json({ 
      success: true, 
      video: {
        id: result.video.id,
        url: minioVideoUrl,
        thumbnailUrl: minioThumbnailUrl || avatarImageUrl,
        avatarId: result.avatar.id,
        prompt: result.video.scriptText
      }
    })

  } catch (error) {
    console.error('Erreur sauvegarde vidéo:', error)
    
    // En cas d'erreur, nettoyer les fichiers uploadés sur MinIO
    try {
      if (minioVideoUrl) {
        const videoPath = minioService.extractObjectPath(minioVideoUrl)
        if (videoPath) await minioService.deleteFile(videoPath)
      }
      if (minioThumbnailUrl) {
        const thumbnailPath = minioService.extractObjectPath(minioThumbnailUrl)
        if (thumbnailPath) await minioService.deleteFile(thumbnailPath)
      }
    } catch (cleanupError) {
      console.error('Erreur lors du nettoyage:', cleanupError)
    }
    
    return createApiError(
      'Erreur lors de la sauvegarde de la vidéo',
      error,
      500,
      'VIDEO_SAVE_ERROR'
    )
  }
}

// Fonction d'upload vers MinIO via le service centralisé
async function uploadToMinIO(buffer: ArrayBuffer, fileName: string, userId: string, projectId: string): Promise<string> {
  const objectPath = `videos/generated/${userId}/${projectId}/${fileName}`
  const contentType = fileName.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'
  
  return await minioService.uploadFile(objectPath, Buffer.from(buffer), contentType)
}
