"use client"

import React, { useState, useEffect, useRef } from "react"
import { IconCloudUpload, IconPhoto, IconTrash, IconAspectRatio, IconSparkles, IconArrowDown } from "@tabler/icons-react"

type CreateMethod = "generate" | "upload"

interface GeneratedActor {
  id: string
  imageUrl: string
  description: string
}

interface ConversationMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  images?: GeneratedActor[]
  timestamp: Date
  basedOnImageId?: string // For iterations based on selected image
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
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null)
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [currentPrompt, setCurrentPrompt] = useState("")
  const conversationEndRef = useRef<HTMLDivElement>(null)

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
    } else if (method === "generate" && currentPrompt.trim()) {
      // Add user message to conversation
      const userMessage: ConversationMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: currentPrompt,
        timestamp: new Date(),
        basedOnImageId: selectedActorId || undefined // If iterating on selected image
      }
      
      setConversation(prev => [...prev, userMessage])
      setSelectedActorId(null) // Reset selection when generating
      setCurrentPrompt("") // Clear input
      onDefineActor(currentPrompt, uploadedImage || undefined)
    }
  }

  const handleRegenerate = () => {
    if (currentPrompt.trim()) {
      handleSubmit()
    }
  }

  // Add assistant response when generatedActors change
  useEffect(() => {
    if (generatedActors.length > 0 && conversation.length > 0) {
      const lastMessage = conversation[conversation.length - 1]
      if (lastMessage.type === 'user') {
        const assistantMessage: ConversationMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: 'Generated images',
          images: generatedActors,
          timestamp: new Date()
        }
        setConversation(prev => [...prev, assistantMessage])
      }
    }
  }, [generatedActors])

  // Auto scroll to bottom when conversation changes
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [conversation, isGenerating])

  const canSubmit = method === "upload" ? uploadedImage : currentPrompt.trim().length > 0

  return (
    <div className="flex flex-col h-full">
      {method === "generate" ? (
        <>
          {/* Conversation Area - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {/* Conversation Messages */}
              {conversation.map((message, index) => (
                <div 
                  key={message.id} 
                  className={`animate-in slide-in-from-bottom-2 duration-300 ${
                    message.type === 'user' ? 'flex justify-end' : 'flex justify-start'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {message.type === 'user' ? (
                    // User Message - Style comme capture d'écran
                    <div className="max-w-[75%]">
                      {message.basedOnImageId && (
                        <div className="flex items-center justify-end gap-2 mb-2 mr-2">
                          <span className="text-xs text-muted-foreground">Based on selected image</span>
                          <IconArrowDown className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                      <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    // Assistant Message - Style exact capture d'écran
                    <div className="max-w-[85%] w-full">
                      <div className="bg-background border border-border rounded-2xl rounded-bl-md p-6 shadow-sm">
                        {/* Header avec prompt */}
                        <div className="text-center mb-4">
                          <h4 className="text-sm font-medium text-foreground mb-1">
                            {conversation[index - 1]?.content || "Generated actors"}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Choose your actor
                          </p>
                        </div>
                        
                        {/* Grid avec marges comme capture */}
                        <div className="grid grid-cols-3 gap-4">
                          {message.images?.map((actor) => (
                            <button
                              key={actor.id}
                              onClick={() => setSelectedActorId(actor.id)}
                              className="group cursor-pointer relative"
                            >
                              <div className={`aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                                selectedActorId === actor.id 
                                  ? 'border-primary ring-2 ring-primary/20 shadow-lg scale-105' 
                                  : 'border-border group-hover:border-primary/50 shadow-sm'
                              }`}>
                                <img
                                  src={actor.imageUrl}
                                  alt={actor.description}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {/* Sélection indicator */}
                              {selectedActorId === actor.id && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200">
                                  <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading State - Style amélioré */}
              {isGenerating && (
                <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-background border border-border rounded-2xl rounded-bl-md p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-muted-foreground">Generating images...</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Scroll anchor */}
              <div ref={conversationEndRef} />
            </div>
          </div>

          {/* Fixed Input Section - EN BAS, ne bouge jamais */}
          <div className="border-t border-border p-8">
            {/* Masquer le texte explicatif quand conversation commencée */}
            {conversation.length === 0 && (
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-foreground mb-2">Let's start</h3>
                <p className="text-muted-foreground">
                  To create your character, start by writing a text, optionally add<br />
                  a reference image, and choose a ration that suits you.
                </p>
              </div>
            )}

            {/* Text Input with integrated controls */}
            <div className="relative group">
              <textarea
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                placeholder={conversation.length > 0 ? "Continue to iterate..." : "Young adult, fitness coach, wrist band watch"}
                className="w-full h-32 p-4 pb-16 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm focus:shadow-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSubmit && !isGenerating) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
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
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm cursor-pointer hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <IconSparkles className="w-4 h-4" />
                      <span>Generate</span>
                    </>
                  )}
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
      {conversation.length > 0 && selectedActorId ? (
        // Footer when actor is selected in conversation
        <div className="p-8 border-t border-border">
          <div className="text-center">
            <button
              onClick={() => {
                const selectedActor = conversation
                  .flatMap(msg => msg.images || [])
                  .find(actor => actor.id === selectedActorId)
                if (selectedActor && onActorSelect) {
                  onActorSelect(selectedActor)
                }
              }}
              className="w-full py-3 bg-muted text-foreground rounded-lg hover:bg-accent transition-all cursor-pointer"
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
