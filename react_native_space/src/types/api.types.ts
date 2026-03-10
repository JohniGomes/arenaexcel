// API Request Types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
}

export interface UpdateLessonRequest {
  lessonId: number;
  completed: boolean;
  xpEarned: number;
}

export interface SubmitAnswerRequest {
  exerciseId: number;
  answer: string;
}

// API Response Types
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    level: number;
    xp: number;
    isPremium?: boolean;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  lives: number;
  nextRechargeTime?: Date | null;
  avatar: string;
  profilePicture?: string | null;
  onboardingCompleted?: boolean;
  isPremium?: boolean;
  stats: {
    lessonsCompleted: number;
    accuracy: number;
    studyHours: number;
  };
}

export interface Lesson {
  id: number;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'incomplete';
  exercises: number;
  canRetryAt?: string | null;
}

export interface Level {
  id: number;
  name: string;
  completed: number;
  total: number;
  lessons: Lesson[];
}

export interface ProgressResponse {
  levels: Level[];
}

export interface Exercise {
  id: number;
  type: string;
  question: string;
  options?: any;
  imageUrl?: string;
  hint?: string;
}

export interface ExercisesResponse {
  exercises: Exercise[];
  lessonStatus?: string;
  canRetryAt?: string | null;
}

export interface SubmitAnswerResponse {
  correct: boolean;
  explanation: string;
  xpEarned: number;
  livesRemaining: number;
  canRetryAt?: string | null;
}

export interface UpdateLessonResponse {
  xp: number;
  level: number;
  achievements: string[];
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  progress: number;
  target: number;
  xpReward: number;
  completed: boolean;
}

export interface MissionsResponse {
  missions: Mission[];
  dailyXpGoal: number;
  dailyXpProgress: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  xp: number;
  level: number;
  avatar: string;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  userRank: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
  currentProgress?: number;
  targetValue?: number;
  progressPercentage?: number;
}

export interface AchievementsResponse {
  achievements: Achievement[];
  nextAchievement?: Achievement | null;
}

// Chat Types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatMessageRequest {
  message: string;
  history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface ChatMessageResponse {
  response: string;
}
