import { NextRequest, NextResponse } from 'next/server';
import { minioService } from '../../../_shared/lib/minio';

/**
 * GET /api/media/[...path]
 * Proxy pour servir les fichiers depuis MinIO
 * Génère des URLs signées pour l'accès sécurisé aux fichiers
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Reconstituer le chemin complet du fichier
    const { path } = await params;
    const filePath = path.join('/');
    
    console.log(`📁 Demande d'accès au fichier: ${filePath}`);

    // Générer une URL signée pour le téléchargement
    const downloadUrl = await minioService.generateDownloadUrl(filePath, 3600); // 1 heure

    // Rediriger vers l'URL signée MinIO
    return NextResponse.redirect(downloadUrl);

  } catch (error) {
    console.error('❌ Erreur lors de l\'accès au fichier média:', error);
    
    return NextResponse.json(
      { error: 'Fichier introuvable' },
      { status: 404 }
    );
  }
}