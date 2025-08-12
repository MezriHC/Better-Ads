import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

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
    
    // Générer un token temporaire sécurisé (expire dans 1h)
    const timestamp = Date.now()
    const expiry = timestamp + (60 * 60 * 1000) // 1 heure
    
    // Créer signature sécurisée
    const payload = `${accessKey}:${timestamp}:${expiry}`
    const signature = createHash('sha256')
      .update(payload + secretKey)
      .digest('hex')
    
    // URL avec auto-login (si MinIO le supporte)
    const autoLoginUrl = new URL(minioConsoleUrl)
    autoLoginUrl.searchParams.set('login', 'auto')
    autoLoginUrl.searchParams.set('token', signature.substring(0, 32))
    autoLoginUrl.searchParams.set('expires', expiry.toString())
    
    return NextResponse.json({
      consoleUrl: minioConsoleUrl,
      autoLoginUrl: autoLoginUrl.toString(),
      fallbackCredentials: {
        accessKey: accessKey,
        note: 'À utiliser si auto-login échoue'
      },
      expiresAt: new Date(expiry).toISOString(),
      connected: true
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur de connexion MinIO' },
      { status: 500 }
    )
  }
}