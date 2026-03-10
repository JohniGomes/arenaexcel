import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_CONFIG } from '../config/api.config';

// Storage helper que funciona em web e mobile
export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },
};
import Constants from 'expo-constants';
import {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  AuthResponse,
  UserProfile,
  UpdateProfileRequest,
  ProgressResponse,
  ExercisesResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  UpdateLessonRequest,
  UpdateLessonResponse,
  MissionsResponse,
  LeaderboardResponse,
  AchievementsResponse,
  ChatMessageRequest,
  ChatMessageResponse,
} from '../types/api.types';

// API URL - SEMPRE usar configuração fixa de produção
const API_BASE_URL = API_CONFIG.PRODUCTION_URL;

// Debug log para diagnóstico
console.log('🔥 API_BASE_URL configurado:', API_BASE_URL);

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await storage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
          return config;
        } catch (error) {
          console.error('❌ Error in request interceptor:', error);
          return config;
        }
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ Response:', response.status, response.config.url);
        return response;
      },
      async (error: AxiosError) => {
        console.error('❌ Response error:', {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          url: error.config?.url
        });
        
        if (error?.response?.status === 401) {
          // Token expired or invalid, clear storage
          await storage.removeItem('auth_token');
          // Navigation will be handled by AuthContext
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('api/auth/register', data);
    return response?.data ?? { token: '', user: { id: '', name: '', email: '', level: 1, xp: 0 } };
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('api/auth/login', data);
    return response?.data ?? { token: '', user: { id: '', name: '', email: '', level: 1, xp: 0 } };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await this.api.post('api/auth/forgot-password', { email });
    return response?.data ?? { message: '' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await this.api.post('api/auth/reset-password', { token, newPassword });
    return response?.data ?? { message: '' };
  }

  googleSignIn(redirectUri: string): string {
    // Returns the Google Auth URL to open in browser
    const baseUrl = API_BASE_URL?.endsWith?.('/') ? API_BASE_URL?.slice(0, -1) : API_BASE_URL;
    const url = `${baseUrl}/api/auth/google`;
    return `${url}?redirect_uri=${encodeURIComponent(redirectUri)}`;
  }

  async googleCallback(code: string): Promise<{ token: string; user: { id: string; name: string; email: string; avatarUrl: string | null } }> {
    const response = await this.api.post('api/auth/google/callback', { code });
    return response?.data ?? { token: '', user: { id: '', name: '', email: '', avatarUrl: null } };
  }

  // User endpoints
  async getProfile(): Promise<UserProfile> {
    const response = await this.api.get<UserProfile>('api/user/profile');
    return response?.data ?? {
      id: '',
      name: '',
      email: '',
      level: 1,
      xp: 0,
      streak: 0,
      lives: 5,
      avatar: 'default',
      stats: { lessonsCompleted: 0, accuracy: 0, studyHours: 0 },
    };
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await this.api.put<UserProfile>('api/user/profile', data);
    return response?.data ?? {
      id: '',
      name: '',
      email: '',
      level: 1,
      xp: 0,
      streak: 0,
      lives: 5,
      avatar: 'default',
      stats: { lessonsCompleted: 0, accuracy: 0, studyHours: 0 },
    };
  }

  // Progress endpoints
  async getProgress(): Promise<ProgressResponse> {
    const response = await this.api.get<ProgressResponse>('api/progress');
    return response?.data ?? { levels: [] };
  }

  async updateLesson(data: UpdateLessonRequest): Promise<UpdateLessonResponse> {
    const response = await this.api.post<UpdateLessonResponse>('api/progress/lesson', data);
    return response?.data ?? { xp: 0, level: 1, achievements: [] };
  }

  // Exercise endpoints
  async getExercisesByLesson(lessonId: number): Promise<ExercisesResponse> {
    const response = await this.api.get<ExercisesResponse>(`api/exercises/lesson/${lessonId}`);
    return response?.data ?? { exercises: [] };
  }

  async submitAnswer(data: SubmitAnswerRequest): Promise<SubmitAnswerResponse> {
    const response = await this.api.post<SubmitAnswerResponse>('api/exercises/submit', data);
    return response?.data ?? { correct: false, explanation: '', xpEarned: 0, livesRemaining: 5 };
  }

  // Missions endpoint
  async getDailyMissions(): Promise<MissionsResponse> {
    const response = await this.api.get<MissionsResponse>('api/missions/daily');
    return response?.data ?? { missions: [], dailyXpGoal: 0, dailyXpProgress: 0 };
  }

  // Leaderboard endpoint
  async getLeaderboard(limit: number = 100): Promise<LeaderboardResponse> {
    const response = await this.api.get<LeaderboardResponse>('api/leaderboard', {
      params: { limit },
    });
    return response?.data ?? { leaderboard: [], userRank: 0 };
  }

  // Achievements endpoint
  async getAchievements(): Promise<AchievementsResponse> {
    const response = await this.api.get<AchievementsResponse>('api/achievements');
    return response?.data ?? { achievements: [] };
  }

  // Onboarding endpoint
  async saveOnboarding(data: {
    level: string;
    goals: string[];
    studyTime: number;
    area: string;
    challenges: string[];
  }): Promise<{ success: boolean }> {
    const response = await this.api.post<{ success: boolean }>('api/user/onboarding', data);
    return response?.data ?? { success: false };
  }

  // Select mascot endpoint
  async selectMascot(mascotId: string): Promise<{ mascotId: string; message: string }> {
    const response = await this.api.post<{ mascotId: string; message: string }>('api/user/select-mascot', {
      mascotId,
    });
    return response?.data ?? { mascotId: '', message: 'Selection failed' };
  }

  // Chat with Excelino AI
  async sendChatMessage(request: ChatMessageRequest): Promise<ChatMessageResponse> {
    const response = await this.api.post<ChatMessageResponse>('api/chat/message', request);
    return response?.data ?? { response: 'Desculpe, não consegui processar sua mensagem.' };
  }

  // Push notifications
  async savePushToken(token: string): Promise<void> {
    await this.api.post('api/notifications/token', { token });
  }

  // Planilha IA - Análise de planilhas
  async analisarPlanilha(dados: string, nomeArquivo: string): Promise<{ insights: string; analisesRestantes: number }> {
    const response = await this.api.post('api/planilha-ia/analisar', { dados, nomeArquivo });
    return response?.data ?? { insights: '', analisesRestantes: 0 };
  }

  async chatSobrePlanilha(dados: string, mensagens: any[]): Promise<{ resposta: string }> {
    const response = await this.api.post('api/planilha-ia/chat', { dados, mensagens });
    return response?.data ?? { resposta: '' };
  }

  async extrairTextoDaImagem(base64: string): Promise<string> {
    const response = await this.api.post('api/planilha-ia/extrair-imagem', { base64 });
    return response?.data?.texto ?? '';
  }

  // Badges e Certificados
  async getMeusBadges(): Promise<any[]> {
    const response = await this.api.get('api/badges/meus');
    return response?.data ?? [];
  }

  async verificarBadges(): Promise<{ novosBadges: string[] }> {
    const response = await this.api.post('api/badges/verificar');
    return response?.data ?? { novosBadges: [] };
  }

  async gerarCertificado(badgeId: string, nomeAluno: string): Promise<any> {
    const response = await this.api.post('api/badges/certificado/gerar', { badgeId, nomeAluno });
    return response?.data ?? null;
  }

  // Trilhas de Aprendizado
  async getTrails(): Promise<any[]> {
    const response = await this.api.get('trails');
    return response?.data ?? [];
  }

  async getTrailDetails(slug: string): Promise<any> {
    const response = await this.api.get(`trails/${slug}`);
    return response?.data ?? null;
  }

  async getQuestion(slug: string, order: number): Promise<any> {
    const response = await this.api.get(`trails/${slug}/questions/${order}`);
    return response?.data ?? null;
  }

  async submitTrailAnswer(data: { questionId: string; value: string; timeSpentMs?: number }): Promise<{
    isCorrect: boolean;
    explanation: string;
    xpEarned: number;
  }> {
    const response = await this.api.post('trails/answer', data);
    return response?.data ?? { isCorrect: false, explanation: '', xpEarned: 0 };
  }
}

export default new ApiService();
