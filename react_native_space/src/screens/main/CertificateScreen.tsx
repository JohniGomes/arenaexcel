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
  const dataFmt = p.data ? new Date(p.data).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR');
  const barcodeText = encodeURIComponent(`${p.userId}-${p.courseId}`);
  const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${barcodeText}&scale=2&height=10&backgroundcolor=ffffff`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=700">
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Cinzel:wght@400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
@page { size: A4 portrait; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f3f4f0; padding: 24px; font-family: 'EB Garamond', serif; }
</style>
</head>
<body>
<div style="position:relative;width:100%;max-width:700px;background:#FFFFFF;border-radius:3px;padding:60px 52px 90px;border:1px solid rgba(33,115,70,0.15);box-shadow:0 1px 3px rgba(0,0,0,0.04),0 12px 40px rgba(33,115,70,0.06);overflow:hidden">

  <!-- Watermark -->
  <div style="position:absolute;inset:0;background-image:radial-gradient(ellipse at 25% 15%,rgba(33,115,70,0.02) 0%,transparent 50%),radial-gradient(ellipse at 75% 85%,rgba(245,158,11,0.015) 0%,transparent 50%);pointer-events:none"></div>

  <!-- Inner frames -->
  <div style="position:absolute;inset:12px;border:1px solid rgba(33,115,70,0.12);pointer-events:none"></div>
  <div style="position:absolute;inset:15px;border:0.5px solid rgba(245,158,11,0.1);pointer-events:none"></div>

  <!-- Top accent bar -->
  <div style="position:absolute;top:0;left:60px;right:60px;height:3px;background:linear-gradient(90deg,transparent,#217346,#F59E0B,#217346,transparent);opacity:0.6"></div>

  <!-- Corner top-left -->
  <svg width="140" height="140" viewBox="0 0 140 140" fill="none" style="position:absolute;top:0;left:0">
    <defs>
      <linearGradient id="cg-tl" x1="0" y1="0" x2="140" y2="140" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#217346"/><stop offset="100%" stop-color="#0A1628"/>
      </linearGradient>
    </defs>
    <path d="M0 0 L55 0 Q40 12 30 28 Q14 52 12 80 L0 80 Z" fill="url(#cg-tl)" opacity="0.08"/>
    <path d="M0 0 Q0 65 65 65" stroke="#217346" stroke-width="2" fill="none"/>
    <path d="M0 0 Q0 95 95 95" stroke="#F59E0B" stroke-width="0.5" fill="none" opacity="0.35"/>
    <path d="M8 0 Q8 42 50 42" stroke="#217346" stroke-width="0.6" fill="none" opacity="0.3"/>
    <path d="M50 50 Q55 40 48 32 Q58 38 50 50Z" fill="#217346" opacity="0.15"/>
  </svg>

  <!-- Corner bottom-right -->
  <svg width="140" height="140" viewBox="0 0 140 140" fill="none" style="position:absolute;bottom:0;right:0;transform:rotate(180deg)">
    <defs>
      <linearGradient id="cg-br" x1="0" y1="0" x2="140" y2="140" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#217346"/><stop offset="100%" stop-color="#0A1628"/>
      </linearGradient>
    </defs>
    <path d="M0 0 L55 0 Q40 12 30 28 Q14 52 12 80 L0 80 Z" fill="url(#cg-br)" opacity="0.08"/>
    <path d="M0 0 Q0 65 65 65" stroke="#217346" stroke-width="2" fill="none"/>
    <path d="M0 0 Q0 95 95 95" stroke="#F59E0B" stroke-width="0.5" fill="none" opacity="0.35"/>
    <path d="M8 0 Q8 42 50 42" stroke="#217346" stroke-width="0.6" fill="none" opacity="0.3"/>
    <path d="M50 50 Q55 40 48 32 Q58 38 50 50Z" fill="#217346" opacity="0.15"/>
  </svg>

  <!-- Medal Seal -->
  <div style="position:absolute;top:18px;right:22px">
    <div style="width:74px;height:74px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#217346,#0A1628);border:2px solid #F59E0B;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(33,115,70,0.25),0 0 0 4px rgba(245,158,11,0.08)">
      <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
        <polygon points="18,3 21.8,13 33,13 24,19.6 27.2,30 18,24 8.8,30 12,19.6 3,13 14.2,13" fill="#F59E0B"/>
      </svg>
    </div>
    <svg width="74" height="28" viewBox="0 0 74 28" style="position:absolute;bottom:-20px;left:0">
      <path d="M22 0 L12 14 L22 26 L30 14 Z" fill="#217346" opacity="0.7"/>
      <path d="M52 0 L62 14 L52 26 L44 14 Z" fill="#217346" opacity="0.7"/>
      <path d="M22 0 L12 14 L22 26 L30 14 Z" stroke="#F59E0B" stroke-width="0.4" fill="none" opacity="0.5"/>
      <path d="M52 0 L62 14 L52 26 L44 14 Z" stroke="#F59E0B" stroke-width="0.4" fill="none" opacity="0.5"/>
    </svg>
  </div>

  <!-- Excel Icon -->
  <div style="position:absolute;bottom:22px;left:22px;width:44px;height:44px;background:#217346;border-radius:8px;border:1px solid rgba(245,158,11,0.4);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 14px rgba(33,115,70,0.3)">
    <span style="color:#fff;font-family:'Cinzel',serif;font-weight:700;font-size:22px;line-height:1">X</span>
  </div>

  <!-- Barcode + CNPJ rente à borda inferior -->
  <div style="position:absolute;bottom:16px;left:50%;transform:translateX(-50%);text-align:center;z-index:10">
    <img src="${barcodeUrl}" alt="Código de barras" style="height:28px;width:auto;display:block;margin:0 auto"/>
    <p style="font-family:'EB Garamond',serif;font-size:9px;color:#ccc;margin-top:2px;letter-spacing:0.1em">CNPJ: 65.002.492/0001-08</p>
  </div>

  <!-- Content -->
  <div style="position:relative;z-index:2;text-align:center">

    <!-- Title -->
    <h1 style="font-family:'Cinzel',serif;font-weight:700;font-size:40px;letter-spacing:0.22em;margin:0;line-height:1.1;background:linear-gradient(90deg,#217346,#2a9558,#217346,#1a5c38,#217346);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">CERTIFICADO</h1>
    <p style="font-family:'Cinzel',serif;font-weight:400;font-size:12px;letter-spacing:0.5em;color:#0A1628;margin:8px 0 0;text-transform:uppercase">de Qualificação</p>

    <!-- Divider 300 -->
    <div style="margin:28px 0 26px">
      <svg width="300" height="14" viewBox="0 0 300 14" fill="none" style="display:block;margin:0 auto">
        <defs>
          <linearGradient id="gl1" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="transparent"/><stop offset="15%" stop-color="#F59E0B" stop-opacity="0.5"/>
            <stop offset="50%" stop-color="#F59E0B"/><stop offset="85%" stop-color="#F59E0B" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="transparent"/>
          </linearGradient>
        </defs>
        <line x1="0" y1="7" x2="300" y2="7" stroke="url(#gl1)" stroke-width="0.5"/>
        <path d="M144 7 L150 2 L156 7 L150 12 Z" fill="none" stroke="#F59E0B" stroke-width="0.6"/>
        <circle cx="150" cy="7" r="1.5" fill="#F59E0B"/>
      </svg>
    </div>

    <!-- Presented to -->
    <p style="font-family:'EB Garamond',serif;font-size:11px;letter-spacing:0.35em;color:#999;text-transform:uppercase;margin:0 0 18px">Este certificado é apresentado a</p>

    <!-- Recipient name -->
    <h2 style="font-family:'Cormorant Garamond',serif;font-weight:500;font-style:italic;font-size:34px;color:#000000;margin:0 0 4px;line-height:1.25">${p.nomeAluno}</h2>

    <!-- Divider 220 -->
    <div style="margin:24px 0">
      <svg width="220" height="14" viewBox="0 0 220 14" fill="none" style="display:block;margin:0 auto">
        <defs>
          <linearGradient id="gl2" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="transparent"/><stop offset="15%" stop-color="#F59E0B" stop-opacity="0.5"/>
            <stop offset="50%" stop-color="#F59E0B"/><stop offset="85%" stop-color="#F59E0B" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="transparent"/>
          </linearGradient>
        </defs>
        <line x1="0" y1="7" x2="220" y2="7" stroke="url(#gl2)" stroke-width="0.5"/>
        <path d="M104 7 L110 2 L116 7 L110 12 Z" fill="none" stroke="#F59E0B" stroke-width="0.6"/>
        <circle cx="110" cy="7" r="1.5" fill="#F59E0B"/>
      </svg>
    </div>

    <!-- Description -->
    <p style="font-family:'EB Garamond',serif;font-size:15.5px;color:#555;line-height:1.75;max-width:490px;margin:0 auto 30px;font-style:italic">
      Após a conclusão com sucesso de
      <span style="color:#217346;font-weight:600;font-style:normal">"${p.curso}"</span>
      com carga horária total de
      <span style="color:#0A1628;font-weight:600;font-family:Arial,sans-serif;font-style:normal">${p.horas}h</span> e
      <span style="color:#0A1628;font-weight:600;font-family:Arial,sans-serif;font-style:normal">${p.licoesConcluidas} lições</span>
      concluídas. Certifico a capacidade do(a) aluno(a) em aplicar as habilidades aprendidas em contextos profissionais e acadêmicos.
    </p>

    <!-- Divider 180 -->
    <div style="margin:20px 0 24px">
      <svg width="180" height="14" viewBox="0 0 180 14" fill="none" style="display:block;margin:0 auto">
        <defs>
          <linearGradient id="gl3" x1="0" y1="0" x2="180" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="transparent"/><stop offset="15%" stop-color="#F59E0B" stop-opacity="0.5"/>
            <stop offset="50%" stop-color="#F59E0B"/><stop offset="85%" stop-color="#F59E0B" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="transparent"/>
          </linearGradient>
        </defs>
        <line x1="0" y1="7" x2="180" y2="7" stroke="url(#gl3)" stroke-width="0.5"/>
        <path d="M84 7 L90 2 L96 7 L90 12 Z" fill="none" stroke="#F59E0B" stroke-width="0.6"/>
        <circle cx="90" cy="7" r="1.5" fill="#F59E0B"/>
      </svg>
    </div>

    <!-- Signature -->
    <p style="font-family:'Dancing Script',cursive;font-weight:700;font-size:36px;color:#1a1a2e;margin:0 0 2px;letter-spacing:0.5px">Johni Michael</p>
    <div style="width:180px;height:1px;background:linear-gradient(90deg,transparent,rgba(245,158,11,0.4),transparent);margin:2px auto 3px"></div>
    <p style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:0.35em;color:#999;text-transform:uppercase;margin:0">Professor e Fundador | Arena Excel</p>

    <!-- Info row -->
    <div style="margin-top:36px;display:flex;justify-content:center;gap:40px">
      <div style="text-align:center">
        <p style="font-family:'EB Garamond',serif;font-size:9px;letter-spacing:0.2em;color:#bbb;text-transform:uppercase;margin:0 0 4px">Data</p>
        <p style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#0A1628;margin:0">${dataFmt}</p>
      </div>
      <div style="text-align:center">
        <p style="font-family:'EB Garamond',serif;font-size:9px;letter-spacing:0.2em;color:#bbb;text-transform:uppercase;margin:0 0 4px">Carga horária</p>
        <p style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#0A1628;margin:0">${p.horas}h</p>
      </div>
      <div style="text-align:center">
        <p style="font-family:'EB Garamond',serif;font-size:9px;letter-spacing:0.2em;color:#bbb;text-transform:uppercase;margin:0 0 4px">Lições</p>
        <p style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#0A1628;margin:0">${p.licoesConcluidas}</p>
      </div>
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
        orientation: Print.Orientation.Portrait,
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
