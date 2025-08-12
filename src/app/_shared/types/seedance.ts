// Types pour l'API de génération vidéo (image-to-video)

export interface SeedanceVideoRequest {
  prompt: string
  image_url: string
  resolution?: '480p' | '720p' | '1080p'
  duration?: '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12'
  camera_fixed?: boolean
  seed?: number
}

export interface SeedanceVideoResponse {
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
}
