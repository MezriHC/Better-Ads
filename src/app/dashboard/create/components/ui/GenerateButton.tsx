"use client"

import { IconSparkles } from "@tabler/icons-react"

type CreationType = "talking-actor" | "b-rolls"

interface GenerateButtonProps {
  selectedType: CreationType
  speechMode: "text-to-speech" | "speech-to-speech"
  script: string
  audioFile: File | null
  onSubmit: () => void
}

export function GenerateButton({
  selectedType,
  speechMode,
  script,
  audioFile,
  onSubmit
}: GenerateButtonProps) {
  const isDisabled = selectedType === "talking-actor" && speechMode === "speech-to-speech" 
    ? !audioFile 
    : !script.trim()

  return (
    <div className="p-[2px] rounded-[16px] bg-gradient-to-b from-black/20 to-transparent dark:from-white/20">
      <button
        onClick={onSubmit}
        disabled={isDisabled}
        className="group rounded-[14px] bg-foreground shadow-lg hover:shadow-md active:shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <div className="px-6 py-3 bg-gradient-to-b from-transparent to-white/10 dark:to-black/10 rounded-[12px] flex items-center gap-2">
          <IconSparkles className="w-5 h-5 shrink-0 text-background" />
          <span className="font-semibold text-background">Generate</span>
        </div>
      </button>
    </div>
  )
}