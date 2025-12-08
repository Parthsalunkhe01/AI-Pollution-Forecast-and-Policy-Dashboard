// src/components/HealthAlertCard.js

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

export default function HealthAlertCard({ aqi = 0, health }) {
  if (!health) {
    return (
      <Text style={{ color: COLORS.muted, fontSize: 13 }}>
        Health advisory will appear once data is loaded.
      </Text>
    );
  }

  return (
    <View>
      <View style={[styles.chip, { backgroundColor: `${health.color}22` }]}>
        <Text style={[styles.chipText, { color: health.color }]}>
          {health.level} AQI · AQI: {Math.round(Number(aqi) || 0)}
        </Text>
      </View>

      <Text style={styles.message}>{health.message}</Text>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.subTitle}>Mask Advice</Text>
        <Text style={styles.subText}>{health.mask}</Text>
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.subTitle}>Outdoor Safety Index</Text>
        <Text style={styles.subText}>
          {health.outdoorIndex}/10 — higher is safer.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "800",
  },
  message: {
    fontSize: 14,
    color: "#111827",
  },
  subTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },
  subText: {
    fontSize: 13,
    color: "#4B5563",
  },
});
