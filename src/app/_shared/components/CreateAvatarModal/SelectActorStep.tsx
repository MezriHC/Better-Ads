"use client"

import { useState } from "react"
import Image from "next/image"


interface SelectActorStepProps {
  onNext: () => void
  selectedImageUrl?: string
}

export function SelectActorStep({ onNext, selectedImageUrl }: SelectActorStepProps) {
  const [prompt, setPrompt] = useState("")

  return (
    <div className="relative h-full">
      {/* Content area - no scroll needed with larger modal */}
      <div className="absolute inset-0 p-8" style={{ paddingBottom: '120px' }}>
        {/* Question */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-foreground mb-4">
            What the actor should do?
          </h3>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Like "Make the actor talk with excitement while looking at the camera"'
              className="w-full h-32 p-4 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Your Actor */}
        <div className="mb-8">
          <div className="border border-border rounded-xl bg-background p-6">
            <h4 className="text-base font-medium text-foreground mb-6 text-center">Your Actor</h4>
            <div className="flex justify-center">
              <div className="relative inline-block">
                <div className="w-32 h-48 bg-muted rounded-xl overflow-hidden border-2 border-border shadow-lg">
                  <Image
                    src={selectedImageUrl || "https://picsum.photos/seed/reference-frame/270/480"}
                    alt="Selected image"
                    width={270}
                    height={480}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Check icon overlay */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-background shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Button fixed at bottom - outside scroll area */}
      <div className="absolute bottom-0 left-0 right-0 bg-card z-10">
        <div className="p-8">
          <button
            onClick={onNext}
            className="w-full bg-foreground text-background py-3 rounded-xl font-medium hover:bg-foreground/90 transition-colors cursor-pointer"
          >
            Turn into talking actor
          </button>
        </div>
      </div>
    </div>
  )
}