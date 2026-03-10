import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingStackParamList } from '../../navigation/types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { theme } from '../../constants/theme';
import { useSound } from '../../contexts/SoundContext';

type OnboardingAreaScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Area'>;
type OnboardingAreaScreenRouteProp = RouteProp<OnboardingStackParamList, 'Area'>;

interface Props {
  navigation: OnboardingAreaScreenNavigationProp;
  route: OnboardingAreaScreenRouteProp;
}

const areas = [
  { id: 'administrative', label: '📋 Administrativo' },
  { id: 'financial', label: '💰 Financeiro' },
  { id: 'logistics', label: '🚚 Logística' },
  { id: 'hr', label: '👥 RH' },
  { id: 'sales', label: '💼 Comercial' },
  { id: 'student', label: '🎓 Estudante' },
  { id: 'other', label: '🔧 Outro' },
];

const OnboardingAreaScreen: React.FC<Props> = ({ navigation, route }) => {
  const { level, goals, studyTime } = route?.params ?? {};
  const [selectedArea, setSelectedArea] = useState('');
  const { playClick } = useSound();

  const handleNext = async () => {
    if (!selectedArea) return;
    await playClick();
    navigation.navigate('Challenges', { level: level ?? 'beginner', goals: goals ?? [], studyTime: studyTime ?? '10', area: selectedArea });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/excelino-welcome.gif')}
          style={styles.mascot}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Qual sua área de atuação?</Text>
        <Text style={styles.subtitle}>Vamos adaptar os exemplos</Text>

        <ScrollView style={styles.optionsContainer} contentContainerStyle={styles.optionsContent} showsVerticalScrollIndicator={true}>
          {areas?.map((area) => (
            <Card
              key={area?.id}
              style={[
                styles.optionCard,
                selectedArea === area?.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedArea(area?.id ?? '')}
            >
              <Text style={[
                styles.optionTitle,
                selectedArea === area?.id && styles.optionTitleSelected,
              ]}>
                {area?.label ?? ''}
              </Text>
            </Card>
          ))}
        </ScrollView>

        <Button
          title="Continuar"
          onPress={handleNext}
          disabled={!selectedArea}
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
  optionCard: { marginBottom: 8, padding: 16, backgroundColor: theme.colors.surface },
  optionCardSelected: { backgroundColor: `${theme.colors.primary}15`, borderColor: theme.colors.primary, borderWidth: 2 },
  optionTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  optionTitleSelected: { color: theme.colors.primary },
  button: { marginTop: 8 },
});

export default OnboardingAreaScreen;