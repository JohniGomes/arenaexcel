import React, { useState, useEffect } from 'react';
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

const PaywallModal = ({ visivel, onFechar, onSuccess }: PaywallModalProps) => {
  const { user, updatePremiumStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    if (visivel) {
      loadOfferings();
    }
  }, [visivel]);

  const loadOfferings = async () => {
    setLoadingPackages(true);
    try {
      // RevenueCat já foi inicializado no AuthContext
      // Apenas buscar os offerings disponíveis
      const pkgs = await PurchasesService.getOfferings();
      setPackages(pkgs);
      
      if (pkgs.length === 0) {
        console.warn('⚠️ Nenhum pacote disponível. Verifique se os produtos estão configurados no RevenueCat Dashboard.');
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
      // Encontrar o pacote selecionado
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
        // Atualizar status premium no context
        if (updatePremiumStatus) {
          await updatePremiumStatus(true);
        }
        
        Alert.alert(
          '🎉 Bem-vindo ao Premium!',
          'Agora você tem acesso a todos os recursos do Arena Excel!',
          [
            {
              text: 'Começar',
              onPress: () => {
                onSuccess();
                onFechar();
              },
            },
          ]
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
        if (updatePremiumStatus) {
          await updatePremiumStatus(true);
        }
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
        colors={['#0A3A40', '#107361']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safe}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onFechar} style={styles.fecharBtn}>
              <Text style={styles.fecharTexto}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.titulo}>⭐ Arena Excel Premium</Text>
            <Text style={styles.subtitulo}>
              Desbloqueie todo o potencial do seu aprendizado!
            </Text>

            {/* Benefícios */}
            <View style={styles.beneficiosContainer}>
              {[
                { icon: '✅', text: 'Acesso a TODOS os níveis (Intermediário e Avançado)' },
                { icon: '✅', text: 'Vidas ILIMITADAS - nunca pare de aprender' },
                { icon: '✅', text: 'Chat ilimitado com o Excelino' },
                { icon: '✅', text: '20 vídeos completos na Wiki Excel' },
                { icon: '✅', text: 'Todas as fórmulas e dicas desbloqueadas' },
                { icon: '✅', text: 'Análise de Planilhas com o Excelino Pró (Importe suas planilhas e obtenha insights com o Excelino Pró)' },
                { icon: '✅', text: 'Certificado de conclusão' },
              ].map((item, index) => (
                <View key={index} style={styles.beneficioItem}>
                  <Text style={styles.beneficioIcon}>{item.icon}</Text>
                  <Text style={styles.beneficioTexto}>{item.text}</Text>
                </View>
              ))}
            </View>

            {/* Planos */}
            <View style={styles.planosContainer}>
              {/* Plano Anual */}
              <TouchableOpacity
                style={[
                  styles.planoCard,
                  selectedPlan === 'yearly' && styles.planoSelecionado,
                ]}
                onPress={() => setSelectedPlan('yearly')}
                disabled={loading}
              >
                <View style={styles.badgeEconomia}>
                  <Text style={styles.badgeTexto}>ECONOMIZE 36%</Text>
                </View>
                <View style={styles.planoHeader}>
                  <Text style={styles.planoTitulo}>Anual</Text>
                  <View style={styles.selecionadoIcone}>
                    {selectedPlan === 'yearly' && (
                      <Text style={styles.checkIcon}>✓</Text>
                    )}
                  </View>
                </View>
                <Text style={styles.planoPreco}>R$ 229,90</Text>
                <Text style={styles.planoPorMes}>R$ 19,16/mês</Text>
                <Text style={styles.planoDetalhes}>2 meses grátis + economia de R$ 129,00</Text>
              </TouchableOpacity>

              {/* Plano Mensal */}
              <TouchableOpacity
                style={[
                  styles.planoCard,
                  selectedPlan === 'monthly' && styles.planoSelecionado,
                ]}
                onPress={() => setSelectedPlan('monthly')}
                disabled={loading}
              >
                <View style={styles.planoHeader}>
                  <Text style={styles.planoTitulo}>Mensal</Text>
                  <View style={styles.selecionadoIcone}>
                    {selectedPlan === 'monthly' && (
                      <Text style={styles.checkIcon}>✓</Text>
                    )}
                  </View>
                </View>
                <Text style={styles.planoPreco}>R$ 29,90</Text>
                <Text style={styles.planoPorMes}>por mês</Text>
                <Text style={styles.planoDetalhes}>Cancele quando quiser</Text>
              </TouchableOpacity>
            </View>

            {/* Loading packages */}
            {loadingPackages && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.loadingTexto}>Carregando planos...</Text>
              </View>
            )}

            {/* Botão de compra */}
            <TouchableOpacity
              style={[
                styles.comprarBtn,
                (loading || loadingPackages) && styles.comprarBtnDisabled,
              ]}
              onPress={handlePurchase}
              disabled={loading || loadingPackages}
            >
              {loading ? (
                <ActivityIndicator color="#0F5959" />
              ) : (
                <Text style={styles.comprarTexto}>
                  ⭐ Assinar Premium - {selectedPlan === 'yearly' ? 'R$ 229,90/ano' : 'R$ 29,90/mês'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Botão restaurar compras */}
            <TouchableOpacity
              style={styles.restaurarBtn}
              onPress={handleRestore}
              disabled={loading || loadingPackages}
            >
              <Text style={styles.restaurarTexto}>Restaurar compras</Text>
            </TouchableOpacity>

            {/* Disclaimer */}
            <Text style={styles.disclaimer}>
              • Renovação automática. Cancele a qualquer momento.{"\n"}
              • Acesso imediato a todos os recursos Premium.{"\n"}
              • Garantia de 7 dias - reembolso total se não gostar.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  fecharBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fecharTexto: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 32,
  },
  beneficiosContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  beneficioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  beneficioIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  beneficioTexto: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  planosContainer: {
    marginBottom: 24,
  },
  planoCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  planoSelecionado: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderColor: '#FFFFFF',
  },
  badgeEconomia: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
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
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  planoPreco: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  planoPorMes: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  planoDetalhes: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loadingTexto: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  comprarBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  comprarBtnDisabled: {
    opacity: 0.6,
  },
  comprarTexto: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A3A40',
  },
  restaurarBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  restaurarTexto: {
    fontSize: 16,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default PaywallModal;
