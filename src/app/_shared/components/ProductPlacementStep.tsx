"use client"

import React, { useState, useCallback } from "react"
import Image from "next/image"
import { IconUpload, IconX, IconSparkles, IconCheck, IconEye } from "@tabler/icons-react"

interface Avatar {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  imageUrl: string
  type: "video" | "product"
  gender?: "male" | "female"
  age?: "young" | "adult"
  theme?: string
}

interface ProductPlacementStepProps {
  selectedAvatar: Avatar | null
  onBack: () => void
  onNext: () => void
}

interface GeneratedPhoto {
  id: string
  imageUrl: string
  isSelected: boolean
}

export function ProductPlacementStep({ selectedAvatar, onBack, onNext }: ProductPlacementStepProps) {
  const [productImage, setProductImage] = useState<File | null>(null)
  const [productImageUrl, setProductImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPhotos, setGeneratedPhotos] = useState<GeneratedPhoto[]>([])
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProductImage(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setProductImageUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      // Reset generated photos when uploading new image
      setGeneratedPhotos([])
      setSelectedPhotoId(null)
    }
  }, [])

  const handleRemoveImage = () => {
    setProductImage(null)
    setProductImageUrl(null)
    setGeneratedPhotos([])
    setSelectedPhotoId(null)
  }

  const handleGenerate = async () => {
    if (!productImage || !selectedAvatar) return
    
    setIsGenerating(true)
    
    // Simulate generation delay
    setTimeout(() => {
      // Generate 4 mock photos
      const mockPhotos: GeneratedPhoto[] = [
        { id: "1", imageUrl: "https://picsum.photos/400/600?random=101", isSelected: false },
        { id: "2", imageUrl: "https://picsum.photos/400/600?random=102", isSelected: false },
        { id: "3", imageUrl: "https://picsum.photos/400/600?random=103", isSelected: false },
        { id: "4", imageUrl: "https://picsum.photos/400/600?random=104", isSelected: false },
      ]
      
      setGeneratedPhotos(mockPhotos)
      setIsGenerating(false)
    }, 3000)
  }

  const handleSelectPhoto = (photoId: string) => {
    setSelectedPhotoId(photoId)
    setGeneratedPhotos(prev => prev.map(photo => ({
      ...photo,
      isSelected: photo.id === photoId
    })))
  }

  const canGenerate = productImage && selectedAvatar && !isGenerating
  const canContinue = selectedPhotoId !== null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Product Placement</h2>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors"
          >
            Back
          </button>
          
          {/* Continue button */}
          <div
            onClick={canContinue ? onNext : undefined}
            className={canContinue ? "cursor-pointer" : "cursor-not-allowed"}
          >
            <div
              className={`p-[2px] rounded-[16px] transition-all ${
                canContinue 
                  ? 'bg-gradient-to-b from-black/20 to-transparent dark:from-white/20' 
                  : 'bg-gradient-to-b from-black/10 to-transparent dark:from-white/10'
              }`}
            >
              <div
                className={`group rounded-[14px] shadow-lg transition-all ${
                  canContinue
                    ? 'bg-foreground dark:bg-white hover:shadow-md active:shadow-sm active:scale-[0.98] cursor-pointer'
                    : 'bg-muted cursor-not-allowed opacity-50'
                }`}
              >
                <div
                  className={`px-6 py-3 rounded-[12px] transition-all ${
                    canContinue
                      ? 'bg-gradient-to-b from-transparent to-white/10 dark:to-black/10'
                      : 'bg-gradient-to-b from-transparent to-black/5 dark:to-white/5'
                  }`}
                >
                  <span className={`font-semibold ${
                    canContinue
                      ? 'text-background dark:text-black'
                      : 'text-muted-foreground'
                  }`}>
                    Next Step
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        
        {/* Left Column - Your Product */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground mb-1">Your Product</h3>
            <p className="text-sm text-muted-foreground">Upload your product to start AI generation</p>
          </div>
          
          <div className="space-y-4">
            {/* Product Image Area */}
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
              {!productImageUrl ? (
                <div className="border-2 border-dashed border-border rounded-lg h-full hover:border-primary/50 hover:bg-accent/5 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="product-upload"
                  />
                  <label 
                    htmlFor="product-upload" 
                    className="cursor-pointer h-full flex flex-col items-center justify-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <IconUpload className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground mb-1">Upload your product</p>
                      <p className="text-sm text-muted-foreground">Drop image here or click to browse</p>
                    </div>
                  </label>
                </div>
              ) : (
                <>
                  <Image
                    src={productImageUrl}
                    alt="Product"
                    fill
                    className="object-contain p-4"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 w-6 h-6 bg-muted/80 hover:bg-muted text-foreground rounded-full flex items-center justify-center transition-colors border border-border cursor-pointer"
                  >
                    <IconX className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
            
            {/* Product Status */}
            <div className="bg-accent/20 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${productImageUrl ? 'bg-green-500' : 'bg-muted-foreground'}`}></div>
                <p className="text-sm font-medium text-foreground">
                  {productImageUrl ? 'Product ready for AI generation' : 'Product not uploaded'}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {productImageUrl 
                  ? `The AI will place your product in ${selectedAvatar?.name}'s hands across 4 different poses and angles.`
                  : 'Upload a clear product image to start AI generation with your selected avatar.'
                }
              </p>
            </div>
            
            {/* Generate Button - 3D Style */}
            <div
              onClick={canGenerate ? handleGenerate : undefined}
              className={canGenerate ? "cursor-pointer" : "cursor-not-allowed"}
            >
              <div
                className={`p-[2px] rounded-[16px] transition-all ${
                  canGenerate 
                    ? 'bg-gradient-to-b from-black/20 to-transparent dark:from-white/20' 
                    : 'bg-gradient-to-b from-black/10 to-transparent dark:from-white/10'
                }`}
              >
                <div
                  className={`group rounded-[14px] shadow-lg transition-all ${
                    canGenerate
                      ? 'bg-foreground dark:bg-white hover:shadow-md active:shadow-sm active:scale-[0.98] cursor-pointer'
                      : 'bg-muted cursor-not-allowed opacity-50'
                  }`}
                >
                  <div
                    className={`px-6 py-3 rounded-[12px] transition-all ${
                      canGenerate
                        ? 'bg-gradient-to-b from-transparent to-white/10 dark:to-black/10'
                        : 'bg-gradient-to-b from-transparent to-black/5 dark:to-white/5'
                    } flex items-center justify-center gap-2`}
                  >
                    {isGenerating ? (
                      <>
                        <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                          canGenerate ? 'border-background dark:border-black' : 'border-muted-foreground'
                        }`}></div>
                        <span className={`font-semibold ${
                          canGenerate ? 'text-background dark:text-black' : 'text-muted-foreground'
                        }`}>
                          Generating...
                        </span>
                      </>
                    ) : (
                      <>
                        <IconSparkles className={`w-4 h-4 ${
                          canGenerate ? 'text-background dark:text-black' : 'text-muted-foreground'
                        }`} />
                        <span className={`font-semibold ${
                          canGenerate ? 'text-background dark:text-black' : 'text-muted-foreground'
                        }`}>
                          Generate 4 AI Photos
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - AI Generated Previews */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground mb-1">AI Generated Photos</h3>
            <p className="text-sm text-muted-foreground">Here&apos;s where the 4 photos of your product generated with the avatar will appear</p>
          </div>

          {generatedPhotos.length === 0 && !isGenerating ? (
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="relative aspect-[9/16] rounded-lg overflow-hidden border-2 border-dashed border-border bg-muted">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                      <IconSparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-foreground mb-1">Photo {index + 1}</p>
                      <p className="text-xs text-muted-foreground">Coming soon</p>
                    </div>
                  </div>
                  <div className="absolute top-1 right-1 w-4 h-4 bg-muted/80 text-muted-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : isGenerating ? (
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="aspect-[9/16] bg-muted rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {generatedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => handleSelectPhoto(photo.id)}
                  className={`group relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                    photo.isSelected ? 'border-primary' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Image
                    src={photo.imageUrl}
                    alt={`Photo ${photo.id}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Preview button in corner */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewImageUrl(photo.imageUrl)
                    }}
                    className="absolute top-1 left-1 w-5 h-5 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <IconEye className="w-3 h-3" />
                  </button>
                  
                  {photo.isSelected && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <IconCheck className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-black/70 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {photo.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImageUrl && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setPreviewImageUrl(null)}>
          <div className="relative w-full max-w-md aspect-[9/16] bg-black rounded-xl overflow-hidden">
            <Image
              src={previewImageUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute top-3 right-3 w-8 h-8 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}