// src/screens/CommunityScreen.js
import { useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { ReportsContext } from '../context/ReportsContext';

export default function CommunityScreen({ navigation }) {
  const { reports } = useContext(ReportsContext);

  // sample local updates (hardcoded)
  const localUpdates = [
    { id: 'u1', title: 'Stubble burning reduced by 15% in Punjab', meta: '2h ago · Verified Source' },
    { id: 'u2', title: 'High smog alert for Anand Vihar tomorrow', meta: '4h ago · Verified Source' }
  ];

  // sample heroes (if you plan to use real data, replace this)
  const heroes = [
    { id: 1, name: 'Rahul K.', subtitle: 'Eco Warrior', pts: 1250 },
    { id: 2, name: 'Sneha M.', subtitle: 'Green Guardian', pts: 980 },
    { id: 3, name: 'Amit S.', subtitle: 'Planter', pts: 850 },
    { id: 4, name: 'Priya R.', subtitle: 'Cleaner', pts: 720 },
    { id: 5, name: 'Ravi D.', subtitle: 'Walker', pts: 640 }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar
        onPressBell={() => navigation.navigate('Notifications') /* or alert */}
        onPressLocation={() => navigation.navigate('SafeRoutes')}
      />

      <ScrollView contentContainerStyle={{ padding: SPACING.md, paddingBottom: 60 }}>
        <TouchableOpacity
          style={styles.reportBtn}
          onPress={() => navigation.navigate('ReportIncident')}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Report Incident</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Local Updates</Text>
        {localUpdates.map(u => (
          <View key={u.id} style={styles.card}>
            <Text style={{ fontWeight: '700' }}>{u.title}</Text>
            <Text style={{ color: COLORS.muted, marginTop: 6 }}>{u.meta}</Text>
          </View>
        ))}

        <Text style={[styles.heading, { marginTop: 8 }]}>Community Reports</Text>
        {reports.length === 0 && (
          <View style={[styles.card, { paddingVertical: 18 }]}>
            <Text style={{ color: COLORS.muted }}>No community reports yet — submit one using the button above.</Text>
          </View>
        )}
        {reports.map(r => (
          <TouchableOpacity
            key={r.id}
            style={[styles.reportCard]}
            onPress={() => navigation.navigate('ReportDetails', { id: r.id })}
            activeOpacity={0.85}
          >
            {/* thumbnail if image present */}
            <View style={styles.thumb}>
              {r.imageUri ? <Image source={{ uri: r.imageUri }} style={{ width: '100%', height: '100%', borderRadius: 8 }} /> : <Text style={{ color: COLORS.muted }}>IMG</Text>}
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontWeight: '700' }}>{r.title}</Text>
              <Text style={{ color: COLORS.muted, marginTop: 6 }}>{r.description}</Text>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
              <Text style={{ color: COLORS.muted, fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString()}</Text>
              <Text style={{ color: r.status === 'verified' ? COLORS.primary : COLORS.muted, marginTop: 6 }}>{r.status}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* AQI Heroes card (styled) */}
        <View style={[styles.heroesCard]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontWeight: '800', fontSize: 16 }}>AQI Heroes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AQIHeroes')} activeOpacity={0.8}>
              <Text style={{ color: COLORS.primary, fontWeight: '700' }}>View All</Text>
            </TouchableOpacity>
          </View>

          {heroes.slice(0, 5).map((h, i) => (
            <View key={h.id} style={styles.heroRow}>
              <View style={styles.rankCircle}><Text style={{ color: COLORS.primary, fontWeight: '700' }}>{i + 1}</Text></View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontWeight: '700' }}>{h.name}</Text>
                <Text style={{ color: COLORS.muted, marginTop: 4 }}>{h.subtitle}</Text>
              </View>
              <Text style={{ color: COLORS.primary, fontWeight: '800' }}>{h.pts} pts</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  reportBtn: { padding: 14, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, alignItems: 'center', marginBottom: 12 },
  heading: { fontSize: 18, fontWeight: '700', marginTop: 8, marginBottom: 8 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 10 },
  reportCard: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 64, height: 48, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  heroesCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginTop: 12 },
  heroRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  rankCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' }
});
