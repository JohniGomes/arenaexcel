import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
import { LEVEL_IMAGES, BANNER_IMAGE, MASCOT_SHADOW } from '../../constants/mascotImages';

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
  const [trailsCompleted, setTrailsCompleted] = useState(0);
  const [trailsTotal, setTrailsTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const { showError } = useSnackbar();
  const { isPremium } = usePremium();

  const NIVEIS_PREMIUM = ['Intermediário', 'Avançado', 'Especialista'];

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [])
  );

  const loadAll = async () => {
    setLoading(true);
    try {
      const [progressResponse, trailsData] = await Promise.all([
        ApiService.getProgress(),
        ApiService.getTrails(),
      ]);
      const levelsData = progressResponse?.levels ?? [];
      setLevels(levelsData);
      // Compute overall progress: trails + classic lessons
      const allTrails: any[] = trailsData ?? [];
      const trailDone = allTrails.reduce((s: number, t: any) => s + (t?.progress?.currentQuestion ?? 0), 0);
      const trailTot  = allTrails.reduce((s: number, t: any) => s + (t?.totalQuestions ?? 0), 0);
      const classicDone = levelsData.reduce((s: number, l: any) => s + (l?.completed ?? 0), 0);
      const classicTot  = levelsData.reduce((s: number, l: any) => s + (l?.total ?? 0), 0);
      setTrailsCompleted(trailDone + classicDone);
      setTrailsTotal(trailTot + classicTot);
    } catch (error: any) {
      showError(error?.response?.data?.message || 'Erro ao carregar dados');
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
    const ehBloqueado = NIVEIS_PREMIUM.includes(level?.name ?? '') && !isPremium;
    if (ehBloqueado) {
      setShowPaywall(true);
      return;
    }
    if (isLevelUnlocked(index)) {
      navigation.navigate('LessonList', {
        levelId: level?.id ?? 0,
        levelName: level?.name ?? '',
      });
    } else {
      showError('Complete o nível anterior para desbloquear');
    }
  };

  const trailPercent = trailsTotal > 0 ? Math.round((trailsCompleted / trailsTotal) * 100) : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Aprender</Text>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadAll} colors={[theme.colors.primary]} />
        }
      >
        {/* Banner Trilhas Interativas */}
        <Card style={styles.trailsCard} onPress={() => navigation.navigate('Trails')}>
          <View style={styles.trailsGradient}>
            <View style={styles.trailsLeft}>
              <Text style={styles.trailsTitle}>Trilhas Interativas</Text>
              <Text style={styles.trailsDescription}>
                Aprenda Excel com exercícios práticos e interativos
              </Text>
              <Text style={styles.trailsLink}>Ver Trilhas →</Text>
            </View>
            <View style={[styles.bannerMascotWrap, MASCOT_SHADOW]}>
              <Image source={BANNER_IMAGE} style={styles.bannerMascot} resizeMode="cover" />
            </View>
          </View>
        </Card>

        {/* Card progresso geral */}
        {trailsTotal > 0 && (
          <View style={styles.progressCard}>
            <View style={styles.progressCardHeader}>
              <Ionicons name="stats-chart" size={18} color={theme.colors.primary} />
              <Text style={styles.progressCardTitle}>Seu progresso geral</Text>
              <Text style={styles.progressCardPercent}>{trailPercent}% concluído</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${trailPercent}%` as any }]} />
            </View>
            <Text style={styles.progressCardSub}>
              {trailsCompleted} de {trailsTotal} questões concluídas nas trilhas
            </Text>
          </View>
        )}

        {/* Lições Clássicas */}
        <Text style={styles.sectionTitle}>Lições Clássicas</Text>

        {levels?.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📚</Text>
            <Text style={styles.emptyStateTitle}>Nenhum nível disponível</Text>
            <Text style={styles.emptyStateText}>Arraste para baixo para atualizar</Text>
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
                unlocked && !bloqueadoPremium && styles.levelCardUnlocked,
                !unlocked && !bloqueadoPremium && styles.levelCardLocked,
                bloqueadoPremium && styles.levelCardPremium,
              ]}
              onPress={() => handleLevelPress(level, index)}
              disabled={!unlocked && !bloqueadoPremium}
            >
              <LinearGradient
                colors={['#0A1628', '#217346']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.levelGradient}
              >
                {/* Locked overlay — grey for progression-locked */}
                {!unlocked && !bloqueadoPremium && <View style={styles.lockedOverlay} />}

                {/* Premium golden glow top-right */}
                {bloqueadoPremium && <View style={styles.premiumGlow} />}

                {/* Badge Bloqueado */}
                {!unlocked && !bloqueadoPremium && (
                  <View style={styles.badgeLocked}>
                    <Ionicons name="lock-closed" size={10} color="#B0BEC5" />
                    <Text style={styles.badgeLockedText}> Bloqueado</Text>
                  </View>
                )}

                {/* Badge Premium */}
                {bloqueadoPremium && (
                  <View style={styles.badgePremium}>
                    <Text style={styles.badgePremiumText}>⭐ Premium</Text>
                  </View>
                )}

                <View style={styles.levelContent}>
                  <View style={styles.levelIconContainer}>
                    {LEVEL_IMAGES[level?.name ?? ''] ? (
                      <Image
                        source={LEVEL_IMAGES[level?.name ?? '']}
                        style={styles.levelIconImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.levelIcon}>
                        {bloqueadoPremium ? '🔒' : unlocked ? LEVEL_ICONS[level?.name ?? ''] ?? '📚' : '🔒'}
                      </Text>
                    )}
                  </View>
                  <View style={styles.levelTextContainer}>
                    <Text style={[
                      styles.levelName,
                      !unlocked && !bloqueadoPremium && styles.levelNameDimmed,
                    ]}>
                      {level?.name ?? ''}
                    </Text>
                    <Text style={[
                      styles.levelProgressText,
                      !unlocked && !bloqueadoPremium && styles.levelProgressTextDimmed,
                    ]}>
                      {level?.completed ?? 0}/{level?.total ?? 0} lições
                    </Text>
                  </View>
                  {unlocked && !bloqueadoPremium && (
                    <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.7)" />
                  )}
                  {!unlocked && !bloqueadoPremium && (
                    <Ionicons name="lock-closed" size={24} color="rgba(255,255,255,0.35)" />
                  )}
                </View>

                {unlocked && !bloqueadoPremium && (
                  <View style={styles.levelProgressTrack}>
                    <View style={[styles.levelProgressFill, { width: `${progress * 100}%` as any }]} />
                  </View>
                )}
              </LinearGradient>
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
  safeArea: { flex: 1, backgroundColor: theme.colors.surface },
  header: {
    padding: 16,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: theme.colors.text },
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },

  /* Banner */
  trailsCard: { marginBottom: 16, padding: 0, overflow: 'hidden' },
  trailsGradient: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 140,
  },
  trailsLeft: { flex: 1, gap: 8 },
  trailsTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  trailsDescription: { fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 18 },
  trailsLink: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.95)', marginTop: 2 },
  bannerMascotWrap: {
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    flexShrink: 0,
  },
  bannerMascot: { width: 120, height: 120 },

  /* Progress card */
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    elevation: 2,
    gap: 8,
  },
  progressCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressCardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  progressCardPercent: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressCardSub: { fontSize: 12, color: theme.colors.textSecondary },

  /* Section */
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  /* Levels */
  levelCard: {
    marginBottom: 12,
    padding: 0,
    overflow: 'hidden',
    borderRadius: 16,
    shadowColor: '#217346',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  // Unlocked: prominent green left accent
  levelCardUnlocked: {
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  // Locked by progression: subtle border
  levelCardLocked: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    opacity: 0.85,
  },
  // Premium: amber border + amber shadow
  levelCardPremium: {
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  levelGradient: { padding: 16, paddingTop: 28 },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 0,
  },
  // Golden glow circle top-right for premium cards
  premiumGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(245,158,11,0.15)',
    zIndex: 0,
  },
  // Badge: Bloqueado
  badgeLocked: {
    position: 'absolute',
    top: 10,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeLockedText: { fontSize: 11, fontWeight: '600', color: '#B0BEC5' },
  // Badge: Premium
  badgePremium: {
    position: 'absolute',
    top: 10,
    right: 12,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  badgePremiumText: { fontSize: 11, fontWeight: '800', color: '#1A1A2E' },
  // Dimmed text for locked cards
  levelNameDimmed: { color: 'rgba(255,255,255,0.5)' },
  levelProgressTextDimmed: { color: 'rgba(255,255,255,0.35)' },
  levelContent: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  levelIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    flexShrink: 0,
  },
  levelIconImage: { width: 56, height: 56 },
  levelIcon: { fontSize: 28, textAlign: 'center', lineHeight: 56 },
  levelTextContainer: { flex: 1 },
  levelName: { fontSize: 17, fontWeight: '700', color: '#fff', marginBottom: 3 },
  levelProgressText: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  levelProgressTrack: {
    width: '100%',
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 3,
  },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyStateIcon: { fontSize: 64, marginBottom: 16 },
  emptyStateTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.text, marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center' },
});

export default LearnScreen;
