// src/screens/AQIDetailsScreen.js
import { ScrollView, Text, View } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

export default function AQIDetailsScreen({ route }) {
  const data = route?.params?.data ?? { aqi: 45, location: 'Sample Location' };

  return (
    <ScrollView style={{ flex:1, backgroundColor: COLORS.bg }}>
      <View style={{ padding: SPACING.md }}>
        <Text style={{ fontSize:22, fontWeight:'700' }}>AQI Details</Text>
        <View style={{ marginTop: 12, backgroundColor:'#fff', padding:16, borderRadius:12 }}>
          <Text style={{color: COLORS.muted}}>Location</Text>
          <Text style={{ fontWeight:'700', marginTop:6 }}>{data.location}</Text>

          <Text style={{ color: COLORS.muted, marginTop: 12 }}>AQI</Text>
          <Text style={{ fontSize:36, fontWeight:'800', color: COLORS.primary }}>{data.aqi}</Text>

          <Text style={{ marginTop: 10, color: COLORS.muted }}>
            Interpretation and recommended precautions based on AQI level.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
