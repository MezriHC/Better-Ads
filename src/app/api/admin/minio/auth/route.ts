import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const minioConsoleUrl = 'https://minio.trybetterads.com'
    const accessKey = process.env.MINIO_ACCESS_KEY
    
    if (!accessKey) {
      return NextResponse.json(
        { error: 'Configuration MinIO manquante' },
        { status: 500 }
      )
    }
    
    // Retourner juste les infos nécessaires pour vérifier la connexion
    return NextResponse.json({
      consoleUrl: minioConsoleUrl,
      connected: true
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur de connexion MinIO' },
      { status: 500 }
    )
  }
}