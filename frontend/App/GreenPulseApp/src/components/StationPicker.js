import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, FlatList } from "react-native";
import { API_BASE } from "../config/api";

export default function StationPicker({ selected, onSelect }) {
  const [stations, setStations] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/stations`)
      .then((r) => r.json())
      .then((d) => setStations(d.stations));
  }, []);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          padding: 10,
          backgroundColor: "white",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#ddd",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          {selected?.name || "Select AQI Station"}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide">
        <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
            Choose Monitoring Station
          </Text>

          {stations.length === 0 ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={stations}
              keyExtractor={(i) => i.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 15,
                    borderBottomWidth: 1,
                    borderColor: "#eee",
                  }}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: "#666" }}>AQI: {item.aqi}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>
    </>
  );
}
