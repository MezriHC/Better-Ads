import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'
import { SeedanceVideoRequest, SeedanceVideoResponse, GeneratedVideoData } from '../../_shared/types/seedance'

// Configuration fal.ai
fal.config({
  credentials: process.env.FAL_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageUrl } = await request.json()

    if (!prompt || !imageUrl) {
      return NextResponse.json({ error: 'Prompt and image URL are required' }, { status: 400 })
    }

    const response = await fal.subscribe('fal-ai/bytedance/seedance/v1/pro/image-to-video', {
      input: {
        prompt,
        image_url: imageUrl,
        resolution: '720p',
        duration: '5',
        camera_fixed: false,
        seed: -1
      } as SeedanceVideoRequest,
      logs: true,
    })

    const result = response.data as SeedanceVideoResponse
    
    if (!result || !result.video || !result.video.url) {
      return NextResponse.json({ 
        error: 'Invalid response structure from video service',
        details: 'Missing video.url in response'
      }, { status: 500 })
    }

    const generatedVideo: GeneratedVideoData = {
      id: `video-${Date.now()}`,
      url: result.video.url,
      duration: '5',
      resolution: '720p',
      prompt,
      loading: false,
    }

    return NextResponse.json({ success: true, video: generatedVideo })

  } catch (error) {
    const { prompt: errorPrompt, imageUrl: errorImageUrl } = await request.json().catch(() => ({ prompt: 'N/A', imageUrl: 'N/A' }))
    
    console.error('[API] Erreur détaillée génération vidéo:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      prompt: errorPrompt,
      imageUrl: errorImageUrl && typeof errorImageUrl === 'string' ? errorImageUrl.substring(0, 50) + '...' : 'missing'
    })
    
    return NextResponse.json({ 
      error: 'Failed to generate video',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
