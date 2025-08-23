"use client"

import { IconUsers } from "@tabler/icons-react"

interface Avatar {
  id: string
  name: string
  imageUrl: string
}

interface ActorSelectionProps {
  selectedActor: Avatar | null
  onOpenModal: () => void
}

export function ActorSelection({
  selectedActor,
  onOpenModal
}: ActorSelectionProps) {
  return (
    <button
      onClick={onOpenModal}
      className="flex items-center gap-3 px-4 py-2 bg-muted border border-border rounded-lg hover:bg-accent transition-all cursor-pointer h-[44px]"
    >
      {selectedActor ? (
        <div className="w-6 h-6 rounded-lg overflow-hidden">
          <img 
            src={selectedActor.imageUrl} 
            alt={selectedActor.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <IconUsers className="w-4 h-4 text-muted-foreground" />
      )}
      <span className="text-sm font-medium text-foreground">
        {selectedActor ? selectedActor.name : "Select an actor"}
      </span>
    </button>
  )
}