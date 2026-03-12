import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
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
import { theme } from '../../constants/theme';
import { usePremium } from '../../hooks/usePremium';
import PaywallModal from '../../components/PaywallModal';

const { width: W, height: H } = Dimensions.get('window');

// Static particle positions to avoid re-computation on render
const PARTICLES = [
  { top: 0.08, left: 0.12, size: 4 }, { top: 0.15, left: 0.78, size: 3 },
  { top: 0.25, left: 0.45, size: 5 }, { top: 0.32, left: 0.88, size: 3 },
  { top: 0.42, left: 0.22, size: 4 }, { top: 0.55, left: 0.65, size: 3 },
  { top: 0.62, left: 0.08, size: 5 }, { top: 0.72, left: 0.55, size: 3 },
  { top: 0.80, left: 0.35, size: 4 }, { top: 0.88, left: 0.82, size: 3 },
  { top: 0.18, left: 0.55, size: 3 }, { top: 0.70, left: 0.90, size: 4 },
];

interface Badge {
  id: string;
  nome: string;
  tipo: string;
  emoji: string;
  conquistado: boolean;
  dataConquista: string | null;
}

// ── Particles ────────────────────────────────────────────────
const ParticlesBackground = () => {
  const anims = useRef(PARTICLES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    anims.forEach((anim, i) => {
      const delay = i * 350;
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
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

// ── Mock Certificate Watermark ────────────────────────────────
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

// ── Main Component ────────────────────────────────────────────
const CertificateScreen = () => {
  const { isPremium } = usePremium();
  const [showPaywall, setShowPaywall] = useState(false);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalCert, setModalCert] = useState<Badge | null>(null);
  const [nomeAluno, setNomeAluno] = useState('');
  const [gerando, setGerando] = useState(false);

  // Pulse animation for the button
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
      carregarBadges();
    } else {
      setLoading(false);
    }
  }, [isPremium]);

  const carregarBadges = async () => {
    try {
      const data = await ApiService.getMeusBadges();
      setBadges(data ?? []);
    } catch (e) {
      console.error('Erro ao carregar badges:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleGerarCertificado = async () => {
    if (!nomeAluno?.trim() || !modalCert) return;
    setGerando(true);
    try {
      const cert = await ApiService.gerarCertificado(modalCert?.id, nomeAluno.trim());
      setModalCert(null);
      setNomeAluno('');
      Alert.alert(
        '🎓 Certificado gerado!',
        'Seu certificado foi gerado com sucesso.',
        [
          {
            text: '📤 Compartilhar',
            onPress: () => {
              if (cert?.id) {
                Share.share({
                  message: `🎓 Conquistei o certificado "${modalCert?.nome}" no Arena Excel!\n\nVerifique: https://arenaexcel.excelcomjohni.com.br/api/badges/certificado/validar/${cert?.id}`,
                });
              }
            },
          },
          { text: 'OK' },
        ]
      );
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível gerar o certificado.');
    } finally {
      setGerando(false);
    }
  };

  // ===== TELA PARA USUÁRIOS GRATUITOS =====
  if (!isPremium) {
    return (
      // backgroundColor matches gradient end so safe-area padding below has no white gap
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1A5C35' }} edges={['top']}>
        <LinearGradient
          colors={['#0A1628', '#217346']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <ParticlesBackground />
          <MockCertWatermark />

          <ScrollView
            contentContainerStyle={styles.freeScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Excelino com anel dourado e badge PRO */}
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
              {/* Badge PRO */}
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            </View>

            {/* Título */}
            <Text style={styles.freeTitle}>Certificado e Badges</Text>

            {/* Subtítulo */}
            <Text style={styles.freeSubtitle}>Você está quase lá! 🏆</Text>
            <Text style={styles.freeDescription}>
              Comprove suas habilidades e conquiste seu espaço no mercado com o certificado oficial do Arena Excel
            </Text>

            {/* Benefícios */}
            <View style={styles.benefitsList}>
              {[
                'Certificado oficial de conclusão',
                'Compartilhe no LinkedIn',
                'Valide suas habilidades em Excel',
              ].map((text, i) => (
                <View key={i} style={styles.benefitCard}>
                  <Text style={styles.benefitCheck}>✅</Text>
                  <Text style={styles.benefitText}>{text}</Text>
                </View>
              ))}
            </View>

            {/* Botão Premium com pulse */}
            <Animated.View style={[styles.btnWrapper, { transform: [{ scale: pulseAnim }] }]}>
              <TouchableOpacity
                onPress={() => setShowPaywall(true)}
                activeOpacity={0.85}
                style={styles.btnOuter}
              >
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
            onSuccess={() => {
              setShowPaywall(false);
              carregarBadges();
            }}
          />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // ===== TELA PARA USUÁRIOS PREMIUM =====
  const badgesCertificados = badges.filter(b => b?.tipo === 'certificado');
  const badgesComuns = badges.filter(b => b?.tipo === 'badge');

  const renderBadge = ({ item }: { item: Badge }) => (
    <TouchableOpacity
      style={[
        styles.badgeCard,
        !item?.conquistado && styles.badgeCardBloqueado,
      ]}
      onPress={() => {
        if (item?.conquistado && item?.tipo === 'certificado') {
          setModalCert(item);
        }
      }}
      activeOpacity={item?.conquistado ? 0.7 : 1}
    >
      <Text style={[styles.badgeEmoji, !item?.conquistado && { opacity: 0.3 }]}>
        {item?.conquistado ? item?.emoji : '🔒'}
      </Text>
      <Text style={[styles.badgeNome, !item?.conquistado && styles.badgeNomeBloqueado]}>
        {item?.nome}
      </Text>
      {item?.conquistado && item?.dataConquista && (
        <Text style={styles.badgeData}>
          {new Date(item?.dataConquista).toLocaleDateString('pt-BR')}
        </Text>
      )}
      {item?.conquistado && item?.tipo === 'certificado' && (
        <View style={styles.certBtn}>
          <Text style={styles.certBtnText}>🎓 Certificado</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) return (
    <SafeAreaView style={styles.loadingBox} edges={['top', 'bottom']}>
      <ActivityIndicator size="large" color="#10B981" />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.titulo}>🏆 Certificado e Badges</Text>

        <Text style={styles.secaoTitulo}>🎓 Certificados por Nível</Text>
        <FlatList
          data={badgesCertificados}
          renderItem={renderBadge}
          keyExtractor={i => i?.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 16 }}
        />

        <Text style={[styles.secaoTitulo, { marginTop: 24 }]}>⭐ Badges</Text>
        <View style={styles.badgesGrid}>
          {badgesComuns.map(item => (
            <View key={item?.id} style={{ width: '31%', marginBottom: 12 }}>
              {renderBadge({ item })}
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={!!modalCert} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>{modalCert?.emoji}</Text>
            <Text style={styles.modalTitulo}>{modalCert?.nome}</Text>
            <Text style={styles.modalSub}>Digite seu nome para o certificado:</Text>
            <TextInput
              style={styles.modalInput}
              value={nomeAluno}
              onChangeText={setNomeAluno}
              placeholder="Nome completo"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleGerarCertificado}
              disabled={gerando}
            >
              {gerando
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.modalBtnText}>✨ Gerar Certificado</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalCert(null)} style={{ marginTop: 12 }}>
              <Text style={{ color: '#999', textAlign: 'center' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ── FREE VIEW ─────────────────────────────────────────────
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
    gap: 0,
  },
  mockCertHeader: {
    width: '50%',
    height: 14,
    backgroundColor: '#F59E0B',
    borderRadius: 4,
    marginBottom: 16,
  },
  mockCertLine: {
    width: '90%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  mockCertSeal: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#F59E0B',
    marginTop: 16,
  },

  // Mascot
  mascotWrapper: {
    position: 'relative',
    marginBottom: 28,
    zIndex: 1,
  },
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
  mascotImage: {
    width: 100,
    height: 100,
  },
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
  proBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: 1,
  },

  // Texts
  freeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    zIndex: 1,
  },
  freeSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    zIndex: 1,
  },
  freeDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    zIndex: 1,
  },

  // Benefits
  benefitsList: {
    width: '100%',
    gap: 10,
    marginBottom: 36,
    zIndex: 1,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  benefitCheck: {
    fontSize: 20,
  },
  benefitText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
    flex: 1,
  },

  // Button
  btnWrapper: {
    width: '100%',
    zIndex: 1,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  btnOuter: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  btnGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A2E',
  },

  // ── PREMIUM VIEW ──────────────────────────────────────────
  container: { flex: 1, backgroundColor: '#fff' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a3a5c',
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 16,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  badgeCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  badgeCardBloqueado: {
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  badgeEmoji: { fontSize: 36 },
  badgeNome: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1a3a5c',
    textAlign: 'center',
  },
  badgeNomeBloqueado: { color: '#aaa' },
  badgeData: { fontSize: 9, color: '#888' },
  certBtn: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  certBtnText: { fontSize: 10, color: '#fff', fontWeight: '700' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    width: '85%',
    alignItems: 'center',
  },
  modalEmoji: { fontSize: 52, marginBottom: 8 },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a3a5c',
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 13,
    color: '#666',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#10B981',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    fontSize: 15,
    color: '#333',
  },
  modalBtn: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 14,
  },
  modalBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default CertificateScreen;
