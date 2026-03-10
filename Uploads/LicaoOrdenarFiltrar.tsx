import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface Produto { nome: string; depto: string; vendas: number; }
interface Props {
  conteudo: {
    instrucao: string;
    dica: string;
    produtos: Produto[];
    filtros: string[];
    filtroCorreto: string;
    tarefas: string[];
    explicacao: string;
  };
  onConcluir: (acertou: boolean) => void;
}

export default function LicaoOrdenarFiltrar({ conteudo, onConcluir }: Props) {
  const [dados, setDados]             = useState<Produto[]>([...conteudo.produtos]);
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');
  const [ordenado, setOrdenado]       = useState(false);
  const [filtrado, setFiltrado]       = useState(false);
  const [sortDir, setSortDir]         = useState<'none' | 'desc'>('none');
  const [verificado, setVerificado]   = useState(false);
  const [acertou, setAcertou]         = useState(false);
  const [showDica, setShowDica]       = useState(false);

  const dadosFiltrados = filtroAtivo === 'Todos'
    ? dados
    : dados.filter(d => d.depto === filtroAtivo);

  function doSort() {
    setDados([...conteudo.produtos].sort((a, b) => b.vendas - a.vendas));
    setOrdenado(true);
    setSortDir('desc');
  }

  function doFilter(f: string) {
    setFiltroAtivo(f);
    if (f !== 'Todos') setFiltrado(true);
  }

  function verificar() {
    const ok = conteudo.tarefas.every(t =>
      t === 'ordenado' ? ordenado : t === 'filtrado' ? filtrado : false
    );
    setAcertou(ok);
    setVerificado(true);
    onConcluir(ok);
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

      <View style={s.filterBar}>
        <Text style={s.filterLabel}>Filtrar:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, flexDirection: 'row' }}>
          {conteudo.filtros.map(f => (
            <TouchableOpacity
              key={f}
              style={[s.filterBtn, filtroAtivo === f && s.filterBtnActive]}
              onPress={() => doFilter(f)}
            >
              <Text style={[s.filterBtnText, filtroAtivo === f && s.filterBtnTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={s.excelWrap}>
        <View style={s.excelHeader}>
          <Text style={[s.excelHeaderCell, { flex: 2 }]}>Produto</Text>
          <Text style={[s.excelHeaderCell, { flex: 1 }]}>Depto</Text>
          <TouchableOpacity style={[s.excelHeaderCell, { flex: 1.2 }]} onPress={doSort}>
            <Text style={s.sortHeaderText}>Vendas {sortDir === 'desc' ? '↓' : '↕'}</Text>
          </TouchableOpacity>
        </View>
        {dadosFiltrados.length === 0 ? (
          <View style={s.emptyRow}><Text style={s.emptyText}>Nenhum resultado</Text></View>
        ) : dadosFiltrados.map((item, i) => (
          <View key={i} style={[s.excelRow, { backgroundColor: i % 2 === 0 ? '#FFF' : '#F9F9F9' }]}>
            <Text style={[s.excelCell, { flex: 2 }]} numberOfLines={1}>{item.nome}</Text>
            <Text style={[s.excelCell, { flex: 1 }]}>{item.depto}</Text>
            <Text style={[s.excelCell, { flex: 1.2, textAlign: 'right', color: '#1A3A5C', fontWeight: '500' }]}>
              {item.vendas.toLocaleString('pt-BR')}
            </Text>
          </View>
        ))}
      </View>

      <View style={s.checklistWrap}>
        <Text style={s.checklistTitle}>PROGRESSO:</Text>
        <View style={s.checkItem}>
          <Text style={s.checkIcon}>{ordenado ? '✅' : '⬜'}</Text>
          <Text style={[s.checkLabel, ordenado && s.checkLabelDone]}>Ordenar por Vendas (maior → menor)</Text>
        </View>
        <View style={s.checkItem}>
          <Text style={s.checkIcon}>{filtrado ? '✅' : '⬜'}</Text>
          <Text style={[s.checkLabel, filtrado && s.checkLabelDone]}>Filtrar por "{conteudo.filtroCorreto}"</Text>
        </View>
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
  container:          { flex: 1, backgroundColor: '#16213E' },
  instrucaoBox:       { flexDirection: 'row', gap: 10, margin: 16, backgroundColor: 'rgba(46,204,113,0.08)', borderLeftWidth: 4, borderLeftColor: '#2ECC71', borderRadius: 10, padding: 14 },
  instrucaoIcon:      { fontSize: 18 },
  instrucaoText:      { flex: 1, color: '#F8FFF9', fontSize: 14, lineHeight: 21 },
  dicaBtn:            { marginHorizontal: 16, marginBottom: 8, alignSelf: 'flex-start' },
  dicaBtnText:        { color: '#F39C12', fontSize: 13, fontWeight: '600' },
  dicaBox:            { marginHorizontal: 16, marginBottom: 12, backgroundColor: 'rgba(243,156,18,0.1)', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: 'rgba(243,156,18,0.3)' },
  dicaText:           { color: '#F9D89A', fontSize: 13 },
  filterBar:          { marginHorizontal: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  filterLabel:        { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600' },
  filterBtn:          { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  filterBtnActive:    { backgroundColor: 'rgba(46,204,113,0.2)', borderColor: '#2ECC71' },
  filterBtnText:      { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  filterBtnTextActive:{ color: '#2ECC71', fontWeight: '700' },
  excelWrap:          { marginHorizontal: 16, marginBottom: 16, borderRadius: 10, overflow: 'hidden', borderWidth: 1.5, borderColor: '#B0C4B0' },
  excelHeader:        { flexDirection: 'row', backgroundColor: '#E8F5E9', borderBottomWidth: 1, borderBottomColor: '#C0C0C0' },
  excelHeaderCell:    { padding: 8, fontSize: 11, fontWeight: '700', color: '#1A5C36' },
  sortHeaderText:     { fontSize: 11, fontWeight: '700', color: '#1A5C36' },
  excelRow:           { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  excelCell:          { padding: 8, fontSize: 11, color: '#333' },
  emptyRow:           { padding: 16, alignItems: 'center', backgroundColor: '#FFF' },
  emptyText:          { color: '#AAA', fontSize: 13 },
  checklistWrap:      { marginHorizontal: 16, marginBottom: 16, backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  checklistTitle:     { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700', marginBottom: 10 },
  checkItem:          { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  checkIcon:          { fontSize: 16 },
  checkLabel:         { flex: 1, color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 18 },
  checkLabelDone:     { color: '#2ECC71', fontWeight: '600' },
  feedback:           { margin: 16, borderRadius: 12, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  feedbackOk:         { backgroundColor: 'rgba(46,204,113,0.12)', borderWidth: 1, borderColor: 'rgba(46,204,113,0.3)' },
  feedbackErr:        { backgroundColor: 'rgba(231,76,60,0.1)', borderWidth: 1, borderColor: 'rgba(231,76,60,0.25)' },
  feedbackIcon:       { fontSize: 22 },
  feedbackText:       { flex: 1, color: '#F8FFF9', fontSize: 13, lineHeight: 20 },
  checkBtn:           { marginHorizontal: 16, marginBottom: 24, backgroundColor: '#2ECC71', borderRadius: 12, padding: 14, alignItems: 'center' },
  checkBtnText:       { color: '#fff', fontWeight: '700', fontSize: 15 },
  nextBtn:            { marginHorizontal: 16, marginBottom: 24, backgroundColor: '#F39C12', borderRadius: 12, padding: 14, alignItems: 'center' },
  nextBtnText:        { color: '#fff', fontWeight: '700', fontSize: 15 },
});
