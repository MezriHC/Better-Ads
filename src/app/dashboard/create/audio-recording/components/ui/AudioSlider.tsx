interface AudioSliderProps {
  label: string
  value: number
  min: number
  max: number  
  step: number
  onChange: (value: number) => void
  suffix?: string
}

export function AudioSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = ""
}: AudioSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
        <span className="text-sm text-muted-foreground">
          {value}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider:bg-primary"
      />
    </div>
  )
}