import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/app/_shared/lib/auth'
import { prisma } from '@/src/app/_shared/database/client'
import { getUserIdFromSession } from '@/src/app/_shared/types/api'
import { minioService } from '../../../../_shared/services/minio'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    const userId = getUserIdFromSession(session)
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const resolvedParams = await params
    const videoId = resolvedParams.id

    // Récupérer la vidéo pour vérifier les permissions et obtenir l'URL
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: userId
      }
    })

    if (!video) {
      return NextResponse.json({ error: 'Vidéo non trouvée' }, { status: 404 })
    }

    // Extraire le chemin MinIO depuis l'URL
    const videoUrl = video.videoUrl
    const thumbnailUrl = video.thumbnailUrl
    
    // Supprimer les fichiers de MinIO
    try {
      const videoPath = minioService.extractObjectPath(videoUrl)
      if (videoPath) {
        await minioService.deleteFile(videoPath)
        console.log('Fichier vidéo supprimé:', videoPath)
      }
      
      if (thumbnailUrl) {
        const thumbnailPath = minioService.extractObjectPath(thumbnailUrl)
        if (thumbnailPath) {
          await minioService.deleteFile(thumbnailPath)
          console.log('Fichier thumbnail supprimé:', thumbnailPath)
        }
      }
    } catch (minioError) {
      console.error('Erreur suppression MinIO:', minioError)
      // Continue même si la suppression MinIO échoue
    }

    // Supprimer la vidéo de la base de données
    await prisma.video.delete({
      where: {
        id: videoId
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Vidéo supprimée avec succès' 
    })

  } catch (error) {
    console.error('Erreur suppression vidéo:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de la suppression de la vidéo',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    const userId = getUserIdFromSession(session)
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const resolvedParams = await params
    const videoId = resolvedParams.id

    // Récupérer la vidéo avec ses relations
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: userId
      },
      include: {
        avatar: true,
        project: true
      }
    })

    if (!video) {
      return NextResponse.json({ error: 'Vidéo non trouvée' }, { status: 404 })
    }

    // Formater les données pour le frontend
    const formattedVideo = {
      id: video.id,
      url: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      prompt: video.scriptText,
      createdAt: video.createdAt.toISOString(),
      avatarId: video.avatarId,
      projectName: video.project?.name || 'Sans projet',
      status: video.status,
      isGenerating: false
    }

    return NextResponse.json({ 
      success: true, 
      video: formattedVideo 
    })

  } catch (error) {
    console.error('Erreur récupération vidéo:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de la récupération de la vidéo',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}
