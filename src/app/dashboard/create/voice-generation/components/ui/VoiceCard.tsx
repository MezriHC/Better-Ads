interface VoiceCardProps {
  id: string
  name: string
  gender: "male" | "female"
  country: string
  flag: string
  isSelected: boolean
  onClick: () => void
}

export function VoiceCard({
  id,
  name, 
  gender,
  country,
  flag,
  isSelected,
  onClick
}: VoiceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-3 text-left rounded-lg border transition-colors cursor-pointer ${
        isSelected 
          ? 'border-primary bg-primary/10 text-foreground'
          : 'border-border bg-card hover:bg-muted/50 text-foreground'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{flag}</span>
        <div className="flex-1">
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted-foreground">
            {gender} • {country}
          </div>
        </div>
      </div>
    </button>
  )
}