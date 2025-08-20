// Types unifiés pour toutes les intégrations IA (fal.ai, FLUX, Seedance)

// === GÉNÉRATION D'IMAGES (FLUX Kontext Max) ===

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

export type ImageGenerationMode = 'generate' | 'edit'

export interface ImageGenerationRequest {
  prompt: string
  mode: ImageGenerationMode
  baseImageUrl?: string
}

// === GÉNÉRATION DE VIDÉOS (Seedance) ===

export interface VideoGenerationRequest {
  prompt: string
  image_url: string
  resolution?: '480p' | '720p' | '1080p'
  duration?: '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12'
  camera_fixed?: boolean
  seed?: number
}

export interface VideoGenerationResponse {
  video: {
    url: string
  }
  seed: number
}

export interface GeneratedVideoData {
  id: string
  url: string
  duration: string
  resolution: string
  prompt: string
  loading: boolean
  type?: 'private-avatar' | 'generated-video'
}
