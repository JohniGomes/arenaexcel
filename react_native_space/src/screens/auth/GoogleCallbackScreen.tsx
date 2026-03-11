import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api.service';

type GoogleCallbackScreenRouteProp = RouteProp<AuthStackParamList, 'GoogleCallback'>;
type GoogleCallbackScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'GoogleCallback'>;

const GoogleCallbackScreen = () => {
  const navigation = useNavigation<GoogleCallbackScreenNavigationProp>();
  const route = useRoute<GoogleCallbackScreenRouteProp>();
  const { googleSignIn } = useAuth();
  const [status, setStatus] = useState('Processando login com Google...');

  useEffect(() => {
    handleGoogleCallback();
  }, []);

  const handleGoogleCallback = async () => {
    try {
      // Extrair token e user da URL (o backend já redirecionou com esses dados)
      let token = '';
      let userJson = '';
      let error = '';
      
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Web: pegar da query string
        const params = new URLSearchParams(window?.location?.search ?? '');
        token = params?.get('token') ?? '';
        userJson = params?.get('user') ?? '';
        error = params?.get('error') ?? '';
      } else {
        // Mobile: pegar dos params da rota
        token = route?.params?.token ?? '';
        userJson = route?.params?.user ?? '';
        error = route?.params?.error ?? '';
      }

      if (error) {
        throw new Error(error);
      }

      if (!token || !userJson) {
        throw new Error('Token ou dados do usuário não encontrados');
      }

      setStatus('Login realizado com sucesso!');
      
      // Parse do user
      const user = JSON.parse(decodeURIComponent(userJson));
      
      // Fazer login com os dados recebidos
      await googleSignIn(token, user);
      
      // Navegação será tratada automaticamente pelo AuthContext
    } catch (error: any) {
      console.error('Erro no callback do Google:', error);
      
      Alert.alert(
        'Erro no Login',
        error?.message ?? 'Não foi possível completar o login com Google. Tente novamente.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1E88E5" style={styles.loader} />
      <Text style={styles.statusText}>{status}</Text>
      <Text style={styles.subText}>Aguarde...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  loader: {
    marginBottom: 24,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default GoogleCallbackScreen;
