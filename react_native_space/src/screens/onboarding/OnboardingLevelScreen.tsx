import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { theme } from '../../constants/theme';
import { useSound } from '../../contexts/SoundContext';

type OnboardingLevelScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Level'>;

interface Props {
  navigation: OnboardingLevelScreenNavigationProp;
}

const levels = [
  { id: 'beginner', title: 'Iniciante', subtitle: 'Nunca usei Excel' },
  { id: 'intermediate', title: 'Intermediário', subtitle: 'Conheço o básico' },
  { id: 'advanced', title: 'Avançado', subtitle: 'Já domino bem' },
  { id: 'dontknow', title: 'Não sei', subtitle: 'Farei um teste rápido' },
];

const OnboardingLevelScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedLevel, setSelectedLevel] = useState('');
  const { playClick } = useSound();

  const handleNext = async () => {
    if (!selectedLevel) return;
    await playClick();
    
    if (selectedLevel === 'dontknow') {
      navigation.navigate('QuickTest', { level: selectedLevel });
    } else {
      navigation.navigate('Goals', { level: selectedLevel });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/excelino-welcome.gif')}
          style={styles.mascot}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Qual seu nível no Excel?</Text>
        <Text style={styles.subtitle}>Vamos personalizar sua jornada</Text>

        <ScrollView style={styles.optionsContainer} contentContainerStyle={styles.optionsContent} showsVerticalScrollIndicator={true}>
          {levels?.map((level) => (
            <Card
              key={level?.id}
              style={[
                styles.optionCard,
                selectedLevel === level?.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedLevel(level?.id ?? '')}
            >
              <Text style={[
                styles.optionTitle,
                selectedLevel === level?.id && styles.optionTitleSelected,
              ]}>
                {level?.title ?? ''}
              </Text>
              <Text style={styles.optionSubtitle}>{level?.subtitle ?? ''}</Text>
            </Card>
          ))}
        </ScrollView>

        <Button
          title="Continuar"
          onPress={handleNext}
          disabled={!selectedLevel}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, padding: 24 },
  mascot: { width: 120, height: 120, alignSelf: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  optionsContainer: { flex: 1, marginBottom: 16 },
  optionsContent: { paddingBottom: 16 },
  optionCard: { marginBottom: 12, padding: 20, backgroundColor: theme.colors.surface },
  optionCardSelected: { backgroundColor: `${theme.colors.primary}15`, borderColor: theme.colors.primary, borderWidth: 2 },
  optionTitle: { fontSize: 18, fontWeight: '600', color: theme.colors.text, marginBottom: 4 },
  optionTitleSelected: { color: theme.colors.primary },
  optionSubtitle: { fontSize: 14, color: theme.colors.textSecondary },
  button: { marginTop: 8 },
});

export default OnboardingLevelScreen;