// ----------------------------------------------------------
// ReportIncidentScreen.js (Expo ImagePicker v17 100% FIXED)
// ----------------------------------------------------------

import React, { useContext, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import HeaderBar from "../components/HeaderBar";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { AuthContext } from "../context/AuthContext";
import { ReportsContext } from "../context/ReportsContext";

const API_BASE_URL = "http://10.10.53.16:3000";

export default function ReportIncidentScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const { loadReports } = useContext(ReportsContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stationName, setStationName] = useState("");
  const [city, setCity] = useState("Delhi");
  const [media, setMedia] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ----------------------------------------------------------
  // FIXED GALLERY PICKER — NO ENUMS (Expo v17 stable)
  // ----------------------------------------------------------
  async function pickFromGallery() {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Permission denied", "Gallery permission is required.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      setMedia({
        uri: asset.uri,
        mime: asset.mimeType ?? "image/jpeg",
        type: asset.mimeType?.includes("video") ? "video" : "image",
      });
    } catch (err) {
      console.log("Gallery error:", err);
    }
  }

  // ----------------------------------------------------------
  // FIXED CAMERA PICKER — NO ENUMS (Expo v17 stable)
  // ----------------------------------------------------------
  async function openCamera() {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Permission denied", "Camera permission is required.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      setMedia({
        uri: asset.uri,
        mime: asset.mimeType ?? "image/jpeg",
        type: asset.mimeType?.includes("video") ? "video" : "image",
      });
    } catch (err) {
      console.log("Camera error:", err);
    }
  }

  // ----------------------------------------------------------
  // SUBMIT REPORT — TEXT + MEDIA UPLOAD
  // ----------------------------------------------------------
  async function handleSubmit() {
    if (!title.trim()) return Alert.alert("Missing title", "Enter a title.");
    if (!description.trim() && !media)
      return Alert.alert("Add details", "Add description or media.");

    try {
      setSubmitting(true);

      // ⿡ Create the report entry
      const reportRes = await axios.post(
        `${API_BASE_URL}/api/reports`,
        { title, description, stationName, city },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reportId = reportRes.data.id;

      // ⿢ Upload media
      if (media) {
        const formData = new FormData();

        formData.append("file", {
          uri: media.uri,
          name: media.type === "video" ? "report.mp4" : "report.jpg",
          type: media.mime,
        });

        formData.append("reportId", String(reportId));

        await axios.post(`${API_BASE_URL}/api/media/report`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      await loadReports?.();
      Alert.alert("Success!", "Your report was submitted.");

      navigation.goBack();
    } catch (err) {
      console.log("Submit error:", err.response?.data || err.message);
      Alert.alert("Error", "Could not submit the report.");
    } finally {
      setSubmitting(false);
    }
  }

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.heading}>Report Air Pollution Incident</Text>

          {/* TITLE */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Garbage burning near roadside"
            style={styles.input}
          />

          {/* DESCRIPTION */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what you saw..."
            style={[styles.input, styles.multiline]}
            multiline
          />

          {/* LOCATION */}
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text style={styles.label}>City</Text>
              <TextInput value={city} onChangeText={setCity} style={styles.input} />
            </View>

            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.label}>Nearby Station</Text>
              <TextInput
                value={stationName}
                onChangeText={setStationName}
                style={styles.input}
              />
            </View>
          </View>

          {/* MEDIA BUTTONS */}
          <View style={styles.mediaRow}>
            <TouchableOpacity style={styles.mediaBtn} onPress={openCamera}>
              <Ionicons name="camera-outline" size={18} color="#047857" />
              <Text style={styles.mediaText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mediaBtn} onPress={pickFromGallery}>
              <Ionicons name="image-outline" size={18} color="#0369a1" />
              <Text style={styles.mediaText}>Gallery</Text>
            </TouchableOpacity>
          </View>

          {/* MEDIA PREVIEW */}
          {media && (
            <View style={styles.previewBox}>
              {media.type === "image" ? (
                <Image source={{ uri: media.uri }} style={styles.previewImage} />
              ) : (
                <View style={styles.videoBox}>
                  <Ionicons name="play-circle-outline" size={40} color="#fff" />
                  <Text style={{ color: "white", marginTop: 6 }}>Video attached</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => setMedia(null)}
              >
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}

          {/* SUBMIT */}
          <TouchableOpacity
            style={[styles.submitBtn, submitting && { opacity: 0.5 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="send-outline" size={18} color="#fff" />
                <Text style={styles.submitText}>Submit Report</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ----------------------------------------------------------
// STYLES
// ----------------------------------------------------------
const styles = StyleSheet.create({
  scrollContent: { padding: 20 },
  heading: { fontSize: 20, fontWeight: "800", marginVertical: 10 },
  label: { fontWeight: "700", marginTop: 12 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  multiline: { minHeight: 90, textAlignVertical: "top" },
  row: { flexDirection: "row", marginTop: 12 },

  mediaRow: { flexDirection: "row", marginTop: 16 },
  mediaBtn: {
    flex: 1,
    backgroundColor: "#ECFEFF",
    padding: 10,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  mediaText: { marginLeft: 6, fontWeight: "700", color: "#0f766e" },

  previewBox: {
    backgroundColor: "#000",
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 220,
  },
  videoBox: { height: 220, justifyContent: "center", alignItems: "center" },
  removeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 999,
  },

  submitBtn: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 999,
    flexDirection: "row",
    justifyContent: "center",
  },
  submitText: { color: "#fff", marginLeft: 6, fontWeight: "800" },
});