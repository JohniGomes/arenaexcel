import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { LearnStackParamList } from '../../navigation/types';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useSound } from '../../contexts/SoundContext';
import ApiService from '../../services/api.service';
import { Exercise } from '../../types/api.types';
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

const LETTERS = ['A', 'B', 'C', 'D'];

const ExerciseScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lessonId, lessonTitle } = route?.params ?? {};
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [lives, setLives] = useState(5);
  const [totalXp, setTotalXp] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lessonStatus, setLessonStatus] = useState<string>('not_started');
  const [canRetryAt, setCanRetryAt] = useState<string | null>(null);
  const [retryWaitSeconds, setRetryWaitSeconds] = useState<number>(0);
  const { showError } = useSnackbar();
  const { playSuccess, playError } = useSound();

  useEffect(() => {
    loadExercises();
  }, [lessonId]);

  useEffect(() => {
    if (retryWaitSeconds > 0) {
      const timer = setInterval(() => {
        setRetryWaitSeconds((prev) => {
          if (prev <= 1) {
            setLessonStatus('not_started');
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

  const handleOptionSelect = (idx: number, value: string) => {
    if (showFeedback) return;
    setSelectedIndex(idx);
    setSelectedOption(value);
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
      setCorrectAnswer(response?.correctAnswer ?? '');
      setLives(response?.livesRemaining ?? 5);
      setTotalXp(totalXp + (response?.xpEarned ?? 0));
      setShowFeedback(true);

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
      setSelectedIndex(null);
      setSelectedOption('');
      setShowFeedback(false);
      setShowHint(false);
    } else {
      if (lessonStatus === 'completed') {
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
          Alert.alert('Parabéns!', `Lição completa! Você ganhou ${totalXp} XP!`, [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      } else if (lessonStatus === 'incomplete') {
        const minutes = Math.floor(retryWaitSeconds / 60);
        const seconds = retryWaitSeconds % 60;
        Alert.alert(
          'Resposta Incorreta',
          `Você pode tentar novamente em ${minutes}:${seconds.toString().padStart(2, '0')} minutos.`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        navigation.goBack();
      }
    }
  };

  const currentExercise = exercises?.[currentIndex];
  const progress = (currentIndex + 1) / (exercises?.length ?? 1);
  const options = currentExercise?.options
    ? Array.isArray(currentExercise.options)
      ? currentExercise.options
      : Object.values(currentExercise.options as any)
    : [];

  const getOptionStyle = (idx: number) => {
    if (!showFeedback) {
      if (selectedIndex === idx) return styles.optionSelected;
      return {};
    }
    if (selectedIndex === idx) {
      return isCorrect ? styles.optionCorrect : styles.optionWrong;
    }
    return {};
  };

  const getCircleStyle = (idx: number) => {
    if (!showFeedback) {
      if (selectedIndex === idx) return styles.circleSelected;
      return {};
    }
    if (selectedIndex === idx) {
      return isCorrect ? styles.circleCorrect : styles.circleWrong;
    }
    return {};
  };

  const getLetterColor = (idx: number) => {
    if (!showFeedback) {
      if (selectedIndex === idx) return '#fff';
      return '#217346';
    }
    if (selectedIndex === idx) return '#fff';
    return '#217346';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Progress bar */}
      <ProgressBar progress={progress} style={styles.progressBar} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="close" size={26} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.questionNumber}>
            Questão {currentIndex + 1}/{exercises?.length ?? '?'}
          </Text>
          {currentExercise?.hint && (
            <TouchableOpacity
              onPress={() => setShowHint(!showHint)}
              style={styles.hintBtn}
            >
              <Text style={styles.hintIcon}>💡</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.livesContainer}>
          {[...Array(5)].map((_, i) => (
            <HeartIcon key={i} filled={i < lives} size={20} />
          ))}
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {currentExercise && (
          <>
            {/* Excel image or mascot */}
            {!showFeedback && (() => {
              const imageUrl = getExerciseImageUrl(currentExercise?.imageUrl);
              if (imageUrl) {
                return (
                  <Image
                    source={{ uri: addCacheBuster(imageUrl, __DEV__) }}
                    style={styles.exerciseImage}
                    resizeMode="contain"
                    onError={(e) => console.error('Erro ao carregar imagem:', e.nativeEvent.error)}
                  />
                );
              } else {
                return (
                  <Image
                    source={require('../../../assets/excelino-thinking.gif')}
                    style={styles.mascot}
                    resizeMode="contain"
                  />
                );
              }
            })()}

            {showFeedback && isCorrect && (
              <Image
                source={require('../../../assets/excelino-celebrating.gif')}
                style={styles.mascot}
                resizeMode="contain"
              />
            )}

            <Text style={styles.question}>{currentExercise?.question ?? ''}</Text>

            {/* Hint box */}
            {showHint && currentExercise?.hint && (
              <View style={styles.hintBox}>
                <Text style={styles.hintTitle}>💡 Dica</Text>
                <Text style={styles.hintText}>{currentExercise.hint}</Text>
              </View>
            )}

            {/* Multiple choice options */}
            {currentExercise?.type === 'multiple_choice' && (
              <View style={styles.options}>
                {options.map((option: string, idx: number) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.option, getOptionStyle(idx)]}
                    onPress={() => handleOptionSelect(idx, option)}
                    disabled={showFeedback}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.letterCircle, getCircleStyle(idx)]}>
                      <Text style={[styles.letterText, { color: getLetterColor(idx) }]}>
                        {LETTERS[idx] ?? String(idx + 1)}
                      </Text>
                    </View>
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Text / formula input */}
            {(currentExercise?.type === 'formula' || currentExercise?.type === 'interactive') && (
              <TextInput
                placeholder="Sua resposta"
                value={answer}
                onChangeText={setAnswer}
                style={styles.input}
                multiline={currentExercise.type === 'formula'}
                placeholderTextColor="#999"
              />
            )}

            {/* Cooldown warning */}
            {retryWaitSeconds > 0 && !showFeedback && (
              <View style={styles.cooldownAlert}>
                <Ionicons name="time-outline" size={20} color={theme.colors.error} />
                <Text style={styles.cooldownText}>
                  Aguarde {Math.floor(retryWaitSeconds / 60)}:{(retryWaitSeconds % 60).toString().padStart(2, '0')} para tentar novamente
                </Text>
              </View>
            )}

            {/* Verify button */}
            {!showFeedback && (
              <TouchableOpacity
                style={[
                  styles.verifyBtn,
                  (selectedIndex === null && !answer.trim()) && styles.verifyBtnDisabled,
                ]}
                onPress={handleSubmit}
                disabled={loading || retryWaitSeconds > 0 || (selectedIndex === null && !answer.trim())}
                activeOpacity={0.85}
              >
                <Text style={styles.verifyBtnText}>
                  {loading ? 'Verificando...' : 'Verificar'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Feedback card */}
            {showFeedback && (
              <View style={[styles.feedbackCard, isCorrect ? styles.feedbackCardOk : styles.feedbackCardFail]}>
                <View style={styles.feedbackHeader}>
                  <Text style={styles.feedbackIcon}>{isCorrect ? '✅' : '❌'}</Text>
                  <Text style={[styles.feedbackTitle, { color: isCorrect ? '#27AE60' : '#EF4444' }]}>
                    {isCorrect ? 'Correto!' : 'Incorreto!'}
                  </Text>
                </View>
                <Text style={styles.feedbackText}>
                  {isCorrect
                    ? explanation
                    : `A resposta correta é: ${correctAnswer || explanation}`}
                </Text>
              </View>
            )}

            {/* Continue button */}
            {showFeedback && (
              <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.85}>
                <Text style={styles.continueBtnText}>Continuar</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  progressBar: { marginHorizontal: 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 8,
  },
  backBtn: { padding: 4 },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  questionNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  hintBtn: {
    padding: 4,
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFB300',
  },
  hintIcon: { fontSize: 16 },
  livesContainer: { flexDirection: 'row', gap: 4 },
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  mascot: { width: 100, height: 100, alignSelf: 'center', marginBottom: 16 },
  exerciseImage: {
    width: '100%',
    height: 220,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  question: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 20,
    lineHeight: 26,
  },

  hintBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#FFD54F',
  },
  hintTitle: { fontSize: 13, fontWeight: '700', color: '#F57F17', marginBottom: 4 },
  hintText: { fontSize: 13, color: '#666', lineHeight: 19 },

  options: { gap: 10, marginBottom: 16 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 1,
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: '#217346',
    backgroundColor: 'rgba(33,115,70,0.06)',
  },
  optionCorrect: {
    borderWidth: 2,
    borderColor: '#27AE60',
    backgroundColor: 'rgba(39,174,96,0.1)',
  },
  optionWrong: {
    borderWidth: 2,
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239,68,68,0.08)',
  },
  letterCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  circleSelected: {
    backgroundColor: '#217346',
    borderColor: '#217346',
  },
  circleCorrect: {
    backgroundColor: '#27AE60',
    borderColor: '#27AE60',
  },
  circleWrong: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  letterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#217346',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A2E',
    lineHeight: 20,
  },

  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1A1A2E',
    backgroundColor: '#fff',
    marginBottom: 16,
  },

  cooldownAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  cooldownText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.error,
    fontWeight: '600',
  },

  verifyBtn: {
    backgroundColor: '#217346',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#217346',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  verifyBtnDisabled: {
    backgroundColor: '#B0BEC5',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyBtnText: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },

  feedbackCard: {
    borderRadius: 14,
    padding: 18,
    marginTop: 16,
    borderWidth: 1.5,
  },
  feedbackCardOk: {
    backgroundColor: '#DCFCE7',
    borderColor: '#27AE60',
  },
  feedbackCardFail: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  feedbackIcon: { fontSize: 22 },
  feedbackTitle: { fontSize: 18, fontWeight: '800' },
  feedbackText: { fontSize: 14, color: '#1A1A2E', lineHeight: 21 },

  continueBtn: {
    backgroundColor: '#217346',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#217346',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  continueBtnText: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
});

export default ExerciseScreen;
