// Adaptateur intelligent : Prisma en dev, Supabase API en prod optimisé

import { supabase, supabaseAdmin } from './supabase'

// Types pour les opérations communes
export interface User {
  id: string
  email: string
  name?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

// Wrapper intelligent qui utilise Supabase API quand c'est plus approprié
export const db = {
  // Pour les opérations simples - utilise Supabase API (plus sécurisé)
  async getUser(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('id', id)
      .single()
    
    return error ? null : data
  },

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User | null> {
    const { data, error } = await supabase
      .from('user')
      .insert(userData)
      .select()
      .single()
    
    return error ? null : data
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('user')
      .update({ ...updates, updatedAt: new Date() })
      .eq('id', id)
      .select()
      .single()
    
    return error ? null : data
  },

  // Pour les opérations complexes - utilisez Prisma directement
  // import { PrismaClient } from '@prisma/client'
  // const prisma = new PrismaClient()
}

export { supabase, supabaseAdmin }
