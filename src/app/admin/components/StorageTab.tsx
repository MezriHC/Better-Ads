"use client"

import { useState, useEffect } from "react"
import { IconExternalLink, IconLoader } from "@tabler/icons-react"

export default function StorageTab() {
  const [loading, setLoading] = useState(true)
  const [autoLoginUrl, setAutoLoginUrl] = useState<string>('')

  useEffect(() => {
    // 🚀 Connexion immédiate et automatique
    const setupAutoLogin = async () => {
      try {
        const response = await fetch('/api/admin/minio/auth', { method: 'POST' })
        const data = await response.json()
        
        if (data.autoLoginUrl) {
          setAutoLoginUrl(data.autoLoginUrl)
          // ⚡ Connexion immédiate dans l'iframe
          const iframe = document.querySelector('#minio-console') as HTMLIFrameElement
          if (iframe) {
            iframe.src = data.autoLoginUrl
          }
        }
      } catch (error) {
        console.error('Erreur auto-login MinIO:', error)
        // 🔄 Fallback : URL normale
        const iframe = document.querySelector('#minio-console') as HTMLIFrameElement
        if (iframe) {
          iframe.src = 'https://minio.trybetterads.com'
        }
      } finally {
        setLoading(false)
      }
    }

    setupAutoLogin()
  }, [])

  const openInNewWindow = () => {
    // 🪟 Ouvrir avec auto-login dans nouvelle fenêtre
    const url = autoLoginUrl || 'https://minio.trybetterads.com'
    window.open(url, '_blank', 'width=1200,height=800')
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="flex items-center gap-3 text-gray-600">
          <IconLoader className="w-6 h-6 animate-spin" />
          <span>Connexion à MinIO...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Barre d'outils minimale */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Console MinIO - Stockage S3
        </div>
        <button
          onClick={openInNewWindow}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2"
        >
          <IconExternalLink className="w-4 h-4" />
          Nouvelle fenêtre
        </button>
      </div>

      {/* Console MinIO pleine largeur */}
      <div className="flex-1">
        <iframe
          id="minio-console"
          src="about:blank"
          className="w-full h-full border-0"
          title="Console MinIO"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation allow-downloads"
        />
      </div>
    </div>
  )
}