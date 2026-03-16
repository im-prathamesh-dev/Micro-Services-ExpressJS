import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterUserScreen from '../screens/RegisterUserScreen';
import RegisterCaptainScreen from '../screens/RegisterCaptainScreen';
import UserDashboardScreen from '../screens/UserDashboardScreen';
import CaptainDashboardScreen from '../screens/CaptainDashboardScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterUser" component={RegisterUserScreen} />
        <Stack.Screen name="RegisterCaptain" component={RegisterCaptainScreen} />
        <Stack.Screen name="UserDashboard" component={UserDashboardScreen} />
        <Stack.Screen name="CaptainDashboard" component={CaptainDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
