import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/app/_shared/lib/auth'
import { prisma } from '@/src/app/_shared/database/client'
import { getUserIdFromSession } from '@/src/app/_shared/types/api'

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    const userId = getUserIdFromSession(session)
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer toutes les vidéos de l'utilisateur avec leurs avatars
    const videos = await prisma.video.findMany({
      where: {
        userId: userId,
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
    console.error('Erreur récupération vidéos:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de la récupération des vidéos',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}
