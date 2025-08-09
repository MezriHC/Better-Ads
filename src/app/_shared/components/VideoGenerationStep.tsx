"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { IconDownload, IconFolderOpen, IconCheck, IconClock } from "@tabler/icons-react"

interface Avatar {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  imageUrl: string
  type: "image"
  gender?: "male" | "female"
  age?: "young" | "adult"
  theme?: string
}

export interface VideoGenerationStepProps {
  selectedAvatar: Avatar | null
  onBack: () => void
}

type GenerationStatus = "generating" | "completed" | "error"

interface GenerationStepProps {
  selectedAvatar: Avatar | null
  onBack: () => void
  type: "video" | "product"
}

export function GenerationStep({ onBack, type }: GenerationStepProps) {
  const [status, setStatus] = useState<GenerationStatus>("generating")
  const [progress, setProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  // Simulate video generation progress
  useEffect(() => {
    if (status === "generating") {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setStatus("completed")
            setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4") // Sample video
            return 100
          }
          // Ensure we never exceed 100%
          const increment = Math.random() * 8 + 2 // Between 2% and 10%
          return Math.min(prev + increment, 100)
        })
      }, 800)

      return () => clearInterval(interval)
    }
  }, [status])

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement('a')
      link.href = videoUrl
      link.download = 'ai-avatar-video.mp4'
      link.click()
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Video Generation</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors"
        >
          Back
        </button>
      </div>



      {/* Generation Status */}
      {status === "generating" && (
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {type === "video" ? "Creating Your Video" : "Creating Your Product Ad"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {type === "video" ? "AI is generating your content..." : "AI is generating your product advertisement..."}
              </p>
            </div>
          </div>

          {/* Progress Section - Main Focus */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Progress</span>
              <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">Usually takes 2-3 minutes</p>
          </div>

          {/* Simple Info */}
          <div className="bg-accent/20 rounded-lg p-3">
            <p className="text-sm text-foreground">
              {type === "video" 
                ? "Your video is being generated. You can wait here or browse your library."
                : "Your product ad is being generated. You can wait here or browse your library."
              }
            </p>
          </div>

          {/* Action */}
          <div className="flex justify-center">
            <Link 
              href="/dashboard/library"
              className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors text-sm font-medium"
            >
              <IconFolderOpen className="w-4 h-4" />
              Browse Library
            </Link>
          </div>
        </div>
      )}

      {/* Completed Status */}
      {status === "completed" && (
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-6">
          
          {/* Simple Success Message */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
              <IconCheck className="w-5 h-5 text-background" />
            </div>
            <div>
                          <h3 className="text-lg font-semibold text-foreground">
              {type === "video" ? "Video Generated Successfully!" : "Product Ad Generated Successfully!"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {type === "video" ? "Your AI avatar video is ready." : "Your AI product advertisement is ready."}
            </p>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="flex gap-8">
            
            {/* Video - Larger */}
            {videoUrl && (
              <div className="w-48 aspect-[9/16] bg-muted rounded-xl overflow-hidden shadow-lg">
                <video 
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  poster="https://picsum.photos/400/600?random=video"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Content & Actions */}
            <div className="flex-1 flex flex-col gap-4">
              
              {/* Video Info */}
              <div className="bg-muted rounded-lg p-4">
                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold text-foreground">
                    {type === "video" ? "Video Ready" : "Product Ad Ready"}
                  </h4>
                </div>
                <div className="text-sm text-muted-foreground flex flex-col gap-1">
                  <p>• Duration: ~30 seconds</p>
                  <p>• Format: Vertical (9:16)</p>
                  <p>• Quality: HD 1080p</p>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDownload}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <IconDownload className="w-4 h-4" />
                  {type === "video" ? "Download Video" : "Download Ad"}
                </button>
                
                <Link 
                  href="/dashboard/library"
                  className="w-full px-6 py-2.5 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <IconFolderOpen className="w-4 h-4" />
                  View in Library
                </Link>
              </div>

              {/* Additional Info */}
              <div className="bg-accent/20 rounded-lg p-3 flex flex-col gap-1">
                <p className="text-sm text-foreground font-medium">What&apos;s next?</p>
                <p className="text-xs text-muted-foreground">
                  Your video has been automatically saved to your library. Share it on social media or create more videos with different avatars.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 px-3 py-2 text-xs bg-background border border-border rounded-lg hover:bg-accent transition-colors font-medium"
                  >
                    Create Another
                  </button>
                  <Link 
                    href="/dashboard"
                    className="flex-1 px-3 py-2 text-xs bg-background border border-border rounded-lg hover:bg-accent transition-colors text-center font-medium"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Error Status */}
      {status === "error" && (
        <div className="bg-card border border-border rounded-2xl p-8 text-center flex flex-col gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <IconClock className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-foreground">Generation Failed</h3>
            <p className="text-muted-foreground">
              Something went wrong while generating your video. Please try again.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setStatus("generating")
                setProgress(0)
              }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Try Again
            </button>
            
            <button
              onClick={onBack}
              className="px-6 py-3 bg-background border border-border rounded-lg hover:bg-accent transition-colors font-medium"
            >
              Back to Edit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}