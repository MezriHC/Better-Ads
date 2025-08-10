"use client"

import { IconSparkles, IconPhoto } from "@tabler/icons-react"

type CreateMethod = "generate" | "upload"

interface GetStartedStepProps {
  onMethodSelect: (method: CreateMethod) => void
}

export function GetStartedStep({ onMethodSelect }: GetStartedStepProps) {
  return (
    <div className="p-8">
      {/* Method Selection - Optimized layout */}
      <div className="grid grid-cols-2 gap-8">
        {/* Generate Option */}
        <button
          onClick={() => onMethodSelect("generate")}
          className="group p-8 text-center border-2 border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
        >
          <div className="w-16 h-16 bg-primary/10 group-hover:bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all">
            <IconSparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-3 text-lg">GENERATE</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Generate from prompt</p>
        </button>

        {/* Upload Option */}
        <button
          onClick={() => onMethodSelect("upload")}
          className="group p-8 text-center border-2 border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
        >
          <div className="w-16 h-16 bg-primary/10 group-hover:bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all">
            <IconPhoto className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-3 text-lg">UPLOAD</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Transform a picture into a talking actor</p>
        </button>
      </div>
    </div>
  )
}
