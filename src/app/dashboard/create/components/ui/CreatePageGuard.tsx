"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { IconX, IconSparkles } from "@tabler/icons-react"

interface CreatePageGuardProps {
  children: React.ReactNode
}

export function CreatePageGuard({ children }: CreatePageGuardProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  // Mock project context
  const currentProject = { id: "demo-project", name: "Demo Project" }
  const projects = [currentProject]
  const isLoading = false

  const handleCloseModal = () => {
    if (projects.length > 0) {
      setIsModalOpen(false)
      setProjectName("")
      setIsCreating(false)
    } else {
      router.push('/dashboard')
    }
  }

  const handleCreateProject = async () => {
    if (!projectName.trim()) return
    
    setIsCreating(true)
    
    // Mock project creation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsModalOpen(false)
    setProjectName("")
    setIsCreating(false)
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    )
  }

  if (!currentProject && !isModalOpen) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">No Project Selected</h2>
          <p className="text-muted-foreground">Please create or select a project to continue.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {(currentProject || isModalOpen) && children}
      
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal()
            }
          }}
        >
          <div 
            className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Create New Project</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title={projects.length > 0 ? "Close" : "Return to dashboard"}
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="projectName" className="text-sm font-medium text-foreground">
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
                  disabled={isCreating}
                />
              </div>
              
              <div className="p-[2px] rounded-[16px] bg-gradient-to-b from-black/20 to-transparent dark:from-white/20">
                <button
                  onClick={handleCreateProject}
                  disabled={!projectName.trim() || isCreating}
                  className="group rounded-[14px] bg-foreground shadow-lg hover:shadow-md active:shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer"
                >
                  <div className="px-6 py-3 bg-gradient-to-b from-transparent to-white/10 dark:to-black/10 rounded-[12px] flex items-center justify-center gap-2">
                    <IconSparkles className="w-5 h-5 shrink-0 text-background" />
                    <span className="font-semibold text-background">
                      {isCreating ? "Creating..." : "Create Project"}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}