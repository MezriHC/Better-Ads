"use client"

import { useState } from "react"
import { IconX } from "@tabler/icons-react"
import { GetStartedStep } from "./CreateAvatarModal/GetStartedStep"
import { DefineActorStep } from "./CreateAvatarModal/DefineActorStep"
import { SelectActorStep } from "./CreateAvatarModal/SelectActorStep"
import { SelectVoiceStep } from "./CreateAvatarModal/SelectVoiceStep"
import { LaunchTrainingStep } from "./CreateAvatarModal/LaunchTrainingStep"

type CreateMethod = "generate" | "upload"
type AvatarStep = "get-started" | "define-actor" | "select-actor" | "select-voice" | "launch-training"

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

interface CreateAvatarModalProps {
  isOpen: boolean
  onClose: () => void
  onAvatarCreated?: (avatar: any) => void
}

export function CreateAvatarModal({ isOpen, onClose, onAvatarCreated }: CreateAvatarModalProps) {
  const [step, setStep] = useState<AvatarStep>("get-started")
  const [method, setMethod] = useState<CreateMethod | null>(null)
  const [actorPrompt, setActorPrompt] = useState("")
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [generatedActors, setGeneratedActors] = useState<GeneratedActor[]>([])
  const [selectedActor, setSelectedActor] = useState<GeneratedActor | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<SelectedVoice | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleClose = () => {
    // Reset state
    setStep("get-started")
    setMethod(null)
    setActorPrompt("")
    setReferenceImage(null)
    setGeneratedActors([])
    setSelectedActor(null)
    setSelectedVoice(null)
    setIsGenerating(false)
    onClose()
  }

  const handleMethodSelect = (selectedMethod: CreateMethod) => {
    setMethod(selectedMethod)
    setStep("define-actor")
  }

  const handleDefineActor = async (prompt: string, image?: File) => {
    setActorPrompt(prompt)
    if (image) setReferenceImage(image)
    
    if (method === "upload" && image) {
      // For upload method, go directly to voice selection
      setStep("select-voice")
    } else {
      // For generate method, create mock generated actors but stay on same step
      setIsGenerating(true)
      
      // Simulate generation delay
      setTimeout(() => {
        const mockActors: GeneratedActor[] = [
          {
            id: "1",
            imageUrl: "/ai-avatars/avatar-1.jpg",
            description: "Professional business attire, confident pose"
          },
          {
            id: "2", 
            imageUrl: "/ai-avatars/avatar-2.jpg",
            description: "Casual smart outfit, friendly expression"
          },
          {
            id: "3",
            imageUrl: "/ai-avatars/avatar-3.jpg", 
            description: "Modern style, approachable demeanor"
          }
        ]
        
        setGeneratedActors(mockActors)
        setIsGenerating(false)
        // Stay on define-actor step to show integrated interface
      }, 2000)
    }
  }

  const handleActorSelect = (actor: GeneratedActor) => {
    setSelectedActor(actor)
    setStep("select-voice")
  }

  const handleVoiceSelect = (voice: SelectedVoice) => {
    setSelectedVoice(voice)
    setStep("launch-training")
  }

  const handleLaunchTraining = async () => {
    // Simulate training launch
    setIsGenerating(true)
    
    setTimeout(() => {
      const newAvatar = {
        id: Date.now().toString(),
        name: actorPrompt.slice(0, 30) + "...",
        imageUrl: selectedActor?.imageUrl || "/ai-avatars/avatar-1.jpg",
        voice: selectedVoice,
        method,
        status: "training"
      }
      
      onAvatarCreated?.(newAvatar)
      handleClose()
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">CREATE ACTOR</p>
            <h2 className="text-xl font-semibold text-foreground">
              {step === "get-started" && "Get Started"}
              {step === "define-actor" && "Create Custom Actor"}
              {step === "select-actor" && "Define your Actor"}
              {step === "select-voice" && "Select Actor Voice"}
              {step === "launch-training" && "Launch Training"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted hover:bg-accent transition-colors cursor-pointer"
          >
            <IconX className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className={`${step === "define-actor" && method === "generate" ? "h-[calc(90vh-80px)] flex flex-col" : "overflow-y-auto max-h-[calc(90vh-80px)]"}`}>
          {step === "get-started" && (
            <GetStartedStep onMethodSelect={handleMethodSelect} />
          )}
          
          {step === "define-actor" && (
            <DefineActorStep
              method={method!}
              onDefineActor={handleDefineActor}
              onBack={() => setStep("get-started")}
              isGenerating={isGenerating}
              generatedActors={generatedActors}
              onActorSelect={handleActorSelect}
              onRegenerateActors={() => handleDefineActor(actorPrompt, referenceImage)}
            />
          )}
          
          {step === "select-actor" && (
            <SelectActorStep
              actors={generatedActors}
              prompt={actorPrompt}
              onActorSelect={handleActorSelect}
              onRegenerateActors={() => handleDefineActor(actorPrompt, referenceImage)}
              isGenerating={isGenerating}
            />
          )}
          
          {step === "select-voice" && (
            <SelectVoiceStep
              onVoiceSelect={handleVoiceSelect}
              isUploading={method === "upload"}
            />
          )}
          
          {step === "launch-training" && (
            <LaunchTrainingStep
              actor={selectedActor}
              voice={selectedVoice}
              onLaunchTraining={handleLaunchTraining}
              isGenerating={isGenerating}
            />
          )}
        </div>
      </div>
    </div>
  )
}
