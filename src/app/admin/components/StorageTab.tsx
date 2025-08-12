"use client"

import { useState, useEffect } from "react"
import { IconLoader } from "@tabler/icons-react"

export default function StorageTab() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [iframeUrl, setIframeUrl] = useState<string>('')
  const [credentials, setCredentials] = useState<{accessKey: string, secretKey: string} | null>(null)
  const [showCredentials, setShowCredentials] = useState(false)

  useEffect(() => {
    const initializeMinIO = async () => {
      try {
        // 🔐 Récupérer les credentials 
        const response = await fetch('/api/admin/minio/credentials', { method: 'POST' })
        const data = await response.json()
        
        if (!data.credentials?.accessKey || !data.credentials?.secretKey) {
          throw new Error('Credentials MinIO indisponibles')
        }
        
        // 🎯 Sauvegarder les credentials et charger MinIO
        setCredentials({
          accessKey: data.credentials.accessKey,
          secretKey: data.credentials.secretKey
        })
        setIframeUrl(data.consoleUrl)
        
        // ⏳ Attendre que l'iframe soit chargée
        setTimeout(() => {
          setLoading(false)
          // 🚀 Injecter les credentials après chargement
          autoFillCredentials(data.credentials.accessKey, data.credentials.secretKey)
          
          // 💡 Afficher les credentials après 2s si l'injection échoue
          setTimeout(() => {
            setShowCredentials(true)
          }, 2000)
        }, 3000)
        
      } catch (err) {
        console.error('Erreur initialisation MinIO:', err)
        setError(err instanceof Error ? err.message : 'Erreur de connexion MinIO')
        setLoading(false)
      }
    }

    initializeMinIO()
  }, [])

  const autoFillCredentials = (accessKey: string, secretKey: string) => {
    try {
      const iframe = document.querySelector('#minio-console') as HTMLIFrameElement
      if (!iframe) return

      // 🎯 Essayer d'accéder aux champs dans l'iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) {
        console.log('Impossible d\'accéder au contenu de l\'iframe (CORS)')
        return
      }

      // 🔍 Chercher les champs de connexion MinIO
      const accessKeyField = iframeDoc.querySelector('input[name="accessKey"], input[placeholder*="access"], input[id*="access"]') as HTMLInputElement
      const secretKeyField = iframeDoc.querySelector('input[name="secretKey"], input[placeholder*="secret"], input[id*="secret"]') as HTMLInputElement

      if (accessKeyField && secretKeyField) {
        accessKeyField.value = accessKey
        secretKeyField.value = secretKey
        
        // 🎯 Déclencher les événements pour que MinIO détecte les changements
        accessKeyField.dispatchEvent(new Event('input', { bubbles: true }))
        secretKeyField.dispatchEvent(new Event('input', { bubbles: true }))
        accessKeyField.dispatchEvent(new Event('change', { bubbles: true }))
        secretKeyField.dispatchEvent(new Event('change', { bubbles: true }))
        
        console.log('✅ Credentials injectés automatiquement')
        
        // 🚀 Essayer de cliquer sur le bouton de connexion
        setTimeout(() => {
          const loginButton = iframeDoc.querySelector('button[type="submit"], button:contains("Login"), button:contains("Connect")') as HTMLButtonElement
          if (loginButton) {
            loginButton.click()
            console.log('✅ Connexion automatique déclenchée')
          }
        }, 500)
      } else {
        console.log('❌ Champs de connexion MinIO non trouvés')
      }
    } catch (error) {
      console.log('❌ Erreur injection credentials:', error)
      console.log('💡 MinIO fonctionne, saisie manuelle nécessaire')
    }
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur MinIO</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center">
          <IconLoader className="w-8 h-8 animate-spin text-black mx-auto mb-4" />
          <p className="text-gray-900 font-medium">Connexion automatique à MinIO...</p>
          <p className="text-gray-500 text-sm mt-2">Injection des credentials en cours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-white relative">
      {/* 💡 Bandeau credentials si nécessaire */}
      {showCredentials && credentials && (
        <div className="absolute top-0 left-0 right-0 bg-blue-50 border-b border-blue-200 p-3 z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">Access Key:</span>
                <code className="ml-2 px-2 py-1 bg-blue-100 rounded text-blue-900 select-all">
                  {credentials.accessKey}
                </code>
              </div>
              <div>
                <span className="font-medium text-blue-800">Secret Key:</span>
                <code className="ml-2 px-2 py-1 bg-blue-100 rounded text-blue-900 select-all">
                  {credentials.secretKey}
                </code>
              </div>
            </div>
            <button
              onClick={() => setShowCredentials(false)}
              className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Masquer ✕
            </button>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            💡 Copiez/collez ces identifiants dans la console MinIO ci-dessous
          </p>
        </div>
      )}
      
      {/* 🎯 Console MinIO intégrée avec auto-login */}
      <iframe
        id="minio-console"
        src={iframeUrl}
        className={`w-full border-0 ${showCredentials ? 'h-[calc(100%-100px)]' : 'h-full'}`}
        style={{ 
          background: 'white',
          colorScheme: 'light',
          marginTop: showCredentials ? '100px' : '0'
        }}
        title="Console MinIO"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads allow-top-navigation"
        onLoad={() => {
          console.log('✅ MinIO console chargée')
        }}
      />
    </div>
  )
}