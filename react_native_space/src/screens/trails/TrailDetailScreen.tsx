import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../../services/api.service';
import { theme } from '../../constants/theme';
import { TRAIL_IMAGES, MASCOT_SHADOW } from '../../constants/mascotImages';
import { LearnStackParamList } from '../../navigation/types';

type TrailDetailRouteProp = RouteProp<LearnStackParamList, 'TrailDetail'>;

const TYPE_LABELS: Record<string, string> = {
  MULTIPLE_CHOICE:  'Múltipla Escolha',
  SPREADSHEET_INPUT:'Fórmula',
  FORMULA_BUILDER:  'Fórmula',
  CHART_BUILDER:    'Gráfico',
  DRAG_AND_DROP:    'Seleção',
  FILL_IN_BLANK:    'Completar',
};

interface TrailDetail {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  totalQuestions: number;
  questions: Array<{
    id: string;
    order: number;
    title: string;
    type: string;
    isCompleted?: boolean;
    status?: 'available' | 'completed' | 'locked';
    unlocksAt?: string;
  }>;
  progress?: {
    currentQuestion: number;
    correctAnswers: number;
  };
}

export default function TrailDetailScreen() {
  const [trail, setTrail] = useState<TrailDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [lives, setLives] = useState(5);
  const navigation = useNavigation<any>();
  const route = useRoute<TrailDetailRouteProp>();
  const { slug } = route?.params ?? {};

  useFocusEffect(
    React.useCallback(() => {
      if (slug) loadTrailDetail();
    }, [slug])
  );

  const loadTrailDetail = async () => {
    try {
      const [data, profile] = await Promise.all([
        ApiService.getTrailDetails(slug ?? ''),
        ApiService.getProfile(),
      ]);
      setTrail(data ?? null);
      setLives(profile?.lives ?? 5);
    } catch (error) {
      console.error('Erro ao carregar trilha:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionPress = (question: any) => {
    if (question?.status === 'locked' && question?.unlocksAt) {
      const unlockDate = new Date(question.unlocksAt);
      const now = new Date();
      const minutesLeft = Math.ceil((unlockDate.getTime() - now.getTime()) / 60000);
      Alert.alert(
        '⏳ Questão Bloqueada',
        `Você errou essa questão. Tente novamente em ${minutesLeft} minuto${minutesLeft > 1 ? 's' : ''}.`,
        [{ text: 'OK' }]
      );
      return;
    }
    if (question?.status === 'locked') return;
    navigation.navigate('Question', { slug: slug ?? '', order: question?.order ?? 1 });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (!trail) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Trilha não encontrada</Text>
      </SafeAreaView>
    );
  }

  const completed = trail.questions?.filter(q => q.status === 'completed').length ?? 0;
  const total = trail.totalQuestions ?? 0;
  const percent = total > 0 ? Math.min((completed / total) * 100, 100) : 0;
  const trailColor = trail.color || theme.colors.primary;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar: back + lives */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.livesRow}>
          {[...Array(5)].map((_, i) => (
            <Text key={i} style={{ fontSize: 18, opacity: i < lives ? 1 : 0.25 }}>❤️</Text>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Trail Header */}
        <LinearGradient
          colors={[trailColor, theme.colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.trailHeader}
        >
          {TRAIL_IMAGES[trail?.slug ?? ''] ? (
            <View style={[styles.trailIconWrap, MASCOT_SHADOW]}>
              <Image
                source={TRAIL_IMAGES[trail.slug]}
                style={styles.trailIconImg}
                resizeMode="cover"
              />
            </View>
          ) : (
            <Text style={styles.trailIcon}>{trail?.icon ?? ''}</Text>
          )}
          <Text style={styles.trailName}>{trail?.name ?? ''}</Text>
          <Text style={styles.trailDesc}>{trail?.description ?? ''}</Text>

          {/* Progress bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${percent}%` as any }]} />
            </View>
          </View>
        </LinearGradient>

        {/* Question list */}
        <View style={styles.questionsContainer}>
          {trail?.questions?.map((question, index) => {
            const status = question?.status ?? 'available';
            const isCompleted = status === 'completed';
            const isLocked = status === 'locked';
            const isAvailable = status === 'available';
            const typeLabel = TYPE_LABELS[question.type] ?? question.type;

            let timeLeftText = '';
            if (isLocked && question?.unlocksAt) {
              const minutesLeft = Math.ceil(
                (new Date(question.unlocksAt).getTime() - Date.now()) / 60000
              );
              timeLeftText = `${minutesLeft}min`;
            }

            return (
              <TouchableOpacity
                key={question?.id ?? index}
                style={[
                  styles.questionCard,
                  isCompleted && styles.qCardCompleted,
                  isAvailable && styles.qCardAvailable,
                  isLocked && styles.qCardLocked,
                ]}
                onPress={() => handleQuestionPress(question)}
                activeOpacity={isLocked ? 1 : 0.75}
              >
                {/* Left accent bar */}
                <View style={[
                  styles.accentBar,
                  isCompleted && styles.accentCompleted,
                  isAvailable && styles.accentAvailable,
                  isLocked && styles.accentLocked,
                ]} />

                {/* Number/status circle */}
                <View style={[
                  styles.questionCircle,
                  isCompleted && styles.circleCompleted,
                  isAvailable && styles.circleAvailable,
                  isLocked && styles.circleLocked,
                ]}>
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  ) : isLocked ? (
                    <Ionicons name="lock-closed" size={15} color="#fff" />
                  ) : (
                    <Text style={[styles.circleNumber, isAvailable && styles.circleNumberAvailable]}>
                      {question?.order ?? 0}
                    </Text>
                  )}
                </View>

                {/* Content */}
                <View style={styles.questionContent}>
                  <Text
                    style={[
                      styles.questionTitle,
                      isCompleted && styles.titleCompleted,
                      isLocked && styles.titleLocked,
                      isAvailable && styles.titleAvailable,
                    ]}
                    numberOfLines={2}
                  >
                    {question?.title ?? ''}
                  </Text>
                  <View style={styles.typeBadgeRow}>
                    <View style={[
                      styles.typeBadge,
                      isCompleted && styles.typeBadgeCompleted,
                      isAvailable && styles.typeBadgeAvailable,
                      isLocked && styles.typeBadgeLocked,
                    ]}>
                      <Text style={[
                        styles.typeBadgeText,
                        isCompleted && styles.typeBadgeTextCompleted,
                        isAvailable && styles.typeBadgeTextAvailable,
                        isLocked && styles.typeBadgeTextLocked,
                      ]}>
                        {typeLabel}
                      </Text>
                    </View>
                    {isLocked && timeLeftText !== '' && (
                      <Text style={styles.lockTimeText}>⏳ {timeLeftText}</Text>
                    )}
                  </View>
                </View>

                {/* Right icon */}
                {isCompleted && (
                  <Ionicons name="checkmark-circle" size={22} color="#27AE60" style={styles.rightIcon} />
                )}
                {isAvailable && (
                  <Text style={styles.arrowAvailable}>›</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  // Top bar
  topBar: {
    paddingHorizontal: 16, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  livesRow: { flexDirection: 'row', gap: 4, alignItems: 'center' },

  // Trail header
  trailHeader: {
    marginHorizontal: 16, padding: 24, borderRadius: 20,
    marginBottom: 20, alignItems: 'center', gap: 8,
  },
  trailIcon: { fontSize: 60, marginBottom: 4 },
  trailIconWrap: {
    width: 100, height: 100, borderRadius: 12, overflow: 'hidden',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.7)', marginBottom: 12,
  },
  trailIconImg: { width: 100, height: 100 },
  trailName: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center' },
  trailDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 20 },
  progressSection: { width: '100%', marginTop: 4 },
  progressTrack: {
    width: '100%', height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 3 },

  // Questions container
  questionsContainer: { paddingHorizontal: 16, gap: 10 },

  // Base question card
  questionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 0,
  },

  // -- COMPLETED --
  qCardCompleted: {
    backgroundColor: 'rgba(33,115,70,0.12)',
    shadowColor: 'transparent',
    elevation: 0,
  },
  accentCompleted: { backgroundColor: '#27AE60' },
  circleCompleted: { backgroundColor: '#27AE60' },
  titleCompleted: { color: 'rgba(0,0,0,0.45)', fontWeight: '400' as any },
  typeBadgeCompleted: { backgroundColor: 'rgba(39,174,96,0.15)' },
  typeBadgeTextCompleted: { color: '#217346' },

  // -- AVAILABLE (next to do) --
  qCardAvailable: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  accentAvailable: { backgroundColor: '#F59E0B' },
  circleAvailable: {
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  circleNumberAvailable: { color: '#1A1A2E', fontWeight: '800' as any },
  titleAvailable: { color: '#1A1A2E', fontWeight: '700' as any, fontSize: 15 },
  typeBadgeAvailable: { backgroundColor: 'rgba(245,158,11,0.15)' },
  typeBadgeTextAvailable: { color: '#B45309' },

  // -- LOCKED (timed cooldown) --
  qCardLocked: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    shadowColor: 'transparent',
    elevation: 0,
  },
  accentLocked: { backgroundColor: '#B0BEC5' },
  circleLocked: { backgroundColor: '#B0BEC5' },
  titleLocked: { color: 'rgba(0,0,0,0.3)' },
  typeBadgeLocked: { backgroundColor: 'rgba(0,0,0,0.06)' },
  typeBadgeTextLocked: { color: 'rgba(0,0,0,0.3)' },

  // Shared card internals
  accentBar: { width: 4, alignSelf: 'stretch' },
  questionCircle: {
    width: 38, height: 38, borderRadius: 19,
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 14, flexShrink: 0,
  },
  circleNumber: { fontSize: 15, fontWeight: '700', color: '#fff' },
  questionContent: { flex: 1, paddingVertical: 12, paddingHorizontal: 12, gap: 5 },
  questionTitle: { fontSize: 14, lineHeight: 20 },
  typeBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  typeBadgeText: { fontSize: 11, fontWeight: '600' },
  lockTimeText: { fontSize: 11, color: theme.colors.error, fontWeight: '600' },
  rightIcon: { marginRight: 14 },
  arrowAvailable: {
    fontSize: 24, fontWeight: '800', color: '#F59E0B',
    marginRight: 14, lineHeight: 24,
  },

  errorText: { fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 32 },
});
