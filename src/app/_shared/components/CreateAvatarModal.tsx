"use client"

import { useState } from "react"
import { IconX, IconArrowLeft } from "@tabler/icons-react"
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

interface CreatedAvatar {
  id: string
  name: string
  imageUrl: string
  voice?: SelectedVoice | null
  method: CreateMethod | null
  status: string
}

interface CreateAvatarModalProps {
  isOpen: boolean
  onClose: () => void
  onAvatarCreated?: (avatar: CreatedAvatar) => void
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
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>()

  // Hauteur adaptative selon l'étape
  const getModalHeight = () => {
    switch (step) {
      case "get-started":
        return "h-[500px]" // Plus petit pour la première étape
      case "define-actor":
        return "h-[800px]" // Grand pour le chat et les images
      case "select-actor":
        return "h-[750px]" // Plus grand pour éviter le scroll interne
      case "select-voice":
        return "h-[850px]" // Plus grand pour voir plus de voix sans coupure
      default:
        return "h-[700px]"
    }
  }

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

  const handleBack = () => {
    switch (step) {
      case "define-actor":
        setStep("get-started")
        break
      case "select-actor":
        setStep("define-actor")
        break
      case "select-voice":
        setStep("select-actor")
        break
      case "launch-training":
        setStep("select-voice")
        break
      default:
        break
    }
  }

  const canGoBack = step !== "get-started" && step !== "launch-training"

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
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={handleClose}
    >
      <div 
        className={`bg-card rounded-lg border border-border w-full max-w-3xl ${getModalHeight()} relative shadow-xl flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header simplifié */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            {canGoBack && (
              <button
                onClick={handleBack}
                className="w-8 h-8 rounded-lg bg-muted/50 hover:bg-accent flex items-center justify-center transition-colors cursor-pointer"
              >
                <IconArrowLeft className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <h2 className="text-xl font-semibold text-foreground">
              {step === "get-started" && "Create Actor"}
              {step === "define-actor" && "Define Actor"}
              {step === "select-actor" && "Create Custom Actor"}
              {step === "select-voice" && "Select Voice"}
              {step === "launch-training" && "Launch Training"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
          >
            <IconX className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content - flex-1 pour les steps */}
        <div className="flex-1 flex flex-col">
          {step === "get-started" && (
            <GetStartedStep onMethodSelect={handleMethodSelect} />
          )}
          
          {step === "define-actor" && (
            <DefineActorStep
              method={method!}
              onDefineActor={handleDefineActor}
              onBack={() => setStep("get-started")}
              onNext={(imageUrl?: string) => {
                if (imageUrl) setSelectedImageUrl(imageUrl)
                setStep("select-actor")
              }}
              isGenerating={isGenerating}
            />
          )}
          
          {step === "select-actor" && (
            <SelectActorStep
              onNext={() => setStep("select-voice")}
              selectedImageUrl={selectedImageUrl}
            />
          )}
          
          {step === "select-voice" && (
            <SelectVoiceStep
              onVoiceSelect={(voice) => {
                handleVoiceSelect(voice)
                setStep("launch-training")
              }}
              isUploading={method === "upload"}
            />
          )}
          
          {step === "launch-training" && (
            <LaunchTrainingStep
              actor={selectedActor}
              voice={selectedVoice}
              onLaunchTraining={handleLaunchTraining}
              isGenerating={isGenerating}
              selectedImageUrl={selectedImageUrl}
            />
          )}
        </div>
      </div>
    </div>
  )
}
