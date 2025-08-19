import { NextRequest, NextResponse } from 'next/server'
import { minioService } from '../../../_shared/services/minio'

export async function POST(request: NextRequest) {
  try {
    const { url, filename } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL requise' }, { status: 400 })
    }

    console.log('Téléchargement demandé pour:', url)

    // Extraire le path de l'objet depuis l'URL
    const objectPath = minioService.extractObjectPath(url)
    
    if (!objectPath) {
      return NextResponse.json({ 
        error: 'URL invalide', 
        details: 'Impossible d\'extraire le chemin de l\'objet depuis l\'URL' 
      }, { status: 400 })
    }

    // Vérifier que le fichier existe
    const exists = await minioService.fileExists(objectPath)
    if (!exists) {
      return NextResponse.json({ 
        error: 'Fichier introuvable', 
        details: `Le fichier ${objectPath} n'existe pas` 
      }, { status: 404 })
    }

    // Télécharger le fichier depuis MinIO
    const buffer = await minioService.downloadFile(objectPath)

    // Déterminer le type de contenu et le nom de fichier
    const contentType = objectPath.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'
    const defaultFilename = objectPath.split('/').pop() || 'download'
    const finalFilename = filename || defaultFilename

    console.log('Fichier téléchargé avec succès:', objectPath, 'Taille:', buffer.length)

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${finalFilename}"`,
        'Content-Length': buffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('Erreur téléchargement:', error)
    return NextResponse.json({ 
      error: 'Erreur lors du téléchargement',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    const filename = searchParams.get('filename')
    
    if (!url) {
      return NextResponse.json({ error: 'Paramètre url requis' }, { status: 400 })
    }

    // Rediriger vers la méthode POST pour une logique unifiée
    return POST(new NextRequest(request.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, filename })
    }))

  } catch (error) {
    console.error('Erreur téléchargement GET:', error)
    return NextResponse.json({ 
      error: 'Erreur lors du téléchargement',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}