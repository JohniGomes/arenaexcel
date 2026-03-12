import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingStackParamList } from '../../navigation/types';
import Button from '../../components/Button';
import { theme } from '../../constants/theme';
import { useSound } from '../../contexts/SoundContext';

type OnboardingTestResultScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'TestResult'>;
type OnboardingTestResultScreenRouteProp = RouteProp<OnboardingStackParamList, 'TestResult'>;

interface Props {
  navigation: OnboardingTestResultScreenNavigationProp;
  route: OnboardingTestResultScreenRouteProp;
}

const levelInfo = {
  beginner: {
    title: 'Iniciante',
    emoji: '🌱',
    description: 'Você está começando sua jornada no Excel! Vamos aprender juntos desde o básico.',
    phrase: 'Não se preocupe! Todo expert já foi iniciante um dia. Vamos juntos nessa jornada.',
    color: '#4CAF50',
    mascot: require('../../../assets/excelino_iniciante.png'),
  },
  intermediate: {
    title: 'Intermediário',
    emoji: '📊',
    description: 'Você já conhece o básico! Vamos aprofundar seus conhecimentos e dominar fórmulas avançadas.',
    phrase: 'Você já tem uma boa base. Hora de dominar as fórmulas avançadas e se tornar um expert.',
    color: '#2196F3',
    mascot: require('../../../assets/excelino_intermediario.png'),
  },
  advanced: {
    title: 'Avançado',
    emoji: '🚀',
    description: 'Parabéns! Você já domina bem o Excel. Vamos te desafiar com conteúdos mais complexos.',
    phrase: 'Impressionante! Você já domina o Excel. Prepare-se para desafios de nível profissional.',
    color: '#9C27B0',
    mascot: require('../../../assets/excelino_avancado.png'),
  },
};

const OnboardingTestResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { level, correctCount } = route?.params ?? { level: 'beginner', correctCount: 0 };
  const info = levelInfo[level as keyof typeof levelInfo] ?? levelInfo.beginner;
  const { playSuccess } = useSound();

  useEffect(() => {
    playSuccess();
  }, []);

  const handleContinue = async () => {
    navigation.navigate('Goals', { level });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={info?.mascot ?? require('../../../assets/excelino_iniciante.png')}
            style={styles.mascot}
            resizeMode="contain"
          />

          <Text style={styles.mascotPhrase}>
            {info?.phrase ?? ''}
          </Text>

          <Text style={styles.title}>Resultado do Teste</Text>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Você acertou</Text>
            <Text style={[styles.scoreValue, { color: info?.color ?? '#4CAF50' }]}>
              {correctCount ?? 0}/10
            </Text>
            <Text style={styles.scoreLabel}>questões</Text>
          </View>

          <View style={[styles.levelCard, { borderColor: info?.color ?? '#4CAF50' }]}>
            <Text style={styles.levelLabel}>Seu nível é:</Text>
            <Text style={[styles.levelTitle, { color: info?.color ?? '#4CAF50' }]}>
              {info?.title ?? 'Iniciante'}
            </Text>
          </View>
        </View>

        <Button
          title="Continuar Jornada"
          onPress={handleContinue}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, padding: 24 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emoji: { fontSize: 64 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  scoreCard: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    marginVertical: 8,
  },
  levelCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    marginBottom: 32,
    width: '100%',
  },
  levelLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  levelDescription: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  mascot: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  mascotPhrase: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 26,
  },
  button: {
    marginTop: 16,
  },
});

export default OnboardingTestResultScreen;
