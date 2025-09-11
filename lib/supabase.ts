import { createClient } from '@supabase/supabase-js'

// Direct values (⚠️ Not recommended for production, okay for prototype)
const supabaseUrl = "https://ilirjqanlvpejzakjxol.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsaXJqcWFubHZwZWp6YWtqeG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NzIyNTEsImV4cCI6MjA3MjQ0ODI1MX0.jUG369Bk_g2GeuxSXK3i4Kz8OVprUeS1GbrXlZ6oJTI"

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
