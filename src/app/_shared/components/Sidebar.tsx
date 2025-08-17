"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconLayoutDashboard,
  IconSettings,
  IconCirclePlusFilled,
  IconBolt,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconDots,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX
} from "@tabler/icons-react"
import { useProjectContext } from "../contexts/ProjectContext"
import { useRouter } from "next/navigation"
import type { Project } from "../database/types"

const menuItems = [
  { title: "Dashboard", href: "/dashboard", icon: IconLayoutDashboard },
  { title: "Settings", href: "/dashboard/settings", icon: IconSettings },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { projects, currentProject, setCurrentProject, setShouldShowNewProjectModal, updateProject, deleteProject, isLoading } = useProjectContext()

  const switchToProject = (project: Project) => {
    setCurrentProject(project)
    
    // Rediriger vers create si on n'y est pas déjà
    if (pathname !== '/dashboard/create') {
      router.push('/dashboard/create')
    }
  }

  const handleNewProject = () => {
    // Si on est déjà sur la page create, ouvrir la modal directement
    if (pathname === '/dashboard/create') {
      setShouldShowNewProjectModal(true)
    } else {
      // Sinon, aller sur create et marquer qu'il faut ouvrir la modal
      setShouldShowNewProjectModal(true)
      router.push('/dashboard/create')
    }
  }

  const handleRenameProject = (project: Project) => {
    setEditingId(project.id)
    setEditingName(project.name)
    setOpenMenuId(null)
  }

  const handleSaveRename = async (projectId: string) => {
    if (editingName.trim() && editingName.trim() !== projects.find(p => p.id === projectId)?.name) {
      // Fermeture immédiate de l'édition
      setEditingId(null)
      setEditingName("")
      
      // Mise à jour en arrière-plan (optimiste)
      try {
        await updateProject(projectId, editingName.trim())
      } catch (error) {
        console.error("Error updating project:", error)
      }
    } else {
      setEditingId(null)
      setEditingName("")
    }
  }

  const handleCancelRename = () => {
    setEditingId(null)
    setEditingName("")
  }

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project)
    setOpenMenuId(null)
  }

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return
    
    setIsDeleting(true)
    try {
      await deleteProject(projectToDelete.id)
      setProjectToDelete(null)
    } catch (error) {
      console.error("Error deleting project:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDeleteProject = () => {
    setProjectToDelete(null)
    setIsDeleting(false)
  }

  // Fermer les menus quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null)
    }

    if (openMenuId) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openMenuId])

  // Fermer la modale de suppression avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && projectToDelete && !isDeleting) {
        cancelDeleteProject()
      }
    }

    if (projectToDelete) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [projectToDelete, isDeleting])

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col h-full`}>
      
      {/* Header */}
      <div className="h-16 border-b border-sidebar-border flex items-center px-4 shrink-0">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="relative w-8 h-8 shrink-0 group cursor-pointer">
            <div className="w-full h-full rounded-lg bg-sidebar-primary border border-sidebar-border shadow-sm group-hover:shadow-md transition-all duration-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 rounded-lg"></div>
              <div className="relative w-full h-full flex items-center justify-center">
                <IconBolt className="w-4 h-4 text-sidebar-primary-foreground group-hover:scale-105 transition-transform duration-200" />
              </div>
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-sidebar-foreground tracking-tight">
                Better Ads
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                AI Video Creation
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-grow p-4 flex flex-col gap-4 overflow-y-auto">
        
        {/* Bouton New Project */}
        <button 
          onClick={handleNewProject}
          className="w-full cursor-pointer"
        >
          <div
            className="p-[2px] rounded-[16px] bg-gradient-to-b from-black/20 to-transparent dark:from-white/20"
          >
            <div
              className="group rounded-[14px] bg-foreground shadow-lg hover:shadow-md active:shadow-sm transition-all active:scale-[0.98] w-full cursor-pointer"
            >
              <div className={`${isCollapsed ? 'px-3 py-3' : 'px-6 py-3'} bg-gradient-to-b from-transparent to-white/10 dark:to-black/10 rounded-[12px] flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                <IconCirclePlusFilled className="w-6 h-6 shrink-0 text-background" />
                {!isCollapsed && <span className="font-semibold text-background truncate">New project</span>}
              </div>
            </div>
          </div>
        </button>

        {/* Menu Items */}
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href && item.href !== "#"
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-lg
                  ${isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }
                  transition-colors duration-200
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className="w-6 h-6 shrink-0" />
                {!isCollapsed && <span className="font-medium truncate">{item.title}</span>}
              </Link>
            )
          })}
        </div>

        {/* Projects Section */}
        {!isCollapsed && (
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 mb-3">
              <h3 className="text-sm font-semibold text-sidebar-foreground">
                Projects
              </h3>
            </div>
            
            <div className="space-y-1">
              {isLoading ? (
                // Skeleton loader pendant le chargement
                [...Array(3)].map((_, i) => (
                  <div key={i} className="px-3 py-3">
                    <div className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                ))
              ) : projects.map((project) => {
                // Un projet est actif seulement si on est sur /create ET qu'il est le projet actuel
                const isActive = pathname === '/dashboard/create' && currentProject?.id === project.id
                const isEditing = editingId === project.id
                
                return (
                  <div
                    key={project.id}
                    className={`
                      group relative w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 ${!isEditing ? 'cursor-pointer' : ''}
                      ${isActive 
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      }
                    `}
                    onClick={() => !isEditing && switchToProject(project)}
                  >
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="w-full flex items-center gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveRename(project.id)
                              } else if (e.key === 'Escape') {
                                handleCancelRename()
                              }
                            }}
                            className="flex-1 px-2 py-1.5 text-sm font-medium bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            autoFocus
                            onFocus={(e) => e.target.select()}
                          />
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSaveRename(project.id)
                              }}
                              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              title="Sauvegarder"
                            >
                              <IconCheck className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCancelRename()
                              }}
                              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              title="Annuler"
                            >
                              <IconX className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={`font-medium text-sm truncate ${
                          isActive ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground'
                        }`}>
                          {project.name}
                        </div>
                      )}
                    </div>

                    {/* Menu trois points */}
                    {!isEditing && (
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenMenuId(openMenuId === project.id ? null : project.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-sidebar-accent/70 transition-all duration-200 cursor-pointer"
                        >
                          <IconDots className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </button>

                        {/* Dropdown menu */}
                        {openMenuId === project.id && (
                          <div className="absolute top-full right-0 mt-2 w-36 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRenameProject(project)
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                              >
                                <IconEdit className="w-4 h-4" />
                                Renommer
                              </button>
                              <div className="h-px bg-border mx-1"></div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteProject(project)
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                              >
                                <IconTrash className="w-4 h-4" />
                                Supprimer
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              
              {!isLoading && projects.length === 0 && (
                <div className="px-3 py-4 text-center text-muted-foreground text-sm">
                  No projects yet.<br />
                  Click &quot;New project&quot; to start.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer - Bouton Collapse */}
      <div className={`p-4 shrink-0 flex ${isCollapsed ? 'justify-center' : 'justify-end'} mt-auto`}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            flex items-center justify-center h-10 w-10 rounded-lg
            text-sidebar-foreground hover:bg-sidebar-accent/50
            transition-colors duration-200
          `}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <IconLayoutSidebarLeftExpand className="w-6 h-6 shrink-0" />
          ) : (
            <IconLayoutSidebarLeftCollapse className="w-6 h-6 shrink-0" />
                  )}
              </button>
      </div>

      {/* Modale de suppression */}
      {projectToDelete && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting) {
              cancelDeleteProject()
            }
          }}
        >
          <div 
            className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconTrash className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Supprimer le projet</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Voulez-vous vraiment supprimer <span className="font-medium text-foreground">&quot;{projectToDelete.name}&quot;</span> ?
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Bouton Annuler */}
              <button
                onClick={cancelDeleteProject}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              
              {/* Bouton Supprimer */}
              <div className="flex-1 p-[2px] rounded-[12px] bg-gradient-to-b from-red-600/20 to-transparent dark:from-red-400/20">
                <button
                  onClick={confirmDeleteProject}
                  disabled={isDeleting}
                  className="group rounded-[10px] bg-red-600 dark:bg-red-500 shadow-lg hover:shadow-md active:shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer"
                >
                  <div className="px-4 py-2.5 bg-gradient-to-b from-transparent to-white/10 dark:to-black/10 rounded-[8px] flex items-center justify-center gap-2">
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-white dark:border-red-100 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <IconTrash className="w-4 h-4 shrink-0 text-white dark:text-red-100" />
                    )}
                    <span className="font-semibold text-white dark:text-red-100">
                      {isDeleting ? "Suppression..." : "Supprimer"}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </aside>
  )
}
