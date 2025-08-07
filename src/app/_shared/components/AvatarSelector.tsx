"use client"

import React, { useState, useMemo } from "react"
import Image from "next/image"
import { IconSearch, IconChevronDown, IconPlus, IconCamera } from "@tabler/icons-react"

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

interface AvatarSelectorProps {
  selectedAvatarId?: string
  onSelectAvatar: (avatar: Avatar) => void
}

// Noms EXACTS extraits des vraies vidéos (135 masculins + 92 féminins)
const maleNames = [
  "Aaron", "Abraham", "Adam", "Adrian", "Alan", "Albert", "Alexander", "Andre", "Andrew", "Angelo",
  "Anthony", "Antonio", "Arthur", "Austin", "Barry", "Benjamin", "Blake", "Brad", "Bradley", "Brian",
  "Bruce", "Bryan", "Calvin", "Cameron", "Carl", "Carlos", "Christian", "Christopher", "Clayton", "Cole",
  "Colin", "Connor", "Corey", "Craig", "Curtis", "Dale", "Damian", "Damien", "Damon", "Daniel",
  "David", "Dean", "Derek", "Devin", "Diego", "Douglas", "Duncan", "Dustin", "Edward", "Edwin",
  "Elliot", "Emmanuel", "Eric", "Erick", "Ernest", "Ethan", "Eugene", "Felix", "Fernando", "Frank",
  "Gabriel", "Geoffrey", "George", "Gerald", "Gregory", "Harold", "Harvey", "Henry", "Hugh", "Ian",
  "Isaac", "Jacob", "James", "Jared", "Jason", "Jeremy", "Jesse", "Joel", "Jonathan", "Joseph",
  "Joshua", "Juan", "Julian", "Justin", "Keith", "Kenneth", "Kevin", "Lance", "Lawrence", "Leo",
  "Lucas", "Luis", "Luke", "Marcus", "Mark", "Martin", "Matthew", "Max", "Nathan", "Neil",
  "Nicholas", "Noah", "Oliver", "Oscar", "Patrick", "Paul", "Philip", "Ralph", "Ricardo", "Robert",
  "Roger", "Ross", "Russell", "Ryan", "Samuel", "Scott", "Sean", "Sebastian", "Shane", "Simon",
  "Stephen", "Steven", "Stewart", "Terry", "Theodore", "Thomas", "Todd", "Tony", "Tyler", "Victor",
  "Vincent", "Warren", "Wesley", "William", "Zachary"
];

const femaleNames = [
  "Adrienne", "Alice", "Allison", "Amanda", "Amber", "Amy", "Anna", "April", "Arlene", "Audrey",
  "Bonnie", "Brenda", "Brittany", "Brooke", "Candace", "Carmen", "Celeste", "Charlotte", "Cheryl", "Chloe",
  "Christina", "Christine", "Claire", "Claudia", "Colleen", "Cynthia", "Dawn", "Delia", "Diana", "Diane",
  "Ellen", "Emily", "Erica", "Evelyn", "Felicia", "Frances", "Gail", "Gloria", "Grace", "Hannah",
  "Hazel", "Heather", "Helen", "Holly", "Janet", "Janice", "Jasmine", "Jenna", "Jennifer", "Joanna",
  "Judy", "Julia", "Julie", "Katherine", "Kathy", "Kayla", "Kelly", "Kristen", "Leah", "Linda",
  "Lisa", "Lori", "Lorraine", "Lynn", "Madeline", "Marcia", "Maria", "Marie", "Marlene", "Mary",
  "Michelle", "Nancy", "Nicole", "Olivia", "Pamela", "Patricia", "Paula", "Rachel", "Rebecca", "Robin",
  "Samantha", "Sarah", "Sheila", "Sophia", "Stacy", "Stephanie", "Susan", "Tamara", "Valerie", "Victoria",
  "Vivian", "Yvonne"
];

// Tags qui tournent sur tous les avatars
const allTags = ["Professional", "Creative", "Business", "Modern", "Friendly", "Expert", "Trendy", "Reliable"];
const allCategories = ["Business", "Tech", "Creative", "Healthcare", "Education", "Social", "Marketing", "Finance"];
const allThemes = ["business", "tech", "creative", "healthcare", "education", "social", "marketing", "finance"];

// Générer les avatars dynamiquement avec des images libres de droit
const enrichedAvatars: Avatar[] = [
  // Avatars masculins
  ...maleNames.map((name, index) => ({
    id: `male-${index + 1}`,
    name,
    category: allCategories[index % allCategories.length],
    description: `Professional ${name} specializing in various fields`,
    tags: [
      allTags[index % allTags.length],
      allTags[(index + 1) % allTags.length]
    ],
    imageUrl: `https://picsum.photos/400/600?random=${200 + index}`,
    type: "image" as const,
    gender: "male" as const,
    age: index % 3 === 0 ? "young" as const : "adult" as const,
    theme: allThemes[index % allThemes.length]
  })),
  // Avatars féminins
  ...femaleNames.map((name, index) => ({
    id: `female-${index + 1}`,
    name,
    category: allCategories[index % allCategories.length],
    description: `Professional ${name} specializing in various fields`,
    tags: [
      allTags[index % allTags.length],
      allTags[(index + 1) % allTags.length]
    ],
    imageUrl: `https://picsum.photos/400/600?random=${300 + index}`,
    type: "image" as const,
    gender: "female" as const,
    age: index % 3 === 0 ? "young" as const : "adult" as const,
    theme: allThemes[index % allThemes.length]
  }))
]

// Composant de filtre custom
function FilterSelect({ 
  value, 
  onChange, 
  options 
}: { 
  label: string
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
        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:border-primary/50 transition-colors min-w-[140px] justify-between"
      >
        <span className="text-sm font-medium">{currentOption?.label}</span>
        <IconChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-full bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors ${
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

export function AvatarSelector({ selectedAvatarId, onSelectAvatar }: AvatarSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGender, setSelectedGender] = useState<"all" | "male" | "female">("all")
  const [selectedAge, setSelectedAge] = useState<"all" | "young" | "adult">("all")
  const [selectedTheme, setSelectedTheme] = useState<"all" | string>("all")
  const [avatarType, setAvatarType] = useState<"all" | "public" | "my">("all")

  // Récupérer les thèmes uniques et limiter à 10
  const uniqueThemes = Array.from(new Set(enrichedAvatars.map(avatar => avatar.theme).filter((theme): theme is string => Boolean(theme))))
  const themes = uniqueThemes.slice(0, 10) // Limiter à 10 thèmes

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

  const avatarTypeOptions = [
    { value: "all", label: "All avatars" },
    { value: "public", label: "Public avatars" },
    { value: "my", label: "My avatars" }
  ]

  // Filtrer les avatars
  const filteredAvatars = useMemo(() => {
    // Si "My avatars" est sélectionné, retourner une liste vide (l'utilisateur n'a pas encore créé d'avatars)
    if (avatarType === "my") {
      return []
    }
    
    // Pour "all" et "public", afficher tous les avatars publics
    return enrichedAvatars.filter(avatar => {
      // Filtrer par recherche
      if (searchQuery && !avatar.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // Filtrer par genre
      if (selectedGender !== "all" && avatar.gender !== selectedGender) {
        return false
      }
      
      // Filtrer par âge
      if (selectedAge !== "all" && avatar.age !== selectedAge) {
        return false
      }
      
      // Filtrer par thème
      if (selectedTheme !== "all" && avatar.theme !== selectedTheme) {
        return false
      }
      
      return true
    })
  }, [searchQuery, selectedGender, selectedAge, selectedTheme, avatarType])

  return (
    <div className="flex flex-col gap-8">
      
      {/* Filtres en priorité */}
      <div className="flex flex-wrap gap-4">
        <FilterSelect
          label="Type"
          value={avatarType}
          onChange={(value) => setAvatarType(value as "all" | "public" | "my")}
          options={avatarTypeOptions}
        />
        
        <FilterSelect
          label="Genre"
          value={selectedGender}
          onChange={(value) => setSelectedGender(value as "all" | "male" | "female")}
          options={genderOptions}
        />
        
        <FilterSelect
          label="Âge"
          value={selectedAge}
          onChange={(value) => setSelectedAge(value as "all" | "young" | "adult")}
          options={ageOptions}
        />
        
        <FilterSelect
          label="Thème"
          value={selectedTheme}
          onChange={setSelectedTheme}
          options={themeOptions}
        />
        
        {/* Barre de recherche plus discrète */}
        <div className="relative flex-1 min-w-[250px]">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-card focus:border-primary/50 transition-colors text-sm"
          />
        </div>
      </div>

      {/* Grille d'avatars - Style du dashboard */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, calc((100% - 4rem) / 5)), 1fr))' }}>
        
        {/* Carte "Create avatar" - Première carte pour "All" et "My avatars" */}
        {(avatarType === "all" || avatarType === "my") && (
          <div
            className="bg-card rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 border border-dashed border-border hover:border-primary/50 hover:bg-accent/20"
          >
            <div className="relative h-72 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <IconPlus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">Create Avatar</h3>
              <p className="text-sm text-muted-foreground text-center px-4">
                Upload your photo to create a personalized AI avatar
              </p>
            </div>
            
            {/* Tags en bas */}
            <div className="p-3">
              <div className="flex justify-center">
                <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full font-medium">
                  <IconCamera className="w-3 h-3 inline mr-1" />
                  Custom Avatar
                </span>
              </div>
            </div>
          </div>
        )}
        
        {filteredAvatars.map((avatar) => {
          const isSelected = selectedAvatarId === avatar.id
          
          return (
            <div
              key={avatar.id}
              onClick={() => onSelectAvatar(avatar)}
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
      {filteredAvatars.length === 0 && avatarType === "public" && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No avatars match your criteria.</p>
        </div>
      )}
      

    </div>
  )
}