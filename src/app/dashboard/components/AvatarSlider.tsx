"use client"

import React from "react"
import Image from "next/image"

export interface Avatar {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  imageUrl: string
  type: "image"
  gender?: "male" | "female"
}

interface AvatarSliderProps {
  avatars: Avatar[]
}

export function AvatarSlider({ avatars }: AvatarSliderProps) {

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4" style={{ width: 'max-content' }}>
        {avatars.map((avatar) => (
          <div 
            key={avatar.id}
            className="bg-card border border-border rounded-2xl overflow-hidden group"
            style={{
              width: '220px',
              flexShrink: 0
            }}
          >
            <div className="relative h-72 overflow-hidden">
              <Image 
                src={avatar.imageUrl}
                alt={avatar.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
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