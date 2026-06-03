import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import MinStockScreen from './src/screens/MinStockScreen';
import ExpiryScreen from './src/screens/ExpiryScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Início: { active: 'home', inactive: 'home-outline' },
  Estoque: { active: 'cube', inactive: 'cube-outline' },
  Vencimentos: { active: 'time', inactive: 'time-outline' },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName as any} size={22} color={color} />;
        },
        tabBarActiveTintColor: '#0F2B4C',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Início" component={DashboardScreen} />
      <Tab.Screen name="Estoque" component={MinStockScreen} />
      <Tab.Screen name="Vencimentos" component={ExpiryScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
