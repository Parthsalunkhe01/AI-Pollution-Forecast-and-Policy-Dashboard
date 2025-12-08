// -------------------------------------------------------------
// CommunityScreen.js — PREMIUM SIH 2025 UI VERSION (FULL FIX)
// -------------------------------------------------------------
import { useContext, useEffect, useState, useRef } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import HeaderBar from "../components/HeaderBar";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { ReportsContext } from "../context/ReportsContext";
import {
  apiFetchLocalUpdates,
  apiFetchHeroes,
} from "../services/community";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// -------------------------------------------------------------
// MAIN SCREEN
// -------------------------------------------------------------
export default function CommunityScreen({ navigation }) {
  const { reports, loadReports, loading } = useContext(ReportsContext);

  const [localUpdates, setLocalUpdates] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [pressedReportId, setPressedReportId] = useState(null);

  // Animations
  const fadeIn = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadReports();
    loadCommunityData();

    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 550,
      useNativeDriver: true,
    }).start();
  }, []);

  async function loadCommunityData() {
    const updates = await apiFetchLocalUpdates();
    const heroList = await apiFetchHeroes();
    setLocalUpdates(updates || []);
    setHeroes(heroList || []);
  }

  // -------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar
        onPressBell={() => navigation.navigate("Notifications")}
        onPressLocation={() => navigation.navigate("SafeRoutes")}
      />

      <Animated.ScrollView
        contentContainerStyle={{ padding: SPACING.md, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeIn }}
      >

        {/* ----------------------------------------------------- */}
        {/* REPORT CTA BUTTON */}
        {/* ----------------------------------------------------- */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("ReportIncident")}
          style={styles.reportBtnWrapper}
        >
          <LinearGradient
            colors={["#22c55e", "#15803d"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.reportBtn}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="alert-circle-outline" size={20} color="#ECFDF5" />
              <Text style={styles.reportBtnText}>
                Report Air Pollution Spot
              </Text>
            </View>

            <Text style={styles.reportBtnSub}>
              Photo / Video / Audio • Verified reports award AQI Points
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* ----------------------------------------------------- */}
        {/* LIVE LOCAL UPDATES */}
        {/* ----------------------------------------------------- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Live Local Updates</Text>

          <View style={styles.smallPill}>
            <Ionicons name="cloud-outline" size={14} color="#0f766e" />
            <Text style={styles.smallPillText}>AI + Community</Text>
          </View>
        </View>

        {localUpdates.length === 0 ? (
          <View style={styles.placeholderCard}>
            <Ionicons name="cloud-outline" size={20} color={COLORS.muted} />
            <Text style={styles.placeholderText}>
              No alerts yet — real-time warnings will appear here.
            </Text>
          </View>
        ) : (
          <>
            <Animated.ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              decelerationRate="fast"
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              style={{ marginTop: 12 }}
            >
              {localUpdates.map((u, i) => (
                <LinearGradient
                  key={i}
                  colors={["#020617", "#0f172a"]}
                  style={styles.reelCard}
                >
                  <View style={styles.reelHeader}>
                    <Ionicons
                      name="megaphone-outline"
                      size={20}
                      color="#93c5fd"
                    />
                    <Text style={styles.reelTitle}>{u.title}</Text>
                  </View>

                  {u.meta && (
                    <Text style={styles.reelMeta} numberOfLines={3}>
                      {u.meta}
                    </Text>
                  )}

                  <View style={styles.badgeRow}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>
                        {(u.category || "info").toUpperCase()}
                      </Text>
                    </View>
                    {u.isAuto && <Text style={styles.autoChip}>AI Auto</Text>}
                  </View>
                </LinearGradient>
              ))}
            </Animated.ScrollView>

            {/* Pagination dots */}
            <View style={styles.dotContainer}>
              {localUpdates.map((_, i) => {
                const input = [
                  (i - 1) * SCREEN_WIDTH * 0.9,
                  i * SCREEN_WIDTH * 0.9,
                  (i + 1) * SCREEN_WIDTH * 0.9,
                ];
                const opacity = scrollX.interpolate({
                  inputRange: input,
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: "clamp",
                });

                return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
              })}
            </View>
          </>
        )}

        {/* ----------------------------------------------------- */}
        {/* COMMUNITY REPORTS */}
        {/* ----------------------------------------------------- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Community Reports</Text>
          <View style={styles.smallPillMuted}>
            <Ionicons name="people-outline" size={14} color="#374151" />
            <Text style={styles.smallPillMutedText}>{reports.length} total</Text>
          </View>
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>Loading reports...</Text>
          </View>
        )}

        {!loading && reports.length === 0 && (
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>
              No reports yet — be the first to submit!
            </Text>
          </View>
        )}

        {/* LIST OF REPORTS */}
        {!loading &&
          reports.map((r) => {
            // FIX: The backend stores fileUrl → so FE should use r.imageUrl
            const imageUrl = r.imageUrl
              ? `http://10.10.53.16:3000${r.imageUrl}`
              : null;

            return (
              <TouchableOpacity
                key={r.id}
                activeOpacity={0.92}
                onPressIn={() => setPressedReportId(r.id)}
                onPressOut={() => setPressedReportId(null)}
                onPress={() =>
                  navigation.navigate("ReportDetails", { id: r.id })
                }
                style={[
                  styles.reportCard,
                  pressedReportId === r.id && { transform: [{ scale: 0.97 }] },
                ]}
              >
                {/* Thumbnail */}
                <View style={styles.thumbnail}>
                  {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.thumbnailImg} />
                  ) : (
                    <Ionicons
                      name="image-outline"
                      size={22}
                      color={COLORS.muted}
                    />
                  )}
                </View>

                {/* Info */}
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.reportTitle}>{r.title}</Text>
                  <Text numberOfLines={2} style={styles.reportDescription}>
                    {r.description}
                  </Text>

                  <View style={styles.reportMetaRow}>
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color={COLORS.muted}
                    />
                    <Text style={styles.reportMeta}>
                      {r.stationName || "Unknown location"}
                    </Text>
                  </View>
                </View>

                {/* Status */}
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.dateText}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </Text>
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          r.status === "verified"
                            ? COLORS.primary
                            : COLORS.muted,
                      },
                    ]}
                  >
                    {r.status}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

        {/* ----------------------------------------------------- */}
        {/* AQI HEROES */}
        {/* ----------------------------------------------------- */}
        <View style={styles.leaderboard}>
          <View style={styles.leaderboardHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="trophy-outline" size={18} color="#f97316" />
              <Text style={[styles.sectionTitle, { marginLeft: 6 }]}>
                AQI Heroes
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("AQIHeroes")}
            >
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {heroes.length === 0 && (
            <Text style={styles.placeholderText}>
              Submit verified reports to appear on leaderboard.
            </Text>
          )}

          {heroes.map((h, i) => (
            <View key={h.id} style={styles.heroRow}>
              <View
                style={[
                  styles.rankCircle,
                  i === 0 && { backgroundColor: "#fef3c7" },
                  i === 1 && { backgroundColor: "#e0f2fe" },
                  i === 2 && { backgroundColor: "#dcfce7" },
                ]}
              >
                <Text style={styles.rankText}>{i + 1}</Text>
              </View>

              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.heroName}>{h.displayName || "User"}</Text>
                <Text style={styles.heroMeta}>Reports: {h.reportsCount}</Text>
              </View>

              <Text style={styles.pointsText}>{h.points} pts</Text>
            </View>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// -------------------------------------------------------------
// STYLES (IMPROVED)
// -------------------------------------------------------------
const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  reportBtnWrapper: { marginTop: 10 },
  reportBtn: {
    borderRadius: 22,
    padding: 16,
  },
  reportBtnText: {
    color: "#ECFDF5",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 8,
  },
  reportBtnSub: {
    color: "#bbf7d0",
    fontSize: 12,
    marginTop: 6,
  },

  placeholderCard: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 18,
    marginTop: 14,
    alignItems: "center",
  },
  placeholderText: {
    color: COLORS.muted,
    marginTop: 6,
    fontSize: 13,
    textAlign: "center",
  },

  smallPill: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#ccfbf1",
    borderRadius: 999,
    alignItems: "center",
  },
  smallPillText: {
    fontSize: 11,
    marginLeft: 4,
    fontWeight: "700",
    color: "#0f766e",
  },

  smallPillMuted: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    alignItems: "center",
  },
  smallPillMutedText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4b5563",
    marginLeft: 4,
  },

  // REEL CARDS
  reelCard: {
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 24,
    padding: 18,
    marginRight: 14,
  },
  reelHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  reelTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 6,
  },
  reelMeta: {
    color: "#cbd5f5",
    marginTop: 12,
    fontSize: 13,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#e0f2fe",
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0369a1",
  },
  autoChip: {
    fontSize: 11,
    color: "#6EE7B7",
    fontWeight: "700",
  },

  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: "#9ca3af",
  },

  // REPORT CARDS
  reportCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginTop: 12,
    elevation: 2,
  },
  thumbnail: {
    width: 68,
    height: 50,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailImg: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  reportDescription: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
  reportMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  reportMeta: {
    fontSize: 11,
    color: COLORS.muted,
    marginLeft: 4,
  },

  dateText: {
    fontSize: 11,
    color: COLORS.muted,
  },
  statusText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
  },

  // HEROES
  leaderboard: {
    backgroundColor: "#fff",
    marginTop: 24,
    padding: 18,
    borderRadius: 20,
  },
  leaderboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    alignItems: "center",
  },
  viewAll: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },
  heroRow: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
  },
  rankCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontWeight: "800",
    color: COLORS.primary,
  },
  heroName: {
    fontWeight: "700",
    fontSize: 15,
  },
  heroMeta: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
},
});