// src/navigation/RootNavigator.js
import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../context/AuthContext';

import AppTabs from './AppTabs';
import AQIDetailsScreen from '../screens/AQIDetailsScreen';
import SafeRoutesScreen from '../screens/SafeRoutesScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ReportIncidentScreen from '../screens/ReportIncidentScreen';
import ReportDetailsScreen from '../screens/ReportDetailsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import AQIHeroesScreen from '../screens/AQIHeroesScreen';

// admin screens
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminPolicyScreen from '../screens/AdminPolicyScreen';
import AdminVerifyReportsScreen from '../screens/AdminVerifyReportsScreen';
import AdminVerifiedReportsScreen from '../screens/AdminVerifiedReportsScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, role, initializing } = useContext(AuthContext);

  console.log("ROOT NAV user =", !!user, "role =", role);

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
        role === 'admin' ? (
          // ADMIN FLOW
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="AdminPolicies" component={AdminPolicyScreen} />
            <Stack.Screen name="AdminVerifyReports" component={AdminVerifyReportsScreen} />
            <Stack.Screen name="AdminVerifiedReports" component={AdminVerifiedReportsScreen} />
            <Stack.Screen name="SafeRoutes" component={SafeRoutesScreen} />
            <Stack.Screen name="AQIDetails" component={AQIDetailsScreen} />
          </>
        ) : (
          // USER FLOW
          <>
            <Stack.Screen name="MainTabs" component={AppTabs} />
            <Stack.Screen name="AQIDetails" component={AQIDetailsScreen} />
            <Stack.Screen name="SafeRoutes" component={SafeRoutesScreen} />
            <Stack.Screen name="ReportIncident" component={ReportIncidentScreen} />
            <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            {typeof AQIHeroesScreen !== 'undefined' && (
              <Stack.Screen name="AQIHeroes" component={AQIHeroesScreen} />
            )}
          </>
        )
      ) : (
        // AUTH FLOW
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}