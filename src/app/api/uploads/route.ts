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
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fileName, contentType } = body;

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: 'fileName et contentType sont requis' },
        { status: 400 }
      );
    }

    // Valider le type de fichier (images seulement)
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Seules les images sont autorisées' },
        { status: 400 }
      );
    }

    // Extraire l'extension du fichier
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension || !['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
      return NextResponse.json(
        { error: 'Format d\'image non supporté. Utilisez JPG, PNG ou WebP' },
        { status: 400 }
      );
    }

    // Générer un chemin temporaire unique pour l'upload
    const userId = session.user.email!; // Use email as user ID
    const tempPath = minioService.generateTempUploadPath(userId, extension);

    // Générer l'URL signée (valide 1 heure)
    const uploadUrl = await minioService.generateUploadUrl(
      tempPath,
      contentType,
      3600 // 1 heure
    );

    console.log(`✅ URL d'upload générée pour l'utilisateur ${userId}: ${tempPath}`);

    return NextResponse.json({
      uploadUrl,
      filePath: tempPath,
      expiresIn: 3600
    });

  } catch (error) {
    console.error('❌ Erreur lors de la génération de l\'URL d\'upload:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}