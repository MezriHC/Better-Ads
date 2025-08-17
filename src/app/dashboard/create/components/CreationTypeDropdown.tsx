"use client"

import { IconChevronDown } from "@tabler/icons-react"

type CreationType = "talking-actor" | "scenes" | "b-rolls"

interface CreationTypeOption {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface CreationTypeDropdownProps {
  selectedType: CreationType
  onTypeChange: (type: CreationType) => void
  creationTypes: CreationTypeOption[]
  isOpen: boolean
  onToggleOpen: () => void
  onCloseAudioSettings: () => void
}

export function CreationTypeDropdown({
  selectedType,
  onTypeChange,
  creationTypes,
  isOpen,
  onToggleOpen,
  onCloseAudioSettings
}: CreationTypeDropdownProps) {
  const currentType = creationTypes.find(type => type.id === selectedType)

  const handleTypeSelect = (typeId: string) => {
    onTypeChange(typeId as CreationType)
    onToggleOpen() // This will close the dropdown
    
    // Fermer le drawer Audio Settings si on quitte Talking Actor
    if (typeId !== "talking-actor") {
      onCloseAudioSettings()
    }
  }

  return (
    <div className="relative">
      <button
        onClick={onToggleOpen}
        className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg hover:bg-accent transition-all cursor-pointer"
      >
        {currentType?.icon && <currentType.icon className="w-4 h-4 text-muted-foreground" />}
        <span className="text-sm font-medium text-foreground">{currentType?.label}</span>
        <IconChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ml-1 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggleOpen} />
          <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[200px]">
            {creationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/50 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer"
              >
                <type.icon className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{type.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
