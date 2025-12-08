// src/components/AQICircle.js

import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

export default function AQICircle({ aqi = 0, size = 200 }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.03,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const borderColor =
    aqi <= 50
      ? "#22c55e"
      : aqi <= 100
      ? "#84cc16"
      : aqi <= 200
      ? "#eab308"
      : aqi <= 300
      ? "#f97316"
      : aqi <= 400
      ? "#ef4444"
      : "#7f1d1d";

  return (
    <Animated.View
      style={[
        styles.outer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.innerRing} />
      <Text style={styles.aqiValue}>{Math.round(Number(aqi) || 0)}</Text>
      <Text style={styles.aqiLabel}>REAL-TIME AQI</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderWidth: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  innerRing: {
    position: "absolute",
    width: "78%",
    height: "78%",
    borderRadius: 999,
    backgroundColor: "#ffffff",
  },
  aqiValue: {
    fontSize: 40,
    fontWeight: "900",
    color: COLORS.primary,
  },
  aqiLabel: {
    marginTop: 4,
    fontSize: 12,
    letterSpacing: 1.2,
    color: "#6B7280",
  },
});
