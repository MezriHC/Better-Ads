// Types pour l'intégration fal.ai FLUX Kontext Max

// Interface pour la génération d'images (text-to-image)
export interface FalImageGenerationRequest {
  prompt: string
  seed?: number
  guidance_scale?: number
  sync_mode?: boolean
  num_images?: number
  output_format?: 'jpeg' | 'png'
  safety_tolerance?: '1' | '2' | '3' | '4' | '5' | '6'
  aspect_ratio?: '21:9' | '16:9' | '4:3' | '3:2' | '1:1' | '2:3' | '3:4' | '9:16' | '9:21'
}

// Interface pour l'édition d'images (image-to-image)
export interface FalImageEditingRequest {
  prompt: string
  image_url: string
  seed?: number
  guidance_scale?: number
  sync_mode?: boolean
  num_images?: number
  output_format?: 'jpeg' | 'png'
  safety_tolerance?: '1' | '2' | '3' | '4' | '5' | '6'
  aspect_ratio?: '21:9' | '16:9' | '4:3' | '3:2' | '1:1' | '2:3' | '3:4' | '9:16' | '9:21'
}

export interface FalImageResponse {
  url: string
  content_type?: string
  height?: number
  width?: number
}

export interface FalGenerationResponse {
  images: FalImageResponse[]
  timings: Record<string, unknown>
  seed: number
  has_nsfw_concepts: boolean[]
  prompt: string
}

export interface GeneratedImageData {
  id: string
  url: string
  selected: boolean
  loading?: boolean
}

// Types pour différencier les modes de génération
export type ImageGenerationMode = 'generate' | 'edit'

export interface ImageGenerationRequest {
  prompt: string
  mode: ImageGenerationMode
  baseImageUrl?: string // Pour le mode édition
}
