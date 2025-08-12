"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { IconCheck, IconPhoto, IconSparkles, IconX, IconDownload } from "@tabler/icons-react"



interface DefineActorStepProps {
  onDefineActor: (prompt: string, image?: File) => void
  onNext: (imageUrl?: string) => void
  isGenerating: boolean
}

interface GeneratedImage {
  id: string
  url: string
  selected: boolean
  loading?: boolean
}

interface ChatMessage {
  text: string
  images: File[]
  timestamp: number
  selectedImage?: string
  generatedImages?: GeneratedImage[]
  isGenerating?: boolean
}

export function DefineActorStep({ 
  onDefineActor, 
  onNext,
  isGenerating
}: DefineActorStepProps) {
  const [prompt, setPrompt] = useState("")
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      setUploadedImages(prev => [...prev, ...files])
    }
  }



  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const createImageUrl = (file: File) => {
    return URL.createObjectURL(file)
  }

  const handleSubmit = () => {
    if (prompt.trim()) {
      // Trouver l'image sélectionnée dans le dernier message
      const lastMessage = chatMessages[chatMessages.length - 1]
      const selectedImage = lastMessage?.generatedImages?.find(img => img.selected)?.url
      
      // Ajouter le nouveau message avec état de génération
      const newMessage: ChatMessage = {
        text: prompt,
        images: [...uploadedImages],
        timestamp: Date.now(),
        selectedImage,
        isGenerating: true
      }
      
      setChatMessages(prev => [...prev, newMessage])
      
      // Scroll immédiat après ajout du message
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
          })
        }
      }, 50)
      
      // Simuler la génération après 2 secondes
      setTimeout(() => {
        // D'abord créer les placeholders avec loading
        const loadingImages: GeneratedImage[] = [
          { id: `${Date.now()}-1`, url: '', selected: false, loading: true },
          { id: `${Date.now()}-2`, url: '', selected: false, loading: true },
          { id: `${Date.now()}-3`, url: '', selected: false, loading: true },
          { id: `${Date.now()}-4`, url: '', selected: false, loading: true }
        ]
        
        // Mettre à jour avec les loaders
        setChatMessages(prev => 
          prev.map((msg, index) => 
            index === prev.length - 1 
              ? { ...msg, generatedImages: loadingImages, isGenerating: false }
              : msg
          )
        )
        
        // Charger les images une par une avec délai
        loadingImages.forEach((_, imageIndex) => {
          setTimeout(() => {
            setChatMessages(prev => 
              prev.map((msg, msgIndex) => 
                msgIndex === prev.length - 1 && msg.generatedImages
                  ? {
                      ...msg,
                      generatedImages: msg.generatedImages.map((img, imgIndex) =>
                        imgIndex === imageIndex
                          ? {
                              ...img,
                              url: `https://picsum.photos/seed/gen-${Date.now()}-${imageIndex + 1}/270/480`,
                              loading: false
                            }
                          : img
                      )
                    }
                  : msg
              )
            )
          }, (imageIndex + 1) * 500) // Charger chaque image avec 500ms de délai
        })
        
        // Auto-scroll quand les images sont générées
        setTimeout(() => {
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
              top: scrollAreaRef.current.scrollHeight,
              behavior: 'smooth'
            })
          }
        }, 100)
      }, 2000)
      
      // Vider les champs
      setPrompt("")
      setUploadedImages([])
      
      // Appeler l'API
      onDefineActor(prompt, uploadedImages[0] || undefined)
    }
  }

  const handleImageSelect = (messageIndex: number, imageId: string) => {
    setChatMessages(prev => 
      prev.map((msg, index) => 
        index === messageIndex && msg.generatedImages
          ? {
              ...msg,
              generatedImages: msg.generatedImages.map(img => ({
                ...img,
                selected: img.id === imageId ? !img.selected : false // Toggle si même image, sinon désélectionner
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

  const canSubmit = prompt.trim().length > 0
  
  // Vérifier s'il y a une image sélectionnée dans le dernier message
  const hasSelectedImage = chatMessages.length > 0 && 
    chatMessages[chatMessages.length - 1]?.generatedImages?.some(img => img.selected)



  // Interface generate (interface actuelle)
  return (
    <div className="relative h-full">
      {/* Messages area - scrollable with fixed bottom space */}
      <div 
        ref={scrollAreaRef}
        className="absolute inset-0 overflow-y-auto p-8 z-0"
                      style={{ paddingBottom: hasSelectedImage ? '300px' : '220px' }}
      >
        {chatMessages.length === 0 ? (
          /* Instructions - centered when no messages */
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">Let&apos;s start</h3>
              <p className="text-muted-foreground">
                To create your character, start by writing a text, optionally add<br />
                a reference image, and choose a ratio that suits you.
              </p>
            </div>
          </div>
        ) : (
          /* Chat messages */
          <div className="space-y-6">
            {chatMessages.map((message, messageIndex) => (
              <div key={message.timestamp}>
                {/* User message - right aligned */}
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
                      {/* Selected image reference */}
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
                
                {/* AI Response for this specific message */}
                <div className="flex justify-start w-full mb-4">
                  <div className={`${message.generatedImages ? 'w-full' : 'max-w-[70%]'} bg-muted rounded-2xl px-4 py-3`}>
                    {message.isGenerating ? (
                      /* Loading state */
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-muted-foreground">Generating images...</span>
                      </div>
                    ) : message.generatedImages ? (
                      /* Generated images */
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
                          {message.generatedImages.map((image) => (
                            <div
                              key={image.id}
                              className="relative flex-1 group"
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
                                {image.loading ? (
                                  /* Loader placeholder */
                                  <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                  </div>
                                ) : (
                                  <Image
                                    src={image.url}
                                    alt={`Generated avatar ${image.id}`}
                                    width={270}
                                    height={480}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                
                                {/* Download button - top right - only when image is loaded */}
                                {!image.loading && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      // Télécharger l'image
                                      const link = document.createElement('a')
                                      link.href = image.url
                                      link.download = `avatar-${image.id}.jpg`
                                      link.click()
                                    }}
                                    className="absolute top-2 right-2 w-6 h-6 bg-background/80 hover:bg-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                                  >
                                    <IconDownload className="w-3 h-3 text-foreground" />
                                  </button>
                                )}
                                
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
                      </div>
                    ) : (
                      /* Réponse générique pour les anciens messages */
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

      {/* Large hover preview - OUTSIDE scroll area for proper z-index */}
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

      {/* Input area - absolutely positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-card z-10 rounded-b-lg">
        <div className="relative border border-border bg-card border-t-2 mx-6 mb-6 rounded-xl overflow-hidden">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your actor... Upload photos and reference them"
            className="w-full h-32 p-4 pb-16 bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none border-0 rounded-xl"
          />
          
          {/* Controls inside textarea */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Image Upload */}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="sr-only"
                />
                <div className="w-8 h-8 bg-muted hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                  <IconPhoto className="w-4 h-4 text-muted-foreground" />
                </div>
              </label>

              {/* Uploaded Images */}
              {uploadedImages.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-border">
                    <Image
                      src={createImageUrl(file)}
                      alt={`Upload ${index + 1}`}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Close button on hover */}
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-foreground text-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <IconX className="w-2 h-2" />
                  </button>
                </div>
              ))}

              {/* Aspect Ratio - Fixed to 9:16 for stories */}
              <div className="flex items-center gap-1">
                <div className="w-4 h-6 bg-muted rounded-sm border border-border flex items-center justify-center">
                  <div className="w-1.5 h-3.5 bg-foreground rounded-sm"></div>
                </div>
                <span className="text-xs text-muted-foreground">9:16</span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isGenerating}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <IconSparkles className="w-4 h-4" />
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
        
        {/* Select Actor Button */}
        {hasSelectedImage && (
          <div className="mt-8 px-8 pb-6">
            <button
              onClick={() => {
                // Passer à l'étape suivante avec l'image sélectionnée
                const selectedImage = chatMessages[chatMessages.length - 1]?.generatedImages?.find(img => img.selected)
                if (selectedImage) {
                  onNext(selectedImage.url) // Passer l'URL de l'image sélectionnée
                }
              }}
              className="w-full bg-foreground text-background py-3 rounded-xl font-medium hover:bg-foreground/90 transition-colors cursor-pointer"
            >
              Select Actor
            </button>
          </div>
        )}
      </div>
    </div>
  )
}