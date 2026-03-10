import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface Tarefa { id: string; label: string; acao: string; }
interface Props {
  conteudo: {
    instrucao: string;
    dica: string;
    tarefas: Tarefa[];
    explicacao: string;
  };
  onConcluir: (acertou: boolean) => void;
}

const DADOS = [
  { produto: 'Notebook',  categoria: 'Eletrônicos', valor: 4500 },
  { produto: 'Cadeira',   categoria: 'Móveis',      valor: 890  },
  { produto: 'Monitor',   categoria: 'Eletrônicos', valor: 2100 },
  { produto: 'Mesa',      categoria: 'Móveis',      valor: 1350 },
];

export default function LicaoFormatacaoCelula({ conteudo, onConcluir }: Props) {
  const [aplicadas, setAplicadas]   = useState<string[]>([]);
  const [verificado, setVerificado] = useState(false);
  const [acertou, setAcertou]       = useState(false);
  const [showDica, setShowDica]     = useState(false);

  const negrito     = aplicadas.includes('negrito');
  const fundoVerde  = aplicadas.includes('fundoverde');
  const textoB      = aplicadas.includes('textobranc');
  const moeda       = aplicadas.includes('moeda');
  const porcentagem = aplicadas.includes('porcentagem');

  function formatarValor(v: number) {
    if (moeda)       return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (porcentagem) return `${v}%`;
    return String(v);
  }

  function verificar() {
    const ok = conteudo.tarefas.every(t => aplicadas.includes(t.id));
    setAcertou(ok);
    setVerificado(true);
    onConcluir(ok);
  }

  const headerBg    = fundoVerde ? '#1A7A3C' : '#E8E8E8';
  const headerColor = textoB     ? '#FFFFFF' : '#333333';
  const headerFW    = negrito    ? '800'     : '600';

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

      <View style={s.instrucaoBox}>
        <Text style={s.instrucaoIcon}>📋</Text>
        <Text style={s.instrucaoText}>{conteudo.instrucao}</Text>
      </View>

      <TouchableOpacity style={s.dicaBtn} onPress={() => setShowDica(!showDica)}>
        <Text style={s.dicaBtnText}>💡 {showDica ? 'Ocultar dica' : 'Ver dica'}</Text>
      </TouchableOpacity>
      {showDica && <View style={s.dicaBox}><Text style={s.dicaText}>{conteudo.dica}</Text></View>}

      <View style={s.toolbar}>
        <Text style={s.toolbarLabel}>FORMATAR:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, flexDirection: 'row' }}>
          {conteudo.tarefas.map(t => (
            <TouchableOpacity
              key={t.id}
              style={[s.toolBtn, aplicadas.includes(t.id) && s.toolBtnActive]}
              onPress={() => !aplicadas.includes(t.id) && setAplicadas(p => [...p, t.id])}
            >
              <Text style={[s.toolBtnText, aplicadas.includes(t.id) && s.toolBtnTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={s.excelWrap}>
        <View style={[s.excelHeader, { backgroundColor: headerBg }]}>
          {['Produto', 'Categoria', 'Valor'].map((h, i) => (
            <Text
              key={i}
              style={[
                s.excelHeaderCell,
                { color: headerColor, fontWeight: headerFW as any },
                i === 2 && { textAlign: 'right' },
              ]}
            >
              {h}
            </Text>
          ))}
        </View>
        {DADOS.map((row, i) => (
          <View key={i} style={[s.excelRow, { backgroundColor: i % 2 === 0 ? '#FFF' : '#F9F9F9' }]}>
            <Text style={s.excelCell}>{row.produto}</Text>
            <Text style={s.excelCell}>{row.categoria}</Text>
            <Text style={[s.excelCell, { textAlign: 'right', color: '#1A3A5C', fontWeight: '500' }]}>
              {formatarValor(row.valor)}
            </Text>
          </View>
        ))}
      </View>

      <View style={s.checklistWrap}>
        <Text style={s.checklistTitle}>PROGRESSO:</Text>
        {conteudo.tarefas.map(t => (
          <View key={t.id} style={s.checkItem}>
            <Text style={s.checkIcon}>{aplicadas.includes(t.id) ? '✅' : '⬜'}</Text>
            <Text style={[s.checkLabel, aplicadas.includes(t.id) && s.checkLabelDone]}>{t.label}</Text>
          </View>
        ))}
      </View>

      {verificado && (
        <View style={[s.feedback, acertou ? s.feedbackOk : s.feedbackErr]}>
          <Text style={s.feedbackIcon}>{acertou ? '🎉' : '❌'}</Text>
          <Text style={s.feedbackText}>{conteudo.explicacao}</Text>
        </View>
      )}

      {!verificado ? (
        <TouchableOpacity style={s.checkBtn} onPress={verificar}>
          <Text style={s.checkBtnText}>✅ Verificar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={s.nextBtn} onPress={() => onConcluir(acertou)}>
          <Text style={s.nextBtnText}>Próxima →</Text>
        </TouchableOpacity>
      )}

    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#16213E' },
  instrucaoBox:      { flexDirection: 'row', gap: 10, margin: 16, backgroundColor: 'rgba(46,204,113,0.08)', borderLeftWidth: 4, borderLeftColor: '#2ECC71', borderRadius: 10, padding: 14 },
  instrucaoIcon:     { fontSize: 18 },
  instrucaoText:     { flex: 1, color: '#F8FFF9', fontSize: 14, lineHeight: 21 },
  dicaBtn:           { marginHorizontal: 16, marginBottom: 8, alignSelf: 'flex-start' },
  dicaBtnText:       { color: '#F39C12', fontSize: 13, fontWeight: '600' },
  dicaBox:           { marginHorizontal: 16, marginBottom: 12, backgroundColor: 'rgba(243,156,18,0.1)', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: 'rgba(243,156,18,0.3)' },
  dicaText:          { color: '#F9D89A', fontSize: 13 },
  toolbar:           { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#F0F0F0', borderRadius: 10, padding: 10 },
  toolbarLabel:      { fontSize: 11, fontWeight: '700', color: '#555', marginBottom: 8 },
  toolBtn:           { paddingHorizontal: 12, paddingVertical: 7, backgroundColor: '#FFF', borderRadius: 6, borderWidth: 1.5, borderColor: '#DDD' },
  toolBtnActive:     { backgroundColor: '#C8E6C9', borderColor: '#1A7A3C' },
  toolBtnText:       { fontSize: 12, color: '#333' },
  toolBtnTextActive: { color: '#1A3A5C', fontWeight: '700' },
  excelWrap:         { marginHorizontal: 16, marginBottom: 16, borderRadius: 10, overflow: 'hidden', borderWidth: 1.5, borderColor: '#B0C4B0' },
  excelHeader:       { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#C0C0C0' },
  excelHeaderCell:   { flex: 1, padding: 8, fontSize: 12 },
  excelRow:          { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  excelCell:         { flex: 1, padding: 8, fontSize: 12, color: '#333' },
  checklistWrap:     { marginHorizontal: 16, marginBottom: 16, backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  checklistTitle:    { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700', marginBottom: 10 },
  checkItem:         { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  checkIcon:         { fontSize: 16 },
  checkLabel:        { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  checkLabelDone:    { color: '#2ECC71', fontWeight: '600' },
  feedback:          { margin: 16, borderRadius: 12, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  feedbackOk:        { backgroundColor: 'rgba(46,204,113,0.12)', borderWidth: 1, borderColor: 'rgba(46,204,113,0.3)' },
  feedbackErr:       { backgroundColor: 'rgba(231,76,60,0.1)', borderWidth: 1, borderColor: 'rgba(231,76,60,0.25)' },
  feedbackIcon:      { fontSize: 22 },
  feedbackText:      { flex: 1, color: '#F8FFF9', fontSize: 13, lineHeight: 20 },
  checkBtn:          { marginHorizontal: 16, marginBottom: 24, backgroundColor: '#2ECC71', borderRadius: 12, padding: 14, alignItems: 'center' },
  checkBtnText:      { color: '#fff', fontWeight: '700', fontSize: 15 },
  nextBtn:           { marginHorizontal: 16, marginBottom: 24, backgroundColor: '#F39C12', borderRadius: 12, padding: 14, alignItems: 'center' },
  nextBtnText:       { color: '#fff', fontWeight: '700', fontSize: 15 },
});
