import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingStackParamList } from './types';
import OnboardingLevelScreen from '../screens/onboarding/OnboardingLevelScreen';
import OnboardingQuickTestScreen from '../screens/onboarding/OnboardingQuickTestScreen';
import OnboardingTestResultScreen from '../screens/onboarding/OnboardingTestResultScreen';
import OnboardingGoalsScreen from '../screens/onboarding/OnboardingGoalsScreen';
import OnboardingTimeScreen from '../screens/onboarding/OnboardingTimeScreen';
import OnboardingAreaScreen from '../screens/onboarding/OnboardingAreaScreen';
import OnboardingChallengesScreen from '../screens/onboarding/OnboardingChallengesScreen';
import OnboardingCompleteScreen from '../screens/onboarding/OnboardingCompleteScreen';

const Stack = createStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Level" component={OnboardingLevelScreen} />
      <Stack.Screen name="QuickTest" component={OnboardingQuickTestScreen} />
      <Stack.Screen name="TestResult" component={OnboardingTestResultScreen} />
      <Stack.Screen name="Goals" component={OnboardingGoalsScreen} />
      <Stack.Screen name="Time" component={OnboardingTimeScreen} />
      <Stack.Screen name="Area" component={OnboardingAreaScreen} />
      <Stack.Screen name="Challenges" component={OnboardingChallengesScreen} />
      <Stack.Screen name="Complete" component={OnboardingCompleteScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;