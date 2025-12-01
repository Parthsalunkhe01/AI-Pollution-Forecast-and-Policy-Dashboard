// src/screens/ProfileScreen.js
import { useContext } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { AuthContext } from '../context/AuthContext';
import { ReportsContext } from '../context/ReportsContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const { reports } = useContext(ReportsContext);

  const credits = 175; // sample
  const steps = 5123;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar onPressBell={() => navigation.navigate('Notifications')} onPressLocation={() => navigation.navigate('SafeRoutes')} />

      <ScrollView contentContainerStyle={{ padding: SPACING.md, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>
              {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
            </Text>
          </View>

          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text style={styles.hello}>Hello, {user?.displayName ?? (user?.email ? user.email.split('@')[0] : 'Citizen')}!</Text>
            <Text style={{ color: COLORS.muted }}>Level 1 • Green Guardian</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={[styles.card, { backgroundColor: COLORS.primary }]}>
            <Text style={{ color: '#DDF9EE' }}>Green Credits</Text>
            <Text style={{ fontSize: 30, fontWeight: '900', color: '#fff', marginTop: 8 }}>{credits}</Text>
            <TouchableOpacity style={[styles.redeemBtn]} onPress={() => alert('Redeem')}>
              <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Redeem</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, { backgroundColor: '#fff' }]}>
            <Text style={{ color: COLORS.muted }}>Steps</Text>
            <Text style={{ fontSize: 36, fontWeight: '900', marginTop: 8 }}>{steps}</Text>
            <Text style={{ color: COLORS.muted, marginTop: 8 }}>Last sync: today</Text>
          </View>
        </View>

        <Text style={{ fontWeight: '700', marginTop: 18, marginBottom: 10 }}>My Badges</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {/* simple badge boxes with icon placeholder */}
          {['Early Bird', 'Walker', 'Reporter'].map((b, i) => (
            <View key={b} style={styles.badge}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF5E6', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <Text>🏅</Text>
              </View>
              <Text style={{ textAlign: 'center' }}>{b}</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontWeight: '700', marginTop: 18 }}>Reports Submitted</Text>
        {reports.length === 0 ? (
          <View style={[styles.emptyCard]}>
            <Text style={{ color: COLORS.muted }}>You have submitted reports — open Community to view them.</Text>
          </View>
        ) : (
          reports.map(r => (
            <TouchableOpacity key={r.id} style={[styles.reportItem]} onPress={() => navigation.navigate('ReportDetails', { id: r.id })}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700' }}>{r.title}</Text>
                <Text style={{ color: COLORS.muted }}>{r.location}</Text>
              </View>

              <TouchableOpacity onPress={() => alert('Long press on report to delete or open details')} style={{ backgroundColor: COLORS.danger, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity style={{ marginTop: 30, alignItems: 'center' }} onPress={() => logout()}>
          <Text style={{ color: COLORS.danger, fontWeight: '700' }}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 86, height: 86, borderRadius: 44, backgroundColor: '#E6F4EE', justifyContent: 'center', alignItems: 'center' },
  avatarInitials: { fontSize: 24, fontWeight: '800', color: COLORS.primary },
  hello: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  card: { flex: 1, padding: 14, borderRadius: RADIUS.md, minHeight: 120, justifyContent: 'space-between', marginRight: 8 },
  redeemBtn: { marginTop: 12, backgroundColor: '#fff', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  badge: { width: 110, backgroundColor: '#fff', padding: 10, borderRadius: 10, alignItems: 'center' },
  emptyCard: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginTop: 8 },
  reportItem: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginTop: 8, flexDirection: 'row', alignItems: 'center' }
});
