"use client"

import { useState, useCallback } from 'react'
import type { User } from '../database/types'

// Hook pour les opérations base de données côté client
export function useDatabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Récupérer un utilisateur
  const getUser = useCallback(async (id: string): Promise<User | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/users/${id}`)
      if (!response.ok) {
        throw new Error('Utilisateur non trouvé')
      }
      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Mettre à jour un utilisateur
  const updateUser = useCallback(async (id: string, data: Partial<User>): Promise<User | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }
      
      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    // État
    isLoading,
    error,
    
    // Méthodes
    getUser,
    updateUser,
    
    // Utilitaires
    clearError: () => setError(null),
  }
}
