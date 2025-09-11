import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { testConnection } from '../lib/testConnection';

export default function LandingPage() {
  const [phase, setPhase] = useState<'landing' | 'loading'>('landing');

  useEffect(() => {
    testConnection();
    const landingTimer = setTimeout(() => {
      setPhase('loading');
    }, 2000);
    const navTimer = setTimeout(() => {
      router.replace('/role-selection');
    }, 2000 + 3000);

    return () => {
      clearTimeout(landingTimer);
      clearTimeout(navTimer);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://i.pinimg.com/736x/21/99/09/219909939e543b3022ca5c926a7c0d78.jpg' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {phase === 'loading' && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loader} />
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02462D',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#ffffff',
    borderTopColor: 'transparent',
  },
});