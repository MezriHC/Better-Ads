"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { IconPhoto } from "@tabler/icons-react"
import { GradientButton } from "./GradientButton"

interface SelectActorStepProps {
  onNext: () => void
  selectedImageUrl?: string
  method?: "generate" | "upload"
  onImageUpload?: (imageUrl: string) => void
  onPromptChange?: (prompt: string) => void
}

export function SelectActorStep({ 
  onNext, 
  selectedImageUrl, 
  method = "generate", 
  onImageUpload,
  onPromptChange
}: SelectActorStepProps) {
  const [prompt, setPrompt] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)
  const [falaiImageUrl, setFalaiImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Afficher immédiatement la preview locale
      const localUrl = URL.createObjectURL(file)
      setLocalPreviewUrl(localUrl)
      setFalaiImageUrl(null)
      
      setIsUploading(true)
      setUploadError(null)
      
      try {
        // Upload to fal.ai storage
        const response = await fetch('/api/images/upload', {
          method: 'POST',
          body: (() => {
            const formData = new FormData()
            formData.append('file', file)
            return formData
          })(),
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const result = await response.json()
        
        // Stocker l'URL fal.ai et l'envoyer au parent
        setFalaiImageUrl(result.data.url)
        onImageUpload?.(result.data.url)
        
        // Nettoyer l'URL locale après succès
        URL.revokeObjectURL(localUrl)
      } catch (error) {
        console.error('Upload error:', error)
        setUploadError('Upload failed. Please try again.')
        setFalaiImageUrl(null)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      // Afficher immédiatement la preview locale
      const localUrl = URL.createObjectURL(file)
      setLocalPreviewUrl(localUrl)
      setFalaiImageUrl(null)
      
      setIsUploading(true)
      setUploadError(null)
      
      try {
        // Upload to fal.ai storage
        const response = await fetch('/api/images/upload', {
          method: 'POST',
          body: (() => {
            const formData = new FormData()
            formData.append('file', file)
            return formData
          })(),
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const result = await response.json()
        
        // Stocker l'URL fal.ai et l'envoyer au parent
        setFalaiImageUrl(result.data.url)
        onImageUpload?.(result.data.url)
        
        // Nettoyer l'URL locale après succès
        URL.revokeObjectURL(localUrl)
      } catch (error) {
        console.error('Upload error:', error)
        setUploadError('Upload failed. Please try again.')
        setFalaiImageUrl(null)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Validation: image uploadée vers fal.ai ET prompt obligatoires ET pas en cours d'upload
  const canProceed = !!(falaiImageUrl && prompt.trim() && !isUploading)

  return (
    <div className="relative h-full">
      <div className="absolute inset-0 p-8" style={{ paddingBottom: '120px' }}>
        {/* Question */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-foreground mb-4">
            How should your avatar behave?
          </h3>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value)
                onPromptChange?.(e.target.value)
              }}
              placeholder='Like "Make the actor talk with excitement while looking at the camera"'
              className="w-full h-32 p-4 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Your Actor */}
        <div className="mb-8">
          <div className="border border-border rounded-xl bg-background p-6">
            <h4 className="text-base font-medium text-foreground mb-6 text-center">Your Actor</h4>
            <div className="flex justify-center">
              <div className="relative inline-block group">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />

                <div 
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`w-32 h-48 bg-muted rounded-xl overflow-hidden border-2 shadow-lg transition-all ${
                    method === "upload"
                      ? isDragOver 
                        ? 'border-primary cursor-pointer' 
                        : 'border-border hover:border-primary cursor-pointer'
                      : 'border-border'
                  }`}
                >
                  {(localPreviewUrl || selectedImageUrl) ? (
                    <>
                      <Image
                        src={localPreviewUrl || selectedImageUrl || ""}
                        alt="Selected image"
                        width={270}
                        height={480}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Loader pendant upload */}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-xs font-medium">Uploading...</p>
                          </div>
                        </div>
                      )}
                      
                      {method === "upload" && !isUploading && (
                        <div 
                          onClick={triggerFileInput}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                          <div className="text-center text-white">
                            <IconPhoto className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-xs font-medium">Upload another</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div 
                      onClick={method === "upload" ? triggerFileInput : undefined}
                      className="w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconPhoto className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-center px-2">
                        <p className="text-xs font-medium text-foreground">Upload Photo</p>
                        <p className="text-xs text-muted-foreground">Click or drag</p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedImageUrl && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-background shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {uploadError && (
          <div className="mt-4 text-center text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg p-3">
            Erreur upload: {uploadError}
          </div>
        )}

      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-card z-10">
        <div className="p-8">
          <GradientButton 
            onClick={canProceed ? onNext : undefined}
            disabled={!canProceed}
          >
            Turn into talking actor
          </GradientButton>
          
          {!canProceed && (
            <p className="text-center text-sm text-muted-foreground mt-3">
              {isUploading
                ? "Uploading..."
                : !falaiImageUrl && !prompt.trim() 
                  ? "Add an image and describe the behavior"
                  : !falaiImageUrl 
                    ? "Add an image to continue"
                    : "Describe how your avatar should behave"
              }
            </p>
          )}
          
          {uploadError && (
            <p className="text-center text-sm text-red-500 mt-2">
              {uploadError}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}