"use client"

import { IconRefresh } from "@tabler/icons-react"

interface GeneratedActor {
  id: string
  imageUrl: string
  description: string
}

interface SelectActorStepProps {
  actors: GeneratedActor[]
  prompt: string
  onActorSelect: (actor: GeneratedActor) => void
  onRegenerateActors: () => void
  isGenerating: boolean
}

export function SelectActorStep({ 
  actors, 
  prompt, 
  onActorSelect, 
  onRegenerateActors, 
  isGenerating 
}: SelectActorStepProps) {
  return (
    <div className="p-8">
      {/* Reference Images Section */}
      <div className="mb-8">
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
            <span className="text-xs text-muted-foreground">Reference</span>
            <div className="w-6 h-6 bg-accent rounded">
              {/* Placeholder for reference icon */}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-muted rounded-lg border border-border">
              {/* Reference images would go here */}
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <p className="text-muted-foreground">
            She is in the street and she talks while walking, she wears different clothes
          </p>
        </div>
      </div>

      {/* Generated Actors Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-foreground mb-6">Choose your actor</h3>
        
        <div className="grid grid-cols-3 gap-6 mb-6">
          {actors.map((actor) => (
            <button
              key={actor.id}
              onClick={() => onActorSelect(actor)}
              className="group cursor-pointer"
            >
              <div className="aspect-[3/4] bg-muted rounded-lg border-2 border-border group-hover:border-primary/50 transition-all overflow-hidden">
                <img
                  src={actor.imageUrl}
                  alt={actor.description}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Continue to Iterate */}
        <div className="text-center mb-8">
          <button
            onClick={onRegenerateActors}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
          >
            <IconRefresh className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Continue to iterate</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Image icon */}
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
            </div>

            {/* Aspect ratio */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <path d="m9 9 5 12 1.774-5.226L21 14 9 9z"/>
                </svg>
              </div>
              <span className="text-sm text-foreground">9:16</span>
            </div>

            {/* Delete */}
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="3,6 5,6 21,6"/>
                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
              </svg>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={onRegenerateActors}
            disabled={isGenerating}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center">
        <button
          disabled={actors.length === 0}
          className="w-full py-3 bg-muted text-foreground rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Select your Actor
        </button>
      </div>
    </div>
  )
}
