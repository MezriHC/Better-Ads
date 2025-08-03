"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconLayoutDashboard,
  IconCamera,
  IconBox,
  IconArchive,
  IconCirclePlusFilled,
  IconInnerShadowTop,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand
} from "@tabler/icons-react"

const menuItems = [
  { title: "Dashboard", href: "/dashboard", icon: IconLayoutDashboard },
  { title: "Video Avatar", href: "/dashboard/video-avatar", icon: IconCamera },
  { title: "Product Avatar", href: "/dashboard/product-avatar", icon: IconBox },
  { title: "Library", href: "/dashboard/library", icon: IconArchive },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col h-full`}>
      
      {/* Header */}
      <div className="h-16 border-b border-sidebar-border flex items-center px-4 shrink-0">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
            <IconInnerShadowTop className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-semibold text-sidebar-foreground truncate">
              Better Ads
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-grow p-4 space-y-4">
        
        {/* Bouton Create Video */}
        <div className="w-full cursor-pointer">
          <div
            className="p-[2px] rounded-[16px] bg-gradient-to-b from-black/20 to-transparent dark:from-white/20"
          >
            <div
              className="group rounded-[14px] bg-foreground dark:bg-white shadow-lg hover:shadow-md active:shadow-sm transition-all active:scale-[0.98] w-full cursor-pointer"
            >
              <div className={`${isCollapsed ? 'px-3 py-3' : 'px-6 py-3'} bg-gradient-to-b from-transparent to-white/10 dark:to-black/10 rounded-[12px] flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                <IconCirclePlusFilled className="w-6 h-6 shrink-0 text-background dark:text-black" />
                {!isCollapsed && <span className="font-semibold text-background dark:text-black truncate">Create Video</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
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
