"use client"

import { useRouter } from "next/navigation"
import { useProjectContext } from '@/_shared'

interface CreateButtonProps {
  children: React.ReactNode
  className?: string
}

export function CreateButton({ children, className }: CreateButtonProps) {
  const router = useRouter()
  const { currentProject, projects, setShouldShowNewProjectModal } = useProjectContext()

  const handleClick = () => {
    if (!currentProject && projects.length === 0) {
      setShouldShowNewProjectModal(true)
      return
    }
    
    if (!currentProject && projects.length > 0) {
      return
    }
    
    router.push('/dashboard/create')
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}