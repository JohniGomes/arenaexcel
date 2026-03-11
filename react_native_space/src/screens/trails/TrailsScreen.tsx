import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../../services/api.service';
import { theme } from '../../constants/theme';

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

        {trails.map((trail) => {
          const completed = trail?.progress?.currentQuestion ?? 0;
          const total = trail.totalQuestions ?? 0;
          const percent = total > 0 ? Math.min((completed / total) * 100, 100) : 0;
          const trailColor = trail.isUnlocked ? (trail.color || theme.colors.primary) : theme.colors.gray;

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
                colors={
                  trail.isUnlocked
                    ? [trailColor, theme.colors.primary]
                    : [theme.colors.gray, '#8A9BA8']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.cardIcon}>
                    {trail.isUnlocked ? trail.icon : '🔒'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardName}>{trail.name}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>
                      {trail.description}
                    </Text>
                  </View>
                  {trail.isUnlocked && (
                    <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.8)" />
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${percent}%` }]} />
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 5,
  },
  cardLocked: { opacity: 0.6 },
  cardGradient: { padding: 18, gap: 12 },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cardIcon: { fontSize: 38 },
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
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
});
