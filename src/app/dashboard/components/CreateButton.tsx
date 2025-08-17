"use client"

import { useRouter } from "next/navigation"
import { useProjects } from "@/src/app/_shared/hooks/useProjects"

interface CreateButtonProps {
  children: React.ReactNode
  className?: string
}

export function CreateButton({ children, className }: CreateButtonProps) {
  const router = useRouter()
  const { setShouldShowNewProjectModal } = useProjects()

  const handleClick = () => {
    // Toujours aller sur la page create et déclencher le modal si nécessaire
    setShouldShowNewProjectModal(true)
    router.push('/dashboard/create')
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
