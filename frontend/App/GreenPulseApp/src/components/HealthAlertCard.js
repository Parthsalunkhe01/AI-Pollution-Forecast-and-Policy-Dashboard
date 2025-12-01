// src/components/HealthAlertCard.js
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RADIUS, SPACING } from '../constants/theme';

export default function HealthAlertCard({ onTips = ()=>{} }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Health Alert</Text>
      <Text style={styles.body}>High pollution — wear masks, avoid outdoor exercise in peak hours.</Text>

      <View style={{flexDirection:'row', marginTop: SPACING.md}}>
        <TouchableOpacity style={styles.ghostBtn} onPress={onTips} activeOpacity={0.8}>
          <Text style={{fontWeight:'700'}}>View Tips</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FF6950',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    shadowColor: '#FDECEA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    elevation: 2
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  body: { color: '#fff', opacity: 0.95 },
  ghostBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    marginRight: 12
  }
});
