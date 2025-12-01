// src/components/PollutionSources.js
import { StyleSheet, Text, View } from 'react-native';
import { RADIUS, SPACING } from '../constants/theme';

export default function PollutionSources({ data }) {
  const sources = data ?? [
    { name: 'Traffic', value: 35, color: '#EF4444' },
    { name: 'Stubble', value: 25, color: '#F59E0B' },
    { name: 'Industry', value: 20, color: '#6366F1' },
    { name: 'Dust', value: 15, color: '#10B981' },
    { name: 'Others', value: 5, color: '#9CA3AF' },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Pollution Sources (Real-time)</Text>
      <View style={styles.row}>
        <View style={styles.donutPlaceholder}><Text style={styles.donutText}>Sources</Text></View>
        <View style={{flex:1, paddingLeft:12}}>
          {sources.map(s => (
            <View key={s.name} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: s.color }]} />
              <Text style={styles.legendLabel}>{s.name}</Text>
              <Text style={styles.legendValue}>{s.value}%</Text>
            </View>
          ))}
          <Text style={styles.note}>Sources breakdown shown on the left. Connect to real API for live data.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor:'#fff', padding: SPACING.md, borderRadius: RADIUS.md, marginTop: SPACING.md },
  title: { fontWeight:'700', fontSize:16, marginBottom:12 },
  row: { flexDirection:'row', alignItems:'center' },
  donutPlaceholder: { width:96, height:96, borderRadius:48, backgroundColor:'#F3F7F5', alignItems:'center', justifyContent:'center' },
  donutText: { color:'#94A3B8', fontWeight:'700' },
  legendRow: { flexDirection:'row', alignItems:'center', marginBottom:10 },
  dot: { width:12, height:12, borderRadius:6, marginRight:8 },
  legendLabel: { flex:1, color:'#374151' },
  legendValue: { fontWeight:'700' },
  note: { color:'#9CA3AF', marginTop:8 }
});
