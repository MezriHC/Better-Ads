import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../_shared/core/auth-global.service';
import { brollGenerationSchema } from './schemas';
import { brollGenerationService } from '../../../_shared/core/broll-generation-global.service';
import { brollStorageService } from '../../../_shared/core/broll-storage-global.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction de génération en arrière-plan
async function processVideoGeneration(
  brollId: string, 
  validatedData: any, 
  userId: string
) {
  try {
    const generationRequest = {
      prompt: validatedData.prompt,
      imageUrl: validatedData.imageUrl,
      resolution: validatedData.resolution,
      duration: validatedData.duration,
      cameraFixed: validatedData.cameraFixed,
      seed: validatedData.seed,
      enableSafetyChecker: validatedData.enableSafetyChecker,
      ...(validatedData.imageUrl ? {} : { aspectRatio: validatedData.aspectRatio })
    };

    const generatedVideo = await brollGenerationService.generateBRoll(generationRequest);

    const storedVideo = await brollStorageService.uploadBRollFromUrl({
      userId: userId,
      videoUrl: generatedVideo.videoUrl,
      filename: brollId,
      isPublic: validatedData.visibility === 'public'
    });

    await prisma.bRoll.update({
      where: { id: brollId },
      data: {
        status: 'ready',
        videoUrl: storedVideo.url,
        minioVideoPath: storedVideo.path,
        seed: BigInt(generatedVideo.seed)
      }
    });

    console.log(`✅ B-Roll ${brollId} generated successfully`);

  } catch (error) {
    console.error(`❌ B-Roll ${brollId} generation failed:`, error);
    
    await prisma.bRoll.update({
      where: { id: brollId },
      data: {
        status: 'failed'
      }
    });
  }
}

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
    const validationResult = brollGenerationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }
    
    const validatedData = validationResult.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        id: validatedData.projectId,
        userId: user.id
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    const brollId = `broll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 1. Créer immédiatement l'entrée en DB avec status 'processing'
    const brollData = await prisma.bRoll.create({
      data: {
        id: brollId,
        name: validatedData.name,
        prompt: validatedData.prompt,
        imageUrl: validatedData.imageUrl,
        status: 'processing',
        type: validatedData.type || 'seedance-video',
        userId: user.id,
        projectId: validatedData.projectId,
        duration: validatedData.duration,
        resolution: validatedData.resolution,
        format: validatedData.aspectRatio,
        aspectRatio: validatedData.aspectRatio,
        cameraFixed: validatedData.cameraFixed,
        seed: validatedData.seed ? BigInt(validatedData.seed) : null,
        enableSafetyChecker: validatedData.enableSafetyChecker,
        visibility: validatedData.visibility || 'private',
      }
    });

    // 2. Retourner immédiatement avec status processing
    const responseData = {
      success: true,
      broll: {
        id: brollData.id,
        name: brollData.name,
        status: brollData.status,
        videoUrl: null,
        duration: brollData.duration,
        resolution: brollData.resolution,
        format: brollData.format,
        createdAt: brollData.createdAt.toISOString()
      }
    };

    // 3. Lancer la génération en arrière-plan (async sans await)
    processVideoGeneration(brollId, validatedData, user.id).catch(error => {
      console.error('Background video generation failed:', error);
    });

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('API B-Roll generation error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');

    const whereClause = projectId 
      ? { userId: user.id, projectId: projectId }
      : { userId: user.id };

    const brolls = await prisma.bRoll.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      brolls: brolls.map(broll => ({
        id: broll.id,
        name: broll.name,
        status: broll.status,
        videoUrl: broll.videoUrl,
        thumbnailUrl: broll.thumbnailUrl,
        duration: broll.duration,
        resolution: broll.resolution,
        format: broll.format,
        createdAt: broll.createdAt.toISOString()
      }))
    });

  } catch (error) {
    console.error('API B-Roll list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}