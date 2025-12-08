// src/screens/ProfileScreen.js

import { useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderBar from "../components/HeaderBar";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { AuthContext } from "../context/AuthContext";
import { ReportsContext } from "../context/ReportsContext";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const { reports } = useContext(ReportsContext);

  const credits = user?.greenCredits ?? 0;
  const footprint = user?.totalFootprint ?? 0;

  const initials =
    user?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar
        onPressBell={() => navigation.navigate("Notifications")}
        onPressLocation={() => navigation.navigate("SafeRoutes")}
      />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: SPACING.md, paddingBottom: 120 }}
      >
        {/* ---------------------------- */}
        {/* USER HEADER */}
        {/* ---------------------------- */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>

          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text style={styles.hello}>
              Hello,{" "}
              {user?.displayName ??
                (user?.email ? user.email.split("@")[0] : "Citizen")}
              !
            </Text>
            <Text style={styles.subtext}>Level 1 • Green Guardian</Text>
          </View>
        </View>

        {/* ---------------------------- */}
        {/* STATS CARDS */}
        {/* ---------------------------- */}
        <View style={styles.statsRow}>
          {/* GREEN CREDITS */}
          <View style={[styles.card, styles.primaryCard]}>
            <Text style={styles.cardLabelLight}>Green Credits</Text>
            <Text style={styles.cardValueLight}>{credits}</Text>
            <TouchableOpacity
              style={styles.redeemBtn}
              onPress={() => alert("Redeem Coming Soon")}
            >
              <Text style={{ color: COLORS.primary, fontWeight: "700" }}>
                Redeem
              </Text>
            </TouchableOpacity>
          </View>

          {/* FOOTPRINT */}
          <View style={[styles.card, { backgroundColor: "#fff" }]}>
            <Text style={styles.cardLabelDark}>Footprint Saved</Text>
            <Text style={styles.cardValueDark}>{footprint} kg</Text>
            <Text style={styles.cardHint}>This month</Text>
          </View>
        </View>

        {/* ---------------------------- */}
        {/* BADGES */}
        {/* ---------------------------- */}
        <Text style={styles.sectionTitle}>My Badges</Text>

        <View style={styles.badgeRow}>
          {["Eco Starter", "Daily Walker", "Top Reporter"].map((b) => (
            <View key={b} style={styles.badge}>
              <View style={styles.badgeIconBox}>
                <Text style={{ fontSize: 22 }}>🏅</Text>
              </View>
              <Text style={styles.badgeText}>{b}</Text>
            </View>
          ))}
        </View>

        {/* ---------------------------- */}
        {/* REPORTS */}
        {/* ---------------------------- */}
        <Text style={styles.sectionTitle}>Your Reports</Text>

        {reports.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No reports submitted yet.  
              Go to *Community* and raise your first report.
            </Text>
          </View>
        ) : (
          reports.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={styles.reportItem}
              onPress={() =>
                navigation.navigate("ReportDetails", { id: r.id })
              }
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.reportTitle}>{r.title}</Text>
                <Text style={styles.reportLocation}>{r.stationName}</Text>
              </View>

              <TouchableOpacity
                onPress={() => alert("Delete functionality coming soon")}
                style={styles.deleteBtn}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}

        {/* LOGOUT */}
        <TouchableOpacity
          style={{ marginTop: 35, alignItems: "center" }}
          onPress={logout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* --------------------------------------------- */
/* STYLES */
/* --------------------------------------------- */

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E6F4EE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.primary,
  },

  hello: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  subtext: { color: COLORS.muted, marginTop: 4 },

  statsRow: { flexDirection: "row", gap: 12, marginBottom: 10 },

  card: {
    flex: 1,
    padding: 16,
    borderRadius: RADIUS.lg,
    elevation: 3,
  },
  primaryCard: { backgroundColor: COLORS.primary },

  cardLabelLight: { color: "#DDF9EE" },
  cardValueLight: { fontSize: 32, fontWeight: "900", color: "#fff" },

  cardLabelDark: { color: COLORS.muted },
  cardValueDark: { fontSize: 32, fontWeight: "900", color: COLORS.text },
  cardHint: { color: COLORS.muted, marginTop: 6 },

  redeemBtn: {
    marginTop: 12,
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  sectionTitle: {
    fontWeight: "800",
    fontSize: 16,
    marginTop: 22,
    marginBottom: 10,
  },

  badgeRow: { flexDirection: "row", gap: 12 },
  badge: {
    width: 110,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  badgeIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF5E6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  badgeText: { textAlign: "center", fontWeight: "600" },

  emptyCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  emptyText: { color: COLORS.muted },

  reportItem: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  reportTitle: { fontWeight: "700", fontSize: 16 },
  reportLocation: { color: COLORS.muted, marginTop: 4 },

  deleteBtn: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  logoutText: { color: COLORS.danger, fontWeight: "700", fontSize: 16 },
});