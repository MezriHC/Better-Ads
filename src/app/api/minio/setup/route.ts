import { NextRequest, NextResponse } from 'next/server'
import { minioService } from '../../../_shared/services/minio'

// Structure des dossiers selon le plan.md
const REQUIRED_FOLDERS = [
  'avatars/public/',
  'avatars/private/',
  'videos/generated/'
]

export async function POST(request: NextRequest) {
  try {
    console.log('Vérification de la configuration MinIO...')

    // 1. S'assurer que le bucket existe
    await minioService.ensureBucketExists()
    console.log(`Bucket ${minioService.getBucketName()} vérifié`)

    // 2. Créer les dossiers de base (en uploadant un fichier .gitkeep)
    const gitkeepContent = Buffer.from('# Dossier géré par Better Ads\n')
    
    for (const folder of REQUIRED_FOLDERS) {
      const objectName = `${folder}.gitkeep`
      
      const exists = await minioService.fileExists(objectName)
      if (!exists) {
        console.log(`Création du dossier ${folder}...`)
        await minioService.uploadFile(objectName, gitkeepContent, 'text/plain')
        console.log(`Dossier ${folder} créé`)
      } else {
        console.log(`Dossier ${folder} existe déjà`)
      }
    }

    // 3. Vérifier les permissions
    try {
      const client = minioService.getClient()
      const objects = await client.listObjects(minioService.getBucketName(), '', false)
      const objectsList = []
      
      for await (const obj of objects) {
        objectsList.push(obj.name)
      }

      return NextResponse.json({
        success: true,
        message: 'Configuration MinIO vérifiée et mise à jour',
        details: {
          bucketName: minioService.getBucketName(),
          bucketExists: true,
          folders: REQUIRED_FOLDERS,
          objects: objectsList.slice(0, 10),
          totalObjects: objectsList.length
        }
      })

    } catch (error) {
      throw new Error(`Erreur lors de la vérification des permissions: ${error}`)
    }

  } catch (error) {
    console.error('Erreur setup MinIO:', error)
    return NextResponse.json({
      error: 'Erreur lors de la configuration MinIO',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // API pour vérifier l'état de MinIO sans modifications
    const client = minioService.getClient()
    const bucketName = minioService.getBucketName()
    const bucketExists = await client.bucketExists(bucketName)
    
    if (!bucketExists) {
      return NextResponse.json({
        success: false,
        message: 'Bucket principal manquant',
        bucketName,
        bucketExists: false
      })
    }

    // Lister les objets pour vérifier la structure
    const objects = await client.listObjects(bucketName, '', false)
    const objectsList: Array<{ name: string; size: number; lastModified: Date }> = []
    
    for await (const obj of objects) {
      objectsList.push({
        name: obj.name,
        size: obj.size,
        lastModified: obj.lastModified
      })
    }

    // Vérifier la présence des dossiers requis
    const folderStatus = REQUIRED_FOLDERS.map(folder => ({
      folder,
      exists: objectsList.some(obj => obj.name.startsWith(folder))
    }))

    return NextResponse.json({
      success: true,
      bucketName: minioService.getBucketName(),
      bucketExists: true,
      folders: folderStatus,
      totalObjects: objectsList.length,
      recentObjects: objectsList.slice(0, 5)
    })

  } catch (error) {
    console.error('Erreur vérification MinIO:', error)
    return NextResponse.json({
      error: 'Erreur lors de la vérification MinIO',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}
