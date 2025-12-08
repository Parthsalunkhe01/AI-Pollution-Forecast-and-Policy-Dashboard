// src/screens/AQIHeroesScreen.js
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderBar from "../components/HeaderBar";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { apiFetchHeroes } from "../services/community";

export default function AQIHeroesScreen({ navigation }) {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadHeroes() {
    setLoading(true);
    const list = await apiFetchHeroes();
    setHeroes(list);
    setLoading(false);
  }

  useEffect(() => {
    loadHeroes();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar
        onPressBell={() => navigation?.navigate?.("Notifications")}
        onPressLocation={() => navigation?.navigate?.("SafeRoutes")}
      />
      <View style={styles.wrapper}>
        <Text style={styles.title}>AQI Heroes</Text>
        <Text style={styles.sub}>Top contributors based on reports & activity</Text>

        {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

        {!loading && heroes.length === 0 && (
          <Text style={{ color: COLORS.muted, marginTop: 12 }}>
            No heroes yet — start reporting incidents to appear on this board.
          </Text>
        )}

        <FlatList
          data={heroes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40, marginTop: 10 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity activeOpacity={0.9} style={styles.card}>
              <View style={styles.rankWrap}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
              </View>

              <View style={styles.info}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarInitials}>
                      {(item.displayName || "User")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.name}>
                      {item.displayName || "User"}
                    </Text>
                    <Text style={styles.role}>
                      Reports: {item.reportsCount ?? 0}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.pointsWrap}>
                <Text style={styles.points}>{item.points} pts</Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: SPACING.md, paddingTop: SPACING.md, flex: 1 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  sub: { color: COLORS.muted, marginBottom: 8 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: RADIUS.md,
    shadowColor: COLORS.shadow,
    elevation: 2,
  },

  rankWrap: { width: 36, alignItems: "center", marginRight: 6 },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F7F5",
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: { fontWeight: "700", color: "#4B5563" },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 24,
    backgroundColor: "#EEF7F0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: { fontWeight: "800", color: COLORS.primary },

  info: { flex: 1, paddingHorizontal: 8 },
  name: { fontWeight: "800", fontSize: 16 },
  role: { color: COLORS.muted, marginTop: 4 },

  pointsWrap: { minWidth: 80, alignItems: "flex-end" },
  points: { fontWeight: "800", color: COLORS.primary },
});