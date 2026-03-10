import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import ApiService, { storage } from '../services/api.service';
import NotificationService from '../services/notification.service';
import PurchasesService from '../services/purchases.service';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/api.types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  user: AuthResponse['user'] | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  googleSignIn: (token: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setHasCompletedOnboarding: (value: boolean) => void;
  updatePremiumStatus: (isPremium: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // 1. Inicializar RevenueCat ANTES de qualquer outra coisa (sem userId)
    await PurchasesService.initializeAnonymous();
    
    // 2. Verificar autenticação
    await checkAuthStatus();
  };

  const checkAuthStatus = async () => {
    try {
      const token = await storage.getItem('auth_token');
      if (token) {
        // Verify token by fetching profile
        const profile = await ApiService.getProfile();
        if (profile?.id) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            level: profile.level,
            xp: profile.xp,
            isPremium: profile.isPremium,
          });
          setIsAuthenticated(true);
          // Check if user has completed onboarding (if onboardingLevel exists in profile, they completed it)
          setHasCompletedOnboarding(!!(profile as any)?.onboardingCompleted);
          
          // 3. Identificar usuário no RevenueCat
          await PurchasesService.identifyUser(profile.id.toString());
        } else {
          await storage.removeItem('auth_token');
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      await storage.removeItem('auth_token');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    try {
      const response = await ApiService.login(data);
      if (response?.token && response?.user) {
        await storage.setItem('auth_token', response.token);
        setUser(response.user ?? null);
        setIsAuthenticated(true);
        
        // Identificar usuário no RevenueCat após login
        await PurchasesService.identifyUser(response.user.id.toString());
        
        // Check if user has completed onboarding from profile
        const profile = await ApiService.getProfile();
        setHasCompletedOnboarding(!!(profile as any)?.onboardingCompleted);
        // Register for push notifications
        await NotificationService.registerForPushNotifications();
      }
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await ApiService.register(data);
      if (response?.token && response?.user) {
        await storage.setItem('auth_token', response.token);
        setUser(response.user ?? null);
        setIsAuthenticated(true);
        
        // Identificar usuário no RevenueCat após registro
        await PurchasesService.identifyUser(response.user.id.toString());
        
        // New users haven't completed onboarding yet
        setHasCompletedOnboarding(false);
        // Register for push notifications
        await NotificationService.registerForPushNotifications();
      }
    } catch (error: any) {
      throw error;
    }
  };

  const googleSignIn = async (token: string, userData: any) => {
    try {
      await storage.setItem('auth_token', token);
      setUser(userData ?? null);
      setIsAuthenticated(true);
      
      // Identificar usuário no RevenueCat após Google Sign In
      if (userData?.id) {
        await PurchasesService.identifyUser(userData.id.toString());
      }
      
      // Check if user has completed onboarding
      setHasCompletedOnboarding(!!(userData as any)?.onboardingCompleted);
      // Register for push notifications
      await NotificationService.registerForPushNotifications();
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Fazer logout do RevenueCat
      await PurchasesService.logout();
      
      // Limpar dados locais
      await storage.removeItem('auth_token');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshProfile = async () => {
    try {
      const profile = await ApiService.getProfile();
      if (profile?.id) {
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          level: profile.level,
          xp: profile.xp,
          isPremium: profile.isPremium,
        });
      }
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  };

  const updatePremiumStatus = async (isPremium: boolean) => {
    try {
      // Atualizar localmente
      if (user) {
        setUser({ ...user, isPremium });
      }
      
      // Recarregar perfil do servidor para confirmar
      await refreshProfile();
    } catch (error) {
      console.error('Update premium status error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        hasCompletedOnboarding,
        user,
        login,
        register,
        googleSignIn,
        logout,
        refreshProfile,
        setHasCompletedOnboarding,
        updatePremiumStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
