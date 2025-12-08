import React, { useContext, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import HeaderBar from "../components/HeaderBar";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { ReportsContext } from "../context/ReportsContext";

export default function AdminVerifiedReportsScreen({ navigation }) {
  const { reports, loadReports } = useContext(ReportsContext);

  useEffect(() => {
    loadReports?.();
  }, []);

  const verifiedReports = reports.filter((r) => r.status === "verified");

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar
        title="Verified Reports"
        onPressBell={() => {}}
        onPressLocation={() => navigation.navigate("SafeRoutes")}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: SPACING.md, paddingBottom: 40 }}
      >
        <Text style={styles.title}>Verified Incidents</Text>

        {verifiedReports.length === 0 && (
          <Text style={{ marginTop: 12, color: COLORS.muted }}>
            No verified reports yet.
          </Text>
        )}

        {verifiedReports.map((r) => (
          <View key={r.id} style={styles.card}>
            <Text style={styles.cardTitle}>{r.title}</Text>
            <Text style={styles.location}>
              {r.location || r.stationName || "Unknown location"}
            </Text>
            <Text style={styles.desc}>{r.description}</Text>
            <Text style={styles.status}>Status: {r.status}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: "800" },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: RADIUS.md,
    marginTop: 12,
  },
  cardTitle: {
    fontWeight: "800",
    fontSize: 16,
  },
  location: {
    color: COLORS.muted,
    marginTop: 4,
  },
  desc: {
    marginTop: 8,
  },
  status: {
    marginTop: 8,
    fontWeight: "700",
    color: COLORS.primary,
},
});