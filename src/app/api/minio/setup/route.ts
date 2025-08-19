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
      }
}
