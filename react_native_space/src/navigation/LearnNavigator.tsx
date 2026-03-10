import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LearnScreen from '../screens/learn/LearnScreen';
import LessonListScreen from '../screens/learn/LessonListScreen';
import ExerciseScreen from '../screens/learn/ExerciseScreen';
import TrailsScreen from '../screens/trails/TrailsScreen';
import TrailDetailScreen from '../screens/trails/TrailDetailScreen';
import QuestionScreen from '../screens/trails/QuestionScreen';
import { LearnStackParamList } from './types';

const Stack = createStackNavigator<LearnStackParamList>();

const LearnNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LevelList" component={LearnScreen} />
      <Stack.Screen name="LessonList" component={LessonListScreen} />
      <Stack.Screen name="Exercise" component={ExerciseScreen} />
      <Stack.Screen name="Trails" component={TrailsScreen} />
      <Stack.Screen name="TrailDetail" component={TrailDetailScreen} />
      <Stack.Screen name="Question" component={QuestionScreen} />
    </Stack.Navigator>
  );
};

export default LearnNavigator;
