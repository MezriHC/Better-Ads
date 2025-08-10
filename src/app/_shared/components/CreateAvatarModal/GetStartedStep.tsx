"use client"

import { IconSparkles, IconPhoto } from "@tabler/icons-react"

type CreateMethod = "generate" | "upload"

interface GetStartedStepProps {
  onMethodSelect: (method: CreateMethod) => void
}

export function GetStartedStep({ onMethodSelect }: GetStartedStepProps) {
  return (
    <div className="p-8">
      {/* Preview Area */}
      <div className="mb-8">
        <div className="w-full h-80 bg-muted rounded-xl border-2 border-dashed border-border flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <IconPhoto className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">Woman fitness coach</p>
          </div>
        </div>
      </div>

      {/* Method Selection */}
      <div className="grid grid-cols-2 gap-6">
        {/* Generate Option */}
        <button
          onClick={() => onMethodSelect("generate")}
          className="group p-6 text-center border-2 border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all">
            <IconSparkles className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">GENERATE</h3>
          <p className="text-sm text-muted-foreground">From prompt and reference images</p>
        </button>

        {/* Upload Option */}
        <button
          onClick={() => onMethodSelect("upload")}
          className="group p-6 text-center border-2 border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all">
            <IconPhoto className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">UPLOAD</h3>
          <p className="text-sm text-muted-foreground">Transform a picture into a talking actor</p>
        </button>
      </div>
    </div>
  )
}
