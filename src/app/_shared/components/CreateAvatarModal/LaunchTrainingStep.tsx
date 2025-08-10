"use client"

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
}

export function LaunchTrainingStep({ 
  actor, 
  voice, 
  onLaunchTraining, 
  isGenerating 
}: LaunchTrainingStepProps) {
  return (
    <div className="p-8">
      {/* Video Preview */}
      <div className="mb-8">
        <div className="relative w-full max-w-md mx-auto">
          {/* Video Container */}
          <div className="aspect-[9/16] bg-black rounded-2xl overflow-hidden relative">
            {actor ? (
              <img
                src={actor.imageUrl}
                alt="Selected actor"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconMicrophone className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No actor selected</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="bg-muted rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <IconMicrophone className="w-3 h-3 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">
              {isGenerating ? "Generating video" : "Ready to generate video"}
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              {isGenerating ? (
                <>
                  <p>Your video will be ready in a few minutes.</p>
                  <p>You can leave this modal. You will be notified when it's ready.</p>
                </>
              ) : (
                <>
                  <p>Your avatar will be trained with the selected voice and appearance.</p>
                  <p>This process typically takes 2-5 minutes to complete.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Details */}
      {(actor || voice) && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-foreground mb-4">Training Details</h3>
          <div className="space-y-3">
            {actor && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <img
                  src={actor.imageUrl}
                  alt="Selected actor"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">Selected Actor</p>
                  <p className="text-sm text-muted-foreground">{actor.description}</p>
                </div>
              </div>
            )}
            
            {voice && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <IconMicrophone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Voice: {voice.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{voice.gender}</span>
                    <span>•</span>
                    <span>{voice.language}</span>
                    <span>•</span>
                    <span>{voice.accent}</span>
                    {voice.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{voice.tags.join(", ")}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Launch Button */}
      {!isGenerating && (
        <div className="text-center">
          <button
            onClick={onLaunchTraining}
            className="px-8 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all font-medium"
          >
            Launch Training
          </button>
        </div>
      )}

      {/* Progress Indicator */}
      {isGenerating && (
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-lg">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-primary font-medium">Training in progress...</span>
          </div>
        </div>
      )}
    </div>
  )
}
