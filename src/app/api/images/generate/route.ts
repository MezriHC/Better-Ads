import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { imageGenerationService } from '../../../_shared/core/image-generation-global.service';
import { imageGenerationSchema } from './schemas';
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
    const validationResult = imageGenerationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const { prompt, imageUrl, aspectRatio, guidanceScale } = validationResult.data;

    const images = await imageGenerationService.generateImages({
      prompt,
      imageUrl,
      aspectRatio,
      guidanceScale,
      numImages: 1,
    });

    return NextResponse.json({
      success: true,
      data: images,
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Image generation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}