// src/components/AQIWidget.js
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export default function AQIWidget({ data = {}, onPress = () => {} }) {
  const aqi = data?.aqi ?? 45;
  const location = data?.location ?? 'Unknown';
  const category = aqi <= 50 ? 'Good' : aqi <= 100 ? 'Moderate' : aqi <= 200 ? 'Unhealthy' : 'Hazardous';

  const getPillColor = () => {
    if (aqi <= 50) return COLORS.success;
    if (aqi <= 100) return COLORS.warning;
    if (aqi <= 200) return '#F97316';
    return COLORS.danger;
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.95} onPress={onPress}>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Current AQI</Text>
          <Text style={[styles.aqi, { color: getPillColor() }]}>{aqi}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.smallLabel}>Location</Text>
          <Text style={styles.locationText}>{location}</Text>
          <View style={[styles.pill, { backgroundColor: getPillColor() + '22' }]}>
            <Text style={[styles.pillText, { color: getPillColor() }]}>{category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    shadowColor: COLORS.shadow,
    elevation: 3,
    marginVertical: SPACING.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: '#94A3B8', fontSize: 12 },
  aqi: { fontSize: 36, fontWeight: '800' },
  smallLabel: { color: '#94A3B8', fontSize: 12 },
  locationText: { color: COLORS.text, fontWeight: '700', marginTop: 4 },
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, marginTop: 6 },
  pillText: { fontWeight: '700', fontSize: 12 },
});
