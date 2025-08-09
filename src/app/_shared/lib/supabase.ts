import { createClient } from '@supabase/supabase-js'

// Configuration Supabase VPS - Simple et direct
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client Supabase unique pour toute l'application
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client avec clé service (pour opérations admin côté serveur)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
