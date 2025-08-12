"use client"

import { useState, useEffect } from "react"
import { IconExternalLink, IconLoader } from "@tabler/icons-react"

export default function StorageTab() {
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Vérification rapide de la connexion MinIO
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/admin/minio/auth', { method: 'POST' })
        const data = await response.json()
        setConnected(!!data.consoleUrl)
      } catch {
        setConnected(false)
      } finally {
        setLoading(false)
      }
    }

    checkConnection()
  }, [])

  const openMinIOConsole = () => {
    window.open('https://minio.trybetterads.com', '_blank')
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <IconLoader className="w-6 h-6 animate-spin border-white" />
          <span>Connexion à MinIO...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* En-tête avec connexion directe */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">MinIO Storage Console</h2>
          <p className="text-sm text-muted-foreground">
            Interface de gestion du stockage S3 - Connexion automatique
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-muted-foreground">
            {connected ? 'Connecté' : 'Déconnecté'}
          </span>
          <button
            onClick={openMinIOConsole}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors cursor-pointer flex items-center gap-2"
          >
            <IconExternalLink className="w-4 h-4" />
            Nouvelle fenêtre
          </button>
        </div>
      </div>

      {/* Console MinIO intégrée */}
      <div className="flex-1 p-4">
        <div className="h-full bg-white rounded-xl border border-border overflow-hidden">
          <iframe
            src="https://minio.trybetterads.com"
            className="w-full h-full border-0"
            title="Console MinIO"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          />
        </div>
      </div>
    </div>
  )
}