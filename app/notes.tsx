import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Linking, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getNotes, Note } from '../lib/notes'

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    async function fetchNotes() {
      const data = await getNotes()
      setNotes(data)
    }
    fetchNotes()
  }, [])

  const openPDF = async (url?: string | null) => {
    if (!url) {
      alert('No PDF URL')
      return
    }
    const supported = await Linking.canOpenURL(url)
    if (supported) {
      await Linking.openURL(url)
    } else {
      alert('Cannot open PDF link')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.header}>📚 Notes</Text>
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openPDF(item.pdf_url)} style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  inner: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: { padding: 15, marginBottom: 10, borderRadius: 10, backgroundColor: '#f2f2f2' },
  title: { fontSize: 16, fontWeight: '600' },
  description: { color: '#555' },
})


