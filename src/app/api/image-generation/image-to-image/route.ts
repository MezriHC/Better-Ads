import { NextResponse } from 'next/server';
import { imageToImageRequestSchema } from './types';
import { handleImageToImageGeneration } from './services';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = imageToImageRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const result = await handleImageToImageGeneration(validation.data);
    return NextResponse.json(result);

  } catch (error) {
    console.error("--- ERREUR API Image-to-Image ---", error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur interne du serveur.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
