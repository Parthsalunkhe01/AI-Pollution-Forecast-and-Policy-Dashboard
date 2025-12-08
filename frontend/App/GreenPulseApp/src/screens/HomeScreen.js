AQIWidget // src/screens/HomeScreen.js

import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";

import HeaderBar from "../components/HeaderBar";
import AQICircle from "../components/AQICircle";
import AQIWidget from "../components/AQIWidget";
import HealthAlertCard from "../components/HealthAlertCard";
import PollutionSources from "../components/PollutionSources";

import RNPickerSelect from "react-native-picker-select";

import { COLORS } from "../constants/theme";
import { AuthContext } from "../context/AuthContext";
import { fetchStations, fetchStationForecast } from "../services/api";

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  const [aqi, setAqi] = useState(0);
  const [fc24, setFc24] = useState(0);
  const [fc48, setFc48] = useState(0);
  const [fc72, setFc72] = useState(0);

  const [health, setHealth] = useState(null);
  const [sources, setSources] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStations();
  }, []);

  async function loadStations() {
    try {
      const res = await fetchStations();
      setStations(res.map((s) => ({ label: s.name, value: s.name })));
    } catch (err) {
      console.log("Station load error:", err.message);
    }
  }

  async function handleSelectStation(stationName) {
    if (!stationName) return;

    setSelectedStation(stationName);
    setLoading(true);

    try {
      const res = await fetchStationForecast(stationName);
      console.log("FORECAST API RESPONSE:", res);

      if (res?.success) {
        const rt = res.realtime || {};

        // Robust AQI picking – handles different field names safely
        const realtimeAqi =
          rt.aqi ??
          rt.aqi_value ??
          rt.current_aqi ??
          rt.value ??
          0;

        setAqi(Number(realtimeAqi) || 0);
        setFc24(res.forecast?.["24h"] ?? 0);
        setFc48(res.forecast?.["48h"] ?? 0);
        setFc72(res.forecast?.["72h"] ?? 0);

        setHealth(res.health || null);
        setSources(res.sources || null);
      }
    } catch (err) {
      console.log("Forecast API error:", err.message);
    }

    setLoading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO SECTION */}
        <View style={styles.heroCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroHello}>
              Hello, {user?.displayName ?? "User"} 👋
            </Text>
            <Text style={styles.heroSubtitle}>
              Track Delhi’s pollution in real time and plan your day smarter.
            </Text>
          </View>

          <View style={styles.heroGraphic}>
            <Text style={{ fontSize: 26 }}>🌫</Text>
            <Text style={styles.heroGraphicText}>AQI{"\n"}Guardian</Text>
          </View>
        </View>

        {/* STATION PICKER */}
        <View style={{ marginTop: 18 }}>
          <Text style={styles.label}>AQI Monitoring Station</Text>
          <View style={styles.selectorWrapper}>
            <RNPickerSelect
              onValueChange={handleSelectStation}
              items={stations}
              placeholder={{ label: "Choose station...", value: null }}
              style={pickerStyles}
            />
          </View>
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 30 }}
          />
        )}

        {/* MAIN BLOCKS */}
        {!loading && selectedStation && (
          <>
            {/* AQI CIRCLE */}
            <View style={styles.centerWrapper}>
              <AQICircle aqi={aqi} size={220} />
            </View>

            {/* SUMMARY WIDGET */}
            <View style={styles.cardShadow}>
              <AQIWidget aqi={aqi} location={selectedStation} />
            </View>

            {/* HEALTH ADVISORY */}
            <Text style={styles.sectionTitle}>Health Advisory</Text>
            <View style={styles.cardShadow}>
              <HealthAlertCard aqi={aqi} health={health} />
            </View>

            {/* FORECAST */}
            <Text style={styles.sectionTitle}>AI Forecast</Text>
            <View style={styles.forecastRow}>
              <View style={[styles.forecastBox, styles.forecastBoxLeft]}>
                <Text style={styles.fTitle}>Next 24h</Text>
                <Text style={styles.fValue}>{Math.round(Number(fc24) || 0)}</Text>
              </View>
              <View style={styles.forecastBox}>
                <Text style={styles.fTitle}>Next 48h</Text>
                <Text style={styles.fValue}>{Math.round(Number(fc48) || 0)}</Text>
              </View>
              <View style={[styles.forecastBox, styles.forecastBoxRight]}>
                <Text style={styles.fTitle}>Next 72h</Text>
                <Text style={styles.fValue}>{Math.round(Number(fc72) || 0)}</Text>
              </View>
            </View>

            {/* POLLUTION BREAKDOWN */}
            <Text style={styles.sectionTitle}>Pollution Breakdown</Text>
            <View style={styles.cardShadow}>
              <PollutionSources sources={sources} />
            </View>

            <View style={{ height: 110 }} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#E6F6F1",
    marginTop: 6,
  },
  heroHello: {
    fontSize: 22,
    fontWeight: "800",
    color: "#064E3B",
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#047857",
  },
  heroGraphic: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: "#ECFEFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  heroGraphicText: {
    textAlign: "center",
    fontSize: 10,
    marginTop: 2,
    color: "#0F766E",
    fontWeight: "700",
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },

  selectorWrapper: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 6 : 2,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 22,
    marginBottom: 10,
  },

  centerWrapper: {
    alignItems: "center",
    marginTop: 18,
    marginBottom: 6,
  },

  cardShadow: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 10,
  },

  forecastRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  forecastBox: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  forecastBoxLeft: {
    marginLeft: 0,
  },
  forecastBoxRight: {
    marginRight: 0,
  },
  fTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
    marginBottom: 4,
  },
  fValue: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primary,
  },
});

const pickerStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical:12,
},
};