import React, { useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { COLORS, SPACING, RADIUS } from "../constants/theme";

export default function AdminDashboardScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>Manage reports & policies</Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutPill} onPress={logout}>
            <Ionicons name="log-out-outline" size={16} color="#b91c1c" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* GREETING BANNER */}
        <View style={styles.banner}>
          <View>
            <Text style={styles.bannerTitle}>Welcome, Admin 👋</Text>
            <Text style={styles.bannerText}>
              Review reports and maintain city air safety.
            </Text>
          </View>

          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={26} color="#22c55e" />
          </View>
        </View>

        {/* ACTION CARDS */}
        <View style={{ marginTop: 28 }}>

          <ActionCard
            icon="document-text-outline"
            label="Policies"
            desc="Create & manage pollution related policies."
            onPress={() => navigation.navigate("AdminPolicies")}
          />

          <ActionCard
            icon="clipboard-outline"
            label="Verify Reports"
            desc="Approve or reject pending user reports."
            onPress={() => navigation.navigate("AdminVerifyReports")}
          />

          <ActionCard
            icon="checkmark-done-circle-outline"
            label="Verified Reports"
            desc="View all reports already approved."
            onPress={() => navigation.navigate("AdminVerifiedReports")}
          />

        </View>
      </View>
    </SafeAreaView>
  );
}

/* --------- Small Card Component --------- */

function ActionCard({ icon, label, desc, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.cardIconBox}>
        <Ionicons name={icon} size={22} color="#fff" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{label}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
    </TouchableOpacity>
  );
}

/* -------------- Styles -------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: 18,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 4,
    color: COLORS.muted,
    fontSize: 12,
  },

  logoutPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  logoutText: {
    marginLeft: 4,
    color: "#b91c1c",
    fontWeight: "700",
    fontSize: 12,
  },

  banner: {
    marginTop: 20,
    backgroundColor: "#e0f2fe",
    borderRadius: RADIUS.lg,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  bannerText: {
    marginTop: 4,
    fontSize: 12,
    color: "#1e293b",
    width: "90%",
  },
  badge: {
    marginLeft: "auto",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  cardDesc: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop:3,
},
});