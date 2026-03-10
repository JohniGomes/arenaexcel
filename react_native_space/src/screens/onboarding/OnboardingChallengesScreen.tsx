import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingStackParamList } from '../../navigation/types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { theme } from '../../constants/theme';
import { useSound } from '../../contexts/SoundContext';

type OnboardingChallengesScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Challenges'>;
type OnboardingChallengesScreenRouteProp = RouteProp<OnboardingStackParamList, 'Challenges'>;

interface Props {
  navigation: OnboardingChallengesScreenNavigationProp;
  route: OnboardingChallengesScreenRouteProp;
}

const challenges = [
  { id: 'formulas', label: '🧮 Fórmulas complexas' },
  { id: 'tables', label: '📋 Tabelas dinâmicas' },
  { id: 'charts', label: '📈 Gráficos avançados' },
  { id: 'macros', label: '🤖 Macros e automação' },
  { id: 'data', label: '🔍 Análise de dados' },
  { id: 'productivity', label: '⚡ Produtividade' },
];

const OnboardingChallengesScreen: React.FC<Props> = ({ navigation, route }) => {
  const { level, goals, studyTime, area } = route?.params ?? {};
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const { playClick } = useSound();

  const toggleChallenge = (challengeId: string) => {
    setSelectedChallenges((prev) =>
      prev?.includes(challengeId)
        ? prev?.filter((id) => id !== challengeId)
        : [...(prev ?? []), challengeId]
    );
  };

  const handleNext = async () => {
    if ((selectedChallenges?.length ?? 0) === 0) return;
    await playClick();
    navigation.navigate('Complete', {
      level: level ?? 'beginner',
      goals: goals ?? [],
      studyTime: studyTime ?? '10',
      area: area ?? 'other',
      challenges: selectedChallenges,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/excelino-welcome.gif')}
          style={styles.mascot}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Quais seus maiores desafios?</Text>
        <Text style={styles.subtitle}>Selecione um ou mais</Text>

        <ScrollView style={styles.optionsContainer} contentContainerStyle={styles.optionsContent} showsVerticalScrollIndicator={true}>
          {challenges?.map((challenge) => (
            <Card
              key={challenge?.id}
              style={styles.optionCard}
              onPress={() => toggleChallenge(challenge?.id ?? '')}
            >
              <Checkbox.Item
                label={challenge?.label ?? ''}
                status={selectedChallenges?.includes(challenge?.id ?? '') ? 'checked' : 'unchecked'}
                onPress={() => toggleChallenge(challenge?.id ?? '')}
                labelStyle={styles.checkboxLabel}
              />
            </Card>
          ))}
        </ScrollView>

        <Button
          title="Finalizar"
          onPress={handleNext}
          disabled={(selectedChallenges?.length ?? 0) === 0}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, padding: 24 },
  mascot: { width: 100, height: 100, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  optionsContainer: { flex: 1, marginBottom: 16 },
  optionsContent: { paddingBottom: 16 },
  optionCard: { marginBottom: 8, backgroundColor: theme.colors.surface },
  checkboxLabel: { fontSize: 16 },
  button: { marginTop: 8 },
});

export default OnboardingChallengesScreen;