import { supabase } from './supabase'

export interface Note {
  id: number
  title: string
  description?: string | null
  pdf_url?: string | null
  [key: string]: unknown
}

export async function getNotes(): Promise<Note[]> {
  const { data, error } = await supabase.from('notes').select('*')

  if (error) {
    console.log('❌ Error fetching notes:', error.message)
    return []
  }

  return (data as Note[]) || []
}


