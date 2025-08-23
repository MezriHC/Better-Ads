"use client"

import { useState } from "react"
import { IconX, IconArrowLeft } from "@tabler/icons-react"
import { GetStartedStep } from "./GetStartedStep"
import { DefineActorStep } from "./DefineActorStep"
import { SelectActorStep } from "./SelectActorStep"
import { LaunchTrainingStep } from "./LaunchTrainingStep"

type CreateMethod = "generate" | "upload"
type AvatarStep = "get-started" | "define-actor" | "select-actor" | "launch-training"

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
  onVideoGenerated?: (video: any) => void
  onAvatarGenerationStarted?: (avatarData: any) => void
  onAvatarGenerationCompleted?: (avatar: any) => void
}

export function CreateAvatarModal({ 
  isOpen, 
  onClose, 
  onAvatarCreated, 
  onVideoGenerated,
  onAvatarGenerationStarted,
  onAvatarGenerationCompleted 
}: CreateAvatarModalProps) {
  const [step, setStep] = useState<AvatarStep>("get-started")
  const [method, setMethod] = useState<CreateMethod | null>(null)
  const [actorPrompt, setActorPrompt] = useState("")
  const [selectedActor, setSelectedActor] = useState<GeneratedActor | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>()

  const getModalHeight = () => {
    switch (step) {
      case "get-started":
        return "h-[500px]"
      case "define-actor":
        return "h-[800px]"
      case "select-actor":
        return "h-[750px]"
      case "launch-training":
        return "h-[700px]"
      default:
        return "h-[700px]"
    }
  }

  const handleClose = () => {
    setStep("get-started")
    setMethod(null)
    setActorPrompt("")
    setSelectedActor(null)
    setSelectedImageUrl(undefined)
    onClose()
  }

  const handleBack = () => {
    switch (step) {
      case "define-actor":
        setStep("get-started")
        break
      case "select-actor":
        if (method === "upload") {
          setStep("get-started")
        } else {
          setStep("define-actor")
        }
        break
      case "launch-training":
        setStep("select-actor")
        break
      default:
        break
    }
  }

  const canGoBack = step !== "get-started" && step !== "launch-training"

  const handleMethodSelect = (selectedMethod: CreateMethod) => {
    setMethod(selectedMethod)
    
    if (selectedMethod === "upload") {
      setStep("select-actor")
    } else {
      setStep("define-actor")
    }
  }

  const handleDefineActor = async (prompt: string, imageUrl?: string) => {
    setActorPrompt(prompt)
    
    if (imageUrl) {
      setSelectedImageUrl(imageUrl)
    }
    
    if (method === "upload" && imageUrl) {
      setStep("select-actor")
    }
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

        <div className="flex-1 flex flex-col">
          {step === "get-started" && (
            <GetStartedStep onMethodSelect={handleMethodSelect} />
          )}
          
          {step === "define-actor" && (
            <DefineActorStep
              onDefineActor={handleDefineActor}
              onNext={(imageUrl?: string) => {
                if (imageUrl) setSelectedImageUrl(imageUrl)
                setStep("select-actor")
              }}
            />
          )}
          
          {step === "select-actor" && (
            <SelectActorStep
              onNext={() => setStep("launch-training")}
              selectedImageUrl={selectedImageUrl}
              method={method || "generate"}
              onImageUpload={(imageUrl) => setSelectedImageUrl(imageUrl)}
              onPromptChange={(prompt) => setActorPrompt(prompt)}
            />
          )}
          
          {step === "launch-training" && (
            <LaunchTrainingStep
              actor={selectedActor}
              selectedImageUrl={selectedImageUrl}
              prompt={actorPrompt}
              onVideoGenerated={onVideoGenerated}
              onAvatarGenerationStarted={onAvatarGenerationStarted}
              onAvatarGenerationCompleted={onAvatarGenerationCompleted}
            />
          )}
        </div>
      </div>
    </div>
  )
}