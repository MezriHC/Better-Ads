import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { videoGlobalService } from '@/_shared';
import { videoGenerationSchema } from './schemas';
import { authOptions } from '../../../_shared/core/auth-global.service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = videoGenerationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const { prompt, imageUrl, resolution, duration, cameraFixed, seed } = validationResult.data;

    const video = await videoGlobalService.generateImageToVideo({
      prompt,
      imageUrl,
      resolution,
      duration,
      cameraFixed,
      seed,
    });

    return NextResponse.json({
      success: true,
      data: video,
    });

  } catch (error) {
    console.error('Video generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Video generation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}