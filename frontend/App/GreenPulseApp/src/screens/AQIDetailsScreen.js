import { ScrollView, Text, View } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

export default function AQIDetailsScreen({ route }) {
  const data = route?.params?.data ?? { aqi: 45, location: "Unknown" };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={{ padding: SPACING.md }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>AQI Details</Text>

        <View
          style={{
            marginTop: 12,
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: COLORS.muted }}>Location</Text>

          {/* FIXED: Prevent long wrapping */}
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontWeight: "700",
              marginTop: 6,
              fontSize: 16,
              lineHeight: 20,
              maxWidth: "100%",
            }}
          >
            {data.location}
          </Text>

          <Text style={{ color: COLORS.muted, marginTop: 12 }}>AQI</Text>
          <Text
            style={{
              fontSize: 40,
              fontWeight: "800",
              color: COLORS.primary,
            }}
          >
            {data.aqi}
          </Text>

          <Text style={{ marginTop: 10, color: COLORS.muted }}>
            This is the latest air quality reading. Values above 200 indicate
            poor conditions; above 300 are hazardous.
          </Text>
        </View>
      </View>
    </ScrollView>
);
}