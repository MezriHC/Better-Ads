import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../_shared/lib/auth';
import { modifyImage } from '../../../_shared/lib/falAi';

/**
 * POST /api/image-generation/image-to-image
 * Modifie une image existante avec un prompt texte via fal.ai
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
    const { prompt, imageUrl } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Le prompt est requis et doit être une chaîne de caractères' },
        { status: 400 }
      );
    }

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json(
        { error: 'L\'URL de l\'image de référence est requise' },
        { status: 400 }
      );
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Le prompt est trop long (maximum 1000 caractères)' },
        { status: 400 }
      );
    }

    console.log(`🖼️ Modification image-to-image pour l'utilisateur ${session.user.email}: "${prompt}"`);
    console.log(`📷 Image de référence: ${imageUrl}`);

    // Modifier l'image via fal.ai
    const imageUrls = await modifyImage(prompt, imageUrl);

    if (!imageUrls || imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'Échec de la modification d\'image' },
        { status: 500 }
      );
    }

    console.log(`✅ ${imageUrls.length} images modifiées avec succès`);

    // Retourner dans le format attendu par le frontend existant
    return NextResponse.json({
      imageUrls
    });

  } catch (error) {
    console.error('❌ Erreur lors de la modification image-to-image:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur lors de la modification d\'image' },
      { status: 500 }
    );
  }
}
