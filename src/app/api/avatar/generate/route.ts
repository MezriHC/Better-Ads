import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { videoGenerationService } from '../../../_shared/core/video-generation-global.service';
import { avatarGenerationSchema } from './schemas';
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
    const validationResult = avatarGenerationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { prompt, imageUrl, resolution, duration, cameraFixed, seed, enableSafetyChecker } = validationResult.data;

    const avatar = await videoGenerationService.generateImageToVideo({
      prompt,
      imageUrl,
      resolution,
      duration,
      cameraFixed,
      seed,
      enableSafetyChecker,
    });

    return NextResponse.json({
      success: true,
      data: avatar,
    });

  } catch (error) {
    console.error('Avatar generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Avatar generation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}