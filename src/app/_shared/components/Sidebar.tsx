"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconLayoutDashboard,
  IconFolder,
  IconSettings,
  IconCirclePlusFilled,
  IconBolt,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconChevronRight
} from "@tabler/icons-react"

const menuItems = [
  { title: "Dashboard", href: "/dashboard", icon: IconLayoutDashboard },
  { title: "Folders", href: "#", icon: IconFolder },
  { title: "Settings", href: "/dashboard/settings", icon: IconSettings },
]

const foldersData = [
  {
    id: "july-week-3",
    name: "July week 3",
    isOpen: true,
    projects: [
      { id: "smm-go-2", name: "smm go 2", isActive: true },
      { id: "smm-go-1", name: "smm go 1" },
      { id: "leads-sniper-2", name: "leads sniper 2" },
      { id: "leads-sniper-1", name: "leads sniper 1" },
      { id: "ugc-team-3", name: "ugc team 3" },
      { id: "ugc-team-2", name: "ugc team 2" },
      { id: "ugc-team-1", name: "ugc team 1" },
      { id: "proxy4u-5", name: "proxy4u 5" },
      { id: "proxy4u-4", name: "proxy4u 4" },
      { id: "proxy4u-3", name: "proxy4u 3" },
      { id: "proxy4u-2", name: "proxy4u 2" },
    ]
  }
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openFolders, setOpenFolders] = useState<string[]>(["july-week-3"])
  const pathname = usePathname()

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    )
  }

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
        <Link href="/dashboard/create" className="w-full cursor-pointer">
          <div
            className="p-[2px] rounded-[16px] bg-gradient-to-b from-black/20 to-transparent dark:from-white/20"
          >
            <div
              className="group rounded-[14px] bg-foreground dark:bg-white shadow-lg hover:shadow-md active:shadow-sm transition-all active:scale-[0.98] w-full cursor-pointer"
            >
              <div className={`${isCollapsed ? 'px-3 py-3' : 'px-6 py-3'} bg-gradient-to-b from-transparent to-white/10 dark:to-black/10 rounded-[12px] flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                <IconCirclePlusFilled className="w-6 h-6 shrink-0 text-background dark:text-black" />
                {!isCollapsed && <span className="font-semibold text-background dark:text-black truncate">New project</span>}
              </div>
            </div>
          </div>
        </Link>

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

        {/* Folders Section */}
        {!isCollapsed && (
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 mb-3">
              <h3 className="text-sm font-semibold text-sidebar-foreground">
                Folders
              </h3>
            </div>
            
            <div className="space-y-2">
              {foldersData.map((folder) => {
                const isFolderOpen = openFolders.includes(folder.id)
                
                return (
                  <div key={folder.id}>
                    <button
                      onClick={() => toggleFolder(folder.id)}
                      className="w-full flex items-center justify-between px-3 py-3 text-left text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <IconFolder className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium truncate">
                          {folder.name}
                        </span>
                      </div>
                      <IconChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isFolderOpen ? 'rotate-90' : ''}`} />
                    </button>
                    
                    {isFolderOpen && (
                      <div className="ml-8 mt-2 space-y-1">
                        {folder.projects.map((project) => (
                          <button
                            key={project.id}
                            className={`
                              w-full flex items-center px-3 py-2.5 rounded-lg text-left transition-colors duration-200
                              ${project.isActive 
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                                : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/30'
                              }
                            `}
                          >
                            <span className="truncate">{project.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
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
    </aside>
  )
}
