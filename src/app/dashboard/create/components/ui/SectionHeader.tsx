"use client"

interface SectionHeaderProps {
  title: string;
  description: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}