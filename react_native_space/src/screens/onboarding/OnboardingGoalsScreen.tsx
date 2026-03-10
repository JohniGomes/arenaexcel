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

type OnboardingGoalsScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Goals'>;
type OnboardingGoalsScreenRouteProp = RouteProp<OnboardingStackParamList, 'Goals'>;

interface Props {
  navigation: OnboardingGoalsScreenNavigationProp;
  route: OnboardingGoalsScreenRouteProp;
}

const goals = [
  { id: 'career', label: '📈 Crescer na carreira' },
  { id: 'job', label: '💼 Conseguir emprego melhor' },
  { id: 'analysis', label: '📊 Dominar análises' },
  { id: 'automation', label: '⚡ Automatizar tarefas' },
  { id: 'learn', label: '📚 Aprender do zero' },
  { id: 'expert', label: '🏆 Virar especialista' },
];

const OnboardingGoalsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { level } = route?.params ?? {};
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const { playClick } = useSound();

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev?.includes(goalId)
        ? prev?.filter((id) => id !== goalId)
        : [...(prev ?? []), goalId]
    );
  };

  const handleNext = async () => {
    if ((selectedGoals?.length ?? 0) === 0) return;
    await playClick();
    navigation.navigate('Time', { level: level ?? 'beginner', goals: selectedGoals });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/excelino-welcome.gif')}
          style={styles.mascot}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Quais seus objetivos?</Text>
        <Text style={styles.subtitle}>Selecione um ou mais</Text>

        <ScrollView 
          style={styles.optionsContainer}
          contentContainerStyle={styles.optionsContent}
          showsVerticalScrollIndicator={true}
        >
          {goals?.map((goal) => (
            <Card
              key={goal?.id}
              style={styles.optionCard}
              onPress={() => toggleGoal(goal?.id ?? '')}
            >
              <Checkbox.Item
                label={goal?.label ?? ''}
                status={selectedGoals?.includes(goal?.id ?? '') ? 'checked' : 'unchecked'}
                onPress={() => toggleGoal(goal?.id ?? '')}
                labelStyle={styles.checkboxLabel}
              />
            </Card>
          ))}
        </ScrollView>

        <Button
          title="Continuar"
          onPress={handleNext}
          disabled={(selectedGoals?.length ?? 0) === 0}
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

export default OnboardingGoalsScreen;