import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'
import { VideoGenerationRequest, VideoGenerationResponse, GeneratedVideoData } from '../../../../_shared/types/ai'
import { withRetry, withTimeout, createApiError, validateRequiredFields } from '../../../../_shared/utils/api-helpers'

// Configuration fal.ai
fal.config({
  credentials: process.env.FAL_KEY
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des champs requis
    const validationError = validateRequiredFields(body, ['prompt', 'imageUrl'])
    if (validationError) {
      return createApiError(validationError, undefined, 400, 'VALIDATION_ERROR')
    }

    const { prompt, imageUrl } = body

    // Génération vidéo avec retry et timeout
    const response = await withRetry(async () => {
      return withTimeout(async () => {
        return await fal.subscribe('fal-ai/bytedance/seedance/v1/pro/image-to-video', {
          input: {
            prompt,
            image_url: imageUrl,
            resolution: '1080p',
            duration: '12',
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

    const generatedVideo: GeneratedVideoData = {
      id: `video-${Date.now()}`,
      url: result.video.url,
      duration: '12',
      resolution: '1080p',
      prompt,
      loading: false,
    }

    return NextResponse.json({ success: true, video: generatedVideo })

  } catch (error) {
    return createApiError(
      'Erreur lors de la génération de vidéo',
      error,
      500,
      'VIDEO_GENERATION_ERROR'
    )
  }
}
