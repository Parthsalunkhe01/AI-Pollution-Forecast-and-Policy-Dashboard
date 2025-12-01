// src/components/HeaderBar.js
import { Ionicons } from '@expo/vector-icons';
import { Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

export default function HeaderBar({ title = 'GreenPulse', location = 'Delhi-NCR', onPressBell = ()=>{}, onPressLocation = ()=>{} }) {
  return (
    <View style={[styles.safeArea, { paddingTop: STATUSBAR_HEIGHT }]}>
      <View style={styles.container}>
        <View style={styles.left}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.right}>
          <TouchableOpacity style={styles.locationBox} onPress={onPressLocation} activeOpacity={0.75} accessibilityLabel="Location">
            <Ionicons name="location-outline" size={14} color={COLORS.primary} />
            <Text style={styles.locationText}>{location}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onPressBell} style={styles.bell} activeOpacity={0.75} accessibilityLabel="Notifications">
            <Ionicons name="notifications" size={20} color="#222" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#fff' },
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 36, height: 36, borderRadius: 8, marginRight: 10 },
  title: { fontWeight:'700', fontSize:18, color: '#0f1724' },
  right: { flexDirection:'row', alignItems:'center' },
  locationBox: { flexDirection:'row', alignItems:'center', backgroundColor:'#F3F4F6', paddingHorizontal:10, paddingVertical:6, borderRadius:16, marginRight:10 },
  locationText: { marginLeft:6, color: '#374151', fontSize:12 },
  bell: { padding:6 },
  badge: { position:'absolute', top:-2, right:-2, width:8, height:8, borderRadius:4, backgroundColor:'red', borderWidth:1, borderColor:'#fff' }
});
