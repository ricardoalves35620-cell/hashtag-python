import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { appConfiguration } from './config'

let client: SupabaseClient | null = null

export class ConfigurationError extends Error {
  constructor(message = 'Supabase is not configured.') {
    super(message)
    this.name = 'ConfigurationError'
  }
}

export function getSupabase(): SupabaseClient {
  if (!appConfiguration.isConfigured) {
    throw new ConfigurationError(
      `Missing or invalid environment variables: ${appConfiguration.missing.join(', ')}`
    )
  }

  if (!client) {
    client = createClient(appConfiguration.supabaseUrl, appConfiguration.supabaseAnonKey)
  }

  return client
}
