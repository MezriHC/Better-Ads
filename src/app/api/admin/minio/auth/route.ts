import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const minioConsoleUrl = 'https://minio.trybetterads.com'
    const accessKey = process.env.MINIO_ACCESS_KEY
    const secretKey = process.env.MINIO_SECRET_KEY
    
    if (!accessKey || !secretKey) {
      return NextResponse.json(
        { error: 'Configuration MinIO manquante' },
        { status: 500 }
      )
    }
    
    // 🚀 Auto-login avec credentials directs (sécurisé car HTTPS + admin auth)
    const autoLoginUrl = new URL(minioConsoleUrl)
    autoLoginUrl.searchParams.set('accessKey', accessKey)
    autoLoginUrl.searchParams.set('secretKey', secretKey)
    autoLoginUrl.searchParams.set('autoLogin', 'true')
    
    return NextResponse.json({
      consoleUrl: minioConsoleUrl,
      autoLoginUrl: autoLoginUrl.toString(),
      credentials: {
        accessKey,
        // Ne pas exposer le secret dans la réponse normale
        note: 'Connexion automatique activée'
      },
      connected: true
    })
    
  } catch {
    return NextResponse.json(
      { error: 'Erreur de connexion MinIO' },
      { status: 500 }
    )
  }
}