"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/src/app/_shared/components/Sidebar"
import { Header } from "@/src/app/_shared/components/Header"

const menuItems = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Video Avatar", href: "/dashboard/video-avatar" },
  { title: "Product Avatar", href: "/dashboard/product-avatar" },
  { title: "Library", href: "/dashboard/library" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const currentPage = menuItems.find((item) => item.href === pathname)
  const pageTitle = currentPage ? currentPage.title : "Dashboard"

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header pageTitle={pageTitle} />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
