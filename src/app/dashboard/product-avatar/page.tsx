"use client"

import { useState } from "react"
import { AvatarSelector } from "../../_shared/components/AvatarSelector"
import { ProductPlacementStep } from "./components/ProductPlacementStep"
import { ScriptAudioStep } from "../../_shared/components/ScriptAudioStep"
import { ProductGenerationStep } from "../../_shared/components/VideoGenerationStepWrapper"
import { SectionHeader } from "../components/SectionHeader"

interface Avatar {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  imageUrl: string
  type: "image"
  gender?: "male" | "female"
  age?: "young" | "adult"
  theme?: string
}

export default function ProductAvatarPage() {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null)
  const [currentStep, setCurrentStep] = useState(1) // Step 1: Avatar Selection, Step 2: Product Placement, Step 3: Script & Audio, Step 4: Product Generation

  const handleSelectAvatar = (avatar: Avatar) => {
    setSelectedAvatar(avatar)
  }

  const handleNextStep = () => {
    if (selectedAvatar && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleStepClick = (step: number) => {
    // Allow going back at any time
    // Allow going forward only if an avatar is selected
    if (step <= currentStep || (selectedAvatar && step <= 4)) {
      setCurrentStep(step)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header with steps */}
      <div className="flex flex-col gap-4">
        <SectionHeader
          title="Create a Product Advertisement"
          description="Follow the steps to create your personalized product ad with an AI avatar."
        />
        
        {/* Step indicator */}
        <div className="flex items-center gap-4">
          <div 
            onClick={() => handleStepClick(1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors cursor-pointer ${
            currentStep === 1 
              ? 'bg-primary text-primary-foreground' 
              : selectedAvatar 
                ? 'bg-muted text-muted-foreground hover:bg-accent' 
                : 'bg-muted text-muted-foreground hover:bg-accent'
          }`}>
            <span className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-sm font-medium">1</span>
            <span className="text-sm font-medium">Choose Avatar</span>
          </div>
          
          <div className={`w-8 h-0.5 ${selectedAvatar ? 'bg-primary' : 'bg-foreground/20 dark:bg-foreground/40'} transition-colors`}></div>
          
          <div 
            onClick={() => handleStepClick(2)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              selectedAvatar ? 'cursor-pointer' : 'cursor-not-allowed'
            } ${
            currentStep === 2 
              ? 'bg-primary text-primary-foreground' 
              : currentStep > 2 && selectedAvatar
                ? 'bg-muted text-muted-foreground hover:bg-accent'
                : selectedAvatar
                  ? 'bg-muted text-muted-foreground hover:bg-accent'
                  : 'bg-muted text-muted-foreground opacity-50'
          }`}>
            <span className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-sm font-medium">2</span>
            <span className="text-sm font-medium">Product Placement</span>
          </div>
          
          <div className={`w-8 h-0.5 ${currentStep > 2 ? 'bg-primary' : 'bg-foreground/20 dark:bg-foreground/40'} transition-colors`}></div>
          
          <div 
            onClick={() => handleStepClick(3)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              selectedAvatar ? 'cursor-pointer' : 'cursor-not-allowed'
            } ${
            currentStep === 3 
              ? 'bg-primary text-primary-foreground' 
              : currentStep > 3 && selectedAvatar
                ? 'bg-muted text-muted-foreground hover:bg-accent'
                : selectedAvatar
                  ? 'bg-muted text-muted-foreground hover:bg-accent'
                  : 'bg-muted text-muted-foreground opacity-50'
          }`}>
            <span className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-sm font-medium">3</span>
            <span className="text-sm font-medium">Product Description</span>
          </div>
          
          <div className={`w-8 h-0.5 ${currentStep > 3 ? 'bg-primary' : 'bg-foreground/20 dark:bg-foreground/40'} transition-colors`}></div>
          
          <div 
            onClick={() => handleStepClick(4)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              selectedAvatar ? 'cursor-pointer' : 'cursor-not-allowed'
            } ${
            currentStep === 4 
              ? 'bg-primary text-primary-foreground' 
              : selectedAvatar
                ? 'bg-muted text-muted-foreground hover:bg-accent'
                : 'bg-muted text-muted-foreground opacity-50'
          }`}>
            <span className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-sm font-medium">4</span>
            <span className="text-sm font-medium">Ad Generation</span>
          </div>
        </div>
      </div>

      {/* Content based on step */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Select your avatar</h2>
            <div
              onClick={selectedAvatar ? handleNextStep : undefined}
              className={selectedAvatar ? "cursor-pointer" : "cursor-not-allowed"}
            >
              <div
                className={`p-[2px] rounded-[16px] transition-all ${
                  selectedAvatar 
                    ? 'bg-gradient-to-b from-black/20 to-transparent dark:from-white/20' 
                    : 'bg-gradient-to-b from-black/10 to-transparent dark:from-white/10'
                }`}
              >
                <div
                  className={`group rounded-[14px] shadow-lg transition-all ${
                    selectedAvatar
                      ? 'bg-foreground dark:bg-white hover:shadow-md active:shadow-sm active:scale-[0.98] cursor-pointer'
                      : 'bg-muted cursor-not-allowed opacity-50'
                  }`}
                >
                  <div
                    className={`px-6 py-3 rounded-[12px] transition-all ${
                      selectedAvatar
                        ? 'bg-gradient-to-b from-transparent to-white/10 dark:to-black/10'
                        : 'bg-gradient-to-b from-transparent to-black/5 dark:to-white/5'
                    }`}
                  >
                    <span className={`font-semibold ${
                      selectedAvatar
                        ? 'text-background dark:text-black'
                        : 'text-muted-foreground'
                    }`}>
                      Next Step
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <AvatarSelector
            selectedAvatarId={selectedAvatar?.id}
            onSelectAvatar={handleSelectAvatar}
          />
        </div>
      )}

      {currentStep === 2 && (
        <ProductPlacementStep 
          selectedAvatar={selectedAvatar}
          onBack={() => setCurrentStep(1)}
          onNext={handleNextStep}
        />
      )}

      {currentStep === 3 && (
        <ScriptAudioStep 
          selectedAvatar={selectedAvatar}
          onBack={() => setCurrentStep(2)}
          onNext={handleNextStep}
          type="product"
        />
      )}

      {currentStep === 4 && (
        <ProductGenerationStep 
          selectedAvatar={selectedAvatar}
          onBack={() => setCurrentStep(3)}
        />
      )}
      
    </div>
  )
}
