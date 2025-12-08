import React, { useContext, useEffect } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderBar from "../components/HeaderBar";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { ReportsContext } from "../context/ReportsContext";

export default function AdminVerifyReportsScreen({ navigation }) {
  const { reports, verifyReport, loadReports } = useContext(ReportsContext);

  useEffect(() => {
    loadReports?.();
  }, []);

  const pendingReports = reports.filter((r) => r.status !== "verified");

  function onVerify(id) {
    verifyReport(id);
    Alert.alert("Verified", "Report marked as verified");
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar
        title="Verify Reports"
        onPressBell={() => {}}
        onPressLocation={() => navigation.navigate("SafeRoutes")}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: SPACING.md, paddingBottom: 40 }}
      >
        <Text style={styles.title}>Pending Reports</Text>

        {pendingReports.length === 0 && (
          <Text style={{ marginTop: 12, color: COLORS.muted }}>
            No pending reports. Everything is verified.
          </Text>
        )}

        {pendingReports.map((r) => (
          <View key={r.id} style={styles.card}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontWeight: "700" }}>{r.title}</Text>
              <Text style={{ color: COLORS.muted }}>{r.status}</Text>
            </View>
            <Text style={{ color: COLORS.muted, marginTop: 6 }}>
              {r.location || r.stationName || "Unknown location"}
            </Text>
            <Text style={{ marginTop: 8 }}>{r.description}</Text>

            <TouchableOpacity
              style={styles.verifyBtn}
              onPress={() => onVerify(r.id)}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Verify</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: "700", fontSize: 18 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: RADIUS.md,
    marginTop: 12,
  },
  verifyBtn: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: RADIUS.md,
    alignItems: "center",
},
});