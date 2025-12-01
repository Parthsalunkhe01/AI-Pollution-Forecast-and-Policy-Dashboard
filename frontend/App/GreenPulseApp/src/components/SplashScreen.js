// src/components/SplashScreen.js
import { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

/**
 * Simple fallback splash (no Lottie).
 * Shows your logo (assets/images/logo.png) and a short delay before calling onFinish.
 */

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const t = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1200); // short splash time
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>GreenPulse</Text>
      <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SPACING.sm }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#ffffff' },
  logo: { width: 180, height: 180, borderRadius: 12 },
  title: { marginTop: SPACING.md, fontSize:20, fontWeight:'800', color: COLORS.primary }
});
