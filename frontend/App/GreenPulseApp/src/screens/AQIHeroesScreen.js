// src/screens/AQIHeroesScreen.js
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

const SAMPLE = [
  { id: '1', name: 'Rahul K.', title: 'Eco Warrior', pts: 1250 },
  { id: '2', name: 'Sneha M.', title: 'Green Guardian', pts: 980 },
  { id: '3', name: 'Amit S.', title: 'Planter', pts: 850 },
  { id: '4', name: 'Priya R.', title: 'Cleaner', pts: 720 },
  { id: '5', name: 'Nikhil P.', title: 'Walker', pts: 610 },
];

export default function AQIHeroesScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar />
      <View style={styles.wrapper}>
        <Text style={styles.title}>AQI Heroes</Text>
        <Text style={styles.sub}>Top contributors this month</Text>

        <FlatList
          data={SAMPLE}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity activeOpacity={0.9} style={styles.card}>
              <View style={styles.rankWrap}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
              </View>

              <View style={styles.info}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarInitials}>{item.name.split(' ').map(n => n[0]).join('').slice(0,2)}</Text>
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.role}>{item.title}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.pointsWrap}>
                <Text style={styles.points}>{item.pts} pts</Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: SPACING.md, paddingTop: SPACING.md },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  sub: { color: COLORS.muted, marginBottom: 16 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: RADIUS.md,
    shadowColor: COLORS.shadow,
    elevation: 2
  },

  rankWrap: { width: 36, alignItems: 'center', marginRight: 6 },
  rankBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F7F5', alignItems: 'center', justifyContent: 'center' },
  rankText: { fontWeight: '700', color: '#4B5563' },

  avatar: { width: 46, height: 46, borderRadius: 24, backgroundColor: '#EEF7F0', alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { fontWeight: '800', color: COLORS.primary },

  info: { flex: 1, paddingHorizontal: 8 },
  name: { fontWeight: '800', fontSize: 16 },
  role: { color: COLORS.muted, marginTop: 4 },

  pointsWrap: { minWidth: 80, alignItems: 'flex-end' },
  points: { fontWeight: '800', color: COLORS.primary }
});
