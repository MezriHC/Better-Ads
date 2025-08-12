"use client"

import { IconCloud } from "@tabler/icons-react"

export default function StorageTab() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center p-8 max-w-2xl">
        <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-6">
          <IconCloud className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-semibold text-foreground mb-4">
          MinIO Storage
        </h3>
        <p className="text-muted-foreground mb-6">
          Interface de gestion du stockage S3 en préparation
        </p>
        
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h4 className="font-semibold text-foreground mb-3">Fonctionnalités prévues :</h4>
          <div className="text-sm text-muted-foreground space-y-2 text-left">
            <p>• Gestion des buckets S3</p>
            <p>• Upload et organisation des fichiers</p>
            <p>• Gestion des permissions</p>
            <p>• Monitoring du stockage</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 bg-muted-foreground rounded-full"></div>
          <span>En préparation</span>
        </div>
      </div>
    </div>
  )
}