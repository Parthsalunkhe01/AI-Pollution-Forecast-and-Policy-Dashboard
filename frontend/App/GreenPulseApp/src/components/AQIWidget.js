// src/components/AQIWidget.js

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

export default function AQIWidget({ aqi = 0, location = "Unknown" }) {
  const level =
    aqi <= 50
      ? "Good"
      : aqi <= 100
      ? "Satisfactory"
      : aqi <= 200
      ? "Moderate"
      : aqi <= 300
      ? "Poor"
      : aqi <= 400
      ? "Very Poor"
      : "Severe";

  const pillColor =
    aqi <= 50
      ? "#DCFCE7"
      : aqi <= 100
      ? "#ECFCCB"
      : aqi <= 200
      ? "#FEF3C7"
      : aqi <= 300
      ? "#FFEDD5"
      : aqi <= 400
      ? "#FEE2E2"
      : "#FECACA";

  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>Current AQI</Text>
        <Text style={styles.value}>{Math.round(Number(aqi) || 0)}</Text>
        <View style={[styles.pill, { backgroundColor: pillColor }]}>
          <Text style={styles.pillText}>{level}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={{ flex: 1, paddingLeft: 12 }}>
        <Text style={styles.label}>Location</Text>
        <Text style={styles.location} numberOfLines={2}>
          📍 {location || "Unknown"}
        </Text>
        <Text style={styles.smallHint}>Updated just now</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  value: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.primary,
  },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 6,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
  },
  divider: {
    width: 1,
    height: 52,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },
  location: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  smallHint: {
    marginTop: 6,
    fontSize: 11,
    color: "#9CA3AF",
  },
});
