// Services de génération mock ultra-minimalistes 
// À remplacer par vraie logique plus tard

export const mockImageGeneration = async (prompt: string): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  return Array.from({ length: 4 }, (_, i) => 
    `https://picsum.photos/512/512?random=${Date.now() + i}`
  )
}

export const mockVideoGeneration = async (
  script: string, 
  avatarId: string, 
  voiceId: string
): Promise<{ id: string; posterUrl: string; videoUrl: string }> => {
  await new Promise(resolve => setTimeout(resolve, 3000))
  return {
    id: `video_${Date.now()}`,
    posterUrl: `https://picsum.photos/512/512?random=${Date.now()}`,
    videoUrl: `https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4`
  }
}

export const mockAudioGeneration = async (
  text: string, 
  voiceId: string
): Promise<Blob> => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  return new Blob(['mock audio data'], { type: 'audio/wav' })
}

export const mockAvatarGeneration = async (
  prompt: string, 
  imageUrl?: string
): Promise<{ id: string; title: string; imageUrl: string }> => {
  await new Promise(resolve => setTimeout(resolve, 2500))
  return {
    id: `avatar_${Date.now()}`,
    title: `Avatar généré`,
    imageUrl: `https://picsum.photos/512/512?random=${Date.now()}`
  }
}