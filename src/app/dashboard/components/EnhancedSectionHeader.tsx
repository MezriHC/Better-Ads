"use client"

import Link from 'next/link'
import { Button } from '@/src/app/_shared'

interface EnhancedSectionHeaderProps {
  title: string
  description: string
  actionText?: string
  actionHref?: string
}

export function EnhancedSectionHeader({ 
  title, 
  description, 
  actionText, 
  actionHref 
}: EnhancedSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {actionText && actionHref && (
        <Link href={actionHref}>
          <Button className="cursor-pointer">
            {actionText}
          </Button>
        </Link>
      )}
    </div>
  )
}