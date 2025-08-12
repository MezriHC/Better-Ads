"use client"

import { useState, useEffect } from "react"
import { IconExternalLink, IconLoader } from "@tabler/icons-react"

export default function StorageTab() {
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Génération d'un token temporaire sécurisé
    const generateSecureSession = async () => {
      try {
        // 🎫 Demander un token temporaire au serveur
        const response = await fetch('/api/admin/minio/session', { method: 'POST' })
        const data = await response.json()
        
        if (data.success && data.autoLoginUrl) {
          setConnected(true)
          // 🔄 Mettre à jour l'iframe avec l'URL d'auto-login
          const iframe = document.querySelector('#minio-console') as HTMLIFrameElement
          if (iframe) {
            iframe.src = data.autoLoginUrl
          }
        } else {
          setConnected(false)
        }
      } catch {
        setConnected(false)
      } finally {
        setLoading(false)
      }
    }

    generateSecureSession()
  }, [])

  const openMinIOConsole = async () => {
    try {
      // 🎫 Générer un nouveau token pour la nouvelle fenêtre
      const response = await fetch('/api/admin/minio/session', { method: 'POST' })
      const data = await response.json()
      
      if (data.success && data.autoLoginUrl) {
        window.open(data.autoLoginUrl, '_blank')
      } else {
        // Fallback vers l'URL normale
        window.open('https://minio.trybetterads.com', '_blank')
      }
    } catch {
      window.open('https://minio.trybetterads.com', '_blank')
    }
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
            id="minio-console"
            src="about:blank"
            className="w-full h-full border-0"
            title="Console MinIO - Connexion automatique"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          />
        </div>
      </div>
    </div>
  )
}