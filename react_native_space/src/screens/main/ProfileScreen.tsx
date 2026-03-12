import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Image, TouchableOpacity, Alert, Linking, Platform, Modal } from 'react-native';
import { Text, Dialog, Portal, TextInput, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { usePremium } from '../../hooks/usePremium';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ApiService from '../../services/api.service';
import { UserProfile, Achievement } from '../../types/api.types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { theme, getLevelName } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

// Mascot images
const MASCOTS = {
  mago: require('../../../assets/excelino_mago.png'),
  mestre: require('../../../assets/excelino_mestre_x.png'),
  verde: require('../../../assets/excelino_verdeX.png'),
  sir: require('../../../assets/excelino_sirX.png'),
  ninj: require('../../../assets/excelino_NinjX.png'),
  orbit: require('../../../assets/excelino_orbitX.png'),
};

const MASCOT_NAMES = {
  mago: 'MagX',
  mestre: 'MestrX',
  verde: 'VerdX',
  sir: 'JohX',
  ninj: 'NinjX',
  orbit: 'OrbitX',
};

const ProfileScreen = () => {
  const { user, logout, refreshProfile } = useAuth();
  const { isPremium } = usePremium();
  const { showSuccess, showError } = useSnackbar();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [nextAchievement, setNextAchievement] = useState<Achievement | null>(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [mascotDialogVisible, setMascotDialogVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileData, achievementsData] = await Promise.all([
        ApiService.getProfile(),
        ApiService.getAchievements(),
      ]);
      setProfile(profileData ?? null);
      setAchievements(achievementsData?.achievements ?? []);
      setNextAchievement(achievementsData?.nextAchievement ?? null);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async () => {
    if (!newName?.trim()) {
      showError('Digite um nome válido');
      return;
    }
    setSaving(true);
    try {
      await ApiService.updateProfile({ name: newName.trim() });
      await refreshProfile();
      await loadData();
      showSuccess('Perfil atualizado!');
      setEditDialogVisible(false);
    } catch (error) {
      showError('Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectMascot = async (mascotId: string) => {
    setSaving(true);
    try {
      await ApiService.selectMascot(mascotId);
      await refreshProfile();
      await loadData();
      setMascotDialogVisible(false);
      showSuccess('Mascote selecionado!');
    } catch (error: any) {
      console.error('Select mascot error:', error);
      showError('Erro ao selecionar mascote');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancelar Assinatura',
      'Para cancelar sua assinatura Premium, acesse as configurações da Google Play Store.\n\nDeseja abrir a Play Store agora?',
      [
        { text: 'Agora não', style: 'cancel' },
        {
          text: 'Abrir Play Store',
          onPress: async () => {
            try {
              const url = 'https://play.google.com/store/account/subscriptions';
              const canOpen = await Linking.canOpenURL(url);
              if (canOpen) {
                await Linking.openURL(url);
              } else {
                showError('Não foi possível abrir a Play Store');
              }
            } catch (error) {
              showError('Erro ao abrir Play Store');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined' && window.confirm) {
      // Web platform
      if (window.confirm('Deseja realmente sair?')) {
        logout();
      }
    } else {
      // Mobile platform - just logout directly for now
      logout();
    }
  };

  const unlockedAchievements = achievements?.filter(a => a?.unlocked) ?? [];
  
  // Get current mascot or default
  const currentMascot = profile?.profilePicture && MASCOTS[profile.profilePicture as keyof typeof MASCOTS]
    ? profile.profilePicture
    : 'professional';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} colors={[theme.colors.primary]} />}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMascotDialogVisible(true)} style={styles.avatarContainer}>
            <Image 
              source={MASCOTS[currentMascot as keyof typeof MASCOTS]} 
              style={styles.avatarLarge} 
            />
            <View style={styles.cameraIcon}>
              <Ionicons name="star" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{profile?.name ?? 'Usuário'}</Text>
            <View style={[styles.badge, isPremium ? styles.badgePremium : styles.badgeFree]}>
              <Text style={styles.badgeText}>{isPremium ? '⭐ Premium' : 'Gratuito'}</Text>
            </View>
          </View>
          <Text style={styles.mascotName}>
            {MASCOT_NAMES[currentMascot as keyof typeof MASCOT_NAMES]}
          </Text>
          <View style={styles.buttonRow}>
            <Button 
              title="Editar Perfil" 
              onPress={() => { setNewName(profile?.name ?? ''); setEditDialogVisible(true); }} 
              variant="outline" 
              style={styles.editButton} 
            />
            {isPremium && (
              <TouchableOpacity onPress={handleCancelSubscription} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar assinatura</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Estatísticas</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Nível</Text>
            <Text style={styles.statValue}>{profile?.level ?? 1} - {getLevelName(profile?.level ?? 1)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>XP Total</Text>
            <Text style={styles.statValue}>{profile?.xp ?? 0} XP</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>🔥 {profile?.streak ?? 0} dias</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Lições Completadas</Text>
            <Text style={styles.statValue}>{profile?.stats?.lessonsCompleted ?? 0}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Taxa de Acerto</Text>
            <Text style={styles.statValue}>{profile?.stats?.accuracy ?? 0}%</Text>
          </View>
        </Card>

        <Card style={styles.achievementsCard}>
          <Text style={styles.cardTitle}>Conquistas ({unlockedAchievements.length}/{achievements.length})</Text>
          
          {/* Show next achievement progress if user has no achievements yet or has room to grow */}
          {nextAchievement && unlockedAchievements.length < achievements.length && (
            <Card style={styles.nextAchievementCard}>
              <View style={styles.nextAchievementHeader}>
                <Text style={styles.nextAchievementIcon}>{nextAchievement?.icon ?? '🎯'}</Text>
                <View style={styles.nextAchievementTextContainer}>
                  <Text style={styles.nextAchievementTitle}>Próxima Conquista</Text>
                  <Text style={styles.nextAchievementName}>{nextAchievement?.name ?? ''}</Text>
                  <Text style={styles.nextAchievementDescription}>{nextAchievement?.description ?? ''}</Text>
                </View>
              </View>
              <View style={styles.nextAchievementProgressContainer}>
                <View style={styles.nextAchievementProgressBar}>
                  <View 
                    style={[
                      styles.nextAchievementProgressFill, 
                      { width: `${nextAchievement?.progressPercentage ?? 0}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.nextAchievementProgressText}>
                  {nextAchievement?.currentProgress ?? 0} / {nextAchievement?.targetValue ?? 1}
                </Text>
              </View>
            </Card>
          )}

          <ScrollView
            style={styles.achievementsScroll}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            <View style={styles.achievementsGrid}>
              {achievements?.map((achievement) => (
                <View key={achievement?.id} style={[styles.achievementBadge, !achievement?.unlocked && styles.lockedBadge]}>
                  <Text style={styles.achievementIcon}>{achievement?.unlocked ? achievement?.icon : '🔒'}</Text>
                  <Text style={styles.achievementName} numberOfLines={2}>{achievement?.name ?? ''}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </Card>

        <Button title="Sair" onPress={handleLogout} variant="outline" style={styles.logoutButton} />
      </ScrollView>

      <Portal>
        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>Editar Perfil</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Nome" value={newName} onChangeText={setNewName} mode="outlined" />
          </Dialog.Content>
          <Dialog.Actions>
            <Button title="Cancelar" onPress={() => setEditDialogVisible(false)} variant="outline" />
            <Button title="Salvar" onPress={handleEditProfile} loading={saving} />
          </Dialog.Actions>
        </Dialog>

        <Modal
          visible={mascotDialogVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setMascotDialogVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.mascotDialogContent}>
              <Text style={styles.mascotDialogTitle}>Escolha seu Mascote</Text>
              
              <ScrollView style={styles.mascotScrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.mascotGrid}>
                  {Object.keys(MASCOTS).map((mascotId) => (
                    <TouchableOpacity
                      key={mascotId}
                      style={[
                        styles.mascotOption,
                        currentMascot === mascotId && styles.selectedMascot,
                      ]}
                      onPress={() => handleSelectMascot(mascotId)}
                      disabled={saving}
                    >
                      <Image
                        source={MASCOTS[mascotId as keyof typeof MASCOTS]}
                        style={styles.mascotImage}
                      />
                      {currentMascot === mascotId && (
                        <View style={styles.selectedBadge}>
                          <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                        </View>
                      )}
                      <Text style={styles.mascotOptionName}>
                        {MASCOT_NAMES[mascotId as keyof typeof MASCOT_NAMES]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {saving && (
                <View style={styles.savingOverlay}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  <Text style={styles.savingText}>Salvando...</Text>
                </View>
              )}

              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setMascotDialogVisible(false)}
                disabled={saving}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.surface },
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  header: { alignItems: 'center', marginBottom: 24 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatarLarge: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: theme.colors.primary, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  avatarText: { fontSize: 40, fontWeight: '700', color: '#FFF' },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.surface,
  },
  nameContainer: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePremium: {
    backgroundColor: '#F59E0B',
  },
  badgeFree: {
    backgroundColor: '#B0BEC5',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mascotName: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 12 },
  buttonRow: {
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  editButton: {},
  cancelButton: {
    marginTop: 4,
  },
  cancelButtonText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textDecorationLine: 'underline',
  },
  statsCard: { marginBottom: 16, padding: 20 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 16 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statLabel: { fontSize: 16, color: theme.colors.textSecondary },
  statValue: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  achievementsCard: { marginBottom: 16, padding: 20 },
  nextAchievementCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: `${theme.colors.primary}10`,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  nextAchievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nextAchievementIcon: {
    fontSize: 48,
    marginRight: 12,
  },
  nextAchievementTextContainer: {
    flex: 1,
  },
  nextAchievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  nextAchievementName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  nextAchievementDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  nextAchievementProgressContainer: {
    marginTop: 8,
  },
  nextAchievementProgressBar: {
    height: 8,
    backgroundColor: `${theme.colors.primary}20`,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  nextAchievementProgressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  nextAchievementProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
    textAlign: 'right',
  },
  achievementsScroll: { maxHeight: 420 },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  achievementBadge: { width: '30%', alignItems: 'center', marginBottom: 16 },
  lockedBadge: { opacity: 0.4 },
  achievementIcon: { fontSize: 32, marginBottom: 4 },
  achievementName: { fontSize: 10, textAlign: 'center', color: theme.colors.textSecondary },
  logoutButton: { marginTop: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mascotDialogContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
  },
  mascotDialogTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  mascotScrollView: {
    maxHeight: 500,
  },
  mascotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  closeButton: {
    backgroundColor: theme.colors.success,
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mascotOption: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  selectedMascot: {
    borderColor: theme.colors.primary,
    borderWidth: 3,
  },
  mascotImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  mascotOptionName: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: theme.colors.primary,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  savingOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  savingText: {
    marginTop: 8,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});

export default ProfileScreen;
