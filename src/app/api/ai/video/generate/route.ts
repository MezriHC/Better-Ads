import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'
import { VideoGenerationRequest, VideoGenerationResponse, GeneratedVideoData } from '../../../../_shared/types/ai'

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
        resolution: '1080p',        // QUALITÉ MAX
        duration: '12',             // DURÉE MAX
        camera_fixed: false,
        seed: -1
      } as VideoGenerationRequest,
      logs: true,
    })

    const result = response.data as VideoGenerationResponse
    
    if (!result || !result.video || !result.video.url) {
      return NextResponse.json({ 
        error: 'Invalid response structure from video service',
        details: 'Missing video.url in response'
      }, { status: 500 })
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
    
    
    return NextResponse.json({ 
      error: 'Failed to generate video',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
