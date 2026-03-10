import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions
} from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';

const SCREEN_W = Dimensions.get('window').width;

interface OpcaoGrafico { id: string; icon: string; label: string; }
interface Props {
  conteudo: {
    instrucao: string;
    dica: string;
    dados: string[];
    valores: number[];
    respostaCorreta: string;
    opcoes: OpcaoGrafico[];
    explicacao: string;
  };
  onConcluir: (acertou: boolean) => void;
}

const COLORS = ['#2ECC71','#3498DB','#E74C3C','#F39C12','#9B59B6','#1ABC9C'];

const chartCfg = {
  backgroundGradientFrom: '#FFF',
  backgroundGradientTo:   '#FFF',
  color: (o = 1) => `rgba(46,204,113,${o})`,
  labelColor: () => '#333',
  style: { borderRadius: 8 },
};

export default function LicaoGrafico({ conteudo, onConcluir }: Props) {
  const [selecionado, setSelecionado] = useState('');
  const [inserido, setInserido]       = useState(false);
  const [verificado, setVerificado]   = useState(false);
  const [acertou, setAcertou]         = useState(false);
  const [showDica, setShowDica]       = useState(false);

  const W = SCREEN_W - 64;

  const data = {
    labels: conteudo.dados,
    datasets: [{ data: conteudo.valores }],
  };

  const pieData = conteudo.dados.map((label, i) => ({
    name: label,
    population: conteudo.valores[i],
    color: COLORS[i % COLORS.length],
    legendFontColor: '#333',
    legendFontSize: 11,
  }));

  function renderGrafico() {
    switch (selecionado) {
      case 'colunas':
        return <BarChart data={data} width={W} height={180} chartConfig={chartCfg} style={s.chart} yAxisLabel="" yAxisSuffix="" showValuesOnTopOfBars />;
      case 'linha':
        return <LineChart data={data} width={W} height={180} chartConfig={chartCfg} style={s.chart} bezier />;
      case 'pizza':
        return <PieChart data={pieData} width={W} height={180} chartConfig={chartCfg} accessor="population" backgroundColor="transparent" paddingLeft="16" style={s.chart} />;
      case 'barra':
        return <BarChart data={data} width={W} height={180} chartConfig={{ ...chartCfg, color: (o = 1) => `rgba(52,152,219,${o})` }} style={s.chart} horizontal yAxisLabel="" yAxisSuffix="" />;
      default:
        return null;
    }
  }

  function verificar() {
    if (!inserido) return;
    const correto = selecionado === conteudo.respostaCorreta;
    setAcertou(correto);
    setVerificado(true);
    onConcluir(correto);
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
      {showDica && <View style={s.dicaBox}><Text style={s.dicaText}>{conteudo.dica}</Text></View>}

      <View style={s.excelWrap}>
        <View style={s.excelHeader}>
          <Text style={[s.excelHeaderCell, { flex: 1.5 }]}>Período</Text>
          <Text style={[s.excelHeaderCell, { flex: 1 }]}>Valor</Text>
        </View>
        {conteudo.dados.map((label, i) => (
          <View key={i} style={s.excelRow}>
            <Text style={[s.excelCell, { flex: 1.5 }]}>{label}</Text>
            <Text style={[s.excelCell, { flex: 1, textAlign: 'right', color: '#1A3A5C' }]}>
              {conteudo.valores[i].toLocaleString('pt-BR')}
            </Text>
          </View>
        ))}
      </View>

      <View style={s.tiposPanel}>
        <Text style={s.tiposTitle}>📊 Tipo de Gráfico</Text>
        <View style={s.tiposGrid}>
          {conteudo.opcoes.map(op => (
            <TouchableOpacity
              key={op.id}
              style={[s.tipoBtn, selecionado === op.id && s.tipoBtnActive]}
              onPress={() => { setSelecionado(op.id); setInserido(false); }}
            >
              <Text style={s.tipoIcon}>{op.icon}</Text>
              <Text style={[s.tipoLabel, selecionado === op.id && s.tipoLabelActive]}>{op.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[s.insertBtn, !selecionado && s.disabled]}
          onPress={() => selecionado && setInserido(true)}
          disabled={!selecionado}
        >
          <Text style={s.insertBtnText}>📊 Inserir Gráfico</Text>
        </TouchableOpacity>
      </View>

      {inserido ? (
        <View style={s.chartWrap}>
          <Text style={s.chartTitle}>Prévia do Gráfico</Text>
          {renderGrafico()}
        </View>
      ) : (
        <View style={s.chartPlaceholder}>
          <Text style={s.chartPlaceholderText}>← Selecione um tipo e clique em Inserir</Text>
        </View>
      )}

      {verificado && (
        <View style={[s.feedback, acertou ? s.feedbackOk : s.feedbackErr]}>
          <Text style={s.feedbackIcon}>{acertou ? '🎉' : '❌'}</Text>
          <Text style={s.feedbackText}>{conteudo.explicacao}</Text>
        </View>
      )}

      {!verificado ? (
        <TouchableOpacity style={[s.checkBtn, !inserido && s.disabled]} onPress={verificar} disabled={!inserido}>
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
  container:            { flex: 1, backgroundColor: '#16213E' },
  instrucaoBox:         { flexDirection: 'row', gap: 10, margin: 16, backgroundColor: 'rgba(46,204,113,0.08)', borderLeftWidth: 4, borderLeftColor: '#2ECC71', borderRadius: 10, padding: 14 },
  instrucaoIcon:        { fontSize: 18 },
  instrucaoText:        { flex: 1, color: '#F8FFF9', fontSize: 14, lineHeight: 21 },
  dicaBtn:              { marginHorizontal: 16, marginBottom: 8, alignSelf: 'flex-start' },
  dicaBtnText:          { color: '#F39C12', fontSize: 13, fontWeight: '600' },
  dicaBox:              { marginHorizontal: 16, marginBottom: 12, backgroundColor: 'rgba(243,156,18,0.1)', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: 'rgba(243,156,18,0.3)' },
  dicaText:             { color: '#F9D89A', fontSize: 13 },
  excelWrap:            { marginHorizontal: 16, marginBottom: 16, borderRadius: 10, overflow: 'hidden', borderWidth: 1.5, borderColor: '#B0C4B0' },
  excelHeader:          { flexDirection: 'row', backgroundColor: '#E8F5E9', borderBottomWidth: 1, borderBottomColor: '#C0C0C0' },
  excelHeaderCell:      { padding: 8, fontSize: 12, fontWeight: '700', color: '#1A5C36' },
  excelRow:             { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  excelCell:            { padding: 8, fontSize: 12, color: '#333' },
  tiposPanel:           { margin: 16, backgroundColor: '#1A1A2E', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  tiposTitle:           { color: '#F8FFF9', fontWeight: '700', fontSize: 14, marginBottom: 12 },
  tiposGrid:            { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tipoBtn:              { flexBasis: '46%', padding: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.04)' },
  tipoBtnActive:        { borderColor: '#3498DB', backgroundColor: 'rgba(52,152,219,0.15)' },
  tipoIcon:             { fontSize: 24, marginBottom: 4 },
  tipoLabel:            { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  tipoLabelActive:      { color: '#3498DB', fontWeight: '700' },
  insertBtn:            { marginTop: 14, backgroundColor: '#3498DB', borderRadius: 10, padding: 12, alignItems: 'center' },
  disabled:             { opacity: 0.4 },
  insertBtnText:        { color: '#fff', fontWeight: '700', fontSize: 14 },
  chartWrap:            { marginHorizontal: 16, marginBottom: 16, backgroundColor: '#FFF', borderRadius: 10, padding: 16, borderWidth: 1.5, borderColor: '#B0C4B0' },
  chartTitle:           { color: '#333', fontWeight: '700', fontSize: 13, marginBottom: 10 },
  chart:                { borderRadius: 8 },
  chartPlaceholder:     { marginHorizontal: 16, marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 32, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed', alignItems: 'center' },
  chartPlaceholderText: { color: 'rgba(255,255,255,0.3)', fontSize: 13 },
  feedback:             { margin: 16, borderRadius: 12, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  feedbackOk:           { backgroundColor: 'rgba(46,204,113,0.12)', borderWidth: 1, borderColor: 'rgba(46,204,113,0.3)' },
  feedbackErr:          { backgroundColor: 'rgba(231,76,60,0.1)', borderWidth: 1, borderColor: 'rgba(231,76,60,0.25)' },
  feedbackIcon:         { fontSize: 22 },
  feedbackText:         { flex: 1, color: '#F8FFF9', fontSize: 13, lineHeight: 20 },
  checkBtn:             { marginHorizontal: 16, marginBottom: 24, backgroundColor: '#2ECC71', borderRadius: 12, padding: 14, alignItems: 'center' },
  checkBtnText:         { color: '#fff', fontWeight: '700', fontSize: 15 },
  nextBtn:              { marginHorizontal: 16, marginBottom: 24, backgroundColor: '#F39C12', borderRadius: 12, padding: 14, alignItems: 'center' },
  nextBtnText:          { color: '#fff', fontWeight: '700', fontSize: 15 },
});
