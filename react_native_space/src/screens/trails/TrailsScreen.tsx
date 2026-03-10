import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../../services/api.service';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

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
        </View>

        {trails.map((trail) => (
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
                  ? [theme.colors.primary, theme.colors.primaryMid]
                  : [theme.colors.gray, theme.colors.grayBg]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardIcon}>
                  {trail.isUnlocked ? trail.icon : '🔒'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName}>{trail.name}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {trail.description}
                  </Text>
                  {trail?.progress && (
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${
                              ((trail?.progress?.currentQuestion ?? 0) /
                                trail.totalQuestions) *
                              100
                            }%`,
                          },
                        ]}
                      />
                    </View>
                  )}
                </View>
                {trail.isUnlocked && (
                  <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 24, paddingTop: 16 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: theme.colors.text },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardLocked: { opacity: 0.65 },
  cardGradient: {
    padding: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardIcon: { fontSize: 40 },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: { 
    height: '100%', 
    backgroundColor: '#fff', 
    borderRadius: 2 
  },
});
