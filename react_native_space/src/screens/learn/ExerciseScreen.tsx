import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Text, TextInput, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { LearnStackParamList } from '../../navigation/types';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useSound } from '../../contexts/SoundContext';
import ApiService from '../../services/api.service';
import { Exercise } from '../../types/api.types';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import HeartIcon from '../../components/HeartIcon';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { getExerciseImageUrl, addCacheBuster } from '../../utils/imageUtils';

type ExerciseScreenNavigationProp = StackNavigationProp<LearnStackParamList, 'Exercise'>;
type ExerciseScreenRouteProp = RouteProp<LearnStackParamList, 'Exercise'>;

interface Props {
  navigation: ExerciseScreenNavigationProp;
  route: ExerciseScreenRouteProp;
}

const ExerciseScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lessonId, lessonTitle } = route?.params ?? {};
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [lives, setLives] = useState(5);
  const [totalXp, setTotalXp] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lessonStatus, setLessonStatus] = useState<string>('not_started');
  const [canRetryAt, setCanRetryAt] = useState<string | null>(null);
  const [retryWaitSeconds, setRetryWaitSeconds] = useState<number>(0);
  const { showError, showSuccess } = useSnackbar();
  const { playSuccess, playError } = useSound();

  useEffect(() => {
    loadExercises();
  }, [lessonId]);

  // Countdown timer for retry cooldown
  useEffect(() => {
    if (retryWaitSeconds > 0) {
      const timer = setInterval(() => {
        setRetryWaitSeconds((prev) => {
          if (prev <= 1) {
            setLessonStatus('not_started'); // Reset status when cooldown ends
            setCanRetryAt(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [retryWaitSeconds]);

  const loadExercises = async () => {
    try {
      const response = await ApiService.getExercisesByLesson(lessonId ?? 0);
      setExercises(response?.exercises ?? []);
      setLessonStatus(response?.lessonStatus ?? 'not_started');
      setCanRetryAt(response?.canRetryAt ?? null);
      
      // Calculate retry wait time if needed
      if (response?.canRetryAt && response?.lessonStatus === 'incomplete') {
        const retryTime = new Date(response.canRetryAt).getTime();
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((retryTime - now) / 1000));
        setRetryWaitSeconds(diff);
      }
    } catch (error) {
      console.error('Error loading exercises:', error);
      showError('Erro ao carregar exercícios');
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    const currentExercise = exercises?.[currentIndex];
    if (!currentExercise) return;

    const userAnswer = currentExercise.type === 'multiple_choice' ? selectedOption : answer;
    if (!userAnswer?.trim()) {
      showError('Por favor, selecione ou digite uma resposta');
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.submitAnswer({
        exerciseId: currentExercise.id,
        answer: userAnswer,
      });

      const correct = response?.correct ?? false;
      setIsCorrect(correct);
      setExplanation(response?.explanation ?? '');
      setLives(response?.livesRemaining ?? 5);
      setTotalXp(totalXp + (response?.xpEarned ?? 0));
      setShowFeedback(true);
      
      // Update lesson status
      if (correct) {
        setLessonStatus('completed');
        setCanRetryAt(null);
        setRetryWaitSeconds(0);
      } else {
        setLessonStatus('incomplete');
        setCanRetryAt(response?.canRetryAt ?? null);
        if (response?.canRetryAt) {
          const retryTime = new Date(response.canRetryAt).getTime();
          const now = Date.now();
          const diff = Math.max(0, Math.ceil((retryTime - now) / 1000));
          setRetryWaitSeconds(diff);
        }
      }
      
      // Play sound based on result
      if (correct) {
        await playSuccess();
      } else {
        await playError();
      }
    } catch (error: any) {
      showError(error?.response?.data?.message || 'Erro ao enviar resposta');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (currentIndex < (exercises?.length ?? 0) - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer('');
      setSelectedOption('');
      setShowFeedback(false);
    } else {
      // Last question - check lesson status
      if (lessonStatus === 'completed') {
        // Only update if completed successfully
        try {
          await ApiService.updateLesson({
            lessonId: lessonId ?? 0,
            completed: true,
            xpEarned: totalXp,
          });
          
          Alert.alert('Parabéns!', `Lição completa! Você ganhou ${totalXp} XP!`, [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        } catch (error) {
          console.error('Error saving lesson progress:', error);
          Alert.alert('Parabéns!', `Lição completa! Você ganhou ${totalXp} XP!`, [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      } else if (lessonStatus === 'incomplete') {
        // Failed - show retry message
        const minutes = Math.floor(retryWaitSeconds / 60);
        const seconds = retryWaitSeconds % 60;
        Alert.alert(
          'Resposta Incorreta', 
          `Você pode tentar novamente em ${minutes}:${seconds.toString().padStart(2, '0')} minutos.`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        // Other status - just go back
        navigation.goBack();
      }
    }
  };

  const currentExercise = exercises?.[currentIndex];
  const progress = (currentIndex + 1) / (exercises?.length ?? 1);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Ionicons
          name="close"
          size={28}
          color={theme.colors.text}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
        />
        <ProgressBar progress={progress} style={styles.progressBar} />
        <View style={styles.livesContainer}>
          {[...Array(5)].map((_, i) => (
            <HeartIcon key={i} filled={i < lives} size={20} />
          ))}
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {currentExercise && (
          <>
            {/* Renderiza imagem do exercício ou mascote pensativo */}
            {!showFeedback && (() => {
              const imageUrl = getExerciseImageUrl(currentExercise?.imageUrl);
              
              if (imageUrl) {
                // Exercício tem imagem - mostra a imagem
                return (
                  <Image
                    source={{ uri: addCacheBuster(imageUrl, __DEV__) }}
                    style={styles.exerciseImage}
                    resizeMode="contain"
                    onError={(e) => console.error('Erro ao carregar imagem:', e.nativeEvent.error)}
                    onLoad={() => console.log('✅ Imagem carregada:', imageUrl)}
                  />
                );
              } else {
                // Exercício sem imagem - mostra mascote pensativo
                return (
                  <Image
                    source={require('../../../assets/excelino-thinking.gif')}
                    style={styles.mascot}
                    resizeMode="contain"
                  />
                );
              }
            })()}
            
            {/* Mostra mascote comemorando ao acertar */}
            {showFeedback && isCorrect && (
              <Image
                source={require('../../../assets/excelino-celebrating.gif')}
                style={styles.mascot}
                resizeMode="contain"
              />
            )}
            
            <Text style={styles.question}>{currentExercise?.question ?? ''}</Text>

            {currentExercise?.type === 'multiple_choice' && currentExercise?.options && (
              <RadioButton.Group
                onValueChange={value => setSelectedOption(value)}
                value={selectedOption}
              >
                {(Array.isArray(currentExercise.options) ? currentExercise.options : Object.values(currentExercise.options)).map((option, index) => (
                  <View key={index} style={styles.optionContainer}>
                    <RadioButton.Item
                      label={`${index}. ${option}`}
                      value={option}
                      style={styles.radioButton}
                    />
                  </View>
                ))}
              </RadioButton.Group>
            )}

            {(currentExercise?.type === 'formula' || currentExercise?.type === 'interactive') && (
              <TextInput
                label="Sua resposta"
                value={answer}
                onChangeText={setAnswer}
                mode="outlined"
                style={styles.input}
                multiline={currentExercise.type === 'formula'}
              />
            )}

            {currentExercise?.hint && !showFeedback && (
              <View style={styles.hintContainer}>
                <Ionicons name="bulb-outline" size={16} color={theme.colors.secondary} />
                <Text style={styles.hintText}>{currentExercise.hint}</Text>
              </View>
            )}

            {showFeedback && (
              <View style={[styles.feedbackContainer, { backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE' }]}>
                <View style={styles.feedbackHeader}>
                  <Ionicons
                    name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                    size={32}
                    color={isCorrect ? theme.colors.success : theme.colors.error}
                  />
                  <Text style={[styles.feedbackTitle, { color: isCorrect ? theme.colors.success : theme.colors.error }]}>
                    {isCorrect ? 'Correto!' : 'Incorreto'}
                  </Text>
                </View>
                <Text style={styles.feedbackText}>{explanation}</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {retryWaitSeconds > 0 && !showFeedback && (
          <View style={styles.cooldownAlert}>
            <Ionicons name="time-outline" size={20} color={theme.colors.error} />
            <Text style={styles.cooldownText}>
              Aguarde {Math.floor(retryWaitSeconds / 60)}:{(retryWaitSeconds % 60).toString().padStart(2, '0')} para tentar novamente
            </Text>
          </View>
        )}
        {!showFeedback ? (
          <Button 
            title="Verificar" 
            onPress={handleSubmit} 
            loading={loading} 
            disabled={retryWaitSeconds > 0}
          />
        ) : (
          <Button title="Continuar" onPress={handleContinue} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  progressBar: { flex: 1, marginHorizontal: 16 },
  livesContainer: { flexDirection: 'row', gap: 4 },
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  mascot: { width: 100, height: 100, alignSelf: 'center', marginBottom: 16 },
  exerciseImage: { width: '100%', height: 250, alignSelf: 'center', marginBottom: 24, borderRadius: 12, backgroundColor: '#f5f5f5' },
  question: { fontSize: 20, fontWeight: '600', color: theme.colors.text, marginBottom: 24 },
  image: { width: '100%', height: 200, marginBottom: 24, borderRadius: 12 },
  optionContainer: { marginBottom: 8 },
  radioButton: { backgroundColor: theme.colors.surface, borderRadius: 12 },
  input: { marginBottom: 16 },
  hintContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#E3F2FD', borderRadius: 8, marginTop: 16 },
  hintText: { flex: 1, marginLeft: 8, fontSize: 14, color: theme.colors.secondary },
  feedbackContainer: { padding: 20, borderRadius: 12, marginTop: 24 },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  feedbackTitle: { fontSize: 20, fontWeight: '700', marginLeft: 12 },
  feedbackText: { fontSize: 16, color: theme.colors.text },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: theme.colors.border },
  cooldownAlert: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    backgroundColor: '#FFEBEE', 
    borderRadius: 8, 
    marginBottom: 12 
  },
  cooldownText: { 
    flex: 1, 
    marginLeft: 8, 
    fontSize: 14, 
    color: theme.colors.error, 
    fontWeight: '600' 
  },
});

export default ExerciseScreen;
