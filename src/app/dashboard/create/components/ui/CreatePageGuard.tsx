"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconX, IconSparkles } from "@tabler/icons-react"
import { useProjectContext } from '@/_shared'

interface CreatePageGuardProps {
  children: React.ReactNode
}

function CreateProjectSkeleton() {
  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="w-full py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-muted rounded-2xl h-48"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0 relative z-10 pb-8 pt-8">
        <div className="w-full flex px-4 justify-center">
          <div className="w-full max-w-4xl">
            <div className="p-[1px] rounded-2xl bg-gradient-to-b from-border/50 via-primary/10 to-border/30">
              <div className="bg-card/95 backdrop-blur-sm border-0 rounded-2xl p-4 shadow-xl shadow-primary/5 animate-pulse">
                <div className="flex flex-col gap-4">
                  <div className="h-12 bg-muted rounded"></div>
                  <div className="h-32 bg-muted rounded"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CreatePageGuard({ children }: CreatePageGuardProps) {
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const { 
    projects, 
    currentProject, 
    isLoading, 
    createProject,
    shouldShowNewProjectModal,
    setShouldShowNewProjectModal
  } = useProjectContext()

  const handleCloseModal = () => {
    setShouldShowNewProjectModal(false)
    setProjectName("")
    setIsCreating(false)
  }

  const handleCreateProject = async () => {
    if (!projectName.trim()) return
    
    setIsCreating(true)
    const newProject = await createProject(projectName)
    
    if (newProject) {
      setShouldShowNewProjectModal(false)
      setProjectName("")
    }
    
    setIsCreating(false)
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    )
  }

  // Aucun projet existant = Squelettes + modal obligatoire
  if (projects.length === 0) {
    return (
      <>
        <CreateProjectSkeleton />
        <div 
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              router.push('/dashboard')
            }
          }}
        >
          <div 
            className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Create Your First Project</h2>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </div>
              
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
      </>
    )
  }

  // Projets existants = Contenu normal + modal conditionnelle
  return (
    <>
      {children}
      
      {shouldShowNewProjectModal && (
        <div 
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
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
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Create New Project</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </div>
              
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