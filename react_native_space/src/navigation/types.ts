import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  GoogleCallback: { token?: string; user?: string; error?: string };
};

export type OnboardingStackParamList = {
  Level: undefined;
  QuickTest: { level: string };
  TestResult: { level: string; correctCount: number };
  Goals: { level: string };
  Time: { level: string; goals: string[] };
  Area: { level: string; goals: string[]; studyTime: string };
  Challenges: { level: string; goals: string[]; studyTime: string; area: string };
  Complete: { level: string; goals: string[]; studyTime: string; area: string; challenges: string[] };
};

export type MainTabParamList = {
  Home: undefined;
  Learn: undefined;
  Wiki: undefined;
  Certificate: undefined;
  Profile: undefined;
};

export type LearnStackParamList = {
  LevelList: undefined;
  LessonList: { levelId: number; levelName: string };
  Exercise: { lessonId: number; lessonTitle: string };
  Trails: undefined;
  TrailDetail: { slug: string };
  Question: { slug: string; order: number };
};
