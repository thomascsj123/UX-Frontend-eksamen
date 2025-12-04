import { createClient } from '@supabase/supabase-js'

// Konfiguration af Supabase klient
// IMPORTANT: Use the ANONYMOUS (public) key, NOT the secret key!
// Find your keys in Supabase Dashboard > Settings > API
// The anonymous key starts with "eyJ" (it's a JWT token)
// The secret key starts with "sb_secret_" and should NEVER be used in the browser

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uczbfnjxksuasytubnyy.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
    'Please add it to your .env.local file. ' +
    'Get your anonymous key from Supabase Dashboard > Settings > API'
  )
}

// Security check: Ensure we're not using a secret key
if (supabaseAnonKey.startsWith('sb_secret_')) {
  throw new Error(
    'SECURITY ERROR: You are using a SECRET key in the browser! ' +
    'Secret keys should NEVER be used in client-side code. ' +
    'Please use the ANONYMOUS (public) key from Supabase Dashboard > Settings > API'
  )
}

// Eksporterer Supabase klient til brug i resten af applikationen
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

