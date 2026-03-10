import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput
} from 'react-native';

interface DadoFC { nome: string; valor: number; }
interface Props {
  conteudo: {
    instrucao: string;
    dica: string;
    dados: DadoFC[];
    resposta: { condicao: string; valor: number };
    explicacao: string;
  };
  onConcluir: (acertou: boolean) => void;
}

const CONDICOES = [
  { id: 'menor', label: 'Menor que' },
  { id: 'maior', label: 'Maior que' },
  { id: 'igual', label: 'Igual a'   },
];

const CORES = [
  { id: 'vermelho', label: '🔴 Vermelho', bg: '#FFCDD2', text: '#C62828' },
  { id: 'amarelo',  label: '🟡 Amarelo',  bg: '#FFF9C4', text: '#F57F17' },
  { id: 'verde',    label: '🟢 Verde',    bg: '#C8E6C9', text: '#1B5E20' },
  { id: 'azul',     label: '🔵 Azul',     bg: '#BBDEFB', text: '#0D47A1' },
];

export default function LicaoFCInterativo({ conteudo, onConcluir }: Props) {
  const [condicao, setCondicao]     = useState('');
  const [valor, setValor]           = useState('');
  const [cor, setCor]               = useState('');
  const [aplicado, setAplicado]     = useState(false);
  const [verificado, setVerificado] = useState(false);
  const [acertou, setAcertou]       = useState(false);
  const [showDica, setShowDica]     = useState(false);

  const corSelecionada = CORES.find(c => c.id === cor);

  function aplicarFC() {
    if (!condicao || !valor || !cor) return;
    setAplicado(true);
  }

  function verificar() {
    if (!aplicado) return;
    const valorNum = parseFloat(valor.replace(',', '.'));
    const correto =
      condicao === conteudo.resposta.condicao &&
      Math.abs(valorNum - conteudo.resposta.valor) < 0.01;
    setAcertou(correto);
    setVerificado(true);
    onConcluir(correto);
  }

  function getCelulaBg(itemValor: number): string {
    if (!aplicado || !cor || !valor) return '#FFFFFF';
    const valorNum = parseFloat(valor.replace(',', '.'));
    let hit = false;
    if (condicao === 'menor' && itemValor < valorNum)   hit = true;
    if (condicao === 'maior' && itemValor > valorNum)   hit = true;
    if (condicao === 'igual' && itemValor === valorNum) hit = true;
    return hit ? (corSelecionada?.bg ?? '#FFFFFF') : '#FFFFFF';
  }

  function getCelulaTextColor(itemValor: number): string {
    if (!aplicado || !cor || !valor) return '#1A1A1A';
    const valorNum = parseFloat(valor.replace(',', '.'));
    let hit = false;
    if (condicao === 'menor' && itemValor < valorNum)   hit = true;
    if (condicao === 'maior' && itemValor > valorNum)   hit = true;
    if (condicao === 'igual' && itemValor === valorNum) hit = true;
    return hit ? (corSelecionada?.text ?? '#1A1A1A') : '#1A1A1A';
  }

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

      <View style={s.instrucaoBox}>
        <Text style={s.instrucaoIcon}>📋</Text>
        <Text style={s.instrucaoText}>{conteudo.instrucao}</Text>
      </View>

      <TouchableOpacity style={s.dicaBtn} onPress={() => setShowDica(!showDica)}>
        <Text style={s.dicaBtnText}>💡 {showDica ? 'Ocultar dica' : 'Ver dica'}</Text>
      </TouchableOpacity>
      {showDica && (
        <View style={s.dicaBox}><Text style={s.dicaText}>{conteudo.dica}</Text></View>
      )}

      <View style={s.configPanel}>
        <Text style={s.configTitle}>⚙️ Configurar Formatação Condicional</Text>

        <Text style={s.fieldLabel}>Condição</Text>
        <View style={s.optionsRow}>
          {CONDICOES.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[s.optionBtn, condicao === c.id && s.optionBtnActive]}
              onPress={() => setCondicao(c.id)}
            >
              <Text style={[s.optionText, condicao === c.id && s.optionTextActive]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.fieldLabel}>Valor</Text>
        <TextInput
          style={s.input}
          placeholder="Ex: 20000"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={valor}
          onChangeText={setValor}
        />

        <Text style={s.fieldLabel}>Cor de destaque</Text>
        <View style={s.optionsRow}>
          {CORES.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[s.optionBtn, cor === c.id && s.optionBtnActive]}
              onPress={() => setCor(c.id)}
            >
              <Text style={[s.optionText, cor === c.id && s.optionTextActive]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[s.applyBtn, (!condicao || !valor || !cor) && s.disabled]}
          onPress={aplicarFC}
          disabled={!condicao || !valor || !cor}
        >
          <Text style={s.applyBtnText}>▶ Aplicar Formatação</Text>
        </TouchableOpacity>
      </View>

      <View style={s.excelWrap}>
        <View style={s.excelHeader}>
          <Text style={[s.excelHeaderCell, { flex: 2 }]}>Nome</Text>
          <Text style={[s.excelHeaderCell, { flex: 1 }]}>Valor</Text>
        </View>
        {conteudo.dados.map((item, i) => (
          <View key={i} style={s.excelRow}>
            <Text style={[s.excelCell, { flex: 2 }]}>{item.nome}</Text>
            <View style={[s.excelValueCell, { flex: 1, backgroundColor: getCelulaBg(item.valor) }]}>
              <Text style={[s.excelValueText, { color: getCelulaTextColor(item.valor) }]}>
                {item.valor.toLocaleString('pt-BR')}
              </Text>
            </View>
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
        <TouchableOpacity
          style={[s.checkBtn, !aplicado && s.disabled]}
          onPress={verificar}
          disabled={!aplicado}
        >
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
  container:        { flex: 1, backgroundColor: '#16213E' },
  instrucaoBox:     { flexDirection: 'row', gap: 10, margin: 16, backgroundColor: 'rgba(46,204,113,0.08)', borderLeftWidth: 4, borderLeftColor: '#2ECC71', borderRadius: 10, padding: 14 },
  instrucaoIcon:    { fontSize: 18 },
  instrucaoText:    { flex: 1, color: '#F8FFF9', fontSize: 14, lineHeight: 21 },
  dicaBtn:          { marginHorizontal: 16, marginBottom: 8, alignSelf: 'flex-start' },
  dicaBtnText:      { color: '#F39C12', fontSize: 13, fontWeight: '600' },
  dicaBox:          { marginHorizontal: 16, marginBottom: 12, backgroundColor: 'rgba(243,156,18,0.1)', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: 'rgba(243,156,18,0.3)' },
  dicaText:         { color: '#F9D89A', fontSize: 13 },
  configPanel:      { margin: 16, backgroundColor: '#1A1A2E', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  configTitle:      { color: '#F8FFF9', fontWeight: '700', fontSize: 14, marginBottom: 14 },
  fieldLabel:       { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  optionsRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn:        { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.04)' },
  optionBtnActive:  { borderColor: '#2ECC71', backgroundColor: 'rgba(46,204,113,0.15)' },
  optionText:       { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  optionTextActive: { color: '#2ECC71', fontWeight: '700' },
  input:            { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', color: '#F8FFF9', fontSize: 14, padding: 10 },
  applyBtn:         { marginTop: 16, backgroundColor: '#9B59B6', borderRadius: 10, padding: 12, alignItems: 'center' },
  disabled:         { opacity: 0.4 },
  applyBtnText:     { color: '#fff', fontWeight: '700', fontSize: 14 },
  excelWrap:        { marginHorizontal: 16, marginBottom: 16, borderRadius: 10, overflow: 'hidden', borderWidth: 1.5, borderColor: '#B0C4B0' },
  excelHeader:      { flexDirection: 'row', backgroundColor: '#E8E8E8', borderBottomWidth: 1, borderBottomColor: '#C0C0C0' },
  excelHeaderCell:  { padding: 8, fontSize: 12, fontWeight: '700', color: '#333' },
  excelRow:         { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  excelCell:        { padding: 8, fontSize: 12, color: '#333', backgroundColor: '#FFF' },
  excelValueCell:   { padding: 8, justifyContent: 'center', alignItems: 'flex-end' },
  excelValueText:   { fontSize: 12, fontWeight: '600' },
  feedback:         { margin: 16, borderRadius: 12, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  feedbackOk:       { backgroundColor: 'rgba(46,204,113,0.12)', borderWidth: 1, borderColor: 'rgba(46,204,113,0.3)' },
  feedbackErr:      { backgroundColor: 'rgba(231,76,60,0.1)', borderWidth: 1, borderColor: 'rgba(231,76,60,0.25)' },
  feedbackIcon:     { fontSize: 22 },
  feedbackText:     { flex: 1, color: '#F8FFF9', fontSize: 13, lineHeight: 20 },
  checkBtn:         { marginHorizontal: 16, marginBottom: 24, backgroundColor: '#2ECC71', borderRadius: 12, padding: 14, alignItems: 'center' },
  checkBtnText:     { color: '#fff', fontWeight: '700', fontSize: 15 },
  nextBtn:          { marginHorizontal: 16, marginBottom: 24, backgroundColor: '#F39C12', borderRadius: 12, padding: 14, alignItems: 'center' },
  nextBtnText:      { color: '#fff', fontWeight: '700', fontSize: 15 },
});
