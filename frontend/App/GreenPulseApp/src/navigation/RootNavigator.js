// src/navigation/RootNavigator.js
import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../context/AuthContext';

import AppTabs from './AppTabs'; // bottom tabs (Home, Routes, Community, Profile)
import AQIDetailsScreen from '../screens/AQIDetailsScreen';
import SafeRoutesScreen from '../screens/SafeRoutesScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ReportIncidentScreen from '../screens/ReportIncidentScreen';
import ReportDetailsScreen from '../screens/ReportDetailsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import AQIHeroesScreen from '../screens/AQIHeroesScreen'; // optional screen for "View All" if you created it

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, initializing } = useContext(AuthContext);

  if (initializing) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Authenticated: show the tab navigator as the main app screen,
        // keep detail screens in stack so they open on top of tabs.
        <>
          <Stack.Screen name="MainTabs" component={AppTabs} />

          {/* Full-screen / pushed screens */}
          <Stack.Screen name="AQIDetails" component={AQIDetailsScreen} />
          <Stack.Screen name="SafeRoutes" component={SafeRoutesScreen} />
          <Stack.Screen name="ReportIncident" component={ReportIncidentScreen} />
          <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          {/* optional: show all heroes or other pages */}
          {typeof AQIHeroesScreen !== 'undefined' && <Stack.Screen name="AQIHeroes" component={AQIHeroesScreen} />}
        </>
      ) : (
        // Not signed in: show auth screens
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
