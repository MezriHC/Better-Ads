import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../_shared/lib/auth';
import { minioService } from '../../_shared/lib/minio';

/**
 * POST /api/uploads
 * Génère une URL signée pour l'upload d'un fichier vers MinIO
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { fileName, fileType, fileSize } = await request.json();
    
    if (!fileName || !fileType || !fileSize) {
      return NextResponse.json(
        { error: 'fileName, fileType et fileSize sont requis' },
        { status: 400 }
      );
    }
    
    const bucketName = 'better-ads';
    const timestamp = Date.now();
    const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const objectName = `temp/${timestamp}-${safeName}`;
    
    console.log(`📤 Génération URL signée pour: ${objectName}`);
    
    const uploadUrl = await minioService.generateUploadUrl(
      objectName,
      fileType,
      60 * 5 // 5 minutes
    );

    const useSSL = process.env.MINIO_USE_SSL === 'true';
    const protocol = useSSL ? 'https' : 'http';
    const publicUrl = `${protocol}://${process.env.MINIO_ENDPOINT}/${bucketName}/${objectName}`;
    
    return NextResponse.json({ 
      uploadUrl,
      publicUrl
    });

  } catch (error) {
    console.error('❌ Erreur génération URL signée:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'URL d\'upload' },
      { status: 500 }
    );
  }
}
