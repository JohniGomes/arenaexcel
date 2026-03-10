import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../../services/api.service';
import { theme } from '../../constants/theme';
import { usePremium } from '../../hooks/usePremium';
import PaywallModal from '../../components/PaywallModal';
import Button from '../../components/Button';

interface Badge {
  id: string;
  nome: string;
  tipo: string;
  emoji: string;
  conquistado: boolean;
  dataConquista: string | null;
}

const CertificateScreen = () => {
  const { isPremium } = usePremium();
  const [showPaywall, setShowPaywall] = useState(false);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalCert, setModalCert] = useState<Badge | null>(null);
  const [nomeAluno, setNomeAluno] = useState('');
  const [gerando, setGerando] = useState(false);

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
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <LinearGradient
          colors={['#0F4C5C', '#1B6B7D']}
          style={styles.paywallContainer}
        >
          <View style={styles.paywallCard}>
            {/* Mascote Excelino */}
            <View style={styles.mascotContainer}>
              <Image
                source={require('../../../assets/mascots/mascot-enthusiastic.png')}
                style={styles.mascotImage}
                resizeMode="contain"
              />
            </View>

            {/* Título */}
            <Text style={styles.paywallTitle}>Certificado e Badges</Text>
            
            {/* Descrição */}
            <Text style={styles.paywallDescription}>
              Complete todas as lições e seja Premium para receber seus certificados oficiais do Arena Excel!
            </Text>

            {/* Lista de benefícios */}
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.benefitText}>Certificado oficial de conclusão</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.benefitText}>Compartilhe no LinkedIn</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.benefitText}>Valide suas habilidades em Excel</Text>
              </View>
            </View>

            {/* Botão Premium */}
            <TouchableOpacity
              style={styles.premiumButton}
              onPress={() => setShowPaywall(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.premiumButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="star" size={20} color="#fff" />
                <Text style={styles.premiumButtonText}>Desbloquear Premium</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Paywall Modal */}
        <PaywallModal
          visivel={showPaywall}
          onFechar={() => setShowPaywall(false)}
          onSuccess={() => {
            setShowPaywall(false);
            // Recarregar badges após se tornar premium
            carregarBadges();
          }}
        />
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
        !item?.conquistado && styles.badgeCardBloqueado
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

        {/* CERTIFICADOS */}
        <Text style={styles.secaoTitulo}>🎓 Certificados por Nível</Text>
        <FlatList
          data={badgesCertificados}
          renderItem={renderBadge}
          keyExtractor={i => i?.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 16 }}
        />

        {/* BADGES */}
        <Text style={[styles.secaoTitulo, { marginTop: 24 }]}>⭐ Badges</Text>
        <View style={styles.badgesGrid}>
          {badgesComuns.map(item => (
            <View key={item?.id} style={{ width: '31%', marginBottom: 12 }}>
              {renderBadge({ item })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* MODAL CERTIFICADO */}
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
  container: { flex: 1, backgroundColor: '#fff' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  
  // ===== PAYWALL STYLES =====
  paywallContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  paywallCard: {
    backgroundColor: '#0F4C5C',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  mascotContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mascotImage: {
    width: 90,
    height: 90,
  },
  paywallTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  paywallDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  benefitsList: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  premiumButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  premiumButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  premiumButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
  },

  // ===== BADGES STYLES =====
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

  // ===== MODAL STYLES =====
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
