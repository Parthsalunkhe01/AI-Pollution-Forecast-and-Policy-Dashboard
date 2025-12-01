// ReportIncidentScreen.js
import * as ImagePicker from 'expo-image-picker';
import { useContext, useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { ReportsContext } from '../context/ReportsContext';

export default function ReportIncidentScreen({ navigation }) {
  const { addReport } = useContext(ReportsContext);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // request permission (optional)
  async function requestPermissions() {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need permission to access your photos.');
        return false;
      }
    }
    return true;
  }

  async function pickImage() {
    const ok = await requestPermissions();
    if (!ok) return;

    // Do not allow cropping; keep default picker UI only
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      allowsEditing: false, // important — removes cropping UI
    });

    if (!result.canceled && result.assets && result.assets.length) {
      setImage(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    const ok = await requestPermissions();
    if (!ok) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets && result.assets.length) {
      setImage(result.assets[0].uri);
    }
  }

  function submit() {
    if (!title.trim()) return Alert.alert('Title required', 'Please add a title for the report.');
    setUploading(true);
    try {
      addReport({ title: title.trim(), description: desc.trim(), location: location.trim(), image });
      Alert.alert('Reported', 'Your incident was submitted');
      // clear form
      setTitle('');
      setDesc('');
      setLocation('');
      setImage(null);
      navigation.goBack();
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Failed to submit report');
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar
        onPressBell={() => Alert.alert('Notifications', 'No notifications')}
        onPressLocation={() => Alert.alert('Location', 'Location picker stub')}
      />

      <View style={{ padding: SPACING.md }}>
        <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 12 }}>Report an Incident</Text>

        <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
        <TextInput placeholder="Location (optional)" value={location} onChangeText={setLocation} style={styles.input} />
        <TextInput placeholder="Description" value={desc} onChangeText={setDesc} style={[styles.input, { height: 110 }]} multiline />

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
          <TouchableOpacity style={[styles.imgBtn]} onPress={pickImage}>
            <Text style={{ fontWeight: '700' }}>Choose Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.imgBtn]} onPress={takePhoto}>
            <Text style={{ fontWeight: '700' }}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        {image ? (
          <View style={{ marginTop: 12, alignItems: 'center' }}>
            <Image source={{ uri: image }} style={{ width: 220, height: 140, borderRadius: 8 }} />
          </View>
        ) : null}

        <TouchableOpacity onPress={submit} style={[styles.btn, { backgroundColor: COLORS.primary, marginTop: 16 }]} disabled={uploading}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>{uploading ? 'Submitting...' : 'Submit'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#fff', padding: 12, borderRadius: RADIUS.md, marginBottom: 12 },
  btn: { padding: 14, borderRadius: RADIUS.md, alignItems: 'center' },
  imgBtn: { backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 14, borderRadius: RADIUS.md, marginTop: 8 }
});
