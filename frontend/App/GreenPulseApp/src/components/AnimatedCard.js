// src/components/AnimatedCard.js
import { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';

export default function AnimatedCard({ children, onPress, style }) {
  const translateY = useRef(new Animated.Value(12)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 420, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 420, useNativeDriver: true })
    ]).start();
  }, []);

  function handlePressIn() { Animated.spring(scale, { toValue: 0.985, useNativeDriver:true }).start(); }
  function handlePressOut() { Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver:true }).start(); }

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[{ transform: [{ translateY }, { scale }], opacity }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
