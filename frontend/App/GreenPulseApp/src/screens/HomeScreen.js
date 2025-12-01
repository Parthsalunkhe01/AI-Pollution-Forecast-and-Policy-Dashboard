// src/screens/HomeScreen.js
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AQICircle from '../components/AQICircle';
import AQIWidget from '../components/AQIWidget';
import ForecastCard from '../components/ForecastCard';
import HeaderBar from '../components/HeaderBar';
import HealthAlertCard from '../components/HealthAlertCard';
import PollutionSources from '../components/PollutionSources';
import { COLORS, SPACING } from '../constants/theme';
import { AuthContext } from '../context/AuthContext';
import { fetchAQI } from '../services/api';

export default function HomeScreen({ navigation }){
  const { user } = useContext(AuthContext);
  const [aqiData, setAqiData] = useState({ aqi:45, location:'Sample Location' });

  // 12 points for 24h (every 2 hours). Expand to 12 = 24h
  const points = [340,355,320,300,280,250,230,210,200,190,180,170];

  useEffect(()=> {
    let mounted=true;
    (async ()=> {
      try {
        const d = await fetchAQI();
        if (mounted && d) setAqiData(d);
      } catch(e){ console.warn(e); }
    })();
    return ()=> mounted=false;
  },[]);

  return (
    <View style={{flex:1, backgroundColor:COLORS.bg}}>
      <HeaderBar onPressLocation={() => navigation.navigate('Routes')} onPressBell={() => {}} />
      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Hello, {user?.displayName ?? (user?.email ? user.email.split('@')[0] : 'Guest')}</Text>

        <View style={{alignItems:'center'}}>
          <AQICircle aqi={aqiData?.aqi ?? 45} size={200} />
        </View>

        <AQIWidget data={aqiData} onPress={() => navigation.navigate('AQIDetails', { data: aqiData })} />

        {/* Health Alert (no 'See Safe Hours' button per last request) */}
        <HealthAlertCard onTips={() => alert('Health tips: mask, avoid peak hours')} onSafeHours={() => {}} />

        {/* Forecast -> interactive 24h */}
        <ForecastCard points={points} onPointPress={(value, idx) => navigation.navigate('AQIDetails', { data: { aqi: value, location: aqiData.location }})} />

        {/* Pollution sources below forecast */}
        <PollutionSources />

        <View style={{height:80}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollArea: { padding: SPACING.md, paddingTop: SPACING.lg + 8, paddingBottom: 120 },
  greeting: { fontSize:20, fontWeight:'700', color:COLORS.text, marginBottom:SPACING.md }
});
