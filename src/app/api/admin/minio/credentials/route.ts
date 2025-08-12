import { NextResponse } from 'next/server'

// 🔒 API sécurisée pour récupérer les credentials MinIO (admin uniquement)
export async function POST() {
  try {
    const minioEndpoint = process.env.MINIO_ENDPOINT
    const accessKey = process.env.MINIO_ACCESS_KEY
    const secretKey = process.env.MINIO_SECRET_KEY
    
    if (!minioEndpoint || !accessKey || !secretKey) {
      return NextResponse.json(
        { error: 'Configuration MinIO manquante' },
        { status: 500 }
      )
    }
    
    // 🎯 Retourner les infos nécessaires pour l'auto-login
    return NextResponse.json({
      consoleUrl: `https://${minioEndpoint}`,
      credentials: {
        accessKey,
        secretKey
      },
      connected: true
    })
    
  } catch {
    return NextResponse.json(
      { error: 'Erreur de configuration MinIO' },
      { status: 500 }
    )
  }
}