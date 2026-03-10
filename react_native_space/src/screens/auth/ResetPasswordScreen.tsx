import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/types';
import Button from '../../components/Button';
import { theme } from '../../constants/theme';
import apiService from '../../services/api.service';

type ResetPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type ResetPasswordScreenRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;

interface Props {
  navigation: ResetPasswordScreenNavigationProp;
  route: ResetPasswordScreenRouteProp;
}

const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { token = '' } = route?.params ?? {};
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      Alert.alert(
        'Token Inválido',
        'Link de redefinição inválido ou expirado.',
        [
          {
            text: 'Voltar',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    }
  }, [token, navigation]);

  const handleSubmit = async () => {
    if (!newPassword?.trim() || !confirmPassword?.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      await apiService.resetPassword(token, newPassword);

      Alert.alert(
        'Senha Redefinida! 🎉',
        'Sua senha foi redefinida com sucesso. Faça login com sua nova senha.',
        [
          {
            text: 'Fazer Login',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Erro ao redefinir senha. O link pode ter expirado.';

      Alert.alert('Erro', message, [
        {
          text: 'Solicitar Novo Link',
          onPress: () => navigation.navigate('ForgotPassword'),
        },
        {
          text: 'OK',
          style: 'cancel',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
            <Text style={styles.title}>Nova Senha</Text>
            <Text style={styles.subtitle}>
              Digite sua nova senha abaixo.
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Nova Senha"
              value={newPassword}
              onChangeText={setNewPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              textContentType="newPassword"
              style={styles.input}
              disabled={loading}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <TextInput
              label="Confirmar Nova Senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              textContentType="newPassword"
              style={styles.input}
              disabled={loading}
              left={<TextInput.Icon icon="lock-check" />}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />

            <Button
              title="Redefinir Senha"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </View>

          <View style={styles.info}>
            <Text style={styles.infoText}>🔒 Seguro</Text>
            <Text style={styles.infoSubtext}>
              Sua senha será criptografada e armazenada com segurança.
            </Text>
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
  },
  mascot: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  submitButton: {
    marginTop: 8,
  },
  info: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 14,
    color: '#1B5E20',
    lineHeight: 20,
  },
});

export default ResetPasswordScreen;
