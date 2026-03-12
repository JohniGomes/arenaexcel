import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PurchasesPackage } from 'react-native-purchases';
import PurchasesService from '../services/purchases.service';
import { useAuth } from '../contexts/AuthContext';

interface PaywallModalProps {
  visivel: boolean;
  onFechar: () => void;
  onSuccess: () => void;
}

const BENEFITS = [
  'Acesso a TODOS os níveis (Intermediário e Avançado)',
  'Vidas ILIMITADAS - nunca pare de aprender',
  'Chat ilimitado com o Excelino',
  '20 vídeos completos na Wiki Excel',
  'Todas as fórmulas e dicas desbloqueadas',
  'Análise de Planilhas com o Excelino Pró',
  'Certificado de conclusão',
];

const PaywallModal = ({ visivel, onFechar, onSuccess }: PaywallModalProps) => {
  const { user, updatePremiumStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loadingPackages, setLoadingPackages] = useState(true);

  // Star pulse animation
  const starAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(starAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(starAnim, { toValue: 1.0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (visivel) {
      loadOfferings();
    }
  }, [visivel]);

  const loadOfferings = async () => {
    setLoadingPackages(true);
    try {
      const pkgs = await PurchasesService.getOfferings();
      setPackages(pkgs);
      if (pkgs.length === 0) {
        console.warn('⚠️ Nenhum pacote disponível. Verifique o RevenueCat Dashboard.');
      }
    } catch (error) {
      console.error('❌ Error loading offerings:', error);
    } finally {
      setLoadingPackages(false);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const pkg = packages.find((p) => {
        if (selectedPlan === 'monthly') {
          return p.packageType === 'MONTHLY' || p.identifier?.includes('monthly');
        } else {
          return p.packageType === 'ANNUAL' || p.identifier?.includes('yearly') || p.identifier?.includes('annual');
        }
      });

      if (!pkg) {
        Alert.alert('Erro', 'Plano não disponível. Tente novamente.');
        setLoading(false);
        return;
      }

      const success = await PurchasesService.purchasePackage(pkg);

      if (success) {
        if (updatePremiumStatus) {
          await updatePremiumStatus(true);
        }
        Alert.alert(
          '🎉 Bem-vindo ao Premium!',
          'Agora você tem acesso a todos os recursos do Arena Excel!',
          [{ text: 'Começar', onPress: () => { onSuccess(); onFechar(); } }]
        );
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Erro', 'Não foi possível completar a compra. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const success = await PurchasesService.restorePurchases();
      if (success) {
        if (updatePremiumStatus) await updatePremiumStatus(true);
        Alert.alert('✅ Compra restaurada', 'Seu acesso Premium foi restaurado com sucesso!');
        onSuccess();
        onFechar();
      } else {
        Alert.alert('Aviso', 'Nenhuma compra anterior encontrada.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Erro', 'Não foi possível restaurar compras.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visivel} animationType="slide" transparent={false}>
      <LinearGradient
        colors={['#0A1628', '#217346']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safe}>
          {/* Header com botão fechar */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onFechar} style={styles.fecharBtn}>
              <Text style={styles.fecharTexto}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Título com estrela animada */}
            <View style={styles.titleRow}>
              <Animated.Text style={[styles.starEmoji, { transform: [{ scale: starAnim }] }]}>
                ⭐
              </Animated.Text>
              <Text style={styles.titulo}> Arena Excel Premium</Text>
            </View>
            <Text style={styles.subtitulo}>
              Desbloqueie todo o potencial do seu aprendizado!
            </Text>

            {/* Benefícios */}
            <View style={styles.beneficiosContainer}>
              {BENEFITS.map((text, index) => (
                <View key={index} style={styles.beneficioItem}>
                  <Text style={styles.beneficioIcon}>✅</Text>
                  <Text style={styles.beneficioTexto}>{text}</Text>
                </View>
              ))}
            </View>

            {/* Planos */}
            <View style={styles.planosContainer}>
              {/* Plano Anual */}
              <TouchableOpacity
                style={[
                  styles.planoCard,
                  styles.planoAnualCard,
                  selectedPlan === 'yearly' && styles.planoAnualSelecionado,
                ]}
                onPress={() => setSelectedPlan('yearly')}
                disabled={loading}
              >
                {/* Badge economia */}
                <View style={styles.badgeEconomia}>
                  <Text style={styles.badgeTexto}>ECONOMIZE 36%</Text>
                </View>

                <View style={styles.planoHeader}>
                  <Text style={styles.planoTitulo}>Anual</Text>
                  <View style={[
                    styles.selecionadoIcone,
                    selectedPlan === 'yearly' && styles.selecionadoIconeAtivo,
                  ]}>
                    {selectedPlan === 'yearly' && (
                      <Text style={styles.checkIcon}>✓</Text>
                    )}
                  </View>
                </View>

                <Text style={styles.planoPreco}>R$ 229,90</Text>
                <Text style={styles.planoPorMes}>R$ 19,16/mês</Text>
                <Text style={styles.planoEconomia}>Economia de R$ 129,00</Text>
              </TouchableOpacity>

              {/* Plano Mensal */}
              <TouchableOpacity
                style={[
                  styles.planoCard,
                  styles.planoMensalCard,
                  selectedPlan === 'monthly' && styles.planoMensalSelecionado,
                ]}
                onPress={() => setSelectedPlan('monthly')}
                disabled={loading}
              >
                <View style={styles.planoHeader}>
                  <Text style={styles.planoTitulo}>Mensal</Text>
                  <View style={[
                    styles.selecionadoIcone,
                    selectedPlan === 'monthly' && styles.selecionadoIconeMensal,
                  ]}>
                    {selectedPlan === 'monthly' && (
                      <Text style={styles.checkIcon}>✓</Text>
                    )}
                  </View>
                </View>

                <Text style={styles.planoPreco}>R$ 29,90</Text>
                <Text style={styles.planoPorMes}>por mês</Text>
                <Text style={styles.planoCancele}>Cancele quando quiser</Text>
              </TouchableOpacity>
            </View>

            {/* Loading packages */}
            {loadingPackages && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.loadingTexto}>Carregando planos...</Text>
              </View>
            )}

            {/* Botão assinar */}
            <View style={styles.comprarBtnWrapper}>
              <TouchableOpacity
                onPress={handlePurchase}
                disabled={loading || loadingPackages}
                style={[styles.comprarBtnOuter, (loading || loadingPackages) && styles.comprarBtnDisabled]}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#F59E0B', '#F7C948']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.comprarBtnGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#1A1A2E" />
                  ) : (
                    <Text style={styles.comprarTexto}>
                      ⭐ Assinar Premium -{' '}
                      {selectedPlan === 'yearly' ? 'R$ 229,90/ano' : 'R$ 29,90/mês'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Restaurar compras */}
            <TouchableOpacity
              style={styles.restaurarBtn}
              onPress={handleRestore}
              disabled={loading || loadingPackages}
            >
              <Text style={styles.restaurarTexto}>Restaurar compras</Text>
            </TouchableOpacity>

            {/* Disclaimer */}
            <Text style={styles.disclaimer}>
              • Renovação automática. Cancele a qualquer momento.{'\n'}
              • Acesso imediato a todos os recursos Premium.{'\n'}
              • Garantia de 7 dias - reembolso total se não gostar.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  fecharBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fecharTexto: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  // Title
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  starEmoji: {
    fontSize: 28,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 28,
  },

  // Benefits
  beneficiosContainer: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
  },
  beneficioItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  beneficioIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 1,
  },
  beneficioTexto: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },

  // Plans
  planosContainer: {
    marginBottom: 24,
    gap: 12,
  },
  planoCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    position: 'relative',
  },
  planoAnualCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(245,158,11,0.4)',
    paddingTop: 32,
  },
  planoAnualSelecionado: {
    borderColor: '#F59E0B',
  },
  planoMensalCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  planoMensalSelecionado: {
    borderColor: '#FFFFFF',
  },

  // Badge economia
  badgeEconomia: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    left: '50%',
    transform: [{ translateX: -55 }],
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeTexto: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A1A2E',
  },

  planoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planoTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  selecionadoIcone: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selecionadoIconeAtivo: {
    borderColor: '#27AE60',
    backgroundColor: '#27AE60',
  },
  selecionadoIconeMensal: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  checkIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  planoPreco: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  planoPorMes: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
  },
  planoEconomia: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '600',
  },
  planoCancele: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  loadingTexto: {
    fontSize: 14,
    color: '#FFFFFF',
  },

  // Buy button
  comprarBtnWrapper: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 16,
    borderRadius: 16,
  },
  comprarBtnOuter: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  comprarBtnDisabled: {
    opacity: 0.6,
  },
  comprarBtnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  comprarTexto: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A2E',
  },

  // Restore
  restaurarBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  restaurarTexto: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    textDecorationLine: 'underline',
  },

  // Disclaimer
  disclaimer: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    lineHeight: 17,
  },
});

export default PaywallModal;
