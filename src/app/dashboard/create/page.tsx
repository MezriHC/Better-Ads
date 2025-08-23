"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreateMain } from './components/CreateMain'
import { useProjectContext } from '@/_shared'

export default function CreatePage() {
  const router = useRouter()
  const { currentProject, projects, isLoading } = useProjectContext()

  useEffect(() => {
    if (!isLoading && !currentProject && projects.length === 0) {
      router.push('/dashboard')
    }
  }, [currentProject, projects.length, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!currentProject) {
    return null
  }

  return <CreateMain />
}
