import { createClient } from '@supabase/supabase-js'

// Konfiguration af Supabase klient
// Erstat disse med din faktiske Supabase URL og anon key
// Du kan finde dem i Supabase Dashboard > Settings > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uczbfnjxksuasytubnyy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_secret_8YFpkU9zOYlZ7TC1QzIYUg_FdI0Uwo7'

// Eksporterer Supabase klient til brug i resten af applikationen
export const supabase = createClient(supabaseUrl, supabaseAnonKey)


