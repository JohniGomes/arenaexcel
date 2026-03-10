import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api.service';
import { LeaderboardEntry } from '../../types/api.types';
import Card from '../../components/Card';
import { theme, getLevelName } from '../../constants/theme';

const RankingScreen = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState(0);
  const [loading, setLoading] = useState(false);

  useFocusEffect(useCallback(() => { loadLeaderboard(); }, []));

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getLeaderboard(100);
      setLeaderboard(response?.leaderboard ?? []);
      setUserRank(response?.userRank ?? 0);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: LeaderboardEntry }) => {
    const isCurrentUser = item?.userId === user?.id;
    return (
      <Card style={[styles.rankCard, isCurrentUser && styles.currentUserCard]}>
        <Text style={styles.rank}>#{item?.rank}</Text>
        <Text style={styles.avatar}>{item?.name?.charAt(0)?.toUpperCase() ?? 'U'}</Text>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{item?.name ?? 'Usuário'}</Text>
          <Text style={styles.level}>{getLevelName(item?.level ?? 1)}</Text>
        </View>
        <Text style={styles.xp}>{item?.xp ?? 0} XP</Text>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ranking Global</Text>
        {userRank > 0 && <Text style={styles.userRankText}>Sua posição: #{userRank}</Text>}
      </View>
      <FlatList
        data={leaderboard}
        renderItem={renderItem}
        keyExtractor={(item) => item?.userId ?? ''}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadLeaderboard} colors={[theme.colors.primary]} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.surface },
  header: { padding: 16, backgroundColor: theme.colors.background, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  headerTitle: { fontSize: 28, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  userRankText: { fontSize: 14, color: theme.colors.textSecondary },
  listContent: { padding: 16 },
  rankCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, padding: 16 },
  currentUserCard: { backgroundColor: '#E8F5E9', borderWidth: 2, borderColor: theme.colors.primary },
  rank: { fontSize: 18, fontWeight: '700', color: theme.colors.text, width: 40 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.primary, color: '#FFF', textAlign: 'center', lineHeight: 40, fontSize: 18, fontWeight: '700', marginRight: 12 },
  userInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  level: { fontSize: 12, color: theme.colors.textSecondary },
  xp: { fontSize: 16, fontWeight: '700', color: theme.colors.primary },
});

export default RankingScreen;
