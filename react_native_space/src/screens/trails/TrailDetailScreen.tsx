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

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  MULTIPLE_CHOICE:  { label: 'Múltipla Escolha', color: '#1565C0' },
  SPREADSHEET_INPUT:{ label: 'Fórmula',          color: '#217346' },
  FORMULA_BUILDER:  { label: 'Fórmula',          color: '#217346' },
  CHART_BUILDER:    { label: 'Gráfico',           color: '#E65100' },
  DRAG_AND_DROP:    { label: 'Seleção',           color: '#00695C' },
  FILL_IN_BLANK:    { label: 'Completar',         color: '#4A148C' },
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
      const data = await ApiService.getTrailDetails(slug ?? '');
      setTrail(data ?? null);
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
      {/* Header com botão voltar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
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

          {/* Barra de progresso */}
          <View style={styles.progressSection}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${percent}%` }]} />
            </View>
          </View>
        </LinearGradient>

        {/* Lista de questões */}
        <View style={styles.questionsContainer}>
          {trail?.questions?.map((question, index) => {
            const status = question?.status ?? 'available';
            const isCompleted = status === 'completed';
            const isLocked = status === 'locked';
            const typeInfo = TYPE_LABELS[question.type] ?? { label: question.type, color: theme.colors.primary };

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
                  isCompleted && styles.questionCardCompleted,
                  isLocked && styles.questionCardLocked,
                ]}
                onPress={() => handleQuestionPress(question)}
                activeOpacity={0.7}
              >
                {/* Barra de status lateral */}
                <View style={[
                  styles.statusBar,
                  isCompleted && { backgroundColor: theme.colors.success },
                  isLocked && { backgroundColor: theme.colors.error },
                  !isCompleted && !isLocked && { backgroundColor: trailColor },
                ]} />

                <View style={styles.questionLeft}>
                  {/* Número / ícone de status */}
                  <View style={[
                    styles.questionNumber,
                    isCompleted && { backgroundColor: theme.colors.success },
                    isLocked && { backgroundColor: theme.colors.error },
                    !isCompleted && !isLocked && { backgroundColor: trailColor },
                  ]}>
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={18} color="#fff" />
                    ) : isLocked ? (
                      <Ionicons name="time-outline" size={18} color="#fff" />
                    ) : (
                      <Text style={styles.questionNumberText}>{question?.order ?? 0}</Text>
                    )}
                  </View>

                  {/* Título e badge de tipo */}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.questionTitle} numberOfLines={2}>
                      {question?.title ?? ''}
                    </Text>

                    <View style={styles.typeBadgeRow}>
                      <View style={[styles.typeBadge, { backgroundColor: typeInfo.color + '18' }]}>
                        <Text style={styles.typeBadgeText}>
                          {typeInfo.label}
                        </Text>
                      </View>
                      {isLocked && timeLeftText && (
                        <Text style={styles.lockTimeText}>⏳ {timeLeftText}</Text>
                      )}
                    </View>
                  </View>
                </View>

                <Ionicons
                  name={isCompleted ? 'checkmark-circle' : isLocked ? 'lock-closed' : 'chevron-forward'}
                  size={22}
                  color={
                    isCompleted ? theme.colors.success
                    : isLocked ? theme.colors.error
                    : theme.colors.border
                  }
                />
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
  topBar: { paddingHorizontal: 16, paddingVertical: 10 },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  trailHeader: {
    marginHorizontal: 16, padding: 24, borderRadius: 20,
    marginBottom: 20, alignItems: 'center', gap: 8,
  },
  trailIcon: { fontSize: 60, marginBottom: 4 },
  trailIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  trailIconImg: { width: 100, height: 100 },
  trailName: {
    fontSize: 26, fontWeight: '800', color: '#fff',
    textAlign: 'center',
  },
  trailDesc: {
    fontSize: 14, color: 'rgba(255,255,255,0.9)',
    textAlign: 'center', lineHeight: 20,
  },
  progressSection: { width: '100%', gap: 6, marginTop: 4 },
  progressTrack: {
    width: '100%', height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: '#fff', borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12, color: 'rgba(255,255,255,0.85)',
    fontWeight: '600', textAlign: 'center',
  },
  questionsContainer: { paddingHorizontal: 16, gap: 10 },
  questionCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 14, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 4, elevation: 2,
  },
  questionCardCompleted: { backgroundColor: '#F0FAF4' },
  questionCardLocked: { backgroundColor: '#FFF5F5' },
  statusBar: { width: 4, alignSelf: 'stretch' },
  questionLeft: {
    flexDirection: 'row', alignItems: 'center',
    flex: 1, padding: 14, gap: 12,
  },
  questionNumber: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  questionNumberText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  questionTitle: {
    fontSize: 14, fontWeight: '600',
    color: theme.colors.text, lineHeight: 20,
  },
  typeBadgeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 10,
  },
  typeBadgeText: {
    fontSize: 11, fontWeight: '600', color: theme.colors.textSecondary,
  },
  lockTimeText: {
    fontSize: 11, color: theme.colors.error, fontWeight: '600',
  },
  errorText: {
    fontSize: 16, color: theme.colors.textSecondary,
    textAlign: 'center', marginTop: 32,
  },
});
