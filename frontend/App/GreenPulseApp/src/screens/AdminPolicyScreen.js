import React, { useContext } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import HeaderBar from "../components/HeaderBar";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { ReportsContext } from "../context/ReportsContext";

export default function AdminPolicyScreen({ navigation }) {
  const { reports } = useContext(ReportsContext);

  const total = reports.length;
  const verified = reports.filter((r) => r.status === "verified").length;
  const pending = total - verified;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar
        title="Policy Dashboard"
        onPressBell={() => {}}
        onPressLocation={() => navigation.navigate("SafeRoutes")}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>City Policy Overview</Text>
        <Text style={styles.subtitle}>
          Use citizen data to guide enforcement and awareness drives.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Report Summary</Text>
          <Text style={styles.line}>Total reports: {total}</Text>
          <Text style={styles.line}>Pending verification: {pending}</Text>
          <Text style={styles.line}>Verified incidents: {verified}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Suggested Actions</Text>
          <Text style={styles.bullet}>• Increase checks in areas with many verified reports.</Text>
          <Text style={styles.bullet}>• Target garbage-burning hotspots for awareness drives.</Text>
          <Text style={styles.bullet}>• Coordinate with traffic police in high-exposure corridors.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.muted,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: RADIUS.lg,
    marginTop: 12,
  },
  cardTitle: {
    fontWeight: "800",
    marginBottom: 8,
  },
  line: {
    marginTop: 4,
    color: COLORS.text,
  },
  bullet: {
    marginTop: 4,
    color: COLORS.muted,
    fontSize:13,
},
});