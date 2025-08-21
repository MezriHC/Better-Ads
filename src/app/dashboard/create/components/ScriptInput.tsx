"use client"

interface ScriptInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  placeholder?: string
}

export function ScriptInput({ 
  value, 
  onChange, 
  onKeyDown, 
  placeholder = "Describe your video... (e.g., An energetic product presentation with a professional actor)"
}: ScriptInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="w-full h-32 p-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
    />
  )
}
