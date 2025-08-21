import { generateImageFromText } from '@/src/app/_shared/lib/falAi';
import { NextResponse } from 'next/server';

/**
 * Gère la requête POST pour générer une image à partir d'un prompt.
 * @param request La requête Next.js contenant le prompt.
 * @returns Une réponse JSON avec l'URL de l'image ou une erreur.
 */
export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Le prompt est manquant.' }, { status: 400 });
    }

    const imageUrls = await generateImageFromText(prompt);

    if (imageUrls && imageUrls.length > 0) {
      return NextResponse.json({ imageUrls });
    } else {
      return NextResponse.json({ error: 'La génération d\'image a échoué.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Erreur dans la route /api/image-generation/text-to-image:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
