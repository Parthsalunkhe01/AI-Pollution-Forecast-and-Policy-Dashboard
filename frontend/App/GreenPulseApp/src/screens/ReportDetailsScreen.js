// src/screens/ReportDetailsScreen.js
import { useContext } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { ReportsContext } from '../context/ReportsContext';

export default function ReportDetailsScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { getReportById, deleteReport } = useContext(ReportsContext);

  const report = getReportById(id);

  if (!report) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
        <HeaderBar onPressBell={() => Alert.alert('No notifications yet')} onPressLocation={() => navigation.navigate('SafeRoutes')} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Report not found</Text>
        </View>
      </View>
    );
  }

  function onDelete() {
    Alert.alert('Delete report', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteReport(id);
          navigation.goBack();
        }
      }
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar onPressBell={() => Alert.alert('No notifications yet')} onPressLocation={() => navigation.navigate('SafeRoutes')} />
      <ScrollView contentContainerStyle={{ padding: SPACING.md }}>
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: RADIUS.md }}>
          <Text style={{ fontWeight: '800', fontSize: 18 }}>{report.title}</Text>
          <Text style={{ color: COLORS.muted, marginTop: 8 }}>{new Date(report.createdAt).toLocaleString()}</Text>

          {report.imageUri ? (
            <Image source={{ uri: report.imageUri }} style={{ width: '100%', height: 220, borderRadius: 12, marginTop: 12 }} />
          ) : null}

          <Text style={{ marginTop: 12 }}>{report.description}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Text style={{ color: COLORS.muted }}>{report.location || 'Unknown location'}</Text>
            <Text style={{ color: report.status === 'verified' ? COLORS.primary : COLORS.muted }}>{report.status}</Text>
          </View>

          <TouchableOpacity onPress={onDelete} style={{ marginTop: 16, backgroundColor: COLORS.danger, padding: 12, borderRadius: RADIUS.md, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
