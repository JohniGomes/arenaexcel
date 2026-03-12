import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  ScrollView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../../services/api.service';
import { usePremium } from '../../hooks/usePremium';
import PaywallModal from '../../components/PaywallModal';

const { width: W, height: H } = Dimensions.get('window');
const PROD_URL = 'https://arenaexcel.excelcomjohni.com.br';

const PARTICLES = [
  { top: 0.08, left: 0.12, size: 4 }, { top: 0.15, left: 0.78, size: 3 },
  { top: 0.25, left: 0.45, size: 5 }, { top: 0.32, left: 0.88, size: 3 },
  { top: 0.42, left: 0.22, size: 4 }, { top: 0.55, left: 0.65, size: 3 },
  { top: 0.62, left: 0.08, size: 5 }, { top: 0.72, left: 0.55, size: 3 },
  { top: 0.80, left: 0.35, size: 4 }, { top: 0.88, left: 0.82, size: 3 },
  { top: 0.18, left: 0.55, size: 3 }, { top: 0.70, left: 0.90, size: 4 },
];

const BADGE_CATEGORIES = [
  { key: 'sequencia',       label: 'Sequência & Dedicação' },
  { key: 'progresso',       label: 'Progresso de Aprendizado' },
  { key: 'desempenho',      label: 'Desempenho' },
  { key: 'funcionalidades', label: 'Funcionalidades' },
  { key: 'especiais',       label: 'Especiais' },
];

interface CertData {
  userId: string;
  nome: string;
  nivel: number;
  nivelNome: string;
  horasDedicadas: number;
  dataInicio: string;
  precisao: number;
  licoesConcluidas: number;
  trilhasConcluidas: number;
}

interface BadgeItem {
  id: string;
  nome: string;
  icone: string;
  categoria: string;
  descricao: string;
  conquistado: boolean;
  dataConquista: string | null;
}

// ── Particles ────────────────────────────────────────────────
const ParticlesBackground = () => {
  const anims = useRef(PARTICLES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    anims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 350),
          Animated.timing(anim, { toValue: 1, duration: 1800, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 1800, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {PARTICLES.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            top: p.top * H,
            left: p.left * W,
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            backgroundColor: '#F59E0B',
            opacity: anims[i].interpolate({ inputRange: [0, 1], outputRange: [0, 0.35] }),
          }}
        />
      ))}
    </View>
  );
};

// ── Mock cert watermark ───────────────────────────────────────
const MockCertWatermark = () => (
  <View style={styles.mockCertWrap} pointerEvents="none">
    <View style={styles.mockCert}>
      <View style={styles.mockCertHeader} />
      <View style={styles.mockCertLine} />
      <View style={[styles.mockCertLine, { width: '60%', marginTop: 8 }]} />
      <View style={[styles.mockCertLine, { width: '80%', marginTop: 8 }]} />
      <View style={styles.mockCertSeal} />
    </View>
  </View>
);

// ── Certificate Card ──────────────────────────────────────────
interface CertCardProps {
  nome: string;
  curso: string;
  nivelNome: string;
  data: string;
  horas: number;
  precisao: number;
  userId: string;
}

const CertificateCard: React.FC<CertCardProps> = ({ nome, curso, nivelNome, data, horas, precisao, userId }) => {
  const validateUrl = `${PROD_URL}/certificado/${userId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(validateUrl)}&bgcolor=0A1628&color=F59E0B`;
  const dataFmt = data ? new Date(data).toLocaleDateString('pt-BR') : '-';

  const handleShare = async () => {
    await Share.share({
      message: `🎓 Conquistei o certificado "${curso}" no Arena Excel!\n\nAcesse: ${validateUrl}`,
    });
  };

  return (
    <View style={styles.certCardWrap}>
      <LinearGradient
        colors={['#0A1628', '#217346']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.certCard}
      >
        <Image
          source={require('../../../assets/mascots/mascot_enthusiastic.png')}
          style={styles.certMascot}
          resizeMode="contain"
        />
        <Text style={styles.certBrand}>ARENA EXCEL</Text>
        <Text style={styles.certTitle}>CERTIFICADO DE CONCLUSÃO</Text>

        <View style={styles.certDivider} />

        <Text style={styles.certNomeAluno}>{nome}</Text>
        <Text style={styles.certCurso}>{curso}</Text>

        <View style={styles.certDividerThin} />

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>NÍVEL</Text>
            <Text style={styles.statValue}>{nivelNome}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>DATA</Text>
            <Text style={styles.statValue}>{dataFmt}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>HORAS</Text>
            <Text style={styles.statValue}>{horas}h</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>PRECISÃO</Text>
            <Text style={styles.statValue}>{precisao}%</Text>
          </View>
        </View>

        <Image source={{ uri: qrUrl }} style={styles.qrCode} resizeMode="contain" />
        <Text style={styles.qrLabel}>Escaneie para validar</Text>
      </LinearGradient>

      <TouchableOpacity onPress={handleShare} style={styles.shareBtn} activeOpacity={0.85}>
        <Text style={styles.shareBtnText}>📤 Compartilhar Certificado</Text>
      </TouchableOpacity>
    </View>
  );
};

// ── Badge Card ────────────────────────────────────────────────
const BadgeCard: React.FC<{ badge: BadgeItem }> = ({ badge }) => (
  <View style={[styles.badgeCard, badge.conquistado ? styles.badgeConquistado : styles.badgeBloqueado]}>
    <Text style={[styles.badgeIcon, !badge.conquistado && { opacity: 0.3 }]}>
      {badge.icone}
    </Text>
    {!badge.conquistado && (
      <View style={styles.lockOverlay}>
        <Text style={styles.lockIcon}>🔒</Text>
      </View>
    )}
    <Text style={[styles.badgeNome, !badge.conquistado && styles.badgeNomeLocked]}>
      {badge.nome}
    </Text>
  </View>
);

// ── Main Component ────────────────────────────────────────────
const CertificateScreen = () => {
  const { isPremium } = usePremium();
  const [showPaywall, setShowPaywall] = useState(false);
  const [certData, setCertData] = useState<CertData | null>(null);
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.02, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (isPremium) {
      carregarDados();
    } else {
      setLoading(false);
    }
  }, [isPremium]);

  const carregarDados = async () => {
    try {
      const [certResp, badgesResp] = await Promise.all([
        ApiService.getCertificateData(),
        ApiService.getMeusBadges(),
      ]);
      setCertData(certResp);
      setBadges(badgesResp ?? []);
    } catch (e) {
      console.error('Erro ao carregar dados de certificado:', e);
    } finally {
      setLoading(false);
    }
  };

  // ── FREE VIEW ──────────────────────────────────────────────
  if (!isPremium) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1A5C35' }} edges={['top']}>
        <LinearGradient
          colors={['#0A1628', '#217346']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <ParticlesBackground />
          <MockCertWatermark />

          <ScrollView contentContainerStyle={styles.freeScrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.mascotWrapper}>
              <LinearGradient
                colors={['#1A3A2A', '#0A1628']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.mascotRing}
              >
                <Image
                  source={require('../../../assets/mascots/mascot_enthusiastic.png')}
                  style={styles.mascotImage}
                  resizeMode="contain"
                />
              </LinearGradient>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            </View>

            <Text style={styles.freeTitle}>Certificado e Badges</Text>
            <Text style={styles.freeSubtitle}>Você está quase lá! 🏆</Text>
            <Text style={styles.freeDescription}>
              Comprove suas habilidades e conquiste seu espaço no mercado com o certificado oficial do Arena Excel
            </Text>

            <View style={styles.benefitsList}>
              {[
                'Certificado oficial de conclusão',
                'Compartilhe no LinkedIn',
                'Valide suas habilidades em Excel',
              ].map((text, i) => (
                <View key={i} style={styles.benefitCard}>
                  <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                  <Text style={styles.benefitText}>{text}</Text>
                </View>
              ))}
            </View>

            <Animated.View style={[styles.btnWrapper, { transform: [{ scale: pulseAnim }] }]}>
              <TouchableOpacity onPress={() => setShowPaywall(true)} activeOpacity={0.85} style={styles.btnOuter}>
                <LinearGradient
                  colors={['#F59E0B', '#F7C948']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.btnText}>⭐ Desbloquear Premium</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>

          <PaywallModal
            visivel={showPaywall}
            onFechar={() => setShowPaywall(false)}
            onSuccess={() => { setShowPaywall(false); carregarDados(); }}
          />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // ── LOADING ────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingBox} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color="#10B981" />
      </SafeAreaView>
    );
  }

  // ── PREMIUM VIEW ───────────────────────────────────────────
  const hasCertificates = certData && (certData.licoesConcluidas > 0 || certData.trilhasConcluidas > 0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.premiumScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.premiumTitle}>🏆 Certificados</Text>

        {hasCertificates ? (
          <CertificateCard
            nome={certData!.nome}
            curso={certData!.trilhasConcluidas > 0
              ? `${certData!.trilhasConcluidas} trilha${certData!.trilhasConcluidas > 1 ? 's' : ''} concluída${certData!.trilhasConcluidas > 1 ? 's' : ''}`
              : 'Lições Clássicas de Excel'}
            nivelNome={certData!.nivelNome}
            data={certData!.dataInicio}
            horas={certData!.horasDedicadas}
            precisao={certData!.precisao}
            userId={certData!.userId}
          />
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🎓</Text>
            <Text style={styles.emptyText}>
              Complete lições ou trilhas para gerar seu certificado!
            </Text>
          </View>
        )}

        <Text style={styles.badgesSectionTitle}>⭐ Suas Badges</Text>

        {BADGE_CATEGORIES.map(cat => {
          const catBadges = badges.filter(b => b.categoria === cat.key);
          if (catBadges.length === 0) return null;
          const conquistadas = catBadges.filter(b => b.conquistado).length;
          return (
            <View key={cat.key} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
                <Text style={styles.categoryCount}>{conquistadas}/{catBadges.length}</Text>
              </View>
              <View style={styles.badgesGrid}>
                {catBadges.map(badge => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ── FREE ──────────────────────────────────────────────────
  freeScrollContent: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 48,
  },
  mockCertWrap: {
    position: 'absolute',
    top: '12%',
    left: -30,
    right: -30,
    height: 200,
    opacity: 0.12,
    transform: [{ rotate: '-5deg' }],
    zIndex: 0,
  },
  mockCert: {
    flex: 1,
    borderWidth: 3,
    borderColor: '#F59E0B',
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mockCertHeader: {
    width: '50%',
    height: 14,
    backgroundColor: '#F59E0B',
    borderRadius: 4,
    marginBottom: 16,
  },
  mockCertLine: { width: '90%', height: 8, backgroundColor: '#333', borderRadius: 4 },
  mockCertSeal: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#F59E0B',
    marginTop: 16,
  },
  mascotWrapper: { position: 'relative', marginBottom: 28, zIndex: 1 },
  mascotRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 16,
  },
  mascotImage: { width: 100, height: 100 },
  proBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  proBadgeText: { fontSize: 11, fontWeight: '800', color: '#1A1A2E', letterSpacing: 1 },
  freeTitle: { fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 10, zIndex: 1 },
  freeSubtitle: { fontSize: 20, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 10, zIndex: 1 },
  freeDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    zIndex: 1,
  },
  benefitsList: { width: '100%', gap: 10, marginBottom: 36, zIndex: 1 },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  benefitText: { fontSize: 15, color: '#fff', fontWeight: '600', flex: 1 },
  btnWrapper: {
    width: '100%',
    zIndex: 1,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  btnOuter: { borderRadius: 16, overflow: 'hidden' },
  btnGradient: { paddingVertical: 18, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 17, fontWeight: '800', color: '#1A1A2E' },

  // ── PREMIUM ────────────────────────────────────────────────
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  premiumScroll: { paddingBottom: 48, paddingTop: 20 },
  premiumTitle: { fontSize: 26, fontWeight: '800', color: '#1a3a5c', paddingHorizontal: 20, marginBottom: 20 },

  // Certificate card
  certCardWrap: { marginHorizontal: 20, marginBottom: 24 },
  certCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  certMascot: { width: 80, height: 80, marginBottom: 8 },
  certBrand: { fontSize: 11, fontWeight: '800', color: '#F59E0B', letterSpacing: 3, marginBottom: 4 },
  certTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 12,
  },
  certDivider: {
    width: '80%',
    height: 2,
    backgroundColor: '#F59E0B',
    marginBottom: 14,
    borderRadius: 1,
  },
  certDividerThin: {
    width: '60%',
    height: 1,
    backgroundColor: 'rgba(245,158,11,0.4)',
    marginBottom: 14,
    borderRadius: 1,
  },
  certNomeAluno: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 4 },
  certCurso: { fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginBottom: 14 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: 16, gap: 8 },
  statItem: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  statLabel: { fontSize: 9, fontWeight: '700', color: '#F59E0B', letterSpacing: 1, marginBottom: 2 },
  statValue: { fontSize: 15, fontWeight: '700', color: '#fff' },
  qrCode: { width: 90, height: 90, borderRadius: 8, marginBottom: 6 },
  qrLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 },
  shareBtn: {
    marginTop: 12,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  shareBtnText: { fontSize: 15, fontWeight: '800', color: '#1A1A2E' },

  // Empty state
  emptyBox: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22 },

  // Badges
  badgesSectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a3a5c',
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  categorySection: { marginBottom: 24, paddingHorizontal: 20 },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryLabel: { fontSize: 14, fontWeight: '700', color: '#444' },
  categoryCount: { fontSize: 12, fontWeight: '600', color: '#888' },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badgeCard: {
    width: (W - 56) / 3,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    position: 'relative',
    minHeight: 80,
    justifyContent: 'center',
  },
  badgeConquistado: {
    backgroundColor: 'rgba(33,115,70,0.15)',
    borderWidth: 1.5,
    borderColor: '#27AE60',
  },
  badgeBloqueado: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    opacity: 0.5,
  },
  badgeIcon: { fontSize: 30, marginBottom: 4 },
  lockOverlay: { position: 'absolute', top: 6, right: 6 },
  lockIcon: { fontSize: 12 },
  badgeNome: { fontSize: 10, fontWeight: '700', color: '#1a3a5c', textAlign: 'center' },
  badgeNomeLocked: { color: '#aaa' },
});

export default CertificateScreen;
