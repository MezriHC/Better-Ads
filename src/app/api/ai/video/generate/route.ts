import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/app/_shared/lib/auth'
import { fal } from '@fal-ai/client'
import { VideoGenerationRequest, VideoGenerationResponse, GeneratedVideoData } from '../../../../_shared/types/ai'
import { withRetry, withTimeout, createApiError, validateRequiredFields, sanitizeString, downloadWithRetry } from '../../../../_shared/utils/api-helpers'
import { getUserIdFromSession } from '../../../../_shared/types/api'
import { minioService } from '../../../../_shared/services/minio'
import { prisma } from '../../../../_shared/database/client'

// Configuration fal.ai
fal.config({
  credentials: process.env.FAL_KEY
})

export async function POST(request: NextRequest) {
  try {
    // Vérification de la session utilisateur
    const session = await getServerSession(authOptions)
    const userId = getUserIdFromSession(session)
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    
    const body = await request.json()
    
    // Validation des champs requis
    const validationError = validateRequiredFields(body, ['prompt', 'imageUrl', 'type'])
    if (validationError) {
      return createApiError(validationError, undefined, 400, 'VALIDATION_ERROR')
    }

    const { prompt, imageUrl, type, projectId } = body
    const sanitizedPrompt = sanitizeString(prompt, 500)

    // Génération vidéo avec retry et timeout
    const response = await withRetry(async () => {
      return withTimeout(async () => {
        return await fal.subscribe('fal-ai/bytedance/seedance/v1/pro/image-to-video', {
          input: {
            prompt,
            image_url: imageUrl,
            resolution: '1080p',
            duration: '5',
            camera_fixed: false,
            seed: -1
          } as VideoGenerationRequest,
          logs: true,
        })
      }, 600000) // 10 minutes timeout pour génération vidéo
    }, {
      maxRetries: 1, // Réduire retry pour éviter multiplication d'appels
      baseDelay: 5000
    })

    const result = response.data as VideoGenerationResponse
    
    if (!result || !result.video || !result.video.url) {
      return createApiError(
        'Réponse invalide du service de génération vidéo',
        'video.url manquant dans la réponse',
        500,
        'INVALID_RESPONSE'
      )
    }

    // Télécharger la vidéo depuis fal.ai
    const videoBuffer = await downloadWithRetry(result.video.url, {
      maxSize: 200 * 1024 * 1024, // 200MB max
      timeout: 90000,
      retryOptions: { maxRetries: 3, baseDelay: 2000 }
    })

    let minioUrl: string
    let dbRecord: any

    if (type === 'private-avatar') {
      // Créer un avatar privé
      const fileName = `avatar-${Date.now()}.mp4`
      const objectPath = `avatars/private/${userId}/${fileName}`
      
      minioUrl = await minioService.uploadFile(objectPath, Buffer.from(videoBuffer), 'video/mp4')
      
      // Sauvegarder en base comme avatar privé
      dbRecord = await prisma.avatar.create({
        data: {
          title: sanitizedPrompt.slice(0, 50) + (sanitizedPrompt.length > 50 ? "..." : ""),
          videoUrl: minioUrl,
          posterUrl: imageUrl, // Image source comme poster
          visibility: "private",
          userId: userId,
          projectId: projectId,
          status: "ready",
          metadata: {
            type: 'private_avatar',
            prompt: sanitizedPrompt,
            originalVideoUrl: result.video.url,
            sourceImageUrl: imageUrl,
            createdAt: new Date().toISOString()
          }
        }
      })
      
    } else if (type === 'generated-video') {
      // Créer une vidéo générée (nécessite projectId)
      if (!projectId) {
        return createApiError('projectId requis pour les vidéos générées', undefined, 400, 'VALIDATION_ERROR')
      }
      
      const fileName = `video-${Date.now()}.mp4`
      const objectPath = `videos/generated/${userId}/${projectId}/${fileName}`
      
      minioUrl = await minioService.uploadFile(objectPath, Buffer.from(videoBuffer), 'video/mp4')
      
      // Sauvegarder en base comme vidéo générée
      dbRecord = await prisma.video.create({
        data: {
          userId: userId,
          videoUrl: minioUrl,
          thumbnailUrl: imageUrl,
          status: "ready",
          scriptText: sanitizedPrompt,
          ttsVoiceId: "default",
          projectId: projectId
        }
      })
      
    } else {
      return createApiError('Type non supporté. Utilisez "private-avatar" ou "generated-video"', undefined, 400, 'INVALID_TYPE')
    }

    const generatedVideo: GeneratedVideoData = {
      id: dbRecord.id,
      url: minioUrl,
      duration: '5',
      resolution: '1080p',
      prompt: sanitizedPrompt,
      loading: false,
      type: type
    }

    return NextResponse.json({ 
      success: true, 
      video: generatedVideo,
      [type === 'private-avatar' ? 'avatar' : 'video']: dbRecord
    })

  } catch (error) {
    return createApiError(
      'Erreur lors de la génération de vidéo',
      error,
      500,
      'VIDEO_GENERATION_ERROR'
    )
  }
}
