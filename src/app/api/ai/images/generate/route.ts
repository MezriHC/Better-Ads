import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'
import { FalImageGenerationRequest, FalGenerationResponse } from '../../../../_shared/types/ai'

// Configurer fal.ai avec la clé API depuis les variables d'environnement
fal.config({
  credentials: process.env.FAL_KEY
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt requis et doit être une chaîne de caractères' },
        { status: 400 }
      )
    }

    // Paramètres pour FLUX Kontext Max
    const requestData: FalImageGenerationRequest = {
      prompt,
      num_images: 4, // Toujours générer 4 images
      guidance_scale: 3.5, // Valeur par défaut recommandée
      output_format: 'jpeg',
      safety_tolerance: '2', // Valeur par défaut
      aspect_ratio: '9:16', // Format vertical pour les avatars/stories
      sync_mode: true // Attendre que toutes les images soient générées
    }

    // Appeler l'API fal.ai avec le modèle FLUX Kontext Max
    const result = await fal.subscribe('fal-ai/flux-pro/kontext/max/text-to-image', {
      input: requestData,
      logs: true
    }) as { data: FalGenerationResponse }

// Transformer la réponse pour notre format
    const generatedImages = result.data.images.map((image, index) => ({
      id: `${Date.now()}-${index + 1}`,
      url: image.url,
      selected: false,
      loading: false
    }))



    return NextResponse.json({
      success: true,
      images: generatedImages,
      metadata: {
        prompt: result.data.prompt,
        seed: result.data.seed,
        has_nsfw_concepts: result.data.has_nsfw_concepts
      }
    })

  } catch (error) {

    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération d\'images',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
