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
import { Ionicons } from '@expo/vector-icons';
import apiService from '../../services/api.service';

WebBrowser.maybeCompleteAuthSession();

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmEntry, setSecureConfirmEntry] = useState(true);
  const { register } = useAuth();
  const { showError, showSuccess } = useSnackbar();

  const handleRegister = async () => {
    if (!name?.trim() || !email?.trim() || !password?.trim() || !confirmPassword?.trim()) {
      showError('Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      showError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      showError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      showSuccess('Conta criada com sucesso!');
    } catch (error: any) {
      console.error('❌ Erro no cadastro:', error);
      console.error('❌ error.response:', error?.response);
      console.error('❌ error.message:', error?.message);
      console.error('❌ error.code:', error?.code);
      
      let message = 'Erro ao criar conta. Tente novamente.';
      
      if (error?.code === 'ECONNABORTED') {
        message = 'Tempo de resposta esgotado. Verifique sua conexão.';
      } else if (error?.message === 'Network Error' || error?.code === 'ERR_NETWORK') {
        message = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (error?.response?.status === 409) {
        message = 'Este email já está cadastrado. Faça login ou use outro email.';
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
          showError('Cadastro cancelado');
        } else if (result?.type === 'dismiss') {
          showError('Navegador fechado');
        }
        // O callback será tratado via deep link pelo GoogleCallbackScreen
      }
    } catch (error: any) {
      console.error('Erro no Google Sign-In:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao cadastrar com Google. Tente novamente.';
      Alert.alert('Erro no Cadastro', errorMessage);
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
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            />
            <Image
              source={require('../../../assets/excelino-welcome.gif')}
              style={styles.mascot}
              resizeMode="contain"
            />
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Junte-se à Arena Excel!</Text>
          </View>

          <View style={styles.form}>
            {/* Google Sign In */}
            <GoogleSignInButton
              onPress={handleGoogleSignIn}
              loading={googleLoading}
              mode="signup"
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View>

            <TextInput
              label="Nome completo"
              value={name}
              onChangeText={setName}
              mode="outlined"
              autoCapitalize="words"
              autoComplete="name"
              outlineColor={theme.colors.border}
              activeOutlineColor={theme.colors.primary}
              style={styles.input}
              accessibilityLabel="Campo de nome"
              disabled={loading || googleLoading}
            />

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

            <TextInput
              label="Confirmar senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={secureConfirmEntry}
              autoCapitalize="none"
              autoComplete="password"
              outlineColor={theme.colors.border}
              activeOutlineColor={theme.colors.primary}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={secureConfirmEntry ? 'eye' : 'eye-off'}
                  onPress={() => setSecureConfirmEntry(!secureConfirmEntry)}
                />
              }
              accessibilityLabel="Campo de confirmar senha"
              disabled={loading || googleLoading}
            />

            <Button
              title="Cadastrar"
              onPress={handleRegister}
              loading={loading}
              disabled={googleLoading}
              style={styles.registerButton}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
                accessibilityRole="link"
                accessibilityLabel="Fazer login"
              >
                Fazer login
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  mascot: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
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
  registerButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '700',
  },
});

export default RegisterScreen;
