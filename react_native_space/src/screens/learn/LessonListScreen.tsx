import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { LearnStackParamList } from '../../navigation/types';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ApiService from '../../services/api.service';
import { Lesson } from '../../types/api.types';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type LessonListScreenNavigationProp = StackNavigationProp<LearnStackParamList, 'LessonList'>;
type LessonListScreenRouteProp = RouteProp<LearnStackParamList, 'LessonList'>;

interface Props {
  navigation: LessonListScreenNavigationProp;
  route: LessonListScreenRouteProp;
}

type LessonState = 'completed' | 'available' | 'locked' | 'cooldown';

const formatCountdown = (canRetryAt: string | null | undefined): string => {
  if (!canRetryAt) return '';
  const remaining = Math.max(0, new Date(canRetryAt).getTime() - Date.now());
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const LessonListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { levelId, levelName } = route?.params ?? {};
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const { showError } = useSnackbar();

  // Tick every second to update countdowns
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLessons();
    }, [levelId])
  );

  const loadLessons = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getProgress();
      const level = response?.levels?.find(l => l?.id === levelId);
      setLessons(level?.lessons ?? []);
    } catch (error) {
      console.error('Error loading lessons:', error);
      showError('Erro ao carregar lições');
    } finally {
      setLoading(false);
    }
  };

  const getLessonState = (lesson: Lesson, index: number): LessonState => {
    if (lesson?.status === 'completed') return 'completed';
    // Sequential lock: previous lesson must be completed
    if (index > 0 && lessons[index - 1]?.status !== 'completed') return 'locked';
    // Cooldown: failed and timer still active
    if (lesson?.status === 'incomplete' && lesson?.canRetryAt) {
      if (new Date(lesson.canRetryAt).getTime() > Date.now()) return 'cooldown';
    }
    return 'available';
  };

  const handleLessonPress = (lesson: Lesson, state: LessonState) => {
    if (state === 'completed') {
      Alert.alert('Lição concluída!', 'Você já completou esta lição com sucesso.', [{ text: 'OK' }]);
      return;
    }
    if (state === 'locked') {
      Alert.alert('Bloqueada', 'Complete a lição anterior para desbloquear esta.', [{ text: 'OK' }]);
      return;
    }
    if (state === 'cooldown') {
      const remaining = formatCountdown(lesson?.canRetryAt);
      Alert.alert('Aguarde', `Disponível novamente em ${remaining}.`, [{ text: 'OK' }]);
      return;
    }
    navigation.navigate('Exercise', {
      lessonId: lesson?.id ?? 0,
      lessonTitle: lesson?.title ?? '',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{levelName ?? ''}</Text>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadLessons} colors={[theme.colors.primary]} />
        }
      >
        {lessons?.map((lesson, index) => {
          const state = getLessonState(lesson, index);
          const countdown = state === 'cooldown' ? formatCountdown(lesson?.canRetryAt) : '';

          return (
            <TouchableOpacity
              key={lesson?.id}
              style={[
                styles.card,
                state === 'completed' && styles.cardCompleted,
                state === 'available' && styles.cardAvailable,
                state === 'locked' && styles.cardLocked,
                state === 'cooldown' && styles.cardCooldown,
              ]}
              onPress={() => handleLessonPress(lesson, state)}
              activeOpacity={state === 'available' ? 0.75 : 1}
            >
              {/* Left: circle */}
              <View style={[
                styles.circle,
                state === 'completed' && styles.circleCompleted,
                state === 'available' && styles.circleAvailable,
                state === 'locked' && styles.circleLocked,
                state === 'cooldown' && styles.circleCooldown,
              ]}>
                {state === 'completed' && <Text style={styles.circleSymbol}>✓</Text>}
                {state === 'available' && <Text style={styles.circleSymbol}>{index + 1}</Text>}
                {state === 'locked' && <Ionicons name="lock-closed" size={16} color="#fff" />}
                {state === 'cooldown' && <Text style={styles.circleSymbol}>⏰</Text>}
              </View>

              {/* Middle: title + badge */}
              <View style={styles.textWrap}>
                <Text
                  style={[
                    styles.title,
                    (state === 'completed' || state === 'locked' || state === 'cooldown') && styles.titleDimmed,
                    state === 'available' && styles.titleAvailable,
                  ]}
                  numberOfLines={2}
                >
                  {lesson?.title ?? ''}
                </Text>

                {state === 'completed' && (
                  <View style={styles.tagCompleted}>
                    <Text style={styles.tagTextCompleted}>Concluído</Text>
                  </View>
                )}
                {state === 'locked' && (
                  <View style={styles.tagLocked}>
                    <Text style={styles.tagTextLocked}>Bloqueado</Text>
                  </View>
                )}
                {state === 'cooldown' && countdown !== '' && (
                  <Text style={styles.cooldownText}>🕐 Disponível em {countdown}</Text>
                )}
              </View>

              {/* Right: arrow for available */}
              {state === 'available' && (
                <Text style={styles.arrow}>›</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: theme.colors.text },
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  cardAvailable: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardCompleted: {
    backgroundColor: 'rgba(33,115,70,0.12)',
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  cardLocked: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderLeftWidth: 4,
    borderLeftColor: '#B0BEC5',
  },
  cardCooldown: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },

  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  circleAvailable: { backgroundColor: '#F59E0B' },
  circleCompleted: { backgroundColor: '#27AE60' },
  circleLocked: { backgroundColor: '#B0BEC5' },
  circleCooldown: { backgroundColor: '#EF4444' },
  circleSymbol: { fontSize: 15, fontWeight: '800', color: '#fff' },

  textWrap: { flex: 1, gap: 5 },
  title: { fontSize: 15, lineHeight: 20 },
  titleAvailable: { fontWeight: '700', color: '#1A1A2E' },
  titleDimmed: { color: 'rgba(0,0,0,0.35)', fontWeight: '500' },

  tagCompleted: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(39,174,96,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  tagTextCompleted: { fontSize: 12, fontWeight: '600', color: '#217346' },
  tagLocked: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  tagTextLocked: { fontSize: 12, fontWeight: '600', color: 'rgba(0,0,0,0.35)' },
  cooldownText: { fontSize: 12, fontWeight: '700', color: '#EF4444' },

  arrow: { fontSize: 22, color: '#F59E0B', fontWeight: '700', marginLeft: 4 },
});

export default LessonListScreen;
