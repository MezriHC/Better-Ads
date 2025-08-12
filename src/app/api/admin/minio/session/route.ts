import { NextResponse } from 'next/server'
import AWS from 'aws-sdk'

export async function POST() {
  try {
    // 🔒 Utilisation des credentials d'environnement (JAMAIS exposés côté client)
    const masterAccessKey = process.env.MINIO_ACCESS_KEY
    const masterSecretKey = process.env.MINIO_SECRET_KEY
    const endpoint = process.env.MINIO_ENDPOINT

    if (!masterAccessKey || !masterSecretKey || !endpoint) {
      return NextResponse.json(
        { error: 'Configuration MinIO manquante dans .env' },
        { status: 500 }
      )
    }

    // 🎫 Configuration STS pour générer des tokens temporaires
    const sts = new AWS.STS({
      endpoint: `https://${endpoint}`,
      accessKeyId: masterAccessKey,          // ← Depuis .env (sécurisé)
      secretAccessKey: masterSecretKey,      // ← Depuis .env (sécurisé)
      region: 'us-east-1',
      s3ForcePathStyle: true,
      signatureVersion: 'v4'
    })

    // ⏰ Créer des credentials temporaires (1 heure max)
    const sessionResponse = await sts.getSessionToken({
      DurationSeconds: 3600 // 1 heure (sécurisé)
    }).promise()

    const tempCredentials = sessionResponse.Credentials

    if (!tempCredentials) {
      throw new Error('Impossible de générer le token temporaire')
    }

    // 🔗 Générer URL avec credentials temporaires
    const consoleUrl = new URL('https://minio.trybetterads.com')
    
    // Ces credentials sont TEMPORAIRES et EXPIRENT automatiquement
    consoleUrl.searchParams.set('accessKey', tempCredentials.AccessKeyId || '')
    consoleUrl.searchParams.set('secretKey', tempCredentials.SecretAccessKey || '')
    consoleUrl.searchParams.set('sessionToken', tempCredentials.SessionToken || '')
    consoleUrl.searchParams.set('autoLogin', 'true')

    return NextResponse.json({
      // 🎯 URL avec auto-login temporaire (1h)
      autoLoginUrl: consoleUrl.toString(),
      
      // 📊 Infos sur le token
      tokenInfo: {
        expiresAt: tempCredentials.Expiration,
        durationMinutes: 60,
        type: 'temporary_session_token'
      },
      
      // 🔄 Fallback si auto-login échoue
      fallback: {
        consoleUrl: 'https://minio.trybetterads.com',
        temporaryCredentials: {
          accessKey: tempCredentials.AccessKeyId,
          secretKey: tempCredentials.SecretAccessKey,
          sessionToken: tempCredentials.SessionToken,
          note: 'Ces credentials sont temporaires et expirent automatiquement'
        }
      },
      
      success: true
    })

  } catch (error) {
    console.error('❌ Erreur génération token temporaire:', error)
    
    // 🚨 Fallback sécurisé : pas de credentials exposés
    return NextResponse.json({
      success: false,
      error: 'Impossible de générer un token temporaire',
      fallback: {
        consoleUrl: 'https://minio.trybetterads.com',
        requiresManualLogin: true,
        note: 'Utilisez vos credentials habituels pour vous connecter manuellement'
      }
    })
  }
}