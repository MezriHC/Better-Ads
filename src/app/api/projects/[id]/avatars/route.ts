import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../_shared'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id || session?.user?.email
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId } = await params

    // Vérifier que le projet appartient à l'utilisateur
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: userId
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Récupérer les avatars du projet
    const avatars = await prisma.avatar.findMany({
      where: {
        projectId: projectId,
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transformer les données au format VideoData attendu par VideoShowcase  
    const videoData = avatars.map((avatar: any) => {
      return {
        id: avatar.id,
        title: avatar.name || 'Avatar',
        posterUrl: avatar.imageUrl, // Image de preview
        videoUrl: avatar.videoUrl,
        status: avatar.status === 'ready' ? 'ready' : 
                avatar.status === 'processing' ? 'processing' : 'failed',
        createdAt: avatar.createdAt.toISOString(),
        duration: avatar.duration || '0:03',
        format: (avatar.format as "16:9" | "9:16" | "1:1") || "16:9"
      }
    })

    return NextResponse.json({
      success: true,
      avatars: videoData,
      count: videoData.length
    })

  } catch (error) {
    console.error('[API] Error fetching project avatars:', error)
    return NextResponse.json(
      { error: 'Failed to fetch avatars' },
      { status: 500 }
    )
  }
}