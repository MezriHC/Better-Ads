"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { IconPhoto, IconX, IconUpload } from "@tabler/icons-react"

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void
  selectedImage: File | null
  className?: string
}

export function ImageUpload({ onImageSelect, selectedImage, className = "" }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      onImageSelect(file)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemoveImage = () => {
    onImageSelect(null)
  }

  const createImageUrl = (file: File) => {
    return URL.createObjectURL(file)
  }

  return (
    <div className={`relative ${className}`}>
      {!selectedImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`h-[44px] w-[44px] rounded-lg border border-border flex items-center justify-center transition-all cursor-pointer active:scale-95
            ${isDragOver 
              ? 'bg-primary/10 border-primary/30 scale-105' 
              : 'bg-muted hover:bg-accent'
            }`}
        >
          <IconPhoto className="w-5 h-5 text-muted-foreground" />
        </div>
      ) : (
        <div className="relative group">
          <div className="h-[44px] w-[44px] rounded-lg overflow-hidden border border-border">
            <Image
              src={createImageUrl(selectedImage)}
              alt="B-Roll reference image"
              width={44}
              height={44}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={handleRemoveImage}
            className="absolute -top-1 -right-1 w-4 h-4 bg-foreground text-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <IconX className="w-3 h-3" />
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
      />

      {/* Drag & Drop Overlay */}
      {isDragOver && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card border border-primary/30 rounded-xl p-8 shadow-xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <IconUpload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-foreground">Drop your starting frame here</p>
                <p className="text-sm text-muted-foreground">Release to set starting frame</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}