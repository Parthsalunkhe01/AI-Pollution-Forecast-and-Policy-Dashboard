// src/screens/SafeRoutesScreen.js
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import HeaderBar from '../components/HeaderBar';

export default function SafeRoutesScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const routes = [
    { id:1, name: 'Green Route', aqi: 180, time: '24 min', desc: 'Cleaner path via parks' },
    { id:2, name: 'Fastest Route', aqi: 340, time: '20 min', desc: 'Direct main road' },
    { id:3, name: 'Park Loop', aqi: 90, time: '18 min', desc: 'Scenic loop inside park' }
  ];

  const filtered = routes.filter(r => r.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={{ flex:1, backgroundColor: COLORS.bg }}>
      <HeaderBar />
      <ScrollView style={{ flex:1, padding: SPACING.md }} contentContainerStyle={{ paddingTop: 8 }}>
        <Text style={{ fontSize:22, fontWeight:'700', marginBottom: 12 }}>Routes</Text>

        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search location or route..."
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
        </View>

        <View style={{marginTop:12}}>
          {filtered.map(r => (
            <TouchableOpacity key={r.id} style={styles.routeCard} onPress={() => navigation.navigate('AQIDetails', { data: { aqi: r.aqi, location: r.name } })} activeOpacity={0.85}>
              <View style={{ flexDirection:'row', alignItems:'center' }}>
                <View style={{ width:56, height:56, borderRadius:10, backgroundColor:'#ECFDF3', marginRight:12 }} />
                <View>
                  <Text style={{ fontWeight:'700' }}>{r.name}</Text>
                  <Text style={{ color: COLORS.muted, marginTop: 6 }}>{r.desc}</Text>
                </View>
              </View>

              <View style={{ justifyContent:'center', alignItems:'flex-end' }}>
                <Text style={{ fontWeight:'700' }}>{r.time}</Text>
                <Text style={{ color: COLORS.muted, marginTop:6 }}>AQI: {r.aqi}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: { backgroundColor:'#fff', padding:8, borderRadius: RADIUS.sm, borderWidth:1, borderColor:'#eee', marginBottom:12 },
  searchInput: { padding:8 },
  routeCard: { backgroundColor:'#fff', padding:14, borderRadius:14, marginBottom:12, flexDirection:'row', justifyContent:'space-between', alignItems:'center', shadowColor:'#000', shadowOpacity:0.03, elevation:1 }
});
