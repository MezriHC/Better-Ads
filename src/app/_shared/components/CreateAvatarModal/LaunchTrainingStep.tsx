"use client"

import Image from "next/image"
import { IconMicrophone } from "@tabler/icons-react"

interface GeneratedActor {
  id: string
  imageUrl: string
  description: string
}

interface SelectedVoice {
  id: string
  name: string
  gender: string
  age: string
  language: string
  accent: string
  tags: string[]
  audioUrl?: string
}

interface LaunchTrainingStepProps {
  actor: GeneratedActor | null
  voice: SelectedVoice | null
  onLaunchTraining: () => void
  isGenerating: boolean
  selectedImageUrl?: string
}

export function LaunchTrainingStep({ 
  actor, 
  voice, 
  onLaunchTraining, 
  isGenerating,
  selectedImageUrl 
}: LaunchTrainingStepProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      {/* Avatar Preview */}
      <div className="mb-8">
        <div className="relative w-48 h-64 mx-auto">
          <div className="aspect-[3/4] bg-muted rounded-2xl overflow-hidden relative border-2 border-border">
            {selectedImageUrl ? (
              <Image
                src={selectedImageUrl}
                alt="Your avatar"
                fill
                className="object-cover"
              />
            ) : actor ? (
              <Image
                src={actor.imageUrl}
                alt="Your avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center">
                  <IconMicrophone className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
            )}
            
            {/* Loading overlay when generating */}
            {isGenerating && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full text-center">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {isGenerating ? "Training Your Avatar" : "Ready to Train"}
          </h3>
          
          <div className="text-sm text-muted-foreground space-y-1">
            {isGenerating ? (
              <>
                <p>We&apos;re generating your avatar with the selected voice and appearance.</p>
                <p>You&apos;ll receive a notification when it&apos;s ready.</p>
              </>
            ) : (
              <>
                <p>Your avatar will be trained with the selected voice and appearance.</p>
                <p>This process typically takes 2-5 minutes to complete.</p>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {!isGenerating ? (
          <button
            onClick={onLaunchTraining}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Start Training
          </button>
        ) : (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-lg">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-primary font-medium">Training in progress...</span>
            </div>
            <button
              onClick={() => {/* Navigate to library */}}
              className="w-full py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-accent transition-colors cursor-pointer"
            >
              Go to Library
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
