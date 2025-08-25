import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../_shared/core/auth-global.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const project = await prisma.project.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    const brolls = await prisma.bRoll.findMany({
      where: {
        projectId: id,
        userId: user.id
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedBrolls = brolls.map(broll => ({
      id: broll.id,
      title: broll.name,
      posterUrl: broll.thumbnailUrl || broll.imageUrl || '/placeholder-video.jpg',
      videoUrl: broll.videoUrl,
      status: broll.status as "processing" | "ready" | "failed",
      progress: broll.status === 'processing' ? 50 : broll.status === 'ready' ? 100 : 0,
      createdAt: broll.createdAt.toISOString(),
      duration: broll.duration ? `0:${broll.duration.replace(/\n/g, '').padStart(2, '0')}` : "0:05",
      format: broll.format || broll.aspectRatio || "16:9"
    }));

    return NextResponse.json(formattedBrolls);

  } catch (error) {
    console.error('API project B-rolls error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}