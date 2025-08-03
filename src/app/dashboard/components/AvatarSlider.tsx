"use client"

import React from "react"

interface Avatar {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  imageUrl: string
  type: "video" | "product"
  gender?: "male" | "female"
}

// Échantillon d'avatars pour la demo (premiers noms de chaque genre)
const sampleMaleNames = ["Aaron", "Abraham", "Adam", "Adrian", "Alan", "Albert", "Alexander", "Andre", "Andrew", "Angelo"];
const sampleFemaleNames = ["Adrienne", "Alice", "Allison", "Amanda", "Amber", "Amy", "Anna", "April", "Arlene", "Audrey"];
const sampleTags = ["Professional", "Creative", "Business", "Modern", "Friendly", "Expert", "Trendy", "Reliable"];
const sampleCategories = ["Business", "Tech", "Creative", "Healthcare", "Education", "Social", "Marketing", "Finance"];

export function AvatarSlider() {
  // Générer un échantillon d'avatars pour l'affichage
  const displayedAvatars: Avatar[] = [
    // 10 avatars masculins
    ...sampleMaleNames.map((name, index) => ({
      id: `male-demo-${index + 1}`,
      name,
      category: sampleCategories[index % sampleCategories.length],
      description: `Professional ${name} specializing in various fields`,
      tags: [
        sampleTags[index % sampleTags.length],
        sampleTags[(index + 1) % sampleTags.length]
      ],
      imageUrl: `/ai-avatars/males/${name}.mp4`,
      type: "video" as const,
      gender: "male" as const
    })),
    // 10 avatars féminins
    ...sampleFemaleNames.map((name, index) => ({
      id: `female-demo-${index + 1}`,
      name,
      category: sampleCategories[index % sampleCategories.length],
      description: `Professional ${name} specializing in various fields`,
      tags: [
        sampleTags[index % sampleTags.length],
        sampleTags[(index + 1) % sampleTags.length]
      ],
      imageUrl: `/ai-avatars/females/${name}.mp4`,
      type: "video" as const,
      gender: "female" as const
    }))
  ]

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4" style={{ width: 'max-content' }}>
        {displayedAvatars.map((avatar) => (
          <div 
            key={avatar.id}
            className="bg-card border border-border rounded-2xl overflow-hidden group"
            style={{
              width: '220px',
              flexShrink: 0
            }}
          >
            <div 
              className="relative h-72 overflow-hidden"
              onMouseEnter={(e) => {
                const video = e.currentTarget.querySelector('video');
                if (video) {
                  video.play().catch(() => {
                    // Ignore play errors (autoplay policy)
                  });
                }
              }}
              onMouseLeave={(e) => {
                const video = e.currentTarget.querySelector('video');
                if (video) {
                  video.pause();
                  video.currentTime = 0;
                }
              }}
            >
              <video 
                src={avatar.imageUrl}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedData={(e) => {
                  // Aller à la 2ème frame pour éviter les frames noires
                  e.currentTarget.currentTime = 0.2;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
                <h3 className="font-bold text-white text-lg drop-shadow-lg">{avatar.name}</h3>
                <span className="px-2 py-1 text-xs bg-white/20 text-white rounded-md font-medium backdrop-blur-sm self-start">
                  {avatar.gender === "female" ? "Female" : "Male"} • Video Avatar
                </span>
              </div>
            </div>
            
            <div className="p-3">
              <div className="flex flex-wrap gap-1">
                {avatar.tags.slice(0, 2).map((tag) => (
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
        ))}
      </div>
    </div>
  )
}
