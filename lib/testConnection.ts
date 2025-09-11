import { supabase } from './supabase'

export async function testConnection(): Promise<void> {
	try {
		const { data, error } = await supabase.from('notes').select('*').limit(1)
		if (error) {
			console.log('❌ Supabase error:', error.message)
			return
		}
		console.log('✅ Supabase connected, data:', data)
	} catch (err) {
		console.log('❌ Unexpected error while testing Supabase:', err)
	}
}


