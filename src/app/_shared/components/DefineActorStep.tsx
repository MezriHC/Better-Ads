"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { IconCheck, IconPhoto, IconSparkles, IconX, IconDownload } from "@tabler/icons-react"
import { useImageGeneration } from "../hooks/useImageGeneration"
import { useImageUpload } from "../hooks/useImageUpload"
import { GeneratedImageData } from "../types/ai"
import { GradientButton } from "./GradientButton"



interface DefineActorStepProps {
  onDefineActor: (prompt: string, imageUrl?: string) => void
  onNext: (imageUrl?: string) => void
}

// Utiliser le type depuis fal.ts
type GeneratedImage = GeneratedImageData

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
  onNext
}: DefineActorStepProps) {
  const [prompt, setPrompt] = useState("")
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  // Hooks pour la génération et l'upload d'images
  const { generateImages, isGenerating: isGeneratingImages, error: generationError } = useImageGeneration()
  const { uploadImage, isUploading: isUploadingReference, error: uploadError } = useImageUpload()
  
  // État pour stocker l'URL de l'image uploadée
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  
  // État pour gérer le téléchargement avec feedback
  const [downloadingImageId, setDownloadingImageId] = useState<string | null>(null)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      const file = files[0] // Prendre seulement la première image
      
      // Remplacer l'image existante
      setUploadedImage(file)
      setUploadedImageUrl(null) // Reset l'URL pendant l'upload
      
      // Uploader vers fal.ai en arrière-plan
      try {
        const uploadedUrl = await uploadImage(file)
        setUploadedImageUrl(uploadedUrl)
      } catch (error) {
        // On garde l'image localement même si l'upload échoue
      }
    }
  }



  const handleRemoveImage = () => {
    setUploadedImage(null)
    setUploadedImageUrl(null)
  }

  const createImageUrl = (file: File) => {
    return URL.createObjectURL(file)
  }

  const handleSubmit = async () => {
    if (prompt.trim()) {
      // Trouver l'image sélectionnée dans TOUS les messages (pas seulement le dernier)
      const selectedImage = chatMessages
        .flatMap(msg => msg.generatedImages || [])
        .find(img => img.selected)?.url
      
      // Déterminer le mode : édition si une image est sélectionnée, génération sinon
      const isEditMode = !!selectedImage
      
      // Sauvegarder le prompt avant de le vider
      const currentPrompt = prompt
      
      // Ajouter le nouveau message avec état de génération
      const newMessage: ChatMessage = {
        text: currentPrompt,
        images: uploadedImage ? [uploadedImage] : [],
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
      
      // Vider les champs immédiatement
      setPrompt("")
      setUploadedImage(null)
      setUploadedImageUrl(null)
      
      try {
        // Logique de sélection du modèle :
        // 1. Si image sélectionnée -> Mode édition (FLUX Kontext Editing Max)
        // 2. Si image uploadée -> Mode édition avec image uploadée comme référence
        // 3. Sinon -> Mode génération pure (FLUX Kontext Max)
        
        let generatedImages: GeneratedImageData[] = []
        
        if (isEditMode && selectedImage) {
          // Mode édition : image sélectionnée depuis les générations précédentes
          generatedImages = await generateImages(currentPrompt, selectedImage)
        } else if (uploadedImageUrl) {
          // Mode édition : utiliser l'image uploadée comme référence
          generatedImages = await generateImages(currentPrompt, uploadedImageUrl)
        } else {
          // Mode génération pure : aucune image de référence
          generatedImages = await generateImages(currentPrompt)
        }
        
        // Mettre à jour le message avec les images générées
        setChatMessages(prev => 
          prev.map((msg, index) => 
            index === prev.length - 1 
              ? { ...msg, generatedImages, isGenerating: false }
              : msg
          )
        )
        
        // Auto-scroll quand les images sont générées
        setTimeout(() => {
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
              top: scrollAreaRef.current.scrollHeight,
              behavior: 'smooth'
            })
          }
        }, 100)
        
      } catch (error) {
        // En cas d'erreur, mettre à jour le message
        setChatMessages(prev => 
          prev.map((msg, index) => 
            index === prev.length - 1 
              ? { ...msg, isGenerating: false }
              : msg
          )
        )
        
        // Optionnel: Afficher une notification d'erreur à l'utilisateur
      }
      
      // Appeler l'API pour notifier le parent avec l'image sélectionnée ou uploadée
      const finalImageUrl = selectedImage || uploadedImageUrl
      onDefineActor(currentPrompt, finalImageUrl || undefined)
    }
  }

  const handleImageSelect = (messageIndex: number, imageId: string) => {
    setChatMessages(prev => 
      prev.map((msg, index) => 
        msg.generatedImages
          ? {
              ...msg,
              generatedImages: msg.generatedImages.map(img => ({
                ...img,
                selected: index === messageIndex && img.id === imageId 
                  ? !img.selected // Toggle seulement pour l'image cliquée
                  : false // Désélectionner toutes les autres images dans tous les messages
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

  const canSubmit = prompt.trim().length > 0 && !isGeneratingImages && !isUploadingReference && 
    // Si une image est uploadée, s'assurer qu'elle a été uploadée vers fal.ai
    (uploadedImage ? !!uploadedImageUrl : true)
  
  // Vérifier s'il y a une image sélectionnée dans TOUS les messages
  const hasSelectedImage = chatMessages.some(msg => 
    msg.generatedImages?.some(img => img.selected)
  )



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
                  <div className={`${message.generatedImages || message.isGenerating ? 'w-full' : 'max-w-[70%]'} bg-muted rounded-2xl px-4 py-3`}>
                    {message.isGenerating ? (
                      /* Loading state with 4 skeleton placeholders */
                      <div className="relative">
                        <p className="text-sm text-muted-foreground mb-3">Generating images...</p>
                        <div className="flex gap-3 w-full">
                          {Array.from({ length: 4 }).map((_, index) => (
                            <div key={`skeleton-${index}`} className="relative flex-1">
                              <div className="aspect-[9/16] rounded-lg overflow-hidden border-2 border-border">
                                {/* Effet de génération simplifié et élégant */}
                                <div className="relative w-full h-full overflow-hidden simple-ai-generation">
                                  {/* Fond dégradé subtil */}
                                  <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-muted/40 to-muted/20" />
                                  
                                  {/* Deux blobs simples qui bougent lentement */}
                                  <div className="absolute inset-0 opacity-40">
                                    {/* Blob principal */}
                                    <div 
                                      className="absolute w-40 h-40 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-3xl simple-float"
                                      style={{ 
                                        top: '20%',
                                        left: '10%',
                                        animationDelay: `${index * 0.4}s`,
                                        animationDuration: '6s'
                                      }}
                                    />
                                    {/* Blob secondaire */}
                                    <div 
                                      className="absolute w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl simple-float"
                                      style={{ 
                                        bottom: '20%',
                                        right: '15%',
                                        animationDelay: `${index * 0.6}s`,
                                        animationDuration: '8s'
                                      }}
                                    />
                                  </div>
                                  
                                  {/* Indicateur central minimaliste */}
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
                          {message.generatedImages.map((image, imgIndex) => (
                            <div
                              key={image.id}
                              className="relative flex-1 group animate-in"
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
                                
                                                                  {/* Download button - top right avec feedback */}
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation()
                                      setDownloadingImageId(image.id)
                                      
                                      // Délai pour montrer l'animation
                                      setTimeout(() => {
                                        const link = document.createElement('a')
                                        link.href = image.url
                                        link.download = `avatar-${image.id}.jpg`
                                        link.click()
                                        
                                        // Reset après le téléchargement
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
        {/* Affichage des erreurs */}
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
          
          {/* Controls inside textarea */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Image Upload */}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
                <div className="w-8 h-8 bg-muted hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                  <IconPhoto className="w-4 h-4 text-muted-foreground" />
                </div>
              </label>

              {/* Uploaded Image */}
              {uploadedImage && (
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
                  {/* Close button on hover */}
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-foreground text-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <IconX className="w-2 h-2" />
                  </button>
                  {/* Upload indicator */}
                  {isUploadingReference && (
                    <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              )}

              {/* Aspect Ratio - Fixed to 9:16 for stories */}
              <div className="flex items-center gap-1">
                <div className="w-4 h-6 bg-muted rounded-sm border border-border flex items-center justify-center">
                  <div className="w-1.5 h-3.5 bg-foreground rounded-sm"></div>
                </div>
                <span className="text-xs text-muted-foreground">9:16</span>
              </div>
            </div>

            {/* Generate Button */}
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
        
        {/* Select Actor Button */}
        {hasSelectedImage && (
          <div className="mt-8 px-8 pb-6">
            <GradientButton
              onClick={() => {
                // Passer à l'étape suivante avec l'image sélectionnée dans TOUS les messages
                const selectedImage = chatMessages
                  .flatMap(msg => msg.generatedImages || [])
                  .find(img => img.selected)
                
                
                if (selectedImage) {
                  onNext(selectedImage.url) // Passer l'URL de l'image sélectionnée
                }
              }}
            >
              Select Actor
            </GradientButton>
          </div>
        )}
      </div>
    </div>
  )
}