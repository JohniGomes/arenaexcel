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
import { useFocusEffect } from '@react-navigation/native';
import { LearnStackParamList } from '../../navigation/types';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { usePremium } from '../../hooks/usePremium';
import ApiService from '../../services/api.service';
import { Level } from '../../types/api.types';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import PaywallModal from '../../components/PaywallModal';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type LearnScreenNavigationProp = StackNavigationProp<LearnStackParamList, 'LevelList'>;

interface Props {
  navigation: LearnScreenNavigationProp;
}

const LEVEL_ICONS: { [key: string]: string } = {
  'Fundamentos': '🌱',
  'Básico': '📊',
  'Intermediário': '🚀',
  'Avançado': '⭐',
  'Especialista': '🏆',
};

const LearnScreen: React.FC<Props> = ({ navigation }) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const { showError } = useSnackbar();
  const { isPremium } = usePremium();

  // Níveis que requerem premium
  const NIVEIS_PREMIUM = ['Intermediário', 'Avançado', 'Especialista'];

  useFocusEffect(
    useCallback(() => {
      loadLevels();
    }, [])
  );

  const loadLevels = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getProgress();
      console.log('Progress response:', response);
      const levelsData = response?.levels ?? [];
      console.log('Levels loaded:', levelsData?.length);
      setLevels(levelsData);
    } catch (error: any) {
      console.error('Error loading levels:', error);
      console.error('Error details:', error?.response?.data);
      showError(error?.response?.data?.message || 'Erro ao carregar níveis');
    } finally {
      setLoading(false);
    }
  };

  const isLevelUnlocked = (levelIndex: number): boolean => {
    if (levelIndex === 0) return true;
    const previousLevel = levels?.[levelIndex - 1];
    return (previousLevel?.completed ?? 0) === (previousLevel?.total ?? 0);
  };

  const handleLevelPress = (level: Level, index: number) => {
    // Verificar se é nível premium
    const ehBloqueado = NIVEIS_PREMIUM.includes(level?.name ?? '') && !isPremium;
    if (ehBloqueado) {
      setShowPaywall(true);
      return;
    }

    // Verificar se está desbloqueado
    if (isLevelUnlocked(index)) {
      navigation.navigate('LessonList', {
        levelId: level?.id ?? 0,
        levelName: level?.name ?? '',
      });
    } else {
      showError('Complete o nível anterior para desbloquear');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Aprender</Text>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadLevels} colors={[theme.colors.primary]} />
        }
      >
        {/* Card de Trilhas - Novo Sistema de Questões */}
        <Card style={styles.trailsCard} onPress={() => navigation.navigate('Trails')}>
          <View style={styles.trailsGradient}>
            <View style={styles.trailsContent}>
              <View style={styles.trailsHeader}>
                <Text style={styles.trailsIcon}>🚀</Text>
                <View style={styles.trailsBadge}>
                  <Text style={styles.trailsBadgeText}>NOVO</Text>
                </View>
              </View>
              <Text style={styles.trailsTitle}>Trilhas Interativas</Text>
              <Text style={styles.trailsDescription}>
                Aprenda Excel com exercícios práticos e interativos
              </Text>
              <View style={styles.trailsFeatures}>
                <View style={styles.trailsFeature}>
                  <Ionicons name="construct" size={16} color="#FFFFFF" />
                  <Text style={styles.trailsFeatureText}>Planilhas Interativas</Text>
                </View>
                <View style={styles.trailsFeature}>
                  <Ionicons name="bar-chart" size={16} color="#FFFFFF" />
                  <Text style={styles.trailsFeatureText}>Gráficos Profissionais</Text>
                </View>
              </View>
              <View style={styles.trailsArrow}>
                <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
              </View>
            </View>
          </View>
        </Card>

        {/* Título para Lições Clássicas */}
        <Text style={styles.sectionTitle}>Lições Clássicas</Text>

        {levels?.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📚</Text>
            <Text style={styles.emptyStateTitle}>Nenhum nível disponível</Text>
            <Text style={styles.emptyStateText}>
              Arraste para baixo para atualizar
            </Text>
          </View>
        )}
        {levels?.map((level, index) => {
          const unlocked = isLevelUnlocked(index);
          const bloqueadoPremium = NIVEIS_PREMIUM.includes(level?.name ?? '') && !isPremium;
          const progress = (level?.completed ?? 0) / (level?.total ?? 1);

          return (
            <Card
              key={level?.id}
              style={[
                styles.levelCard,
                (!unlocked || bloqueadoPremium) && styles.lockedCard,
                bloqueadoPremium && styles.premiumCard,
              ]}
              onPress={() => handleLevelPress(level, index)}
              disabled={!unlocked && !bloqueadoPremium}
            >
              <View style={styles.levelContent}>
                <View style={styles.levelIconContainer}>
                  <Text style={styles.levelIcon}>
                    {bloqueadoPremium
                      ? '🔒'
                      : unlocked
                      ? LEVEL_ICONS[level?.name ?? ''] ?? '📚'
                      : '🔒'}
                  </Text>
                </View>
                <View style={styles.levelTextContainer}>
                  <Text style={[styles.levelName, (!unlocked || bloqueadoPremium) && styles.lockedText]}>
                    {level?.name ?? ''}
                  </Text>
                  <Text style={styles.levelProgress}>
                    {level?.completed ?? 0}/{level?.total ?? 0} lições
                  </Text>
                  {bloqueadoPremium ? (
                    <View style={styles.premiumBadge}>
                      <Text style={styles.premiumBadgeEmoji}>⭐</Text>
                      <Text style={styles.premiumBadgeText}>Premium</Text>
                    </View>
                  ) : (
                    !unlocked && (
                      <View style={styles.lockedBadge}>
                        <Ionicons name="lock-closed" size={12} color="#FFFFFF" />
                        <Text style={styles.lockedBadgeText}>Bloqueado</Text>
                      </View>
                    )
                  )}
                </View>
                {unlocked && !bloqueadoPremium && (
                  <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
                )}
              </View>
              {unlocked && !bloqueadoPremium && (
                <ProgressBar
                  progress={progress}
                  style={styles.levelProgressBar}
                />
              )}
            </Card>
          );
        })}
      </ScrollView>

      <PaywallModal
        visivel={showPaywall}
        onFechar={() => setShowPaywall(false)}
        onSuccess={() => setShowPaywall(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    padding: 16,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 28,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  levelCard: {
    marginBottom: 16,
    padding: 20,
  },
  lockedCard: {
    opacity: 0.6,
  },
  levelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  levelIcon: {
    fontSize: 32,
  },
  levelTextContainer: {
    flex: 1,
  },
  levelName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  lockedText: {
    color: theme.colors.textSecondary,
  },
  levelProgress: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.textSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  lockedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  premiumCard: {
    borderColor: '#F59E0B',
    borderWidth: 2,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  premiumBadgeEmoji: {
    fontSize: 12,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  levelProgressBar: {
    marginTop: 8,
  },
  // Estilos do Card de Trilhas
  trailsCard: {
    marginBottom: 24,
    padding: 0,
    overflow: 'hidden',
  },
  trailsGradient: {
    backgroundColor: theme.colors.primary,
    padding: 24,
  },
  trailsContent: {
    position: 'relative',
  },
  trailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trailsIcon: {
    fontSize: 36,
    marginRight: 12,
  },
  trailsBadge: {
    backgroundColor: theme.colors.primaryVivid,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trailsBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  trailsTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  trailsDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    lineHeight: 22,
  },
  trailsFeatures: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  trailsFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trailsFeatureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
  },
  trailsArrow: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
});

export default LearnScreen;
