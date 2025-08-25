"use client"

import { IconSparkles } from "@tabler/icons-react"

type CreationType = "talking-actor" | "b-rolls"

interface GenerateButtonProps {
  selectedType: CreationType
  speechMode: "text-to-speech" | "speech-to-speech"
  script: string
  audioFile: File | null
  isGenerating?: boolean
  onSubmit: () => void
}

export function GenerateButton({
  selectedType,
  speechMode,
  script,
  audioFile,
  isGenerating = false,
  onSubmit
}: GenerateButtonProps) {
  const isDisabled = isGenerating || (selectedType === "talking-actor" && speechMode === "speech-to-speech" 
    ? !audioFile 
    : !script.trim())

  // Animation des 3 points
  const AnimatedDots = () => (
    <span className="inline-flex">
      <span className="animate-pulse delay-0">.</span>
      <span className="animate-pulse delay-150">.</span>
      <span className="animate-pulse delay-300">.</span>
    </span>
  )

  return (
    <div className="p-[2px] rounded-[16px] bg-gradient-to-b from-black/20 to-transparent dark:from-white/20">
      <button
        onClick={onSubmit}
        disabled={isDisabled}
        className={`group rounded-[14px] shadow-lg hover:shadow-md active:shadow-sm transition-all active:scale-[0.98] disabled:cursor-not-allowed cursor-pointer
          ${isGenerating 
            ? 'bg-muted-foreground opacity-75' 
            : 'bg-foreground hover:bg-foreground/90'
          }
          ${isDisabled && !isGenerating ? 'opacity-50' : ''}
        `}
      >
        <div className="px-6 py-3 bg-gradient-to-b from-transparent to-white/10 dark:to-black/10 rounded-[12px] flex items-center gap-2">
          <IconSparkles className={`w-5 h-5 shrink-0 transition-all ${
            isGenerating 
              ? 'text-muted animate-spin' 
              : 'text-background'
          }`} />
          <span className={`font-semibold transition-all ${
            isGenerating 
              ? 'text-muted' 
              : 'text-background'
          }`}>
            {isGenerating ? (
              <>
                Generating
                <AnimatedDots />
              </>
            ) : (
              'Generate'
            )}
          </span>
        </div>
      </button>
    </div>
  )
}