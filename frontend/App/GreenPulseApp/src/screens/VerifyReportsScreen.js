// src/screens/VerifyReportsScreen.js
import { useContext } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { ReportsContext } from '../context/ReportsContext';

export default function VerifyReportsScreen() {
  const { reports, verifyReport } = useContext(ReportsContext);

  function onVerify(id) {
    verifyReport(id);
    Alert.alert('Verified', 'Report marked as verified');
  }

  return (
    <ScrollView style={{flex:1, backgroundColor:COLORS.bg, padding: SPACING.md}}>
      <Text style={{fontWeight:'700', fontSize:18}}>Verify Reports</Text>
      {reports.length === 0 && <Text style={{marginTop:12}}>No reports yet.</Text>}

      {reports.map(r => (
        <View key={r.id} style={styles.card}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{fontWeight:'700'}}>{r.title}</Text>
            <Text style={{color: r.status === 'verified' ? 'green' : COLORS.muted}}>{r.status}</Text>
          </View>
          <Text style={{color:COLORS.muted, marginTop:6}}>{r.location}</Text>
          <Text style={{marginTop:8}}>{r.description}</Text>

          {r.status !== 'verified' && (
            <TouchableOpacity style={styles.verifyBtn} onPress={() => onVerify(r.id)}>
              <Text style={{color:'#fff', fontWeight:'700'}}>Verify</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor:'#fff', padding:12, borderRadius: RADIUS.md, marginTop:12 },
  verifyBtn: { marginTop:10, backgroundColor: COLORS.primary, padding:10, borderRadius: RADIUS.md, alignItems:'center' }
});