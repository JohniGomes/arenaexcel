import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
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

const LessonListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { levelId, levelName } = route?.params ?? {};
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useSnackbar();

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

  const handleLessonPress = (lesson: Lesson) => {
    navigation.navigate('Exercise', {
      lessonId: lesson?.id ?? 0,
      lessonTitle: lesson?.title ?? '',
    });
  };

  const isCompleted = (status: string) => status === 'completed';

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
          const done = isCompleted(lesson?.status ?? 'not_started');
          return (
            <TouchableOpacity
              key={lesson?.id}
              style={[styles.card, done ? styles.cardDone : styles.cardPending]}
              onPress={() => handleLessonPress(lesson)}
              activeOpacity={0.75}
            >
              {/* Left: number circle */}
              <View style={[styles.numCircle, done ? styles.numCircleDone : styles.numCirclePending]}>
                {done ? (
                  <Text style={styles.checkMark}>✓</Text>
                ) : (
                  <Text style={styles.numText}>{index + 1}</Text>
                )}
              </View>

              {/* Middle: title + tag */}
              <View style={styles.textWrap}>
                <Text style={[styles.lessonTitle, done && styles.lessonTitleDone]} numberOfLines={2}>
                  {lesson?.title ?? ''}
                </Text>
                <View style={[styles.tag, done ? styles.tagDone : styles.tagPending]}>
                  <Text style={[styles.tagText, done ? styles.tagTextDone : styles.tagTextPending]}>
                    {done ? 'Concluído' : `${lesson?.exercises ?? 0} exercícios`}
                  </Text>
                </View>
              </View>

              {/* Right: arrow */}
              {!done && (
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
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  cardPending: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  cardDone: {
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },

  numCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  numCirclePending: {
    backgroundColor: '#F59E0B',
  },
  numCircleDone: {
    backgroundColor: '#27AE60',
  },
  numText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  checkMark: { fontSize: 16, fontWeight: '800', color: '#fff' },

  textWrap: { flex: 1, gap: 6 },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    lineHeight: 20,
  },
  lessonTitleDone: {
    color: 'rgba(0,0,0,0.45)',
  },

  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  tagPending: {
    backgroundColor: 'rgba(245,158,11,0.15)',
  },
  tagDone: {
    backgroundColor: 'rgba(39,174,96,0.15)',
  },
  tagText: { fontSize: 12, fontWeight: '600' },
  tagTextPending: { color: '#B45309' },
  tagTextDone: { color: '#217346' },

  arrow: { fontSize: 22, color: '#F59E0B', fontWeight: '700', marginLeft: 4 },
});

export default LessonListScreen;
