// src/navigation/AppTabs.js
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../constants/theme';
import CommunityScreen from '../screens/CommunityScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SafeRoutesScreen from '../screens/SafeRoutesScreen';

const Tab = createBottomTabNavigator();

function TabLabel({ label, focused }) {
  return <Text style={{ fontSize:11, color: focused ? COLORS.primary : COLORS.muted }}>{label}</Text>;
}

export default function AppTabs(){
  return (
    <Tab.Navigator screenOptions={({route})=>({
      headerShown: false,
      tabBarStyle: { height:62, paddingBottom:6, paddingTop:6, backgroundColor:'#fff' },
      tabBarIcon: ({focused}) => {
        let iconName = 'home-outline';
        if (route.name === 'Routes') iconName = 'navigate-outline';
        if (route.name === 'Community') iconName = 'people-outline';
        if (route.name === 'Profile') iconName = 'leaf-outline';
        return <Ionicons name={iconName} size={22} color={focused ? COLORS.primary : COLORS.muted} />;
      }
    })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: ({focused}) => <TabLabel label="Home" focused={focused}/> }} />
      <Tab.Screen name="Routes" component={SafeRoutesScreen} options={{ tabBarLabel: ({focused}) => <TabLabel label="Routes" focused={focused}/> }} />
      <Tab.Screen name="Community" component={CommunityScreen} options={{ tabBarLabel: ({focused}) => <TabLabel label="Community" focused={focused}/> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: ({focused}) => <TabLabel label="Profile" focused={focused}/> }} />
    </Tab.Navigator>
  );
}