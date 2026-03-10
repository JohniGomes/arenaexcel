import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import Button from '../../components/Button';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import { theme } from '../../constants/theme';
import apiService from '../../services/api.service';

WebBrowser.maybeCompleteAuthSession();

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { login } = useAuth();
  const { showError, showSuccess } = useSnackbar();

  const handleLogin = async () => {
    if (!email?.trim() || !password?.trim()) {
      showError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      showSuccess('Login realizado com sucesso!');
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      console.error('❌ error.response:', error?.response);
      console.error('❌ error.message:', error?.message);
      console.error('❌ error.code:', error?.code);
      
      let message = 'Erro ao fazer login. Tente novamente.';
      
      if (error?.code === 'ECONNABORTED') {
        message = 'Tempo de resposta esgotado. Verifique sua conexão.';
      } else if (error?.message === 'Network Error' || error?.code === 'ERR_NETWORK') {
        message = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (error?.response?.status === 401) {
        message = 'Email ou senha incorretos.';
      } else if (error?.response?.data?.message) {
        message = error.response.data.message;
      }
      
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);

      // Define redirect URI baseado no ambiente
      let redirectUri = '';
      
      if (Platform.OS === 'web') {
        // Web: usa window.location.origin ou domínio de produção
        if (typeof window !== 'undefined' && window?.location?.origin) {
          redirectUri = `${window.location.origin}/auth/callback`;
        } else {
          redirectUri = 'https://arenaexcel.excelcomjohni.com.br/auth/callback';
        }
      } else {
        // Mobile: SEMPRE usa o domínio de produção
        // O backend retorna HTML com deep link que abre o app
        redirectUri = 'https://arenaexcel.excelcomjohni.com.br/auth/callback';
      }

      // Obter URL de autenticação do Google
      const authUrl = apiService.googleSignIn(redirectUri);

      if (Platform.OS === 'web') {
        // Na web, redireciona a página inteira
        if (typeof window !== 'undefined') {
          window.location.href = authUrl;
        }
      } else {
        // No mobile, abre browser in-app
        const result = await WebBrowser.openAuthSessionAsync(
          authUrl,
          redirectUri,
        );

        if (result?.type === 'cancel') {
          showError('Login cancelado');
        } else if (result?.type === 'dismiss') {
          showError('Navegador fechado');
        }
        // O callback será tratado via deep link pelo GoogleCallbackScreen
      }
    } catch (error: any) {
      console.error('Erro no Google Sign-In:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao fazer login com Google. Tente novamente.';
      Alert.alert('Erro no Login', errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image
              source={require('../../../assets/excelino-welcome.gif')}
              style={styles.mascot}
              resizeMode="contain"
            />
            <Text style={styles.title}>Arena Excel</Text>
            <Text style={styles.subtitle}>Aprenda Excel de forma divertida!</Text>
          </View>

          <View style={styles.form}>
            {/* Google Sign In */}
            <GoogleSignInButton
              onPress={handleGoogleSignIn}
              loading={googleLoading}
              mode="signin"
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              outlineColor={theme.colors.border}
              activeOutlineColor={theme.colors.primary}
              style={styles.input}
              accessibilityLabel="Campo de email"
              disabled={loading || googleLoading}
            />

            <TextInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              autoComplete="password"
              outlineColor={theme.colors.border}
              activeOutlineColor={theme.colors.primary}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={secureTextEntry ? 'eye' : 'eye-off'}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
              accessibilityLabel="Campo de senha"
              disabled={loading || googleLoading}
            />

            <Button
              title="Entrar"
              onPress={handleLogin}
              loading={loading}
              disabled={googleLoading}
              style={styles.loginButton}
            />

            <Button
              title="Esqueci minha senha"
              onPress={() => navigation.navigate('ForgotPassword')}
              mode="text"
              disabled={loading || googleLoading}
              style={styles.forgotButton}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Não tem uma conta? </Text>
              <Text
                style={styles.registerLink}
                onPress={() => navigation.navigate('Register')}
                accessibilityRole="link"
                accessibilityLabel="Criar conta"
              >
                Criar conta
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  mascot: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.background,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  forgotButton: {
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  registerLink: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '700',
  },
});

export default LoginScreen;
