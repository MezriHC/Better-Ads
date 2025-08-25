import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { videoGenerationService } from '../../../_shared/core/video-generation-global.service';
import { avatarStorageService } from '../../../_shared/core/avatar-storage-global.service';
import { avatarGenerationSchema } from './schemas';
import { authOptions } from '../../../_shared/core/auth-global.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    const { prompt, imageUrl, projectId, resolution, duration, cameraFixed, seed, enableSafetyChecker, videoFormat } = validationResult.data;
    

    const avatar = await videoGenerationService.generateImageToVideo({
      prompt,
      imageUrl,
      resolution,
      duration,
      cameraFixed,
      seed,
      enableSafetyChecker,
      videoFormat,
    });

    try {
      const userId = (session.user as any).id || session.user.email;
      const filename = avatarStorageService.generateAvatarId();
      
      const storedAvatar = await avatarStorageService.uploadAvatarFromUrl({
        userId,
        videoUrl: avatar.url,
        filename,
        isPublic: false,
      });

      // Sauvegarder en base de données
      
      const savedAvatar = await prisma.avatar.create({
        data: {
          id: filename,
          name: `Avatar ${new Date().toLocaleDateString()}`,
          imageUrl: imageUrl, // Image de preview
          videoUrl: storedAvatar.url, // URL MinIO
          visibility: 'private',
          status: 'ready',
          userId: userId,
          projectId: projectId || null,
          duration: `0:0${duration}`,
          format: videoFormat,
          minioVideoPath: storedAvatar.path,
          prompt: prompt,
          resolution: resolution,
        }
      });

      return NextResponse.json({
        success: true,
        data: {
          id: savedAvatar.id,
          url: savedAvatar.videoUrl,
          posterUrl: savedAvatar.imageUrl,
          createdAt: savedAvatar.createdAt.toISOString(),
          metadata: {
            stored: {
              path: storedAvatar.path,
              minioUrl: storedAvatar.url,
              size: storedAvatar.size,
              uploadedAt: storedAvatar.uploadedAt,
            }
          }
        },
      });
      
    } catch (storageError) {
      console.warn('Avatar generated but storage failed:', storageError);
      
      return NextResponse.json({
        success: true,
        data: avatar,
        warning: 'Avatar generated successfully but storage failed'
      });
    }

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