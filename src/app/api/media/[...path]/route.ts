import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../_shared/lib/auth'
import { getUserIdFromSession } from '../../../_shared/types/api'
import { minioService } from '../../../_shared/services/minio'
import { logger } from '../../../_shared/utils/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  const objectPath = resolvedParams.path.join('/')
  
  try {
    logger.server.api.request('GET', `/api/media/${objectPath}`)
    logger.minio.download(objectPath)
    
    // Vérification d'autorisation selon plan.md
    // Fichiers publics : avatars/public/* et videos/generated/*
    // Fichiers privés : avatars/private/{userId}/* (nécessite authentification)
    if (objectPath.startsWith('avatars/private/')) {
      const session = await getServerSession(authOptions)
      const userId = getUserIdFromSession(session)
      
      if (!userId) {
        logger.server.warn(`Accès non autorisé à un avatar privé: ${objectPath}`)
        return new NextResponse('Unauthorized', { status: 401 })
      }
      
      // Vérifier que l'utilisateur accède à son propre avatar privé
      const pathUserId = objectPath.split('/')[2] // avatars/private/{userId}/...
      if (pathUserId !== userId) {
        logger.server.warn(`Tentative d'accès à l'avatar privé d'un autre utilisateur: ${objectPath} par ${userId}`)
        return new NextResponse('Forbidden', { status: 403 })
      }
      
      logger.server.info(`Accès autorisé à l'avatar privé: ${objectPath} par ${userId}`)
    } else if (objectPath.startsWith('avatars/public/') || objectPath.startsWith('videos/generated/')) {
      // Fichiers publics - pas d'authentification requise
      logger.server.info(`Accès à un fichier public: ${objectPath}`)
    } else {
      // Chemin non reconnu
      logger.server.warn(`Tentative d'accès à un chemin non autorisé: ${objectPath}`)
      return new NextResponse('Forbidden', { status: 403 })
    }
    
    // Vérifier que le fichier existe
    const exists = await minioService.fileExists(objectPath)
    if (!exists) {
      logger.server.error(`Fichier non trouvé dans MinIO: ${objectPath}`)
      return new NextResponse('File not found', { status: 404 })
    }

    // Télécharger le fichier depuis MinIO
    const fileBuffer = await minioService.downloadFile(objectPath)
    logger.server.info(`Fichier MinIO téléchargé avec succès: ${objectPath} (${fileBuffer.length} bytes)`)
    
    // Déterminer le type de contenu basé sur l'extension
    const extension = objectPath.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (extension) {
      case 'mp4':
        contentType = 'video/mp4'
        break
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'png':
        contentType = 'image/png'
        break
      case 'webp':
        contentType = 'image/webp'
        break
    }

    // Retourner le fichier avec les headers appropriés
    logger.server.api.response('GET', `/api/media/${objectPath}`, 200, { 
      contentType, 
      size: fileBuffer.length 
    })
    
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache 1 heure
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    logger.server.api.error('GET', `/api/media/${objectPath}`, error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}