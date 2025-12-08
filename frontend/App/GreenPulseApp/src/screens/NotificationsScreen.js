// src/screens/NotificationsScreen.js
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export default function NotificationsScreen({ navigation }) {
  // placeholder notifications list
  const items = [
    { id: '1', title: 'Air quality alert', time: '2h ago' },
    { id: '2', title: 'Report approved', time: '4h ago' },
  ];

  return (
    <View style={styles.container}>
      {/* HeaderBar is already used across screens; pass handlers */}
      <HeaderBar
        onPressBell={() => navigation.navigate('Notifications')}
        onPressLocation={() => navigation.navigate('SafeRoutes')}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Notifications</Text>

        {items.map(it => (
          <View key={it.id} style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{it.title}</Text>
              <Text style={styles.cardTime}>{it.time}</Text>
            </View>
            <TouchableOpacity style={styles.viewBtn} onPress={() => alert('Open notification')}>
              <Text style={{ color: COLORS.primary, fontWeight: '700' }}>View</Text>
            </TouchableOpacity>
          </View>
        ))}

        {items.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ color: COLORS.muted }}>No notifications</Text>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: SPACING.md, paddingTop: 8, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: SPACING.md },
  card: {
    backgroundColor: '#fff',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cardTitle: { fontWeight: '700' },
  cardTime: { color: COLORS.muted, marginTop: 6 },
  viewBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  empty: { padding: SPACING.md, alignItems:'center'},
});