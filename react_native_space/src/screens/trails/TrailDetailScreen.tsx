import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../../services/api.service';
import { theme } from '../../constants/theme';
import { LearnStackParamList } from '../../navigation/types';

type TrailDetailRouteProp = RouteProp<LearnStackParamList, 'TrailDetail'>;

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

  // Recarrega progresso sempre que a tela fica visível
  useFocusEffect(
    React.useCallback(() => {
      if (slug) {
        loadTrailDetail();
      }
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

    navigation.navigate('Question', {
      slug: slug ?? '',
      order: question?.order ?? 1,
    });
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Trail Header */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryMid]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.trailHeader}
        >
          <Text style={styles.trailIcon}>{trail?.icon ?? ''}</Text>
          <Text style={styles.trailName}>{trail?.name ?? ''}</Text>
          <Text style={styles.trailDesc}>{trail?.description ?? ''}</Text>
        </LinearGradient>

        {/* Questions List */}
        <View style={styles.questionsContainer}>
          {trail?.questions?.map((question, index) => {
            const status = question?.status ?? 'available';
            const isCompleted = status === 'completed';
            const isLocked = status === 'locked';
            const isAvailable = status === 'available';
            
            // Calcula tempo restante se locked
            let timeLeftText = '';
            if (isLocked && question?.unlocksAt) {
              const unlockDate = new Date(question.unlocksAt);
              const now = new Date();
              const minutesLeft = Math.ceil((unlockDate.getTime() - now.getTime()) / 60000);
              timeLeftText = `${minutesLeft}min`;
            }
            
            return (
              <TouchableOpacity
                key={question?.id ?? index}
                style={[
                  styles.questionCard,
                  isCompleted && styles.questionCardCompleted,
                  isLocked && styles.questionCardFailed,
                ]}
                onPress={() => handleQuestionPress(question)}
                activeOpacity={0.7}
              >
                <View style={styles.questionLeft}>
                  <View
                    style={[
                      styles.questionNumber,
                      isCompleted && styles.questionNumberCompleted,
                      isLocked && styles.questionNumberFailed,
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                    ) : isLocked ? (
                      <Ionicons name="close" size={20} color="#FFFFFF" />
                    ) : (
                      <Text style={styles.questionNumberText}>
                        {question?.order ?? 0}
                      </Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={styles.questionTitle}
                      numberOfLines={2}
                    >
                      {question?.title ?? ''}
                    </Text>
                    {isLocked && timeLeftText && (
                      <Text style={styles.lockTimeText}>
                        ⏳ Tente novamente em {timeLeftText}
                      </Text>
                    )}
                  </View>
                </View>
                <Ionicons
                  name={isCompleted ? "checkmark-circle" : isLocked ? "time-outline" : "chevron-forward"}
                  size={24}
                  color={isCompleted ? '#4CAF50' : isLocked ? '#E53935' : '#999'}
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
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trailHeader: {
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  trailIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  trailName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  trailDesc: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 22,
  },
  questionsContainer: {
    paddingHorizontal: 16,
  },
  questionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  questionCardCompleted: {
    backgroundColor: '#F1F8F4',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  questionCardFailed: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
  },
  questionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  questionNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionNumberCompleted: {
    backgroundColor: '#4CAF50',
  },
  questionNumberFailed: {
    backgroundColor: '#E53935',
  },
  questionNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  questionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    lineHeight: 20,
  },
  lockTimeText: {
    fontSize: 12,
    color: '#E53935',
    marginTop: 4,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 32,
  },
});
