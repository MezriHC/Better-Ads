import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'

// Configurer fal.ai avec la clé API
fal.config({
  credentials: process.env.FAL_KEY
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucune image fournie' },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Le fichier doit être une image' },
        { status: 400 }
      )
    }

    try {
      // Utiliser l'API fal.ai storage pour uploader (passer le File directement)
      const uploadedFile = await fal.storage.upload(file)

      return NextResponse.json({
        success: true,
        imageUrl: uploadedFile
      })

    } catch (uploadError) {

      
      try {
        // Fallback : convertir en Data URL
        const arrayBuffer = await file.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        const dataUrl = `data:${file.type};base64,${base64}`
        
        return NextResponse.json({
          success: true,
          imageUrl: dataUrl,
          isDataUrl: true
        })
      } catch (fallbackError) {

        
        return NextResponse.json(
          { 
            error: 'Erreur lors de l\'upload de l\'image de référence',
            details: fallbackError instanceof Error ? fallbackError.message : 'Erreur inconnue'
          },
          { status: 500 }
        )
      }
    }
  } catch (error) {

    
    return NextResponse.json(
      { 
        error: 'Erreur lors du traitement de la requête',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
