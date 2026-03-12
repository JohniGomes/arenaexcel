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

function getLevelTag(index: number): { label: string; color: string } {
  if (index < 3) return { label: 'Iniciante',     color: '#27AE60' };
  if (index < 6) return { label: 'Intermediário', color: '#F59E0B' };
  return            { label: 'Avançado',          color: '#E74C3C' };
}

export default function TrailsScreen() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

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

          return (
            <TouchableOpacity
              key={trail.id}
              style={[styles.card, !trail.isUnlocked && styles.cardLocked]}
              onPress={() =>
                trail.isUnlocked &&
                navigation.navigate('TrailDetail', { slug: trail.slug })
              }
              activeOpacity={trail.isUnlocked ? 0.8 : 1}
            >
              <LinearGradient
                colors={trail.isUnlocked ? ['#0A1628', '#217346'] : ['#2C3E50', '#4A5568']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                {/* Glow canto superior direito */}
                <View style={styles.cardGlow} />
                {/* Level tag */}
                <View style={[styles.levelTag, { backgroundColor: trail.isUnlocked ? levelTag.color + 'CC' : 'rgba(255,255,255,0.25)' }]}>
                  <Text style={styles.levelTagText}>
                    {trail.isUnlocked ? levelTag.label : 'Bloqueado'}
                  </Text>
                </View>

                <View style={styles.cardTop}>
                  <View style={[styles.cardIconWrap, MASCOT_SHADOW]}>
                    {TRAIL_IMAGES[trail.slug] ? (
                      <Image
                        source={TRAIL_IMAGES[trail.slug]}
                        style={styles.cardIconImg}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.cardIconFallback}>
                        {trail.isUnlocked ? trail.icon : '🔒'}
                      </Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardName}>{trail.name}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>
                      {trail.description}
                    </Text>
                  </View>
                  {trail.isUnlocked ? (
                    <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.8)" />
                  ) : (
                    <Ionicons name="lock-closed-outline" size={20} color="#B0BEC5" />
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${percent}%` as any }]} />
                  </View>
                  <Text style={styles.progressLabel}>
                    {completed}/{total} questões
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 24, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: theme.colors.text },
  headerSub: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
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
  cardLocked: { opacity: 0.75 },
  cardGlow: {
    position: 'absolute', top: -20, right: -20,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(39,174,96,0.25)',
  },
  cardGradient: { padding: 18, paddingTop: 36, gap: 12 },
  levelTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  levelTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cardIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#217346',
    flexShrink: 0,
  },
  cardIconImg: { width: 56, height: 56 },
  cardIconFallback: { fontSize: 32, textAlign: 'center', lineHeight: 56 },
  cardName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 18,
  },
  cardFooter: {
    gap: 6,
  },
  progressTrack: {
    width: '100%',
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
});
