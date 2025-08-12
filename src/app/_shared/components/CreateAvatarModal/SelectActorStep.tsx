"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { IconPhoto } from "@tabler/icons-react"

interface SelectActorStepProps {
  onNext: () => void
  selectedImageUrl?: string
  method?: "generate" | "upload"
  onImageUpload?: (imageUrl: string) => void
}

export function SelectActorStep({ 
  onNext, 
  selectedImageUrl, 
  method = "generate", 
  onImageUpload 
}: SelectActorStepProps) {
  const [prompt, setPrompt] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      onImageUpload?.(imageUrl)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file)
      onImageUpload?.(imageUrl)
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

  return (
    <div className="relative h-full">
      {/* Content area - no scroll needed with larger modal */}
      <div className="absolute inset-0 p-8" style={{ paddingBottom: '120px' }}>
        {/* Question */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-foreground mb-4">
            How should your avatar behave?
          </h3>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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
                {/* Input file caché */}
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
                  {selectedImageUrl ? (
                    <>
                      <Image
                        src={selectedImageUrl}
                        alt="Selected image"
                        width={270}
                        height={480}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay au hover pour upload mode */}
                      {method === "upload" && (
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
                    /* Zone d'upload initiale pour mode upload */
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

                {/* Check icon overlay - seulement si on a une image */}
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
      </div>

      {/* Button fixed at bottom - outside scroll area */}
      <div className="absolute bottom-0 left-0 right-0 bg-card z-10">
        <div className="p-8">
          <button
            onClick={onNext}
            className="w-full bg-foreground text-background py-3 rounded-xl font-medium hover:bg-foreground/90 transition-colors cursor-pointer"
          >
            Turn into talking actor
          </button>
        </div>
      </div>
    </div>
  )
}