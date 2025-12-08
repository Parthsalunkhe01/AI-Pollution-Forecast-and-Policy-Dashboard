import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

export default function StationForecastScreen({ route }) {
  const { station, aqi, fc24, fc48, fc72 } = route?.params ?? {};

  // Safe rounded values
  const currentAqi = Math.round(Number(aqi) || 0);
  const f24 = Math.round(Number(fc24) || 0);
  const f48 = Math.round(Number(fc48) || 0);
  const f72 = Math.round(Number(fc72) || 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={{ padding: SPACING.md }}>

        <Text style={styles.title}>{station}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Current AQI</Text>
          <Text style={styles.aqiValue}>{currentAqi}</Text>
        </View>

        <Text style={styles.subTitle}>AI Forecast</Text>

        <View style={styles.forecastCard}>
          <Text style={styles.forecastLabel}>24 Hours</Text>
          <Text style={styles.forecastValue}>{f24}</Text>
        </View>

        <View style={styles.forecastCard}>
          <Text style={styles.forecastLabel}>48 Hours</Text>
          <Text style={styles.forecastValue}>{f48}</Text>
        </View>

        <View style={styles.forecastCard}>
          <Text style={styles.forecastLabel}>72 Hours</Text>
          <Text style={styles.forecastValue}>{f72}</Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
  },
  label: {
    color: COLORS.muted,
  },
  aqiValue: {
    fontSize: 45,
    fontWeight: "800",
    color: COLORS.primary,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
  },
  forecastCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  forecastLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  forecastValue: {
    fontSize: 30,
    fontWeight: "700",
    marginTop:6,
},
});