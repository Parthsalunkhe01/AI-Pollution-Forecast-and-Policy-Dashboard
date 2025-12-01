// src/components/AnimatedButton.js
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

export default function AnimatedButton({ children, style, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  function pressIn() {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  }
  function pressOut() {
    Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }).start();
  }

  const content =
    typeof children === 'string' || typeof children === 'number'
      ? <Text style={styles.text}>{children}</Text>
      : children;

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {content}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: { color: '#fff', fontWeight: '800', textAlign: 'center' }
});
