export async function generateVideoThumbnail(
  videoUrl: string, 
  timeOffset: number = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Canvas context not supported'))
        return
      }

      video.crossOrigin = 'anonymous'
      video.muted = true
      
      video.onloadedmetadata = () => {
        // Respecter le ratio original de la vidéo
        const videoWidth = video.videoWidth
        const videoHeight = video.videoHeight
        
        // Calculer la taille du canvas en gardant le ratio
        const maxSize = 640
        if (videoWidth > videoHeight) {
          // Vidéo horizontale
          canvas.width = maxSize
          canvas.height = Math.round((maxSize * videoHeight) / videoWidth)
        } else {
          // Vidéo verticale ou carrée
          canvas.height = maxSize
          canvas.width = Math.round((maxSize * videoWidth) / videoHeight)
        }
        
        // Aller à la frame désirée (1 seconde par défaut)
        video.currentTime = Math.min(timeOffset, video.duration || 1)
      }
      
      video.onseeked = () => {
        try {
          // Dessiner la frame actuelle sur le canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          
          // Convertir en data URL avec meilleure qualité
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.95)
          
          // Nettoyer
          video.remove()
          
          resolve(thumbnailUrl)
        } catch (error) {
          reject(error)
        }
      }
      
      video.onerror = () => {
        reject(new Error('Failed to load video'))
      }
      
      video.src = videoUrl
      
    } catch (error) {
      reject(error)
    }
  })
}

export async function generateVideoThumbnailSafe(
  videoUrl: string, 
  fallbackUrl: string = '/placeholder-video.jpg'
): Promise<string> {
  try {
    return await generateVideoThumbnail(videoUrl)
  } catch (error) {
    console.warn('Failed to generate video thumbnail:', error)
    return fallbackUrl
  }
}