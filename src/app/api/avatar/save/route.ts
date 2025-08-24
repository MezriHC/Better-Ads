import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { avatarStorageService } from '../../../_shared/core/avatar-storage-global.service';
import { authOptions } from '../../../_shared/core/auth-global.service';
import { z } from 'zod';

const saveAvatarSchema = z.object({
  videoUrl: z.string().url('URL vidéo invalide'),
  filename: z.string().optional(),
  isPublic: z.boolean().default(false)
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = saveAvatarSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { videoUrl, filename, isPublic } = validationResult.data;
    const userId = session.user.email; 

    const storedAvatar = await avatarStorageService.uploadAvatarFromUrl({
      userId,
      videoUrl,
      filename,
      isPublic,
    });

    return NextResponse.json({
      success: true,
      data: storedAvatar,
    });

  } catch (error) {
    console.error('Avatar save error:', error);
    
    return NextResponse.json(
      { 
        error: 'Avatar save failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}