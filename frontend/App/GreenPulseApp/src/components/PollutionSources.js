// src/components/PollutionSources.js

import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { COLORS } from "../constants/theme";

const screenWidth = Dimensions.get("window").width - 80; // fixed width within card

export default function PollutionSources({ sources }) {
  const [showInfo, setShowInfo] = useState(false);

  if (!sources) {
    return (
      <Text style={{ color: COLORS.muted, fontSize: 14, marginTop: 8 }}>
        Source breakdown will appear once live data is available.
      </Text>
    );
  }

  const data = [
    { name: "Traffic", value: sources.traffic, color: "#22c55e", legendFontColor: "#333" },
    { name: "Garbage", value: sources.garbage, color: "#16a34a", legendFontColor: "#333" },
    { name: "Dust", value: sources.dust, color: "#0ea5e9", legendFontColor: "#333" },
    { name: "Industry", value: sources.industry, color: "#6366f1", legendFontColor: "#333" },
    { name: "Stubble", value: sources.stubble, color: "#f97316", legendFontColor: "#333" },
  ];

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Source Contribution (Today)</Text>
          <Text style={styles.caption}>Estimated share of pollution sources.</Text>
        </View>

        <Pressable onPress={() => setShowInfo(true)}>
          <View style={styles.whyChip}>
            <Text style={styles.whyText}>Why?</Text>
          </View>
        </Pressable>
      </View>

      {/* PIE CHART */}
      <View style={{ alignItems: "center", marginTop: -10 }}>
        <PieChart
          data={data}
          width={screenWidth}
          height={210}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="12"
          center={[0, 0]}
          absolute
          hasLegend={true}
          chartConfig={{
            color: () => `#000`,
            labelColor: () => "#333",
          }}
          style={{ marginTop: 10 }}
        />
      </View>

      {/* BAR CHART */}
      <View style={{ marginTop: -20 }}>
        <BarChart
          data={{
            labels: ["Traffic", "Garbage", "Dust", "Industry", "Stubble"],
            datasets: [{ data: data.map((d) => d.value) }],
          }}
          width={screenWidth}
          height={240}
          fromZero
          showValuesOnTopOfBars
          withInnerLines={false}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            barPercentage: 0.6,
            color: (opacity) => `rgba(34,197,94, ${opacity})`,
            labelColor: () => "#333",
          }}
          style={{
            borderRadius: 14,
            alignSelf: "center",
          }}
        />
      </View>

      {/* INFO MODAL */}
      <Modal
        visible={showInfo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInfo(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>How is this calculated?</Text>

            <Text style={styles.modalText}>
              We use measured pollutants (PM2.5, PM10, NO₂, SO₂, CO), satellite fire
              data, wind patterns, and citizen reports to estimate daily pollutant
              contribution.
            </Text>

            <Pressable
              style={styles.modalButton}
              onPress={() => setShowInfo(false)}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
  },
  caption: {
    fontSize: 12,
    color: "#6B7280",
  },

  whyChip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  whyText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  modalText: {
    fontSize: 14,
    color: "#444",
    marginTop: 10,
    lineHeight: 20,
  },
  modalButton: {
    marginTop: 16,
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
  },
  modalButtonText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "700",
  },
});
