"use client"

import { useState } from "react"
import { IconCloudUpload, IconPhoto, IconTrash, IconAspectRatio, IconSparkles } from "@tabler/icons-react"

type CreateMethod = "generate" | "upload"

interface GeneratedActor {
  id: string
  imageUrl: string
  description: string
}

interface DefineActorStepProps {
  method: CreateMethod
  onDefineActor: (prompt: string, image?: File) => void
  onBack: () => void
  isGenerating: boolean
  generatedActors?: GeneratedActor[]
  onActorSelect?: (actor: GeneratedActor) => void
  onRegenerateActors?: () => void
}

export function DefineActorStep({ 
  method, 
  onDefineActor, 
  onBack, 
  isGenerating, 
  generatedActors = [], 
  onActorSelect, 
  onRegenerateActors 
}: DefineActorStepProps) {
  const [prompt, setPrompt] = useState("")
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [aspectRatio, setAspectRatio] = useState("9:16")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    setImagePreview(null)
  }

  const handleSubmit = () => {
    if (method === "upload" && uploadedImage) {
      onDefineActor(prompt, uploadedImage)
    } else if (method === "generate" && prompt.trim()) {
      onDefineActor(prompt, uploadedImage || undefined)
    }
  }

  const canSubmit = method === "upload" ? uploadedImage : prompt.trim().length > 0

  return (
    <div className="flex flex-col h-full">
      {method === "generate" ? (
        <>
          {/* Scrollable Content Area - Photos générées AU-DESSUS */}
          <div className="flex-1 overflow-y-auto p-8">
            {isGenerating && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-muted-foreground">Generating images...</span>
                </div>
              </div>
            )}

            {/* Generated Actors Display */}
            {generatedActors.length > 0 && (
              <div>
                <div className="text-center mb-6">
                  <p className="text-muted-foreground mb-2">
                    45 years old female in the couch talking
                  </p>
                  <p className="text-muted-foreground text-sm">
                    she is in the street and she talks while walking, she wears different clothes
                  </p>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-foreground">Choose your actor</h3>
                  <button
                    onClick={onRegenerateActors}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <IconSparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>Continue to iterate</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {generatedActors.map((actor) => (
                    <button
                      key={actor.id}
                      onClick={() => onActorSelect?.(actor)}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[9/16] bg-muted rounded-lg border-2 border-border group-hover:border-primary/50 transition-all overflow-hidden">
                        <img
                          src={actor.imageUrl}
                          alt={actor.description}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 text-center">{actor.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Input Section - EN BAS, ne bouge jamais */}
          <div className="border-t border-border p-8">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-foreground mb-2">Let's start</h3>
              <p className="text-muted-foreground">
                To create your character, start by writing a text, optionally add<br />
                a reference image, and choose a ration that suits you.
              </p>
            </div>

            {/* Text Input with integrated controls */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Young adult, fitness coach, wrist band watch"
                className="w-full h-32 p-4 pb-16 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              />
              
              {/* Controls inside textarea */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Image Upload */}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                    <div className="w-8 h-8 bg-muted hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                      <IconPhoto className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </label>

                  {/* Aspect Ratio - Fixed to 9:16 for stories */}
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-6 bg-muted rounded-sm border border-muted-foreground/30 flex items-center justify-center">
                      <div className="w-1.5 h-3.5 bg-foreground rounded-sm"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">9:16</span>
                  </div>

                  {/* Delete Image */}
                  {imagePreview && (
                    <button
                      onClick={handleRemoveImage}
                      className="w-8 h-8 bg-muted hover:bg-accent rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <IconTrash className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isGenerating}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm cursor-pointer"
                >
                  <IconSparkles className="w-4 h-4" />
                  {isGenerating ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>

            {/* Reference Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <div className="w-full max-w-xs mx-auto">
                  <img
                    src={imagePreview}
                    alt="Reference"
                    className="w-full h-auto rounded-xl border border-border"
                  />
                </div>
              </div>
            )}

            {/* Cancel button for Generate method */}
            <div className="flex justify-start mt-4">
              <button
                onClick={onBack}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Upload Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              What the actor should do?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Like "Make the actor talk with excitement while looking at the camera"'
              className="w-full h-24 p-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            />
          </div>

          {/* Upload Area */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-foreground mb-4">
              Starting frame
            </label>
            
            {!imagePreview ? (
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
                <div className="w-full h-64 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <IconCloudUpload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-foreground font-medium">Upload an image file</p>
                  <p className="text-sm text-muted-foreground mt-1">PNG, JPG, WEBP up to 10MB</p>
                </div>
              </label>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Uploaded"
                  className="w-full max-w-sm mx-auto rounded-xl border border-border"
                />
                <div className="text-center mt-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Image uploaded</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer - Always at bottom */}
      {generatedActors.length > 0 ? (
        // Footer when actors are generated
        <div className="p-8 border-t border-border">
          <div className="text-center">
            <button
              disabled={!generatedActors.length}
              className="w-full py-3 bg-muted text-foreground rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Select your Actor
            </button>
          </div>
        </div>
      ) : (
        // Normal footer for upload method
        method === "upload" && (
          <div className="p-8 border-t border-border">
            <div className="flex justify-between items-center">
              <button
                onClick={onBack}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Back
              </button>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isGenerating}
                className="px-6 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {isGenerating ? "Processing..." : "Turn into talking actor"}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  )
}
