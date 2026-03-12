import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import ApiService from '../../services/api.service';
import { usePremium } from '../../hooks/usePremium';
import { useAuth } from '../../contexts/AuthContext';
import PaywallModal from '../../components/PaywallModal';

const { width: W, height: H } = Dimensions.get('window');
const PROD_URL = 'https://arenaexcel.excelcomjohni.com.br';

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

interface TrailItem {
  id: string;
  slug: string;
  name: string;
  icon: string;
  totalQuestions: number;
  progress: { completedAt: string | null; currentQuestion: number; accuracy: number } | null;
}

interface LevelItem {
  id: number;
  name: string;
  completed: number;
  total: number;
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

interface CertTarget {
  type: 'trail' | 'level';
  name: string;
  completedAt: string | null;
  horas: number;
  courseId: string;
}

// ── Certificate HTML Generator ────────────────────────────────
const generateCertificateHTML = (p: {
  nomeAluno: string;
  curso: string;
  horas: number;
  licoesConcluidas: number;
  data: string;
  userId: string;
  courseId: string;
}): string => {
  const validateUrl = `${PROD_URL}/certificado/${p.userId}/${p.courseId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(validateUrl)}&color=F59E0B&bgcolor=0A1628`;
  const dataFmt = p.data ? new Date(p.data).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=900">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Playfair+Display:wght@700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;600;700&display=swap');
  @page { size: A4 landscape; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0A1628; font-family: 'Montserrat', Arial, sans-serif; }
  .cw {
    width: 900px; height: 636px; position: relative;
    background: linear-gradient(135deg, #0A1628 0%, #0d2a1a 50%, #0A1628 100%);
    overflow: hidden;
  }
  .corner-tl {
    position: absolute; top: 0; left: 0; width: 280px; height: 200px;
    overflow: hidden; z-index: 2;
  }
  .corner-tl::before {
    content: ''; position: absolute; top: -60px; left: -100px;
    width: 400px; height: 250px;
    background: linear-gradient(135deg, #217346 0%, #2a8f5a 40%, #1a5e38 70%);
    border-radius: 0 0 60% 0; transform: rotate(-5deg);
  }
  .corner-tl::after {
    content: ''; position: absolute; top: -30px; left: -80px;
    width: 350px; height: 200px;
    background: linear-gradient(135deg, rgba(245,159,11,0.25) 0%, transparent 60%);
    border-radius: 0 0 50% 0; transform: rotate(-8deg);
  }
  .corner-br {
    position: absolute; bottom: 0; right: 0; width: 300px; height: 220px;
    overflow: hidden; z-index: 2;
  }
  .corner-br::before {
    content: ''; position: absolute; bottom: -70px; right: -110px;
    width: 420px; height: 270px;
    background: linear-gradient(315deg, #217346 0%, #2a8f5a 40%, #1a5e38 70%);
    border-radius: 60% 0 0 0; transform: rotate(-5deg);
  }
  .corner-br::after {
    content: ''; position: absolute; bottom: -40px; right: -90px;
    width: 370px; height: 220px;
    background: linear-gradient(315deg, rgba(245,159,11,0.3) 0%, transparent 60%);
    border-radius: 50% 0 0 0; transform: rotate(-8deg);
  }
  .gold-tl {
    position: absolute; top: 0; left: 0; width: 240px; height: 160px;
    overflow: hidden; z-index: 3;
  }
  .gold-tl::before {
    content: ''; position: absolute; top: -50px; left: -70px;
    width: 350px; height: 200px;
    border: 3px solid rgba(245,159,11,0.4);
    border-radius: 0 0 55% 0; transform: rotate(-5deg); background: transparent;
  }
  .gold-br {
    position: absolute; bottom: 0; right: 0; width: 260px; height: 180px;
    overflow: hidden; z-index: 3;
  }
  .gold-br::before {
    content: ''; position: absolute; bottom: -60px; right: -80px;
    width: 380px; height: 230px;
    border: 3px solid rgba(245,159,11,0.4);
    border-radius: 55% 0 0 0; transform: rotate(-5deg); background: transparent;
  }
  .inner-border {
    position: absolute; top: 16px; left: 16px; right: 16px; bottom: 16px;
    border: 1px solid rgba(245,159,11,0.25); z-index: 1;
  }
  .ornament-tr {
    position: absolute; top: 20px; right: 20px; width: 40px; height: 40px;
    border-top: 2px solid rgba(245,159,11,0.4); border-right: 2px solid rgba(245,159,11,0.4);
    border-radius: 0 8px 0 0; z-index: 4;
  }
  .ornament-bl {
    position: absolute; bottom: 20px; left: 20px; width: 40px; height: 40px;
    border-bottom: 2px solid rgba(245,159,11,0.4); border-left: 2px solid rgba(245,159,11,0.4);
    border-radius: 0 0 0 8px; z-index: 4;
  }
  .medal {
    position: absolute; top: 36px; right: 60px; z-index: 6; width: 90px; height: 110px;
  }
  .medal-circle {
    width: 80px; height: 80px; border-radius: 50%;
    background: radial-gradient(circle, #217346 0%, #0A1628 100%);
    border: 2px solid #F59E0B;
    box-shadow: 0 4px 20px rgba(245,159,11,0.4), 0 0 30px rgba(33,115,70,0.3);
    display: flex; align-items: center; justify-content: center; margin: 0 auto;
    font-size: 30px; color: #F59E0B;
    position: relative;
  }
  .medal-circle::after {
    content: ''; position: absolute; top: 5px; left: 5px; right: 5px; bottom: 5px;
    border-radius: 50%; border: 1px solid rgba(245,159,11,0.3);
  }
  .medal-rl { position: absolute; bottom: 0; left: 14px; width: 0; height: 0; z-index: -1;
    border-left: 18px solid #217346; border-right: 18px solid transparent;
    border-top: 30px solid #217346; border-bottom: 12px solid transparent; }
  .medal-rr { position: absolute; bottom: 0; right: 14px; width: 0; height: 0; z-index: -1;
    border-left: 18px solid transparent; border-right: 18px solid #217346;
    border-top: 30px solid #217346; border-bottom: 12px solid transparent; }
  .excel-icon {
    position: absolute; bottom: 36px; left: 50px; z-index: 6;
    width: 44px; height: 44px; background: #217346; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-family: 'Montserrat', sans-serif;
    font-weight: 700; font-size: 20px;
    box-shadow: 0 2px 12px rgba(33,115,70,0.5);
  }
  .meta-info {
    position: absolute; bottom: 40px; right: 60px; z-index: 6; text-align: right;
  }
  .meta-info p {
    font-family: 'Montserrat', sans-serif; font-size: 11px; color: rgba(255,255,255,0.55); line-height: 1.6;
  }
  .meta-info strong { color: rgba(255,255,255,0.9); font-weight: 600; }
  .qr-block {
    position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
    z-index: 6; text-align: center;
  }
  .qr-block img { width: 56px; height: 56px; border-radius: 4px; }
  .qr-label { font-size: 8px; color: rgba(255,255,255,0.5); margin-top: 2px; letter-spacing: 0.3px; }
  .qr-cnpj { font-size: 7px; color: rgba(255,255,255,0.35); margin-top: 1px; letter-spacing: 0.2px; }
  .content {
    position: relative; z-index: 5;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 100%; padding: 50px 80px; text-align: center;
  }
  .title-main {
    font-family: 'Playfair Display', Georgia, serif; font-weight: 900; font-size: 48px;
    color: #F59E0B; letter-spacing: 6px; line-height: 1; text-transform: uppercase;
    text-shadow: 0 0 30px rgba(245,159,11,0.3);
  }
  .title-sub {
    font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 16px;
    color: rgba(255,255,255,0.75); letter-spacing: 12px; text-transform: uppercase; margin-top: 4px;
  }
  .presented-to {
    font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600; font-size: 13px;
    color: rgba(245,159,11,0.7); letter-spacing: 5px; text-transform: uppercase; margin: 20px 0 10px;
  }
  .recipient-name {
    font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 38px;
    color: #fff; line-height: 1.2; margin-bottom: 4px;
  }
  .description {
    font-family: 'Cormorant Garamond', Georgia, serif; font-size: 15px; color: rgba(255,255,255,0.8);
    line-height: 1.7; max-width: 520px; margin: 12px auto 0;
  }
  .description strong { font-weight: 600; color: #fff; }
  .signature-section { margin-top: 24px; display: flex; flex-direction: column; align-items: center; }
  .sig-cursive {
    font-family: 'Dancing Script', cursive; font-size: 34px; color: #fff; margin-bottom: -2px;
  }
  .sig-line { width: 200px; height: 1px; background: rgba(255,255,255,0.3); margin: 4px 0; }
  .sig-role {
    font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 600;
    color: #F59E0B; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 6px;
  }
</style>
</head>
<body>
<div class="cw">
  <div class="corner-tl"></div>
  <div class="corner-br"></div>
  <div class="gold-tl"></div>
  <div class="gold-br"></div>
  <div class="inner-border"></div>
  <div class="ornament-tr"></div>
  <div class="ornament-bl"></div>

  <div class="medal">
    <div class="medal-circle">★</div>
    <div class="medal-rl"></div>
    <div class="medal-rr"></div>
  </div>

  <div class="excel-icon">X</div>

  <div class="meta-info">
    <p>Data: <strong>${dataFmt}</strong></p>
    <p>Carga horária: <strong>${p.horas}h</strong></p>
    <p>Lições: <strong>${p.licoesConcluidas}</strong></p>
  </div>

  <div class="qr-block">
    <img src="${qrUrl}" alt="QR Code" />
    <div class="qr-label">Escaneie para validar</div>
    <div class="qr-cnpj">CNPJ: 65.002.492/0001-08</div>
  </div>

  <div class="content">
    <div>
      <div class="title-main">Certificado</div>
      <div class="title-sub">de Qualificação</div>
    </div>
    <div class="presented-to">Este certificado é apresentado a</div>
    <div class="recipient-name">${p.nomeAluno}</div>
    <p class="description">
      Após a conclusão com sucesso de <strong>"${p.curso}"</strong>
      com carga horária total de <strong>${p.horas}h</strong> e
      <strong>${p.licoesConcluidas} lições</strong> concluídas.
      Certifico a capacidade do(a) aluno(a) em aplicar as habilidades
      aprendidas em contextos profissionais e acadêmicos.
    </p>
    <div class="signature-section">
      <div class="sig-cursive">Johni Michael</div>
      <div class="sig-line"></div>
      <div class="sig-role">Professor e Fundador | Arena Excel</div>
    </div>
  </div>
</div>
</body>
</html>`;
};

// ── Trail Card ────────────────────────────────────────────────
const TrailCard: React.FC<{
  trail: TrailItem;
  onGenerate: (target: CertTarget) => void;
}> = ({ trail, onGenerate }) => {
  const completed = !!trail.progress?.completedAt;
  const inProgress = !completed && (trail.progress?.currentQuestion ?? 0) > 0;
  const progress = trail.progress;
  const pct = completed ? 100 : Math.round(((progress?.currentQuestion ?? 0) / Math.max(trail.totalQuestions, 1)) * 100);
  const horas = Math.round((trail.totalQuestions * 3 / 60) * 10) / 10;

  return (
    <View style={[styles.itemCard, completed && styles.itemCardDone, inProgress && styles.itemCardProgress]}>
      <View style={styles.itemRow}>
        <View style={[styles.itemIconWrap, completed && styles.itemIconDone, inProgress && styles.itemIconProgress]}>
          {completed
            ? <Ionicons name="checkmark" size={18} color="#fff" />
            : inProgress
              ? <Text style={styles.itemIconEmoji}>{trail.icon}</Text>
              : <Ionicons name="lock-closed" size={16} color="#bbb" />
          }
        </View>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, !completed && !inProgress && styles.itemNameLocked]} numberOfLines={1}>
            {trail.name}
          </Text>
          <Text style={styles.itemMeta}>
            {completed
              ? `✓ Concluída · ${Math.round((progress?.accuracy ?? 0) * 100)}% precisão`
              : inProgress
                ? `${progress?.currentQuestion ?? 0}/${trail.totalQuestions} questões`
                : `${trail.totalQuestions} questões`
            }
          </Text>
          {(completed || inProgress) && (
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${pct}%` as any, backgroundColor: completed ? '#27AE60' : '#F59E0B' }]} />
            </View>
          )}
        </View>
        {completed && (
          <TouchableOpacity
            style={styles.certBtn}
            onPress={() => onGenerate({
              type: 'trail',
              name: trail.name,
              completedAt: progress?.completedAt ?? null,
              horas,
              courseId: trail.slug,
            })}
            activeOpacity={0.8}
          >
            <Ionicons name="ribbon-outline" size={14} color="#fff" />
            <Text style={styles.certBtnText}>Certificado</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ── Level Card ────────────────────────────────────────────────
const LevelCard: React.FC<{
  level: LevelItem;
  onGenerate: (target: CertTarget) => void;
}> = ({ level, onGenerate }) => {
  const completed = level.total > 0 && level.completed === level.total;
  const inProgress = !completed && level.completed > 0;
  const pct = level.total > 0 ? Math.round((level.completed / level.total) * 100) : 0;
  const horas = Math.round((level.completed * 3 / 60) * 10) / 10;

  return (
    <View style={[styles.itemCard, completed && styles.itemCardDone, inProgress && styles.itemCardProgress]}>
      <View style={styles.itemRow}>
        <View style={[styles.itemIconWrap, completed && styles.itemIconDone, inProgress && styles.itemIconProgress]}>
          {completed
            ? <Ionicons name="checkmark" size={18} color="#fff" />
            : inProgress
              ? <Ionicons name="book-outline" size={16} color="#F59E0B" />
              : <Ionicons name="lock-closed" size={16} color="#bbb" />
          }
        </View>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, !completed && !inProgress && styles.itemNameLocked]} numberOfLines={1}>
            {level.name}
          </Text>
          <Text style={styles.itemMeta}>
            {completed
              ? `✓ ${level.completed}/${level.total} lições concluídas`
              : `${level.completed}/${level.total} lições`
            }
          </Text>
          {(completed || inProgress) && (
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${pct}%` as any, backgroundColor: completed ? '#27AE60' : '#F59E0B' }]} />
            </View>
          )}
        </View>
        {completed && (
          <TouchableOpacity
            style={styles.certBtn}
            onPress={() => onGenerate({
              type: 'level',
              name: `${level.name} — Lições Clássicas`,
              completedAt: null,
              horas,
              courseId: `nivel-${level.id}`,
            })}
            activeOpacity={0.8}
          >
            <Ionicons name="ribbon-outline" size={14} color="#fff" />
            <Text style={styles.certBtnText}>Certificado</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ── Badge Card ────────────────────────────────────────────────
const BadgeCard: React.FC<{ badge: BadgeItem }> = ({ badge }) => (
  <View style={[styles.badgeCard, badge.conquistado ? styles.badgeDone : styles.badgeLocked]}>
    <Text style={[styles.badgeIcon, !badge.conquistado && { opacity: 0.25 }]}>
      {badge.icone}
    </Text>
    {!badge.conquistado && (
      <View style={styles.badgeLockIcon}>
        <Ionicons name="lock-closed" size={10} color="#bbb" />
      </View>
    )}
    <Text style={[styles.badgeName, !badge.conquistado && styles.badgeNameLocked]}>
      {badge.nome}
    </Text>
    <Text style={[styles.badgeDesc, !badge.conquistado && styles.badgeDescLocked]} numberOfLines={2}>
      {badge.descricao}
    </Text>
  </View>
);

// ── Certificate Modal ─────────────────────────────────────────
interface CertModalProps {
  visible: boolean;
  target: CertTarget | null;
  certData: CertData | null;
  isPremium: boolean;
  onClose: () => void;
  onShowPaywall: () => void;
}

const CertModal: React.FC<CertModalProps> = ({ visible, target, certData, isPremium, onClose, onShowPaywall }) => {
  const { user } = useAuth();
  const [nome, setNome] = useState('');
  const [gerando, setGerando] = useState(false);

  useEffect(() => {
    if (visible) setNome(user?.name ?? '');
  }, [visible]);

  const handleGerar = async () => {
    if (!nome.trim() || !target || !certData) return;

    if (!isPremium) {
      onClose();
      setTimeout(() => onShowPaywall(), 300);
      return;
    }

    setGerando(true);
    try {
      // Registra certificado e verifica badges (Fix 6)
      await ApiService.gerarCertificado(target.courseId, nome.trim()).catch(() => {});
      ApiService.verificarBadges().catch(() => {});

      const html = generateCertificateHTML({
        nomeAluno: nome.trim(),
        curso: target.name,
        horas: target.horas + certData.horasDedicadas,
        licoesConcluidas: certData.licoesConcluidas,
        data: target.completedAt ?? new Date().toISOString(),
        userId: certData.userId,
        courseId: target.courseId,
      });

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
        orientation: Print.Orientation.Landscape,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartilhar Certificado',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('PDF Gerado', `Arquivo salvo em:\n${uri}`);
      }
      onClose();
    } catch (e) {
      console.error('Erro ao gerar certificado:', e);
      Alert.alert('Erro', 'Não foi possível gerar o certificado. Tente novamente.');
    } finally {
      setGerando(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <LinearGradient colors={['#0A1628', '#217346']} style={styles.modalHeader}>
            <Ionicons name="ribbon" size={32} color="#F59E0B" />
            <Text style={styles.modalHeaderTitle}>Gerar Certificado</Text>
            <Text style={styles.modalHeaderSub} numberOfLines={2}>{target?.name}</Text>
          </LinearGradient>

          <View style={styles.modalBody}>
            {!isPremium && (
              <View style={styles.premiumWarning}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.premiumWarningText}>Recurso exclusivo Premium</Text>
              </View>
            )}

            <Text style={styles.modalLabel}>Nome completo para o certificado:</Text>
            <TextInput
              style={styles.modalInput}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome completo"
              placeholderTextColor="#aaa"
              autoFocus
            />

            <View style={styles.modalStats}>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatVal}>{(target?.horas ?? 0) + (certData?.horasDedicadas ?? 0)}h</Text>
                <Text style={styles.modalStatLabel}>Horas</Text>
              </View>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatVal}>{certData?.licoesConcluidas ?? 0}</Text>
                <Text style={styles.modalStatLabel}>Lições</Text>
              </View>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatVal}>{certData?.precisao ?? 0}%</Text>
                <Text style={styles.modalStatLabel}>Precisão</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.modalBtn, (!nome.trim() || gerando) && { opacity: 0.5 }]}
              onPress={handleGerar}
              disabled={!nome.trim() || gerando}
              activeOpacity={0.85}
            >
              {gerando
                ? <ActivityIndicator color="#1A1A2E" size="small" />
                : <>
                    <Ionicons name={isPremium ? 'download-outline' : 'star'} size={18} color="#1A1A2E" />
                    <Text style={styles.modalBtnText}>
                      {isPremium ? 'Salvar PDF e Compartilhar' : 'Assinar Premium'}
                    </Text>
                  </>
              }
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ── Free View (non-premium marketing page) ────────────────────
const FreeView: React.FC<{ onShowPaywall: () => void }> = ({ onShowPaywall }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1A5C35' }} edges={['top']}>
      <LinearGradient colors={['#0A1628', '#217346']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.freeContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mascotRingWrap}>
            <LinearGradient colors={['#1A3A2A', '#0A1628']} style={styles.mascotRing}>
              <Image source={require('../../../assets/mascots/mascot_enthusiastic.png')} style={styles.mascotImg} resizeMode="contain" />
            </LinearGradient>
            <View style={styles.proBadge}><Text style={styles.proBadgeText}>PRO</Text></View>
          </View>

          <Text style={styles.freeTitle}>Certificados e Badges</Text>
          <Text style={styles.freeSub}>Comprove suas habilidades no mercado</Text>
          <Text style={styles.freeDesc}>
            Gere certificados PDF profissionais ao concluir trilhas e módulos. Compartilhe no LinkedIn e valide suas habilidades.
          </Text>

          {[
            'Certificados PDF de cada trilha concluída',
            'QR Code único para validação',
            'Compartilhe no LinkedIn e redes sociais',
            'Badges desbloqueáveis por conquistas',
          ].map((t, i) => (
            <View key={i} style={styles.freeBenefit}>
              <Ionicons name="checkmark-circle" size={22} color="#10B981" />
              <Text style={styles.freeBenefitText}>{t}</Text>
            </View>
          ))}

          <Animated.View style={[styles.freeBtnWrap, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity onPress={onShowPaywall} activeOpacity={0.85} style={styles.freeBtnOuter}>
              <LinearGradient colors={['#F59E0B', '#F7C948']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.freeBtnGrad}>
                <Text style={styles.freeBtnText}>⭐ Desbloquear Premium</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// ── Main Component ────────────────────────────────────────────
const CertificateScreen = () => {
  const { isPremium } = usePremium();
  const [showPaywall, setShowPaywall] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trails, setTrails] = useState<TrailItem[]>([]);
  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [certData, setCertData] = useState<CertData | null>(null);
  const [certTarget, setCertTarget] = useState<CertTarget | null>(null);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const carregarDados = async () => {
    try {
      const [trailsResp, progressResp, certResp, badgesResp] = await Promise.all([
        ApiService.getTrails(),
        ApiService.getProgress(),
        ApiService.getCertificateData().catch(() => null),
        ApiService.getMeusBadges().catch(() => []),
      ]);
      setTrails(trailsResp ?? []);
      setLevels(progressResp?.levels ?? []);
      setCertData(certResp);
      setBadges(badgesResp ?? []);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCert = (target: CertTarget) => {
    setCertTarget(target);
  };

  if (!isPremium) {
    return (
      <>
        <FreeView onShowPaywall={() => setShowPaywall(true)} />
        <PaywallModal
          visivel={showPaywall}
          onFechar={() => setShowPaywall(false)}
          onSuccess={() => { setShowPaywall(false); carregarDados(); }}
        />
      </>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingBox} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color="#217346" />
      </SafeAreaView>
    );
  }

  const trailsDone = trails.filter(t => t.progress?.completedAt).length;
  const levelsDone = levels.filter(l => l.total > 0 && l.completed === l.total).length;
  const badgesDone = badges.filter(b => b.conquistado).length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── TRILHAS ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🗺️ Trilhas</Text>
          <Text style={styles.sectionCount}>{trailsDone}/{trails.length} concluídas</Text>
        </View>
        {trails.length === 0
          ? <Text style={styles.emptyMsg}>Nenhuma trilha disponível</Text>
          : trails.map(t => <TrailCard key={t.id} trail={t} onGenerate={handleGenerateCert} />)
        }

        {/* ── LIÇÕES CLÁSSICAS ── */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>📖 Lições Clássicas</Text>
          <Text style={styles.sectionCount}>{levelsDone}/{levels.length} módulos</Text>
        </View>
        {levels.length === 0
          ? <Text style={styles.emptyMsg}>Nenhum módulo disponível</Text>
          : levels.map(l => <LevelCard key={l.id} level={l} onGenerate={handleGenerateCert} />)
        }

        {/* ── BADGES ── */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>⭐ Badges</Text>
          <Text style={styles.sectionCount}>{badgesDone}/{badges.length} desbloqueadas</Text>
        </View>
        {BADGE_CATEGORIES.map(cat => {
          const catBadges = badges.filter(b => b.categoria === cat.key);
          if (catBadges.length === 0) return null;
          const done = catBadges.filter(b => b.conquistado).length;
          return (
            <View key={cat.key} style={styles.categorySection}>
              <View style={styles.categoryRow}>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
                <Text style={styles.categoryCount}>{done}/{catBadges.length}</Text>
              </View>
              <View style={styles.badgesGrid}>
                {catBadges.map(b => <BadgeCard key={b.id} badge={b} />)}
              </View>
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

      <CertModal
        visible={!!certTarget}
        target={certTarget}
        certData={certData}
        isPremium={isPremium}
        onClose={() => setCertTarget(null)}
        onShowPaywall={() => setShowPaywall(true)}
      />

      <PaywallModal
        visivel={showPaywall}
        onFechar={() => setShowPaywall(false)}
        onSuccess={() => { setShowPaywall(false); carregarDados(); }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F6F9' },
  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24 },

  // ── FREE VIEW ──────────────────────────────────────────────
  freeContent: { alignItems: 'center', paddingHorizontal: 28, paddingTop: 48, paddingBottom: 56 },
  mascotRingWrap: { position: 'relative', marginBottom: 28 },
  mascotRing: {
    width: 130, height: 130, borderRadius: 65,
    borderWidth: 3, borderColor: '#F59E0B',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 24, elevation: 16,
  },
  mascotImg: { width: 100, height: 100 },
  proBadge: {
    position: 'absolute', bottom: 4, right: 4,
    backgroundColor: '#F59E0B', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 3,
    elevation: 6,
  },
  proBadgeText: { fontSize: 11, fontWeight: '800', color: '#1A1A2E', letterSpacing: 1 },
  freeTitle: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 8 },
  freeSub: { fontSize: 17, fontWeight: '600', color: '#F59E0B', textAlign: 'center', marginBottom: 12 },
  freeDesc: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  freeBenefit: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12, width: '100%' },
  freeBenefitText: { fontSize: 14, color: '#fff', fontWeight: '500', flex: 1 },
  freeBtnWrap: {
    width: '100%', marginTop: 28,
    shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6, shadowRadius: 16, elevation: 12,
  },
  freeBtnOuter: { borderRadius: 16, overflow: 'hidden' },
  freeBtnGrad: { paddingVertical: 18, alignItems: 'center' },
  freeBtnText: { fontSize: 17, fontWeight: '800', color: '#1A1A2E' },

  // ── SECTION HEADERS ──────────────────────────────────────
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1a3a5c' },
  sectionCount: { fontSize: 13, fontWeight: '600', color: '#888' },
  emptyMsg: { fontSize: 14, color: '#aaa', textAlign: 'center', paddingVertical: 16 },

  // ── ITEM CARDS (trails & levels) ─────────────────────────
  itemCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  itemCardDone: { borderColor: '#27AE60', backgroundColor: '#F0FDF4' },
  itemCardProgress: { borderColor: '#F59E0B', backgroundColor: '#FFFBEB' },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  itemIconDone: { backgroundColor: '#27AE60' },
  itemIconProgress: { backgroundColor: '#FEF3C7' },
  itemIconEmoji: { fontSize: 20 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#1a3a5c', marginBottom: 2 },
  itemNameLocked: { color: '#9CA3AF' },
  itemMeta: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  progressBarBg: { height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: 4, borderRadius: 2 },
  certBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#217346', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 7,
    flexShrink: 0,
  },
  certBtnText: { fontSize: 11, fontWeight: '700', color: '#fff' },

  // ── BADGES ───────────────────────────────────────────────
  categorySection: { marginBottom: 20 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryLabel: { fontSize: 13, fontWeight: '700', color: '#555' },
  categoryCount: { fontSize: 12, color: '#888' },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badgeCard: {
    width: (W - 48) / 3,
    borderRadius: 12, padding: 10, alignItems: 'center',
    position: 'relative', minHeight: 100, justifyContent: 'center',
  },
  badgeDone: { backgroundColor: 'rgba(33,115,70,0.12)', borderWidth: 1.5, borderColor: '#27AE60' },
  badgeLocked: { backgroundColor: 'rgba(0,0,0,0.03)', borderWidth: 1, borderColor: '#E5E7EB' },
  badgeIcon: { fontSize: 28, marginBottom: 4 },
  badgeLockIcon: { position: 'absolute', top: 6, right: 6 },
  badgeName: { fontSize: 10, fontWeight: '700', color: '#1a3a5c', textAlign: 'center', marginBottom: 3 },
  badgeNameLocked: { color: '#9CA3AF' },
  badgeDesc: { fontSize: 9, color: '#217346', textAlign: 'center', lineHeight: 13 },
  badgeDescLocked: { color: '#C4C4C4' },

  // ── CERT MODAL ───────────────────────────────────────────
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  modalCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 20,
  },
  modalHeader: { padding: 24, alignItems: 'center', gap: 6 },
  modalHeaderTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  modalHeaderSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', maxWidth: '90%' },
  modalBody: { padding: 20 },
  premiumWarning: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFFBEB', borderRadius: 10,
    padding: 10, marginBottom: 14,
    borderWidth: 1, borderColor: '#F59E0B',
  },
  premiumWarningText: { fontSize: 13, fontWeight: '600', color: '#92400E' },
  modalLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8 },
  modalInput: {
    borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#111', marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  modalStats: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: '#F3F4F6', borderRadius: 12, padding: 14, marginBottom: 16,
  },
  modalStat: { alignItems: 'center' },
  modalStatVal: { fontSize: 18, fontWeight: '800', color: '#1a3a5c' },
  modalStatLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  modalBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#F59E0B', borderRadius: 12,
    paddingVertical: 15, marginBottom: 10,
  },
  modalBtnText: { fontSize: 15, fontWeight: '800', color: '#1A1A2E' },
  modalCancel: { alignItems: 'center', paddingVertical: 8 },
  modalCancelText: { fontSize: 14, color: '#9CA3AF' },
});

export default CertificateScreen;
