import { createClient } from '@supabase/supabase-js'

// Configuration Supabase VPS Self-hosted
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client Supabase pour le côté client (navigateur)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client Supabase pour le côté serveur (avec privilèges admin)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

// Types de base Supabase
export type { User } from '@supabase/supabase-js'
