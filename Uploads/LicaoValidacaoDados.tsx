import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Props {
  conteudo: {
    instrucao: string;
    dica: string;
    itensCertos: string[];
    projetos: string[];
    colunaLabel: string;
    explicacao: string;
  };
  onConcluir: (acertou: boolean) => void;
}

export default function LicaoValidacaoDados({ conteudo, onConcluir }: Props) {
  const [inputs, setInputs]             = useState<string[]>(['', '', '']);
  const [aplicado, setAplicado]         = useState(false);
  const [selecionados, setSelecionados] = useState<Record<number, string>>({});
  const [verificado, setVerificado]     = useState(false);
  const [acertou, setAcertou]           = useState(false);
  const [showDica, setShowDica]         = useState(false);

  const itensFiltrados = inputs.map(i => i.trim()).filter(i => i.length > 0);

  function verificar() {
    if (!aplicado) return;
    const esperados  = conteudo.itensCertos.map(i => i.toLowerCase().trim());
    const fornecidos = itensFiltrados.map(i => i.toLowerCase().trim());
    const ok = esperados.every(e => fornecidos.includes(e));
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

      <View style={s.configPanel}>
        <Text style={s.configTitle}>⚙️ Configurar Lista de Validação</Text>
        <Text style={s.configSub}>Adicione os itens que aparecerão na lista suspensa:</Text>
        {inputs.map((val, i) => (
          <View key={i} style={s.inputRow}>
            <Text style={s.inputNum}>{i + 1}.</Text>
            <TextInput
              style={s.input}
              placeholder={`Item ${i + 1}...`}
              placeholderTextColor="#999"
              value={val}
              onChangeText={text => {
                const next = [...inputs];
                next[i] = text;
                setInputs(next);
              }}
            />
          </View>
        ))}
        <TouchableOpacity
          style={[s.applyBtn, itensFiltrados.length < 2 && s.disabled]}
          onPress={() => itensFiltrados.length >= 2 && setAplicado(true)}
          disabled={itensFiltrados.length < 2}
        >
          <Text style={s.applyBtnText}>✅ Aplicar Validação</Text>
        </TouchableOpacity>
      </View>

      <View style={s.excelWrap}>
        <View style={s.excelHeader}>
          <Text style={[s.excelHeaderCell, { flex: 2 }]}>Projeto</Text>
          <Text style={[s.excelHeaderCell, { flex: 1.5 }]}>{conteudo.colunaLabel}</Text>
        </View>
        {conteudo.projetos.map((proj, i) => (
          <View key={i} style={[s.excelRow, { backgroundColor: i % 2 === 0 ? '#FFF' : '#F9F9F9' }]}>
            <Text style={[s.excelCell, { flex: 2 }]} numberOfLines={1}>{proj}</Text>
            <View style={[s.dropdownCell, { flex: 1.5 }]}>
              {aplicado ? (
                <Picker
                  selectedValue={selecionados[i] || ''}
                  onValueChange={v => setSelecionados(p => ({ ...p, [i]: v }))}
                  style={s.picker}
                  dropdownIconColor="#1A7A3C"
                >
                  <Picker.Item label="— selecione —" value="" />
                  {itensFiltrados.map((item, j) => (
                    <Picker.Item key={j} label={item} value={item} />
                  ))}
                </Picker>
              ) : (
                <Text style={s.dropdownPlaceholder}>— selecione —</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {aplicado && (
        <View style={s.successBadge}>
          <Text style={s.successText}>✅ Lista criada com {itensFiltrados.length} itens!</Text>
        </View>
      )}

      {verificado && (
        <View style={[s.feedback, acertou ? s.feedbackOk : s.feedbackErr]}>
          <Text style={s.feedbackIcon}>{acertou ? '🎉' : '❌'}</Text>
          <View style={{ flex: 1 }}>
            {!acertou && (
              <Text style={[s.feedbackText, { marginBottom: 4 }]}>
                Itens corretos: {conteudo.itensCertos.join(', ')}
              </Text>
            )}
            <Text style={s.feedbackText}>{conteudo.explicacao}</Text>
          </View>
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
  container:           { flex: 1, backgroundColor: '#16213E' },
  instrucaoBox:        { flexDirection: 'row', gap: 10, margin: 16, backgroundColor: 'rgba(46,204,113,0.08)', borderLeftWidth: 4, borderLeftColor: '#2ECC71', borderRadius: 10, padding: 14 },
  instrucaoIcon:       { fontSize: 18 },
  instrucaoText:       { flex: 1, color: '#F8FFF9', fontSize: 14, lineHeight: 21 },
  dicaBtn:             { marginHorizontal: 16, marginBottom: 8, alignSelf: 'flex-start' },
  dicaBtnText:         { color: '#F39C12', fontSize: 13, fontWeight: '600' },
  dicaBox:             { marginHorizontal: 16, marginBottom: 12, backgroundColor: 'rgba(243,156,18,0.1)', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: 'rgba(243,156,18,0.3)' },
  dicaText:            { color: '#F9D89A', fontSize: 13 },
  configPanel:         { margin: 16, backgroundColor: '#1A1A2E', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  configTitle:         { color: '#F8FFF9', fontWeight: '700', fontSize: 14, marginBottom: 4 },
  configSub:           { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 14 },
  inputRow:            { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  inputNum:            { color: 'rgba(255,255,255,0.4)', fontSize: 13, width: 20 },
  input:               { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', color: '#F8FFF9', fontSize: 13, padding: 10 },
  applyBtn:            { marginTop: 8, backgroundColor: '#E74C3C', borderRadius: 10, padding: 12, alignItems: 'center' },
  disabled:            { opacity: 0.4 },
  applyBtnText:        { color: '#fff', fontWeight: '700', fontSize: 14 },
  excelWrap:           { marginHorizontal: 16, marginBottom: 16, borderRadius: 10, overflow: 'hidden', borderWidth: 1.5, borderColor: '#B0C4B0' },
  excelHeader:         { flexDirection: 'row', backgroundColor: '#E8F5E9', borderBottomWidth: 1, borderBottomColor: '#C0C0C0' },
  excelHeaderCell:     { padding: 8, fontSize: 12, fontWeight: '700', color: '#1A5C36' },
  excelRow:            { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', minHeight: 44 },
  excelCell:           { padding: 8, fontSize: 12, color: '#333', alignSelf: 'center' },
  dropdownCell:        { justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#E0E0E0' },
  picker:              { height: 44, color: '#1A3A5C', backgroundColor: '#E8F5E9' },
  dropdownPlaceholder: { color: '#AAA', fontSize: 12, padding: 8 },
  successBadge:        { marginHorizontal: 16, marginBottom: 12, backgroundColor: 'rgba(46,204,113,0.1)', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: 'rgba(46,204,113,0.3)' },
  successText:         { color: '#2ECC71', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  feedback:            { margin: 16, borderRadius: 12, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  feedbackOk:          { backgroundColor: 'rgba(46,204,113,0.12)', borderWidth: 1, borderColor: 'rgba(46,204,113,0.3)' },
  feedbackErr:         { backgroundColor: 'rgba(231,76,60,0.1)', borderWidth: 1, borderColor: 'rgba(231,76,60,0.25)' },
  feedbackIcon:        { fontSize: 22 },
  feedbackText:        { color: '#F8FFF9', fontSize: 13, lineHeight: 20 },
  checkBtn:            { marginHorizontal: 16, marginBottom: 24, backgroundColor: '#2ECC71', borderRadius: 12, padding: 14, alignItems: 'center' },
  checkBtnText:        { color: '#fff', fontWeight: '700', fontSize: 15 },
  nextBtn:             { marginHorizontal: 16, marginBottom: 24, backgroundColor: '#F39C12', borderRadius: 12, padding: 14, alignItems: 'center' },
  nextBtnText:         { color: '#fff', fontWeight: '700', fontSize: 15 },
});
