import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../_shared/lib/auth';
import { generateImageFromText } from '../../../_shared/lib/falAi';

/**
 * POST /api/image-generation/text-to-image
 * Génère des images à partir d'un prompt texte avec fal.ai
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
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Le prompt est requis et doit être une chaîne de caractères' },
        { status: 400 }
      );
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Le prompt est trop long (maximum 1000 caractères)' },
        { status: 400 }
      );
    }

    console.log(`🎨 Génération text-to-image pour l'utilisateur ${session.user.email}: "${prompt}"`);

    // Générer les images via fal.ai
    const imageUrls = await generateImageFromText(prompt);

    if (!imageUrls || imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'Échec de la génération d\'images' },
        { status: 500 }
      );
    }

    console.log(`✅ ${imageUrls.length} images générées avec succès`);

    // Retourner dans le format attendu par le frontend existant
    return NextResponse.json({
      imageUrls
    });

  } catch (error) {
    console.error('❌ Erreur lors de la génération text-to-image:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur lors de la génération d\'images' },
      { status: 500 }
    );
  }
}
