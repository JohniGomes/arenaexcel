import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../../services/api.service';
import { theme } from '../../constants/theme';
import { TRAIL_IMAGES, MASCOT_SHADOW } from '../../constants/mascotImages';
import { usePremium } from '../../hooks/usePremium';
import PaywallModal from '../../components/PaywallModal';

interface Trail {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  totalQuestions: number;
  isUnlocked: boolean;
  progress: any;
}

// Only the first trail is free; the rest require premium or progression
const FREE_TRAIL_SLUG = 'excel-do-zero';

function getLevelTag(index: number): { label: string; color: string } {
  if (index < 3) return { label: 'Iniciante',     color: '#27AE60' };
  if (index < 6) return { label: 'Intermediário', color: '#F59E0B' };
  return            { label: 'Avançado',          color: '#E74C3C' };
}

export default function TrailsScreen() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const navigation = useNavigation<any>();
  const { isPremium } = usePremium();

  useEffect(() => {
    loadTrails();
  }, []);

  const loadTrails = async () => {
    try {
      const data = await ApiService.getTrails();
      setTrails(data ?? []);
    } catch (error) {
      console.error('Erro ao carregar trilhas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trilhas de Aprendizado</Text>
          <Text style={styles.headerSub}>{trails.length} trilhas disponíveis</Text>
        </View>

        {trails.map((trail, index) => {
          const completed = trail?.progress?.currentQuestion ?? 0;
          const total = trail.totalQuestions ?? 0;
          const percent = total > 0 ? Math.min((completed / total) * 100, 100) : 0;
          const levelTag = getLevelTag(index);

          // Determine status:
          // - First trail (excel-do-zero): always unlocked for everyone
          // - Free user + other trails: premium-locked
          // - Premium user: progressive (unlocked only if previous trail completed)
          const isFirstTrail = trail.slug === FREE_TRAIL_SLUG || index === 0;
          const previousCompleted = index > 0 && trails[index - 1]?.progress?.completedAt != null;

          let trailStatus: 'unlocked' | 'locked' | 'premium';
          if (isFirstTrail) {
            trailStatus = 'unlocked';
          } else if (!isPremium) {
            trailStatus = 'premium';
          } else if (previousCompleted) {
            trailStatus = 'unlocked';
          } else {
            trailStatus = 'locked';
          }

          const isUnlocked = trailStatus === 'unlocked';
          const isPremiumLocked = trailStatus === 'premium';
          const isProgressionLocked = trailStatus === 'locked';
          const isBlocked = isPremiumLocked || isProgressionLocked;

          const handlePress = () => {
            if (isUnlocked) {
              navigation.navigate('TrailDetail', { slug: trail.slug });
            } else if (isPremiumLocked) {
              setShowPaywall(true);
            }
            // progression-locked: no action
          };

          return (
            <TouchableOpacity
              key={trail.id}
              style={[
                styles.card,
                isUnlocked && styles.cardUnlocked,
                isBlocked && styles.cardBlocked,
              ]}
              onPress={handlePress}
              activeOpacity={isUnlocked ? 0.8 : 0.95}
            >
              <LinearGradient
                colors={['#0A1628', '#217346']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                {/* Dark overlay for all locked/premium */}
                {isBlocked && <View style={styles.lockedOverlay} />}

                {/* Level tag / status badge */}
                {isUnlocked && (
                  <View style={[styles.levelTag, { backgroundColor: levelTag.color + 'CC' }]}>
                    <Text style={styles.levelTagText}>{levelTag.label}</Text>
                  </View>
                )}
                {isProgressionLocked && (
                  <View style={styles.badgeLocked}>
                    <Ionicons name="lock-closed" size={10} color="#B0BEC5" />
                    <Text style={styles.badgeLockedText}> Bloqueado</Text>
                  </View>
                )}
                {isPremiumLocked && (
                  <View style={styles.badgePremium}>
                    <Text style={styles.badgePremiumText}>⭐ Premium</Text>
                  </View>
                )}

                <View style={styles.cardTop}>
                  <View style={[styles.cardIconWrap, MASCOT_SHADOW, isBlocked && { borderColor: 'rgba(255,255,255,0.2)' }]}>
                    {TRAIL_IMAGES[trail.slug] ? (
                      <Image
                        source={TRAIL_IMAGES[trail.slug]}
                        style={[styles.cardIconImg, isBlocked && { opacity: 0.5 }]}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.cardIconFallback}>
                        {isBlocked ? '🔒' : trail.icon}
                      </Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardName, isBlocked && styles.cardNameDimmed]}>
                      {trail.name}
                    </Text>
                    <Text style={[styles.cardDesc, isBlocked && styles.cardDescDimmed]} numberOfLines={2}>
                      {trail.description}
                    </Text>
                  </View>
                  {isUnlocked && (
                    <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.8)" />
                  )}
                  {isBlocked && (
                    <Ionicons name="lock-closed" size={20} color="rgba(255,255,255,0.35)" />
                  )}
                </View>

                {isUnlocked && (
                  <View style={styles.cardFooter}>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${percent}%` as any }]} />
                    </View>
                    <Text style={styles.progressLabel}>
                      {completed}/{total} questões
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 32 }} />
      </ScrollView>

      <PaywallModal
        visivel={showPaywall}
        onFechar={() => setShowPaywall(false)}
        onSuccess={() => setShowPaywall(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 24, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: theme.colors.text },
  headerSub: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },

  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#217346',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardUnlocked: {
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  cardBlocked: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    opacity: 0.85,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 0,
  },
  cardGradient: { padding: 18, paddingTop: 36, gap: 12 },

  // Status badges
  levelTag: {
    position: 'absolute', top: 12, right: 12,
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20,
  },
  levelTagText: { fontSize: 11, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  badgeLocked: {
    position: 'absolute', top: 10, right: 12,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  badgeLockedText: { fontSize: 11, fontWeight: '600', color: '#B0BEC5' },
  badgePremium: {
    position: 'absolute', top: 10, right: 12,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
    shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4, shadowRadius: 6, elevation: 4,
  },
  badgePremiumText: { fontSize: 11, fontWeight: '800', color: '#1A1A2E' },

  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  cardIconWrap: {
    width: 56, height: 56, borderRadius: 12,
    overflow: 'hidden', borderWidth: 1.5, borderColor: '#217346', flexShrink: 0,
  },
  cardIconImg: { width: 56, height: 56 },
  cardIconFallback: { fontSize: 32, textAlign: 'center', lineHeight: 56 },
  cardName: { fontSize: 17, fontWeight: '700', color: '#fff', marginBottom: 3 },
  cardNameDimmed: { color: 'rgba(255,255,255,0.5)' },
  cardDesc: { fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 18 },
  cardDescDimmed: { color: 'rgba(255,255,255,0.35)' },
  cardFooter: { gap: 6 },
  progressTrack: {
    width: '100%', height: 5,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#27AE60', borderRadius: 3 },
  progressLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
});
