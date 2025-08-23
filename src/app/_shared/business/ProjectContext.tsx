"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./hooks/useAuth"
import type { Project } from "../core/types"

interface ProjectContextType {
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  error: string | null
  createProject: (name: string) => Promise<Project | null>
  updateProject: (id: string, name: string) => Promise<Project | null>
  deleteProject: (id: string) => Promise<boolean>
  setCurrentProject: (project: Project | null) => void
  refreshProjects: () => Promise<void>
  requireProject: boolean // Indique si l'utilisateur doit avoir un projet actif
  setRequireProject: (require: boolean) => void
  shouldShowNewProjectModal: boolean // Flag pour déclencher la modal New Project
  setShouldShowNewProjectModal: (show: boolean) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requireProject, setRequireProject] = useState(false)
  const [shouldShowNewProjectModal, setShouldShowNewProjectModal] = useState(false)

  const fetchProjects = async () => {
    if (!isAuthenticated) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/projects')
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          setProjects([])
          return
        }
        throw new Error(data.error || 'Erreur lors du chargement des projets')
      }

      setProjects(data.projects)
      
      if (!currentProject && data.projects.length > 0) {
        setCurrentProjectState(data.projects[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  const createProject = async (name: string): Promise<Project | null> => {
    if (!isAuthenticated) return null

    try {
      setError(null)

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du projet')
      }

      const newProject = data.project
      setProjects(prev => [newProject, ...prev])
      setCurrentProjectState(newProject)
      
      return newProject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    }
  }

  const updateProject = async (id: string, name: string): Promise<Project | null> => {
    if (!isAuthenticated) return null

    const previousProjects = projects
    const previousCurrentProject = currentProject
    
    const optimisticProject = projects.find(p => p.id === id)
    if (!optimisticProject) return null

    const updatedProject = { ...optimisticProject, name, updatedAt: new Date() }
    
    setProjects(prev => prev.map(p => p.id === id ? updatedProject : p))
    if (currentProject?.id === id) {
      setCurrentProjectState(updatedProject)
    }

    try {
      setError(null)

      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (!response.ok) {
        setProjects(previousProjects)
        setCurrentProjectState(previousCurrentProject)
        throw new Error(data.error || 'Erreur lors de la mise à jour du projet')
      }

      const serverProject = data.project
      setProjects(prev => prev.map(p => p.id === id ? serverProject : p))
      
      if (currentProject?.id === id) {
        setCurrentProjectState(serverProject)
      }
      
      return serverProject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    }
  }

  const deleteProject = async (id: string): Promise<boolean> => {
    if (!isAuthenticated) return false

    const previousProjects = projects
    const previousCurrentProject = currentProject
    
    const newProjects = projects.filter(p => p.id !== id)
    const newCurrentProject = currentProject?.id === id 
      ? (newProjects.length > 0 ? newProjects[0] : null)
      : currentProject

    setProjects(newProjects)
    setCurrentProjectState(newCurrentProject)

    try {
      setError(null)

      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        setProjects(previousProjects)
        setCurrentProjectState(previousCurrentProject)
        
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la suppression du projet')
      }
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return false
    }
  }

  const setCurrentProject = (project: Project | null) => {
    setCurrentProjectState(project)
  }

  const refreshProjects = async () => {
    await fetchProjects()
  }

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchProjects()
    } else if (!authLoading && !isAuthenticated) {
      setProjects([])
      setCurrentProjectState(null)
      setIsLoading(false)
    }
  }, [isAuthenticated, authLoading])

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        isLoading: isLoading || authLoading,
        error,
        createProject,
        updateProject,
        deleteProject,
        setCurrentProject,
        refreshProjects,
        requireProject,
        setRequireProject,
        shouldShowNewProjectModal,
        setShouldShowNewProjectModal,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjectContext() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider')
  }
  return context
}
