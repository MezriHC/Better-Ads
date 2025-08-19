import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'
import { FalImageEditingRequest, FalGenerationResponse } from '../../../../_shared/types/ai'

// Configurer fal.ai avec la clé API depuis les variables d'environnement
fal.config({
  credentials: process.env.FAL_KEY
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, baseImageUrl } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt requis et doit être une chaîne de caractères' },
        { status: 400 }
      )
    }

    if (!baseImageUrl || typeof baseImageUrl !== 'string') {
      return NextResponse.json(
        { error: 'URL de l\'image de base requise pour l\'édition' },
        { status: 400 }
      )
    }

    // Paramètres pour FLUX Kontext Editing Max
    const requestData: FalImageEditingRequest = {
      prompt,
      image_url: baseImageUrl,
      num_images: 4, // Toujours générer 4 variantes
      guidance_scale: 3.5, // Valeur par défaut recommandée
      output_format: 'jpeg',
      safety_tolerance: '2', // Valeur par défaut
      sync_mode: true // Attendre que toutes les images soient générées
    }

    // Appeler l'API fal.ai avec le modèle FLUX Kontext Editing Max
    const result = await fal.subscribe('fal-ai/flux-pro/kontext/max/image-to-image', {
      input: requestData,
      logs: true
    }) as { data: FalGenerationResponse }

    // Transformer la réponse pour notre format
    const editedImages = result.data.images.map((image, index) => ({
      id: `edited-${Date.now()}-${index + 1}`,
      url: image.url,
      selected: false,
      loading: false
    }))

    return NextResponse.json({
      success: true,
      images: editedImages,
      metadata: {
        prompt: result.data.prompt,
        seed: result.data.seed,
        has_nsfw_concepts: result.data.has_nsfw_concepts,
        originalImageUrl: baseImageUrl
      }
    })

  } catch (error) {

    
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'édition d\'images',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
