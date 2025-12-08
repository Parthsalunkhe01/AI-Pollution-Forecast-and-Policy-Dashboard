// src/screens/SafeRoutesScreen.js

import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import HeaderBar from "../components/HeaderBar";
import { COLORS } from "../constants/theme";
import { GOOGLE_API_KEY } from "../config/google";
import { getSafeRoute } from "../services/routeService";

// ---------- RISK META ----------
function getRiskMeta(exposure) {
  if (exposure < 1500) return { label: "Low", color: "green" };
  if (exposure < 3500) return { label: "Moderate", color: "orange" };
  return { label: "High", color: "red" };
}

export default function SafeRoutesScreen({ navigation }) {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  const [showOriginList, setShowOriginList] = useState(true);
  const [showDestList, setShowDestList] = useState(true);

  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.209,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [routesData, setRoutesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const originRef = useRef(null);
  const destRef = useRef(null);

  // ---------- AUTO CURRENT LOCATION ----------
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      setOrigin({ lat: latitude, lng: longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.035,
        longitudeDelta: 0.035,
      });
    })();
  }, []);

  // ---------- SAFE ROUTE ----------
  const handleSafeRoute = async () => {
    if (!origin || !destination) {
      setError("Please select both Origin & Destination");
      return;
    }

    setLoading(true);
    setError(null);
    setRoutesData(null);

    try {
      const res = await getSafeRoute(origin, destination);
      if (!res || !res.success) {
        setError(res?.error || "Safe route unavailable");
      } else {
        setRoutesData(res);
        Keyboard.dismiss();
      }
    } catch (e) {
      setError("Server error");
    }

    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar />

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 20 }}
      >
        <Text style={styles.title}>Safe Route Suggestions</Text>

        {/* ---------- ORIGIN ---------- */}
        <Text style={styles.label}>Origin</Text>
        <View style={{ zIndex: 3000 }}>
          <GooglePlacesAutocomplete
            ref={originRef}
            placeholder="Search Origin"
            fetchDetails
            minLength={2}
            keyboardShouldPersistTaps="handled"
            disableScroll={true}
            onPress={(data, details = null) => {
              if (!details) return;
              const { lat, lng } = details.geometry.location;

              setOrigin({ lat, lng });
              // show selected address in input
              originRef.current?.setAddressText(data.description);

              setShowOriginList(false);
              setTimeout(() => originRef.current?.blur(), 80);

              setRegion({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.035,
                longitudeDelta: 0.035,
              });
            }}
            onChangeText={(text) => {
              // allow re-search after selection
              setShowOriginList(true);
              if (text === "") {
                setOrigin(null);
              }
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: "en",
              components: "country:in",
              location: "28.6139,77.2090",
              radius: 25000,
            }}
            styles={{
              ...autoStyles,
              listView: {
                ...autoStyles.listView,
                display: showOriginList ? "flex" : "none",
              },
            }}
            enablePoweredByContainer={false}
            debounce={150}
          />
        </View>

        {/* ---------- DESTINATION ---------- */}
        <Text style={styles.label}>Destination</Text>
        <View style={{ zIndex: 2000, marginBottom: 10 }}>
          <GooglePlacesAutocomplete
            ref={destRef}
            placeholder="Search Destination"
            fetchDetails
            minLength={2}
            keyboardShouldPersistTaps="handled"
            disableScroll={true}
            onPress={(data, details = null) => {
              if (!details) return;

              const { lat, lng } = details.geometry.location;
              setDestination({ lat, lng });
              destRef.current?.setAddressText(data.description);

              setShowDestList(false);
              setTimeout(() => destRef.current?.blur(), 80);
            }}
            onChangeText={(text) => {
              setShowDestList(true);
              if (text === "") {
                setDestination(null);
              }
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: "en",
              components: "country:in",
              location: "28.6139,77.2090",
              radius: 25000,
            }}
            styles={{
              ...autoStyles,
              listView: {
                ...autoStyles.listView,
                display: showDestList ? "flex" : "none",
              },
            }}
            enablePoweredByContainer={false}
            debounce={150}
          />
        </View>

        {/* ---------- MAP ---------- */}
        <MapView
          style={styles.map}
          region={region}
          onPress={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setDestination({ lat: latitude, lng: longitude });
          }}
        >
          {origin && (
            <Marker
              coordinate={{ latitude: origin.lat, longitude: origin.lng }}
              pinColor="green"
              title="Origin"
            />
          )}

          {destination && (
            <Marker
              coordinate={{
                latitude: destination.lat,
                longitude: destination.lng,
              }}
              pinColor="red"
              title="Destination"
            />
          )}

          {routesData?.bestRoute?.points && (
            <Polyline
              coordinates={routesData.bestRoute.points.map((p) => ({
                latitude: p.lat,
                longitude: p.lng,
              }))}
              strokeColor={getRiskMeta(routesData.bestRoute.aqiExposure).color}
              strokeWidth={5}
            />
          )}
        </MapView>

        {/* ---------- BUTTON ---------- */}
        <TouchableOpacity style={styles.button} onPress={handleSafeRoute}>
          <Text style={styles.buttonText}>Find Safe Route</Text>
        </TouchableOpacity>

        {/* ---------- RESULTS ---------- */}
        {loading && <ActivityIndicator size="large" color={COLORS.primary} />}
        {error && <Text style={styles.error}>{error}</Text>}

        {routesData && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.subtitle}>Best Route</Text>
            {renderRouteCard(routesData.bestRoute, navigation)}

            <Text style={styles.subtitle}>Alternatives</Text>
            {routesData.alternatives.map((r, i) =>
              renderRouteCard({ ...r, id: i }, navigation)
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ---------- CARD ----------
function renderRouteCard(route, navigation) {
  const riskMeta = getRiskMeta(route.aqiExposure);

  return (
    <TouchableOpacity
      key={route.id}
      style={styles.routeCard}
      onPress={() =>
        navigation.navigate("AQIDetails", {
          data: { aqi: route.avgAQI, location: route.summary },
        })
      }
    >
      <View>
        <Text style={styles.cardTitle}>{route.summary}</Text>
        <Text style={styles.cardText}>
          {(route.distanceMeters / 1000).toFixed(1)} km
        </Text>
        <Text style={[styles.cardText, { color: riskMeta.color }]}>
          AQI Exposure: {route.aqiExposure} ({riskMeta.label})
        </Text>
      </View>

      <Text style={styles.cardTime}>
        {Math.round(route.durationSeconds / 60)} min
      </Text>
    </TouchableOpacity>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", marginBottom: 5 },
  label: { marginTop: 14, fontSize: 14, fontWeight: "600" },

  map: {
    height: 260,
    width: "100%",
    marginTop: 15,
    borderRadius: 12,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    marginTop: 15,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  subtitle: { marginTop: 20, fontSize: 18, fontWeight: "700" },

  routeCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    elevation: 3,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardText: { fontSize: 14, marginTop: 2, color: "#555" },
  cardTime: { fontWeight: "700", fontSize: 16 },

  error: { textAlign: "center", color: "red", marginTop: 10 },
});

// ---------- AUTOCOMPLETE STYLES ----------
const autoStyles = {
  container: {
    flex: 0,
    position: "relative",
    zIndex: 9999,
  },
  textInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  listView: {
    position: "absolute",
    top: 50,
    width: "100%",
    maxHeight: 200,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 25,
    zIndex: 99999,
  },
  row: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  description: { fontSize: 14, color: "#444" },
};