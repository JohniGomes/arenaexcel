import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View, StyleSheet, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import AuthNavigator from './AuthNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import MainTabNavigator from './MainTabNavigator';
import FloatingChatButton from '../components/chat/FloatingChatButton';
import ChatModal from '../components/chat/ChatModal';
import PlanilhaIAButton from '../components/PlanilhaIAButton';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

// Configuração de linking para deep links e web URLs
const linking = {
  prefixes: [
    Linking.createURL('/'), 
    'http://localhost:8081', 
    'https://arenaexcel.excelcomjohni.com.br',
    'exp://'
  ],
  config: {
    screens: {
      Auth: {
        screens: {
          ResetPassword: {
            path: 'reset-password',
            parse: {
              token: (token: string) => token,
            },
          },
          GoogleCallback: {
            path: 'auth/callback',
            parse: {
              token: (token: string) => token,
              user: (user: string) => user,
              error: (error: string) => error,
            },
          },
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      Main: {
        screens: {
          Home: 'home',
          Learn: 'learn',
          Ranking: 'ranking',
          Profile: 'profile',
        },
      },
    },
  },
};

const RootNavigator = () => {
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();
  
  const showChatButton = isAuthenticated && hasCompletedOnboarding;

  // Processar query string na web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const params = new URLSearchParams(window?.location?.search ?? '');
      const token = params?.get('token');
      const screen = params?.get('screen');
      
      if (token && screen === 'reset-password') {
        // URL será processada pelo linking config
        console.log('Token de reset detectado:', token);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#58CC02" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer linking={linking}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          ) : !hasCompletedOnboarding ? (
            <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
          ) : (
            <Stack.Screen name="Main" component={MainTabNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      
      {showChatButton && (
        <>
          <FloatingChatButton />
          <PlanilhaIAButton />
          <ChatModal />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default RootNavigator;
