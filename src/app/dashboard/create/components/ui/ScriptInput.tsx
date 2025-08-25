
interface ScriptInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  disabled?: boolean
}

export function ScriptInput({ 
  value, 
  onChange, 
  onKeyDown, 
  placeholder = "Describe your video... (e.g., An energetic product presentation with a professional actor)",
  disabled = false
}: ScriptInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={disabled ? "Generating..." : placeholder}
      disabled={disabled}
      className="w-full h-32 p-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
    />
  )
}