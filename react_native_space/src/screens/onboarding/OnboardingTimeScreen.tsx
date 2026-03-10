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

type OnboardingTimeScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Time'>;
type OnboardingTimeScreenRouteProp = RouteProp<OnboardingStackParamList, 'Time'>;

interface Props {
  navigation: OnboardingTimeScreenNavigationProp;
  route: OnboardingTimeScreenRouteProp;
}

const timeOptions = [
  { id: '5', label: '⏱️ 5 minutos/dia', subtitle: 'Bem casual' },
  { id: '10', label: '⏰ 10 minutos/dia', subtitle: 'Padrão' },
  { id: '20', label: '⏲️ 20 minutos/dia', subtitle: 'Comprometido' },
  { id: '30', label: '🔥 30+ minutos/dia', subtitle: 'Intensivo' },
];

const OnboardingTimeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { level, goals } = route?.params ?? {};
  const [selectedTime, setSelectedTime] = useState('');
  const { playClick } = useSound();

  const handleNext = async () => {
    if (!selectedTime) return;
    await playClick();
    navigation.navigate('Area', { level: level ?? 'beginner', goals: goals ?? [], studyTime: selectedTime });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/excelino-welcome.gif')}
          style={styles.mascot}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Quanto tempo pode dedicar?</Text>
        <Text style={styles.subtitle}>Escolha seu ritmo de estudo</Text>

        <ScrollView style={styles.optionsContainer} contentContainerStyle={styles.optionsContent} showsVerticalScrollIndicator={true}>
          {timeOptions?.map((option) => (
            <Card
              key={option?.id}
              style={[
                styles.optionCard,
                selectedTime === option?.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedTime(option?.id ?? '')}
            >
              <Text style={[
                styles.optionTitle,
                selectedTime === option?.id && styles.optionTitleSelected,
              ]}>
                {option?.label ?? ''}
              </Text>
              <Text style={styles.optionSubtitle}>{option?.subtitle ?? ''}</Text>
            </Card>
          ))}
        </ScrollView>

        <Button
          title="Continuar"
          onPress={handleNext}
          disabled={!selectedTime}
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
  optionCard: { marginBottom: 12, padding: 20, backgroundColor: theme.colors.surface },
  optionCardSelected: { backgroundColor: `${theme.colors.primary}15`, borderColor: theme.colors.primary, borderWidth: 2 },
  optionTitle: { fontSize: 18, fontWeight: '600', color: theme.colors.text, marginBottom: 4 },
  optionTitleSelected: { color: theme.colors.primary },
  optionSubtitle: { fontSize: 14, color: theme.colors.textSecondary },
  button: { marginTop: 8 },
});

export default OnboardingTimeScreen;