import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/main/HomeScreen';
import LearnNavigator from './LearnNavigator';
import WikiExcelScreen from '../screens/main/WikiExcelScreen';
import CertificateScreen from '../screens/main/CertificateScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { MainTabParamList } from './types';
import { theme } from '../constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          paddingBottom: 20,
          paddingTop: 8,
          height: 70,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnNavigator}
        options={{
          tabBarLabel: 'Aprender',
          tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Wiki"
        component={WikiExcelScreen}
        options={{
          tabBarLabel: 'Wiki',
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Certificate"
        component={CertificateScreen}
        options={{
          tabBarLabel: 'Certificado',
          tabBarIcon: ({ color, size }) => <Ionicons name="ribbon" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
