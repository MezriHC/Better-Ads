import { NextRequest, NextResponse } from 'next/server'
import { minioService } from '../../../_shared/services/minio'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const path = formData.get('path') as string

    if (!file || !path) {
      return NextResponse.json({ error: 'File et path requis' }, { status: 400 })
    }

    console.log('Uploading to MinIO:', path, 'Size:', file.size)

    // Convertir File en Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Déterminer le content-type
    const contentType = file.type || (path.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg')

    // Upload vers MinIO via service centralisé
    const publicUrl = await minioService.uploadFile(path, buffer, contentType)

    console.log('Successfully uploaded to MinIO:', publicUrl)

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      path: path,
      size: buffer.length
    })

  } catch (error) {
    console.error('Erreur upload MinIO:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de l\'upload',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}
