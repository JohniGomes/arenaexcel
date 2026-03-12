import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingStackParamList } from '../../navigation/types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { theme } from '../../constants/theme';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSound } from '../../contexts/SoundContext';
import ApiService from '../../services/api.service';

type OnboardingCompleteScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Complete'>;
type OnboardingCompleteScreenRouteProp = RouteProp<OnboardingStackParamList, 'Complete'>;

interface Props {
  navigation: OnboardingCompleteScreenNavigationProp;
  route: OnboardingCompleteScreenRouteProp;
}

const getLevelText = (level: string) => {
  switch (level) {
    case 'beginner': return 'Iniciante';
    case 'intermediate': return 'Intermediário';
    case 'advanced': return 'Avançado';
    default: return 'Iniciante';
  }
};

const getGoalsText = (goals: string[]) => {
  const goalMap: { [key: string]: string } = {
    career: 'Crescer na carreira',
    job: 'Conseguir emprego melhor',
    analysis: 'Dominar análises',
    automation: 'Automatizar tarefas',
    learn: 'Aprender do zero',
    expert: 'Virar especialista',
  };
  return goals.map(g => goalMap[g] || g).join(', ');
};

const getAreaText = (area: string) => {
  const areaMap: { [key: string]: string } = {
    administrative: 'Administrativo',
    financial: 'Financeiro',
    logistics: 'Logística',
    hr: 'RH',
    sales: 'Comercial',
    student: 'Estudante',
    other: 'Outro',
  };
  return areaMap[area] || 'Outro';
};

const getPersonalizedMessage = (level: string, goals: string[], studyTime: string, area: string): string => {
  const primaryGoal = goals?.[0] ?? '';
  const goalMap: Record<string, string> = {
    career: 'crescer na carreira',
    job: 'conquistar um emprego melhor',
    analysis: 'dominar análises de dados',
    automation: 'automatizar suas tarefas',
    learn: 'aprender do início',
    expert: 'se tornar um especialista',
  };
  const areaMap: Record<string, string> = {
    administrative: 'área administrativa',
    financial: 'área financeira',
    logistics: 'logística',
    hr: 'gestão de pessoas',
    sales: 'área comercial',
    student: 'vida acadêmica',
    other: 'sua área',
  };
  const goalText = goalMap[primaryGoal] ?? 'evoluir no Excel';
  const areaText = areaMap[area ?? 'other'] ?? 'sua área';
  const timeNum = parseInt(studyTime ?? '10');

  if (level === 'beginner') {
    return `Com ${timeNum} minutos por dia, você vai construir uma base sólida na ${areaText} e dar passos reais para ${goalText}.`;
  } else if (level === 'intermediate') {
    return `Você já tem uma base. Com ${timeNum} minutos diários focados na ${areaText}, vai dominar o que falta para ${goalText}.`;
  } else {
    return `Nível avançado, ${timeNum} minutos por dia e foco na ${areaText}. Os recursos certos para ${goalText} estão te esperando.`;
  }
};

const OnboardingCompleteScreen: React.FC<Props> = ({ navigation, route }) => {
  const { level, goals, studyTime, area, challenges } = route?.params ?? {};
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useSnackbar();
  const { setHasCompletedOnboarding } = useAuth();
  const { playClick } = useSound();

  const handleStart = async () => {
    await playClick();
    setLoading(true);
    try {
      await ApiService.saveOnboarding({
        level: level ?? 'beginner',
        goals: goals ?? [],
        studyTime: parseInt(studyTime ?? '10'),
        area: area ?? 'other',
        challenges: challenges ?? [],
      });

      showSuccess('Perfil configurado com sucesso!');
      // Update auth context to mark onboarding as complete
      // RootNavigator will automatically navigate to Main
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error saving onboarding:', error);
      showError('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/excelino-celebrating.gif')}
          style={styles.mascotImage}
          resizeMode="contain"
        />

        <Text style={styles.title}>🏆 Tudo pronto!</Text>
        <Text style={styles.subtitle}>Vamos começar sua jornada personalizada</Text>

        <Card style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>🎯 Objetivo:</Text>
            <Text style={styles.summaryValue}>{getGoalsText(goals ?? [])}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>🧠 Nível:</Text>
            <Text style={styles.summaryValue}>{getLevelText(level ?? 'beginner')}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>🕒 Tempo diário:</Text>
            <Text style={styles.summaryValue}>{studyTime} minutos</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>🏢 Área:</Text>
            <Text style={styles.summaryValue}>{getAreaText(area ?? 'other')}</Text>
          </View>
        </Card>

        <Card style={styles.messageCard}>
          <Text style={styles.mascotMessage}>
            {getPersonalizedMessage(level ?? 'beginner', goals ?? [], studyTime ?? '10', area ?? 'other')}
          </Text>
        </Card>

        <Button
          title="🚀 Iniciar Arena"
          onPress={handleStart}
          loading={loading}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, padding: 24 },
  mascotImage: { width: '100%', height: 120, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  summaryCard: { padding: 20, marginBottom: 20 },
  summaryItem: { marginBottom: 12 },
  summaryLabel: { fontSize: 16, fontWeight: '600', color: theme.colors.primary, marginBottom: 4 },
  summaryValue: { fontSize: 16, color: theme.colors.text },
  messageCard: { padding: 20, backgroundColor: `${theme.colors.primary}10`, marginBottom: 32 },
  mascotMessage: { fontSize: 16, color: theme.colors.text, fontStyle: 'italic', textAlign: 'center', lineHeight: 24 },
  button: { marginTop: 'auto' },
});

export default OnboardingCompleteScreen;