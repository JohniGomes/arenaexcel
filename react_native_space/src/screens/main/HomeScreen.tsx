import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ApiService from '../../services/api.service';
import { UserProfile, Mission } from '../../types/api.types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { theme, getLevelName, getXpForNextLevel } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mascot images
const MASCOTS = {
  mago: require('../../../assets/excelino_mago.png'),
  mestre: require('../../../assets/excelino_mestre_x.png'),
  verde: require('../../../assets/excelino_verdeX.png'),
  sir: require('../../../assets/excelino_sirX.png'),
  ninj: require('../../../assets/excelino_NinjX.png'),
  orbit: require('../../../assets/excelino_orbitX.png'),
};

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { user, refreshProfile } = useAuth();
  const { showError } = useSnackbar();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [dailyXpProgress, setDailyXpProgress] = useState(0);
  const [dailyXpGoal, setDailyXpGoal] = useState(65);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const DAILY_XP_KEY = `dailyXpProgress_${new Date().toISOString().slice(0, 10)}`;

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileData, missionsData] = await Promise.all([
        ApiService.getProfile(),
        ApiService.getDailyMissions(),
      ]);

      setProfile(profileData ?? null);
      setMissions(missionsData?.missions ?? []);
      setDailyXpGoal(missionsData?.dailyXpGoal ?? 65);

      // Use server value if available, otherwise fallback to AsyncStorage cache
      const serverXp = missionsData?.dailyXpProgress;
      if (typeof serverXp === 'number' && serverXp > 0) {
        setDailyXpProgress(serverXp);
        await AsyncStorage.setItem(DAILY_XP_KEY, String(serverXp));
      } else {
        const cached = await AsyncStorage.getItem(DAILY_XP_KEY);
        setDailyXpProgress(cached ? parseInt(cached, 10) : 0);
      }

      await refreshProfile();
    } catch (error) {
      console.error('Error loading home data:', error);
      showError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const completedMissions = missions?.filter(m => m?.completed)?.length ?? 0;
  const totalMissions = missions?.length ?? 0;
  const xpForNextLevel = getXpForNextLevel(profile?.level ?? 1);
  const xpProgress = (profile?.xp ?? 0) / xpForNextLevel;

  // Dynamic Excelino messages based on user progress
  const getExcelinoMessage = () => {
    const streak = profile?.streak ?? 0;
    const lessonsCompleted = profile?.stats?.lessonsCompleted ?? 0;
    const accuracy = profile?.stats?.accuracy ?? 0;
    const level = profile?.level ?? 1;

    // Priority 1: Encourage starting streak (TRISTE)
    if (streak === 0) {
      return {
        message: 'Comece seu streak hoje! 🔥 Cada dia conta na sua jornada de aprendizado!',
        mascot: require('../../../assets/excelino_triste.png'),
      };
    }

    // Priority 2: Celebrate streak milestones (STREAK/COMEMORANDO)
    if (streak >= 30) {
      return {
        message: `Incrível! ${streak} dias de streak! 🔥🏆 Você é uma inspiração!`,
        mascot: require('../../../assets/excelino_streak.png'),
      };
    }
    if (streak >= 7) {
      return {
        message: `Parabéns! ${streak} dias consecutivos! 🔥 Continue assim!`,
        mascot: require('../../../assets/excelino_streak.png'),
      };
    }
    if (streak >= 3) {
      return {
        message: `Ótimo! ${streak} dias de streak! 🔥 Não quebre a sequência!`,
        mascot: require('../../../assets/excelino_streak.png'),
      };
    }

    // Priority 3: Based on accuracy (COMEMORANDO)
    if (accuracy >= 90) {
      return {
        message: `Sua precisão de ${accuracy}% é excepcional! 🎯 Você domina o Excel!`,
        mascot: require('../../../assets/excelino_comemorando.png'),
      };
    }
    if (accuracy >= 70) {
      return {
        message: `Muito bem! ${accuracy}% de precisão! 📊 Você está indo bem!`,
        mascot: require('../../../assets/excelino_comemorando.png'),
      };
    }

    // Priority 4: Based on lessons completed (COMEMORANDO)
    if (lessonsCompleted >= 30) {
      return {
        message: `Uau! ${lessonsCompleted} lições completadas! 🌟 Você é dedicado!`,
        mascot: require('../../../assets/excelino_comemorando.png'),
      };
    }
    if (lessonsCompleted >= 10) {
      return {
        message: `${lessonsCompleted} lições completadas! 📚 Continue aprendendo!`,
        mascot: require('../../../assets/excelino_comemorando.png'),
      };
    }
    if (lessonsCompleted >= 5) {
      return {
        message: `Já completou ${lessonsCompleted} lições! 💪 Você está progredindo!`,
        mascot: require('../../../assets/excelino_comemorando.png'),
      };
    }

    // Priority 5: Based on level (COMEMORANDO)
    if (level >= 5) {
      return {
        message: 'Você já é um expert em Excel! 🚀 Continue dominando!',
        mascot: require('../../../assets/excelino_comemorando.png'),
      };
    }
    if (level >= 3) {
      return {
        message: `Nível ${level}! 📈 Você está evoluindo muito bem!`,
        mascot: require('../../../assets/excelino_comemorando.png'),
      };
    }

    // Default messages for beginners (NEUTRO - usar welcome)
    return {
      message: 'Olá! Sou o Excelino, seu companheiro nesta jornada! 🐯📊',
      mascot: require('../../../assets/excelino-welcome.gif'),
    };
  };

  const excelinoData = getExcelinoMessage();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadData} colors={[theme.colors.primary]} />
        }
      >
        {/* Header Card */}
        <Card style={[styles.headerCard, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              {profile?.profilePicture && MASCOTS[profile.profilePicture as keyof typeof MASCOTS] ? (
                <Image
                  source={MASCOTS[profile.profilePicture as keyof typeof MASCOTS]}
                  style={styles.avatarMascot}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                </Text>
              )}
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greeting}>Bora estudar!</Text>
              <Text style={styles.userName}>{user?.name ?? 'Usuário'}</Text>
              <Text style={styles.levelText}>
                Nível {profile?.level ?? 1} - {getLevelName(profile?.level ?? 1)}
              </Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <Text style={styles.xpText}>
              {profile?.xp ?? 0} / {xpForNextLevel} XP
            </Text>
            <ProgressBar progress={xpProgress} height={10} color="#FFFFFF" backgroundColor="rgba(255,255,255,0.3)" />
          </View>
        </Card>

        {/* Mascot Card */}
        <Card style={styles.mascotCard}>
          <Image
            source={excelinoData?.mascot ?? require('../../../assets/excelino-welcome.gif')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
          <Text style={styles.mascotText}>
            {excelinoData?.message ?? 'Olá! Sou o Excelino!'}
          </Text>
        </Card>

        {/* Continue Learning Button */}
        <Button
          title="Continuar Aprendendo"
          onPress={() => navigation.navigate('Learn')}
          style={styles.continueButton}
        />

        {/* Daily Missions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Missões Diárias</Text>
            <Text style={styles.sectionSubtitle}>
              {completedMissions}/{totalMissions}
            </Text>
          </View>

          {missions?.map((mission) => (
            <Card key={mission?.id} style={styles.missionCard}>
              <View style={styles.missionHeader}>
                <View style={styles.missionIcon}>
                  <Ionicons
                    name={mission?.completed ? 'checkmark-circle' : 'radio-button-off'}
                    size={32}
                    color={mission?.completed ? theme.colors.success : theme.colors.textSecondary}
                  />
                </View>
                <View style={styles.missionTextContainer}>
                  <Text style={styles.missionTitle}>{mission?.title ?? ''}</Text>
                  <Text style={styles.missionDescription}>{mission?.description ?? ''}</Text>
                </View>
                <View style={styles.missionXpContainer}>
                  <Text style={styles.missionXp}>+{mission?.xpReward ?? 0}</Text>
                  <Text style={styles.missionXpLabel}>XP</Text>
                </View>
              </View>
              <ProgressBar
                progress={(mission?.progress ?? 0) / (mission?.target ?? 1)}
                style={styles.missionProgress}
              />
              <Text style={styles.missionProgressText}>
                {mission?.progress ?? 0}/{mission?.target ?? 0}
              </Text>
            </Card>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>{profile?.streak ?? 0}</Text>
              <Text style={styles.statLabel}>
                {(profile?.streak ?? 0) === 0 ? 'Comece agora!' : 'Dias seguidos'}
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statIcon}>🎯</Text>
              <Text style={styles.statValue}>{profile?.stats?.accuracy ?? 0}%</Text>
              <Text style={styles.statLabel}>Precisão</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statIcon}>📚</Text>
              <Text style={styles.statValue}>{profile?.stats?.lessonsCompleted ?? 0}</Text>
              <Text style={styles.statLabel}>Lições feitas</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statValue}>{profile?.stats?.studyHours ?? 0}h</Text>
              <Text style={styles.statLabel}>Horas de estudo</Text>
            </Card>
          </View>
        </View>

        {/* Daily Goal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meta diária</Text>
          <Card style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalText}>
                {dailyXpProgress}/{dailyXpGoal} XP
              </Text>
              <Text style={styles.goalPercentage}>
                {Math.round((dailyXpProgress / dailyXpGoal) * 100)}%
              </Text>
            </View>
            <ProgressBar progress={dailyXpProgress / dailyXpGoal} height={12} />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    marginBottom: 16,
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatarMascot: {
    width: 60,
    height: 60,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  levelText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  progressContainer: {
    marginTop: 8,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  continueButton: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  missionCard: {
    marginBottom: 12,
    padding: 16,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  missionIcon: {
    marginRight: 12,
  },
  missionTextContainer: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  missionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  missionXpContainer: {
    alignItems: 'center',
  },
  missionXp: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  missionXpLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  missionProgress: {
    marginBottom: 8,
  },
  missionProgressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 48) / 2,
    marginBottom: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  goalCard: {
    padding: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  goalPercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  mascotCard: {
    padding: 20,
    marginBottom: 16,
    backgroundColor: `${theme.colors.primary}10`,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mascotImage: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  mascotText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
});

export default HomeScreen;
