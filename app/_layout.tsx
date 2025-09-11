import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="role-selection" />
        <Stack.Screen name="student-login" />
        <Stack.Screen name="faculty-login" />
        <Stack.Screen name="(student-tabs)" />
        <Stack.Screen name="(faculty-tabs)" />
        <Stack.Screen name="subject/[id]" />
        <Stack.Screen name="faculty/manage-students" />
        <Stack.Screen name="faculty/manage-subjects" />
        
        <Stack.Screen name="faculty/student-detail/[id]" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}