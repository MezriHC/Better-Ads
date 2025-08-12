"use client"

import { useState } from "react"
import AdminHeader from "./AdminHeader"
import DatabaseTab from "./DatabaseTab"
import StorageTab from "./StorageTab"

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"database" | "storage">("database")

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
      />
      
      <main className="h-[calc(100vh-80px)]">
        {activeTab === "database" && <DatabaseTab />}
        {activeTab === "storage" && <StorageTab />}
      </main>
    </div>
  )
}