import React, { useState } from 'react';
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
import { AuthStackParamList } from '../../navigation/types';
import Button from '../../components/Button';
import { theme } from '../../constants/theme';
import apiService from '../../services/api.service';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email?.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu e-mail');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido');
      return;
    }

    try {
      setLoading(true);
      await apiService.forgotPassword(email);

      Alert.alert(
        'E-mail Enviado! 📧',
        'Se o e-mail existir em nosso sistema, você receberá um link para redefinir sua senha.\n\nVerifique sua caixa de entrada e spam.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Erro ao solicitar redefinição de senha. Tente novamente.';

      Alert.alert('Erro', message);
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
            <Text style={styles.title}>Esqueceu sua senha?</Text>
            <Text style={styles.subtitle}>
              Não se preocupe! Digite seu e-mail e enviaremos um link para
              redefinir sua senha.
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              style={styles.input}
              disabled={loading}
              left={<TextInput.Icon icon="email" />}
            />

            <Button
              title="Enviar Link de Redefinição"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />

            <Button
              title="Voltar para Login"
              onPress={() => navigation.goBack()}
              mode="text"
              disabled={loading}
              style={styles.backButton}
            />
          </View>

          <View style={styles.info}>
            <Text style={styles.infoText}>💡 Dica:</Text>
            <Text style={styles.infoSubtext}>
              O link de redefinição expira em 1 hora por motivos de segurança.
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
    marginBottom: 8,
  },
  backButton: {
    marginTop: 8,
  },
  info: {
    backgroundColor: '#FFF4E5',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 14,
    color: '#6D4C41',
    lineHeight: 20,
  },
});

export default ForgotPasswordScreen;
