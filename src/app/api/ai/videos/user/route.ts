import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/app/_shared/lib/auth'
import { prisma } from '@/src/app/_shared/database/client'
import { getUserIdFromSession } from '@/src/app/_shared/types/api'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    const userId = getUserIdFromSession(session)
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ error: 'ProjectId requis' }, { status: 400 })
    }

    const videos = await prisma.video.findMany({
      where: {
        userId: userId,
        projectId: projectId,
        status: 'ready'
      },
      include: {
        avatar: true,
        project: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Formater les données pour le frontend
    const formattedVideos = videos.map(video => ({
      id: video.id,
      url: video.videoUrl, // URL MinIO
      thumbnailUrl: video.thumbnailUrl,
      prompt: video.scriptText,
      createdAt: video.createdAt.toISOString(),
      avatarId: video.avatarId,
      projectName: video.project?.name || 'Sans projet',
      status: video.status,
      isGenerating: false // Toujours false car status='ready'
    }))

    return NextResponse.json({ 
      success: true, 
      videos: formattedVideos 
    })

  } catch (error) {
      }
}
