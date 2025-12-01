// src/components/AQICircle.js
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

export default function AQICircle({ aqi = 45, size = 220 }) {
  const anim = useRef(new Animated.Value(0)).current;

  const clamped = Math.max(0, Math.min(aqi, 500));
  const percent = clamped / 500;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: percent,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    }).start();
  }, [percent]);

  const strokeWidth = Math.max(12, Math.round(size * 0.06));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const dashOffset = anim.interpolate({ inputRange:[0,1], outputRange:[circumference, 0] });

  // interpolate color (works with Animated on numeric components like SVG stroke)
  const color = anim.interpolate({
    inputRange: [0, 0.12, 0.25, 0.4, 1],
    outputRange: ['#10B981', '#A3E635', '#F59E0B', '#FB923C', '#EF4444']
  });

  const category = clamped <= 50 ? 'Good' : clamped <= 100 ? 'Moderate' : clamped <= 200 ? 'Unhealthy' : clamped <= 300 ? 'Very Unhealthy' : 'Hazardous';

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size/2}, ${size/2}`}>
          <Circle
            cx={size/2} cy={size/2} r={radius}
            stroke="#F3F4F6" strokeWidth={strokeWidth} fill="none"
          />
          <AnimatedCircle
            cx={size/2} cy={size/2} r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference}, ${circumference}`}
            strokeDashoffset={dashOffset}
            fill="none"
          />
        </G>
      </Svg>

      <View style={styles.center}>
        <Text style={styles.smallLabel}>REAL-TIME AQI</Text>
        <Animated.Text style={[styles.aqi, { color }]}>
          {Math.round(clamped)}
        </Animated.Text>
        <View style={[styles.pill, { backgroundColor: '#F0FDF4' }]}>
          <Text style={[styles.pillText]}>{category}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { justifyContent:'center', alignItems:'center' },
  center: { position:'absolute', alignItems:'center' },
  smallLabel: { fontSize:11, color:'#64748B', fontWeight:'700', letterSpacing:1 },
  aqi: { fontSize:40, fontWeight:'900', marginTop:6 },
  pill: { marginTop:8, paddingHorizontal:12, paddingVertical:6, borderRadius:999 },
  pillText: { fontWeight:'700', color:'#065F46' }
});
