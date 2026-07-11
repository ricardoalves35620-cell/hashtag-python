export interface AppConfiguration {
  isConfigured: boolean
  supabaseUrl: string
  supabaseAnonKey: string
  missing: string[]
}

function readEnv(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string {
  const value = import.meta.env[name]
  return typeof value === 'string' ? value.trim() : ''
}

function isValidSupabaseUrl(value: string): boolean {
  if (!value) return false
  try {
    const url = new URL(value)
    const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
    return url.protocol === 'https:' || (isLocal && url.protocol === 'http:')
  } catch {
    return false
  }
}

const supabaseUrl = readEnv('VITE_SUPABASE_URL')
const supabaseAnonKey = readEnv('VITE_SUPABASE_ANON_KEY')
const missing: string[] = []

if (!isValidSupabaseUrl(supabaseUrl)) missing.push('VITE_SUPABASE_URL')
if (!supabaseAnonKey || supabaseAnonKey.length < 20) missing.push('VITE_SUPABASE_ANON_KEY')

export const appConfiguration: AppConfiguration = {
  isConfigured: missing.length === 0,
  supabaseUrl,
  supabaseAnonKey,
  missing,
}
