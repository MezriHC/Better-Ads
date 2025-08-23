"use client"

import React, { useState, useMemo } from "react"
import Image from "next/image"
import { IconSearch, IconChevronDown, IconPlus, IconX } from "@tabler/icons-react"
import { Avatar, mockAvatars } from '@/_shared'

interface ActorSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectActor: (actor: Avatar) => void
  selectedActorId?: string
  onCreateAvatar?: () => void
}

// Ajouter propriétés gender/age aux mock avatars
const enrichedAvatars: (Avatar & { gender?: "male" | "female"; age?: "young" | "adult"; theme?: string })[] = mockAvatars.map((avatar, index) => ({
  ...avatar,
  gender: index % 3 === 0 ? "female" : index % 3 === 1 ? "male" : undefined,
  age: index % 2 === 0 ? "adult" : "young", 
  theme: ["business", "casual", "creative", "professional", "modern", "classic"][index % 6]
}))

// Composant de filtre custom
function FilterSelect({ 
  value, 
  onChange, 
  options 
}: { 
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const currentOption = options.find(opt => opt.value === value)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:border-primary/50 transition-colors min-w-[140px] justify-between cursor-pointer"
      >
        <span className="text-sm font-medium">{currentOption?.label}</span>
        <IconChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 w-full bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto" style={{marginTop: '4px'}}>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors cursor-pointer ${
                  value === option.value ? 'bg-accent text-accent-foreground' : 'text-foreground'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function ActorSelectorModal({ 
  isOpen, 
  onClose, 
  onSelectActor,
  selectedActorId,
  onCreateAvatar
}: ActorSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGender, setSelectedGender] = useState<"all" | "male" | "female">("all")
  const [selectedAge, setSelectedAge] = useState<"all" | "young" | "adult">("all")
  const [selectedTheme, setSelectedTheme] = useState<"all" | string>("all")

  // Récupérer les thèmes uniques
  const uniqueThemes = Array.from(new Set(enrichedAvatars.map(avatar => avatar.theme).filter((theme): theme is string => Boolean(theme))))
  const themes = uniqueThemes.slice(0, 10)

  // Options pour les filtres
  const genderOptions = [
    { value: "all", label: "All genders" },
    { value: "female", label: "Female" },
    { value: "male", label: "Male" }
  ]

  const ageOptions = [
    { value: "all", label: "All ages" },
    { value: "young", label: "Young" },
    { value: "adult", label: "Adult" }
  ]

  const themeOptions = [
    { value: "all", label: "All themes" },
    ...themes.map(theme => ({
      value: theme as string,
      label: theme.charAt(0).toUpperCase() + theme.slice(1)
    }))
  ]

  // Filtrer les avatars
  const filteredAvatars = useMemo(() => {
    return enrichedAvatars.filter(avatar => {
      if (searchQuery && !avatar.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      if (selectedGender !== "all" && avatar.gender !== selectedGender) {
        return false
      }
      
      if (selectedAge !== "all" && avatar.age !== selectedAge) {
        return false
      }
      
      if (selectedTheme !== "all" && avatar.theme !== selectedTheme) {
        return false
      }
      
      return true
    })
  }, [searchQuery, selectedGender, selectedAge, selectedTheme])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Select an Actor</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-muted hover:bg-accent flex items-center justify-center transition-colors cursor-pointer"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-border">
          <div className="flex flex-col gap-4">
            
            {/* Search */}
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search avatars..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <FilterSelect
                value={selectedGender}
                onChange={(value: string) => setSelectedGender(value as "male" | "female" | "all")}
                options={genderOptions}
              />
              <FilterSelect
                value={selectedAge}
                onChange={(value: string) => setSelectedAge(value as "young" | "adult" | "all")}
                options={ageOptions}
              />
              <FilterSelect
                value={selectedTheme}
                onChange={setSelectedTheme}
                options={themeOptions}
              />
            </div>
          </div>
        </div>

        {/* Avatars Grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, calc((100% - 4rem) / 5)), 1fr))' }}>
            
            {/* Carte "Create avatar" */}
            <div
              onClick={() => onCreateAvatar?.()}
              className="bg-card rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 border border-dashed border-border hover:border-primary/50 hover:bg-accent/20"
            >
              <div className="relative h-72 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <IconPlus className="w-8 h-8 text-primary" />
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <h3 className="font-bold text-foreground text-lg">Create Avatar</h3>
                  <p className="text-sm text-muted-foreground text-center px-4">
                    Upload your photo to create a personalized AI avatar
                  </p>
                </div>
              </div>
              
              {/* Tags en bas */}
              <div className="p-3">
                <div className="flex justify-center">
                  <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full font-medium">
                    Custom Avatar
                  </span>
                </div>
              </div>
            </div>
            
            {filteredAvatars.map((avatar) => {
              const isSelected = selectedActorId === avatar.id
              
              return (
                <div
                  key={avatar.id}
                  onClick={() => onSelectActor(avatar)}
                  className={`
                    bg-card rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300
                    ${isSelected 
                      ? 'border-2 border-foreground shadow-lg' 
                      : 'border border-border hover:border-primary/50'
                    }
                  `}
                >
                  <div className="relative h-72 overflow-hidden">
                    <Image 
                      src={avatar.imageUrl}
                      alt={avatar.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Nom et type d'avatar en bas de l'image */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
                      <h3 className="font-bold text-white text-lg drop-shadow-lg">{avatar.name}</h3>
                      <span className="px-2 py-1 text-xs bg-white/20 text-white rounded-md font-medium backdrop-blur-sm self-start">
                        {avatar.gender === "female" ? "Female" : "Male"} • {avatar.age === "young" ? "Young" : "Adult"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Tags en bas */}
                  <div className="p-3">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full font-medium">
                        {avatar.theme}
                      </span>
                      {avatar.tags.slice(0, 1).map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Message si aucun résultat */}
          {filteredAvatars.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No avatars match your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}