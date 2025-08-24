"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { IconCheck, IconPhoto, IconSparkles, IconX, IconDownload, IconUpload, IconVideo } from "@tabler/icons-react"
import { GradientButton } from "./GradientButton"

interface DefineActorStepProps {
  onDefineActor: (prompt: string, imageUrl?: string) => void
  onNext: (imageUrl?: string) => void
}

interface GeneratedImage {
  id: string
  url: string
  selected: boolean
  loading?: boolean
}

interface GeneratedVideo {
  id: string
  url: string
  seedUsed?: number
  loading?: boolean
}

interface ChatMessage {
  text: string
  images: File[]
  timestamp: number
  selectedImage?: string
  generatedImages?: GeneratedImage[]
  isGenerating?: boolean
  generatedVideo?: GeneratedVideo
  isGeneratingVideo?: boolean
}

export function DefineActorStep({ 
  onDefineActor, 
  onNext
}: DefineActorStepProps) {
  const [prompt, setPrompt] = useState("")
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [downloadingImageId, setDownloadingImageId] = useState<string | null>(null)
  const [isDragOverGlobal, setIsDragOverGlobal] = useState(false)
  
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [videoPrompt, setVideoPrompt] = useState("")
  const [uploadVideoPrompt, setUploadVideoPrompt] = useState("")
  const [isGeneratingVideoFromUpload, setIsGeneratingVideoFromUpload] = useState(false)
  const [generatedVideoFromUpload, setGeneratedVideoFromUpload] = useState<GeneratedVideo | null>(null)
  
  const isGeneratingImages = false
  const isUploadingReference = false
  const generationError = null
  const uploadError = null

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      const file = files[0]
      setUploadedImage(file)
      setUploadedImageUrl(null)
      
      // Clear toutes les sélections d'images existantes (mutuelle exclusive)
      setChatMessages(prev => 
        prev.map(msg => ({
          ...msg,
          generatedImages: msg.generatedImages?.map(img => ({
            ...img,
            selected: false
          }))
        }))
      )
    }
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    setUploadedImageUrl(null)
  }

  const createImageUrl = (file: File) => {
    return URL.createObjectURL(file)
  }

  // Gestion du drag & drop global pour avatar creation
  const handleGlobalDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOverGlobal(true)
  }

  const handleGlobalDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    // Vérifier si on sort vraiment du container (et pas juste d'un enfant)
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOverGlobal(false)
    }
  }

  const handleGlobalDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOverGlobal(false)
    
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file)
      setUploadedImageUrl(null)
    }
  }

  const handleSubmit = async () => {
    if (prompt.trim()) {
      const selectedImage = chatMessages
        .flatMap(msg => msg.generatedImages || [])
        .find(img => img.selected)?.url
      
      // Validation des règles métier
      const hasUploadedImage = !!uploadedImage
      const hasSelectedImage = !!selectedImage
      
      if (hasUploadedImage && hasSelectedImage) {
        console.error("ERREUR : Upload et sélection simultanés interdits")
        alert("Erreur : Vous ne pouvez pas avoir à la fois une image uploadée et une image sélectionnée. Choisissez une seule source.")
        return
      }
      
      const currentPrompt = prompt
      
      const newMessage: ChatMessage = {
        text: currentPrompt,
        images: uploadedImage ? [uploadedImage] : [],
        timestamp: Date.now(),
        selectedImage,
        isGenerating: true
      }
      
      setChatMessages(prev => [...prev, newMessage])
      
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
          })
        }
      }, 50)
      
      setPrompt("")
      setUploadedImage(null)
      setUploadedImageUrl(null)
      
      let uploadedImageUrl: string | undefined;
      
      if (uploadedImage) {
        try {
          const response = await fetch('/api/images/upload', {
            method: 'POST',
            body: (() => {
              const formData = new FormData();
              formData.append('file', uploadedImage);
              return formData;
            })(),
          });
          
          const uploadResult = await response.json();
          if (uploadResult.success) {
            uploadedImageUrl = uploadResult.data.url;
          }
        } catch (error) {
          console.error('Upload error:', error);
        }
      }
      
      try {
        const response = await fetch('/api/images/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: currentPrompt,
            imageUrl: uploadedImageUrl || selectedImage,
            aspectRatio: '9:16',
            guidanceScale: 3.5,
          }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          setChatMessages(prev => 
            prev.map((msg, index) => 
              index === prev.length - 1 
                ? { ...msg, generatedImages: result.data, isGenerating: false }
                : msg
            )
          );
        } else {
          throw new Error(result.message || 'Generation failed');
        }
        
        setTimeout(() => {
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
              top: scrollAreaRef.current.scrollHeight,
              behavior: 'smooth'
            })
          }
        }, 100)
        
      } catch (error) {
        console.error('Generation error:', error);
        setChatMessages(prev => 
          prev.map((msg, index) => 
            index === prev.length - 1 
              ? { ...msg, isGenerating: false }
              : msg
          )
        )
      }
      
      const finalImageUrl = selectedImage || uploadedImageUrl
      onDefineActor(currentPrompt, finalImageUrl || undefined)
    }
  }

  const handleImageSelect = (messageIndex: number, imageId: string) => {
    // Clear upload existant (mutuelle exclusive)
    setUploadedImage(null)
    setUploadedImageUrl(null)
    
    setChatMessages(prev => 
      prev.map((msg, index) => 
        msg.generatedImages
          ? {
              ...msg,
              generatedImages: msg.generatedImages.map(img => ({
                ...img,
                selected: index === messageIndex && img.id === imageId 
                  ? !img.selected
                  : false
              }))
            }
          : msg
      )
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleGenerateVideo = async () => {
    const selectedImage = chatMessages
      .flatMap(msg => msg.generatedImages || [])
      .find(img => img.selected)
    
    if (!selectedImage || !videoPrompt.trim()) {
      alert("Please select an image and enter a video prompt")
      return
    }

    const messageIndex = chatMessages.findIndex(msg => 
      msg.generatedImages?.some(img => img.id === selectedImage.id)
    )
    
    if (messageIndex === -1) return

    setChatMessages(prev => 
      prev.map((msg, index) => 
        index === messageIndex 
          ? { ...msg, isGeneratingVideo: true }
          : msg
      )
    )

    try {
      const response = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: videoPrompt,
          imageUrl: selectedImage.url,
          resolution: '1080p',
          duration: '5',
        }),
      })

      const result = await response.json()

      if (result.success) {
        setChatMessages(prev => 
          prev.map((msg, index) => 
            index === messageIndex 
              ? { ...msg, generatedVideo: result.data, isGeneratingVideo: false }
              : msg
          )
        )
        setVideoPrompt("")
      } else {
        throw new Error(result.message || 'Video generation failed')
      }
    } catch (error) {
      console.error('Video generation error:', error)
      alert(`Error generating video: ${error instanceof Error ? error.message : 'Unknown error'}`)
      
      setChatMessages(prev => 
        prev.map((msg, index) => 
          index === messageIndex 
            ? { ...msg, isGeneratingVideo: false }
            : msg
        )
      )
    }
  }

  const handleGenerateVideoFromUpload = async () => {
    if (!uploadedImage || !uploadVideoPrompt.trim()) {
      alert("Please upload an image and enter a video prompt")
      return
    }

    setIsGeneratingVideoFromUpload(true)
    
    try {
      let imageUrl = uploadedImageUrl
      
      if (!imageUrl) {
        const response = await fetch('/api/images/upload', {
          method: 'POST',
          body: (() => {
            const formData = new FormData();
            formData.append('file', uploadedImage);
            return formData;
          })(),
        });
        
        const uploadResult = await response.json();
        if (uploadResult.success) {
          imageUrl = uploadResult.data.url;
          setUploadedImageUrl(imageUrl);
        } else {
          throw new Error('Failed to upload image');
        }
      }

      const response = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: uploadVideoPrompt,
          imageUrl: imageUrl,
          resolution: '1080p',
          duration: '5',
        }),
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedVideoFromUpload(result.data)
        setUploadVideoPrompt("")
      } else {
        throw new Error(result.message || 'Video generation failed')
      }
    } catch (error) {
      console.error('Video generation error:', error)
      alert(`Error generating video: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGeneratingVideoFromUpload(false)
    }
  }

  const canSubmit = prompt.trim().length > 0 && !isGeneratingImages && !isUploadingReference
  
  const hasSelectedImage = chatMessages.some(msg => 
    msg.generatedImages?.some(img => img.selected)
  )

  return (
    <div 
      className="relative h-full"
      onDragOver={handleGlobalDragOver}
      onDragLeave={handleGlobalDragLeave}
      onDrop={handleGlobalDrop}
    >
      <div 
        ref={scrollAreaRef}
        className="absolute inset-0 overflow-y-auto p-8 z-0"
        style={{ paddingBottom: hasSelectedImage ? '300px' : '220px' }}
      >
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">Let's start</h3>
              <p className="text-muted-foreground">
                To create your character, start by writing a text, optionally add<br />
                a reference image, and choose a ratio that suits you.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {chatMessages.map((message, messageIndex) => (
              <div key={message.timestamp}>
                <div className="flex justify-end mb-4">
                  <div className="max-w-[70%] bg-primary text-primary-foreground rounded-2xl px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        {message.images.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {message.images.map((file, imgIndex) => (
                              <div key={imgIndex} className="w-12 h-12 rounded-lg overflow-hidden border border-primary-foreground/20">
                                <Image
                                  src={createImageUrl(file)}
                                  alt={`Uploaded ${imgIndex + 1}`}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {message.selectedImage && (
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 rounded-md overflow-hidden border border-primary-foreground/20">
                            <Image
                              src={message.selectedImage}
                              alt="Selected reference"
                              width={24}
                              height={24}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-start w-full mb-4">
                  <div className={`${message.generatedImages || message.isGenerating ? 'w-full' : 'max-w-[70%]'} bg-muted rounded-2xl px-4 py-3`}>
                    {message.isGenerating ? (
                      <div className="relative">
                        <p className="text-sm text-muted-foreground mb-3">Generating images...</p>
                        <div className="flex gap-3 w-full">
                          {Array.from({ length: 4 }).map((_, index) => (
                            <div key={`skeleton-${index}`} className="relative flex-1">
                              <div className="aspect-[9/16] rounded-lg overflow-hidden border-2 border-border">
                                <div className="relative w-full h-full overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-muted/40 to-muted/20" />
                                  <div className="absolute inset-0 opacity-40">
                                    <div 
                                      className="absolute w-40 h-40 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-3xl animate-pulse"
                                      style={{ 
                                        top: '20%',
                                        left: '10%',
                                        animationDelay: `${index * 0.4}s`,
                                        animationDuration: '6s'
                                      }}
                                    />
                                    <div 
                                      className="absolute w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl animate-pulse"
                                      style={{ 
                                        bottom: '20%',
                                        right: '15%',
                                        animationDelay: `${index * 0.6}s`,
                                        animationDuration: '8s'
                                      }}
                                    />
                                  </div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : message.generatedImages ? (
                      <div className="relative">
                        <p className="text-sm text-muted-foreground mb-3">Choose your avatar:</p>
                        <div 
                          className="flex gap-3 w-full"
                          onMouseMove={(e) => {
                            setMousePosition({
                              x: e.clientX,
                              y: e.clientY
                            })
                          }}
                        >
                          {message.generatedImages.map((image, imgIndex) => (
                            <div
                              key={image.id}
                              className="relative flex-1 group"
                              style={{ 
                                animationDelay: `${imgIndex * 100}ms`,
                                animationDuration: '600ms'
                              }}
                            >
                              <div
                                onClick={() => handleImageSelect(messageIndex, image.id)}
                                onMouseEnter={() => setHoveredImageId(image.id)}
                                onMouseLeave={() => setHoveredImageId(null)}
                                className={`relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
                                  image.selected 
                                    ? 'border-primary ring-2 ring-primary/20' 
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                <Image
                                  src={image.url}
                                  alt={`Generated avatar ${image.id}`}
                                  width={270}
                                  height={480}
                                  className="w-full h-full object-cover"
                                />
                                
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation()
                                    setDownloadingImageId(image.id)
                                    
                                    setTimeout(() => {
                                      const link = document.createElement('a')
                                      link.href = image.url
                                      link.download = `avatar-${image.id}.jpg`
                                      link.click()
                                      
                                      setTimeout(() => {
                                        setDownloadingImageId(null)
                                      }, 1000)
                                    }, 200)
                                  }}
                                  className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm ${
                                    downloadingImageId === image.id
                                      ? 'bg-foreground scale-110 animate-pulse'
                                      : 'bg-background/80 hover:bg-background hover:scale-105'
                                  }`}
                                >
                                  {downloadingImageId === image.id ? (
                                    <IconCheck className="w-3 h-3 text-background" />
                                  ) : (
                                    <IconDownload className="w-3 h-3 text-foreground" />
                                  )}
                                </button>
                                
                                {image.selected && (
                                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                      <IconCheck className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {message.generatedImages?.some(img => img.selected) && !message.generatedVideo && (
                          <div className="mt-4 border-t border-border pt-4">
                            <p className="text-sm text-muted-foreground mb-3">Generate video from selected image:</p>
                            <div className="flex gap-3">
                              <input
                                type="text"
                                value={videoPrompt}
                                onChange={(e) => setVideoPrompt(e.target.value)}
                                placeholder="Describe the video animation..."
                                className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                              <GradientButton
                                onClick={handleGenerateVideo}
                                disabled={!videoPrompt.trim() || message.isGeneratingVideo}
                                icon={<IconVideo />}
                                fullWidth={false}
                                size="md"
                              >
                                {message.isGeneratingVideo ? "Generating..." : "Generate Video"}
                              </GradientButton>
                            </div>
                          </div>
                        )}

                        {message.isGeneratingVideo && (
                          <div className="mt-4 border-t border-border pt-4">
                            <p className="text-sm text-muted-foreground mb-3">Generating video...</p>
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                              <span className="text-sm text-muted-foreground">Video generation typically takes 2-3 minutes...</span>
                            </div>
                          </div>
                        )}

                        {message.generatedVideo && (
                          <div className="mt-4 border-t border-border pt-4">
                            <p className="text-sm text-muted-foreground mb-3">Generated video:</p>
                            <div className="relative aspect-[9/16] max-w-xs rounded-lg overflow-hidden border border-border">
                              <video
                                src={message.generatedVideo.url}
                                controls
                                loop
                                muted
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => {
                                  const link = document.createElement('a')
                                  link.href = message.generatedVideo!.url
                                  link.download = `video-${message.generatedVideo!.id}.mp4`
                                  link.click()
                                }}
                                className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 cursor-pointer"
                              >
                                Download Video
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Images generated ✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {hoveredImageId && (
        <div 
          className="fixed z-[100] w-64 rounded-lg overflow-hidden border-2 border-primary shadow-2xl bg-card pointer-events-none"
          style={{
            left: mousePosition.x + 2,
            top: mousePosition.y + 2,
            aspectRatio: '9/16',
            height: 'calc(256px * 16 / 9)'
          }}
        >
          <Image
            src={chatMessages
              .flatMap(msg => msg.generatedImages || [])
              .find(img => img.id === hoveredImageId)?.url || ''}
            alt="Preview"
            width={270}
            height={480}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-card z-10 rounded-b-lg">
        {(generationError || uploadError) && (
          <div className="mx-6 mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            {generationError && <p className="text-sm text-destructive">{generationError}</p>}
            {uploadError && <p className="text-sm text-destructive">Upload: {uploadError}</p>}
          </div>
        )}
        
        <div className="relative border border-border bg-card border-t-2 mx-6 mb-6 rounded-xl overflow-hidden">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your actor... Upload photos and reference them"
            className="w-full h-32 p-4 pb-16 bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none border-0 rounded-xl"
          />
          
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!uploadedImage ? (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                  <div className="w-8 h-8 bg-muted hover:bg-accent rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer">
                    <IconPhoto className="w-4 h-4 text-muted-foreground transition-transform" />
                  </div>
                </label>
              ) : (
                <div className="relative group">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-border">
                    <Image
                      src={createImageUrl(uploadedImage)}
                      alt="Reference image"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-foreground text-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <IconX className="w-2 h-2" />
                  </button>
                  {isUploadingReference && (
                    <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-1">
                <div className="w-4 h-6 bg-muted rounded-sm border border-border flex items-center justify-center">
                  <div className="w-1.5 h-3.5 bg-foreground rounded-sm"></div>
                </div>
                <span className="text-xs text-muted-foreground">9:16</span>
              </div>
            </div>

            <GradientButton
              onClick={handleSubmit}
              disabled={!canSubmit}
              icon={<IconSparkles />}
              fullWidth={false}
              size="md"
            >
              {isGeneratingImages ? "Generating..." : "Generate"}
            </GradientButton>
          </div>
        </div>
        
        {hasSelectedImage && (
          <div className="mt-8 px-8 pb-6">
            <GradientButton
              onClick={() => {
                const selectedImage = chatMessages
                  .flatMap(msg => msg.generatedImages || [])
                  .find(img => img.selected)
                
                if (selectedImage) {
                  onNext(selectedImage.url)
                }
              }}
            >
              Select Actor
            </GradientButton>
          </div>
        )}

        {uploadedImage && !generatedVideoFromUpload && (
          <div className="mt-8 px-8 pb-6">
            <div className="border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Generate Video from Uploaded Image</h3>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-border flex-shrink-0">
                  <Image
                    src={createImageUrl(uploadedImage)}
                    alt="Uploaded image"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={uploadVideoPrompt}
                    onChange={(e) => setUploadVideoPrompt(e.target.value)}
                    placeholder="Describe the video animation for this image..."
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 mb-3"
                  />
                  <GradientButton
                    onClick={handleGenerateVideoFromUpload}
                    disabled={!uploadVideoPrompt.trim() || isGeneratingVideoFromUpload}
                    icon={<IconVideo />}
                    fullWidth={false}
                    size="md"
                  >
                    {isGeneratingVideoFromUpload ? "Generating Video..." : "Generate Video"}
                  </GradientButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {isGeneratingVideoFromUpload && (
          <div className="mt-8 px-8 pb-6">
            <div className="border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-3">Generating video from uploaded image...</p>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Video generation typically takes 2-3 minutes...</span>
              </div>
            </div>
          </div>
        )}

        {generatedVideoFromUpload && (
          <div className="mt-8 px-8 pb-6">
            <div className="border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Generated Video</h3>
              <div className="relative aspect-[9/16] max-w-xs rounded-lg overflow-hidden border border-border">
                <video
                  src={generatedVideoFromUpload.url}
                  controls
                  loop
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = generatedVideoFromUpload.url
                    link.download = `video-${generatedVideoFromUpload.id}.mp4`
                    link.click()
                  }}
                  className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 cursor-pointer"
                >
                  Download Video
                </button>
                <button
                  onClick={() => {
                    setGeneratedVideoFromUpload(null)
                    setUploadVideoPrompt("")
                  }}
                  className="px-3 py-2 text-sm bg-muted text-muted-foreground rounded-md hover:bg-accent cursor-pointer"
                >
                  Generate Another
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Overlay global de drop pour Avatar creation */}
      {isDragOverGlobal && (
        <div className="absolute inset-0 bg-background rounded-2xl flex items-center justify-center z-50 border-2 border-primary/40 border-dashed">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center transition-all hover:scale-110 animate-pulse">
              <IconUpload className="w-6 h-6 text-primary transition-transform" />
            </div>
            <div>
              <p className="text-base font-medium text-foreground">Drop your image here</p>
              <p className="text-sm text-muted-foreground">
                {uploadedImage ? 'Replace reference image' : 'Add reference image for avatar'}
              </p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}