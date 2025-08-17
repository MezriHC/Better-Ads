"use client"

import { useState, useMemo, useEffect } from "react"
import { createStudioBFFClient } from "@prisma/studio-core/data/bff"
import { createPostgresAdapter } from "@prisma/studio-core/data/postgres-core"
import { Studio } from "@prisma/studio-core/ui"
import { IconDatabase, IconRefresh } from "@tabler/icons-react"
import "@prisma/studio-core/ui/index.css"

export default function DatabaseTab() {
  const [isDbConnected, setIsDbConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const adapter = useMemo(() => {
    const executor = createStudioBFFClient({
      url: "/api/admin/studio",
      customHeaders: {
        "x-admin-auth": "true",
      },
    })

    return createPostgresAdapter({ executor })
  }, [])

  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        const response = await fetch("/api/admin/studio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-auth": "true",
          },
          body: JSON.stringify({ query: { type: "ping" } }),
        })
        
        setIsDbConnected(response.ok)
      } catch {
        setIsDbConnected(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkDbConnection()
  }, [])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification de la connexion...</p>
        </div>
      </div>
    )
  }

  if (!isDbConnected) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8 max-w-2xl">
          <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-6">
            <IconDatabase className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Base de données distante non accessible
          </h3>
          <p className="text-muted-foreground mb-6">
            Impossible de se connecter à la base de données PostgreSQL sur le VPS.
          </p>
          
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-3">Vérifications à effectuer :</h4>
            <div className="text-sm text-muted-foreground space-y-2 text-left">
              <p>1. Le VPS est-il accessible ? (ping 85.215.140.65)</p>
              <p>2. PostgreSQL est-il démarré sur le VPS ?</p>
              <p>3. Le port 5432 est-il bien exposé ?</p>
              <p>4. Les credentials sont-ils corrects dans .env ?</p>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 font-medium cursor-pointer flex items-center gap-2 mx-auto"
          >
            <IconRefresh className="w-4 h-4" />
            Réessayer la connexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-background">
      <div 
        className="h-full prisma-studio-container"
        style={{
          // Forcer les couleurs par défaut de Prisma Studio
          color: '#000000',
          backgroundColor: '#ffffff',
          // Isoler les styles pour éviter les conflits avec notre thème
          colorScheme: 'light'
        }}
      >
        <Studio adapter={adapter} />
      </div>
    </div>
  )
}