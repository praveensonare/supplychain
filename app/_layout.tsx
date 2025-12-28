import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="slr" />
        <Stack.Screen name="lgt" />
        <Stack.Screen name="mfr" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
