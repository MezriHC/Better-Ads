"use client"

import { IconSparkles, IconPhoto } from "@tabler/icons-react"

type CreateMethod = "generate" | "upload"

interface GetStartedStepProps {
  onMethodSelect: (method: CreateMethod) => void
}

export function GetStartedStep({ onMethodSelect }: GetStartedStepProps) {
  return (
    <div className="flex-1 p-12">
      <div className="grid grid-cols-2 gap-8 h-full">
        <button
          onClick={() => onMethodSelect("generate")}
          className="group border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-6 cursor-pointer"
        >
          <div className="w-20 h-20 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors">
            <IconSparkles className="w-10 h-10 text-primary" />
          </div>
          <div className="text-center px-6 flex flex-col gap-2">
            <h3 className="text-2xl font-semibold text-foreground">Generate</h3>
            <p className="text-sm text-muted-foreground">Create unique AI actors from text descriptions</p>
          </div>
        </button>

        <button
          onClick={() => onMethodSelect("upload")}
          className="group border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-6 cursor-pointer"
        >
          <div className="w-20 h-20 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors">
            <IconPhoto className="w-10 h-10 text-primary" />
          </div>
          <div className="text-center px-6 flex flex-col gap-2">
            <h3 className="text-2xl font-semibold text-foreground">Upload</h3>
            <p className="text-sm text-muted-foreground">Transform your photos into talking AI actors</p>
          </div>
        </button>
      </div>
    </div>
  )
}
