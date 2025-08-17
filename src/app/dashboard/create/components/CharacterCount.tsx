"use client"

interface CharacterCountProps {
  count: number
  maxCount: number
}

export function CharacterCount({ count, maxCount }: CharacterCountProps) {
  return (
    <div className="text-sm text-muted-foreground">
      {count} / {maxCount}
    </div>
  )
}
