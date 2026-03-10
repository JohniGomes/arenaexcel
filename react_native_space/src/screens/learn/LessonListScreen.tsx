import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { LearnStackParamList } from '../../navigation/types';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ApiService from '../../services/api.service';
import { Lesson } from '../../types/api.types';
import Card from '../../components/Card';
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

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'incomplete':
        return 'close-circle';
      case 'in_progress':
        return 'play-circle';
      default:
        return 'radio-button-off';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'incomplete':
        return theme.colors.error;
      case 'in_progress':
        return theme.colors.secondary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'Completo';
      case 'incomplete':
        return 'Incompleto';
      case 'in_progress':
        return 'Continuar';
      default:
        return 'Iniciar';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={theme.colors.text}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        />
        <Text style={styles.headerTitle}>{levelName ?? ''}</Text>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadLessons} colors={[theme.colors.primary]} />
        }
      >
        {lessons?.map((lesson, index) => (
          <Card
            key={lesson?.id}
            style={styles.lessonCard}
            onPress={() => handleLessonPress(lesson)}
          >
            <View style={styles.lessonContent}>
              <View style={styles.lessonIconContainer}>
                <Ionicons
                  name={getStatusIcon(lesson?.status ?? 'not_started')}
                  size={40}
                  color={getStatusColor(lesson?.status ?? 'not_started')}
                />
              </View>
              <View style={styles.lessonTextContainer}>
                <Text style={styles.lessonTitle}>{lesson?.title ?? ''}</Text>
                <Text style={styles.lessonSubtitle}>
                  {lesson?.exercises ?? 0} exercícios
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(lesson?.status ?? 'not_started') },
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {getStatusText(lesson?.status ?? 'not_started')}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  lessonCard: {
    marginBottom: 12,
    padding: 16,
  },
  lessonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonIconContainer: {
    marginRight: 16,
  },
  lessonTextContainer: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  lessonSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default LessonListScreen;
