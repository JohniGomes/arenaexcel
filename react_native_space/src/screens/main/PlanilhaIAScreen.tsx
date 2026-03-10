import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Alert, ActivityIndicator, SafeAreaView,
  KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as XLSX from 'xlsx';
import Markdown from 'react-native-markdown-display';
import ApiService from '../../services/api.service';

type Mensagem = {
  role: 'user' | 'assistant';
  content: string;
};

const PlanilhaIAScreen = ({ onClose }: { onClose: () => void }) => {
  const [etapa, setEtapa] = useState<'upload' | 'chat'>('upload');
  const [carregando, setCarregando] = useState(false);
  const [dadosPlanilha, setDadosPlanilha] = useState<string>('');
  const [nomeArquivo, setNomeArquivo] = useState<string>('');
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [pergunta, setPergunta] = useState('');
  const [analisesRestantes, setAnalisesRestantes] = useState(999);
  const scrollRef = useRef<ScrollView>(null);

  // ── Upload Excel/CSV ──────────────────────────────────────
  const uploadArquivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['*/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      const file = result.assets[0];
      setNomeArquivo(file.name);
      setCarregando(true);

      console.log('📁 Arquivo selecionado:', file.name);

      let textoCompleto = '';

      if (file.name.endsWith('.csv')) {
        // CSV — leitura direta como texto usando fetch
        console.log('📄 Lendo CSV...');
        const response = await fetch(file.uri);
        textoCompleto = await response.text();
        console.log('✅ CSV lido com sucesso');
      } else {
        // Excel — leitura como base64 usando fetch
        console.log('📊 Lendo Excel...');
        const response = await fetch(file.uri);
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.readAsDataURL(blob);
        });
        console.log('✅ Excel convertido para base64');
        
        const workbook = XLSX.read(base64, { type: 'base64' });
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          textoCompleto += `\n=== Aba: ${sheetName} ===\n`;
          textoCompleto += XLSX.utils.sheet_to_csv(sheet);
        });
        console.log('✅ Excel convertido para texto');
      }

      console.log('📝 Texto final:', textoCompleto.substring(0, 100));
      setDadosPlanilha(textoCompleto);
      await iniciarAnalise(textoCompleto, file.name);
    } catch (error: any) {
      console.error('❌ Erro ao ler arquivo:', error);
      Alert.alert('Erro', `Não foi possível ler o arquivo:\n${error?.message || 'Erro desconhecido'}`);
    } finally {
      setCarregando(false);
    }
  };

  // ── Foto da planilha ──────────────────────────────────────
  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos acessar a câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.3, // Compressão maior para evitar erro 413
      allowsEditing: true,
    });

    if (result.canceled) return;
    setNomeArquivo('Foto da planilha');
    setCarregando(true);

    try {
      const base64 = result.assets[0].base64 ?? '';
      console.log('📸 Foto capturada, tamanho base64:', base64.length);
      
      // Envia imagem para o backend extrair o texto via IA
      const texto = await ApiService.extrairTextoDaImagem(base64);
      console.log('✅ Texto extraído da imagem:', texto.substring(0, 100));
      
      setDadosPlanilha(texto);
      await iniciarAnalise(texto, 'Foto da planilha');
    } catch (error: any) {
      console.error('❌ Erro ao processar imagem:', error);
      Alert.alert('Erro', `Não foi possível processar a imagem:\n${error?.message || 'Erro desconhecido'}`);
    } finally {
      setCarregando(false);
    }
  };

  // ── Colar dados manualmente ───────────────────────────────
  const [mostrarTextInput, setMostrarTextInput] = useState(false);
  const [textoColar, setTextoColar] = useState('');

  const confirmarTextoColar = async () => {
    if (!textoColar.trim()) return;
    setNomeArquivo('Dados colados');
    setCarregando(true);
    setMostrarTextInput(false);
    setDadosPlanilha(textoColar);
    await iniciarAnalise(textoColar, 'Dados colados');
    setCarregando(false);
  };

  // ── Iniciar análise automática ────────────────────────────
  const iniciarAnalise = async (dados: string, nome: string) => {
    try {
      const resposta = await ApiService.analisarPlanilha(dados, nome);
      setAnalisesRestantes(resposta.analisesRestantes);
      setMensagens([
        {
          role: 'assistant',
          content: resposta.insights,
        },
      ]);
      setEtapa('chat');
    } catch (error: any) {
      if (error?.response?.status === 429) {
        Alert.alert(
          '⚠️ Limite diário atingido',
          'Você usou suas 3 análises de hoje. Deseja comprar mais análises?',
          [
            { text: 'Agora não', style: 'cancel' },
            { text: 'Comprar', onPress: () => {} }, // TODO: integrar compra
          ]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível analisar. Tente novamente.');
      }
    }
  };

  // ── Chat livre sobre os dados ─────────────────────────────
  const enviarPergunta = async () => {
    if (!pergunta.trim()) return;
    const novaMensagem: Mensagem = { role: 'user', content: pergunta };
    const novasMensagens = [...mensagens, novaMensagem];
    setMensagens(novasMensagens);
    setPergunta('');
    setCarregando(true);

    try {
      const resposta = await ApiService.chatSobrePlanilha(dadosPlanilha, novasMensagens);
      setMensagens([...novasMensagens, { role: 'assistant', content: resposta.resposta }]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível responder. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // ── TELA DE UPLOAD ────────────────────────────────────────
  if (etapa === 'upload') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.fechar}>
            <Text style={styles.fecharTexto}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>🤖 Análise com IA</Text>
          <View style={styles.badgePremium}>
            <Text style={styles.badgePremiumTexto}>⭐ PREMIUM</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.uploadContent}>
          <Image 
            source={require('../../../assets/excelino-pro.png')} 
            style={styles.excelinoProImage}
            resizeMode="contain"
          />
          <Text style={styles.uploadTitulo}>Envie sua planilha</Text>
          <Text style={styles.uploadSubtitulo}>
            O Excelino Pró vai analisar seus dados e te dar insights poderosos
          </Text>

          {carregando ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F59E0B" />
              <Text style={styles.loadingTexto}>Analisando sua planilha...</Text>
              <Text style={styles.loadingSubTexto}>Isso pode levar alguns segundos</Text>
            </View>
          ) : (
            <View style={styles.opcoes}>
              <TouchableOpacity style={styles.opcaoCard} onPress={uploadArquivo} activeOpacity={0.8}>
                <Text style={styles.opcaoEmoji}>📁</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.opcaoTitulo}>Excel ou CSV</Text>
                  <Text style={styles.opcaoSub}>Selecione um arquivo do dispositivo</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.opcaoCard} onPress={tirarFoto} activeOpacity={0.8}>
                <Text style={styles.opcaoEmoji}>📸</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.opcaoTitulo}>Foto da planilha</Text>
                  <Text style={styles.opcaoSub}>Tire uma foto da tela ou papel</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.opcaoCard}
                onPress={() => setMostrarTextInput(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.opcaoEmoji}>📋</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.opcaoTitulo}>Colar dados</Text>
                  <Text style={styles.opcaoSub}>Cole linhas e colunas de texto</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {mostrarTextInput && (
            <View style={styles.colarContainer}>
              <Text style={styles.colarTitulo}>Cole seus dados abaixo:</Text>
              <TextInput
                style={styles.colarInput}
                multiline
                numberOfLines={8}
                placeholder={'Nome;Valor;Data\nJoão;1500;Jan\nMaria;2300;Jan'}
                value={textoColar}
                onChangeText={setTextoColar}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.colarBtn} onPress={confirmarTextoColar}>
                <Text style={styles.colarBtnTexto}>Analisar dados</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── TELA DE CHAT ──────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setEtapa('upload')} style={styles.fechar}>
          <Text style={styles.fecharTexto}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitulo}>🤖 {nomeArquivo}</Text>
        </View>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.fecharTexto}>✕</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.mensagens}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {mensagens.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.mensagem,
                msg.role === 'user' ? styles.mensagemUsuario : styles.mensagemIA,
              ]}
            >
              {msg.role === 'assistant' && (
                <Text style={styles.mensagemIALabel}>🤖 Excelino IA</Text>
              )}
              {msg.role === 'assistant' ? (
                <Markdown
                  style={{
                    body: { color: '#1F2937', fontSize: 15, lineHeight: 22 },
                    heading1: { color: '#111827', fontSize: 20, fontWeight: 'bold', marginTop: 12, marginBottom: 8 },
                    heading2: { color: '#111827', fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 6 },
                    heading3: { color: '#111827', fontSize: 16, fontWeight: '600', marginTop: 8, marginBottom: 4 },
                    strong: { fontWeight: 'bold', color: '#111827' },
                    em: { fontStyle: 'italic' },
                    code_inline: {
                      backgroundColor: '#F3F4F6',
                      color: '#EF4444',
                      paddingHorizontal: 4,
                      paddingVertical: 2,
                      borderRadius: 4,
                      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                    },
                    fence: {
                      backgroundColor: '#F3F4F6',
                      padding: 12,
                      borderRadius: 8,
                      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                      fontSize: 13,
                    },
                    bullet_list: { marginVertical: 4 },
                    ordered_list: { marginVertical: 4 },
                    list_item: { marginVertical: 2 },
                  }}
                >
                  {msg.content}
                </Markdown>
              ) : (
                <Text style={[
                  styles.mensagemTexto,
                  styles.mensagemTextoUsuario,
                ]}>
                  {msg.content}
                </Text>
              )}
            </View>
          ))}
          {carregando && (
            <View style={styles.mensagemIA}>
              <Text style={styles.mensagemIALabel}>🤖 Excelino IA</Text>
              <ActivityIndicator size="small" color="#F59E0B" style={{ marginTop: 8 }} />
            </View>
          )}
        </ScrollView>

        {/* Sugestões de perguntas */}
        {mensagens.length === 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.sugestoes}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {[
              'Quais são os maiores problemas?',
              'Que gráfico usar aqui?',
              'Tem algum dado inconsistente?',
              'Como posso melhorar esses números?',
              'Qual a tendência dos dados?',
            ].map((sugestao, i) => (
              <TouchableOpacity
                key={i}
                style={styles.sugestaoChip}
                onPress={() => { setPergunta(sugestao); }}
              >
                <Text style={styles.sugestaoTexto}>{sugestao}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input de pergunta */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Pergunte algo sobre seus dados..."
            value={pergunta}
            onChangeText={setPergunta}
            multiline
            maxLength={500}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[styles.enviarBtn, !pergunta.trim() && styles.enviarBtnDisabled]}
            onPress={enviarPergunta}
            disabled={!pergunta.trim() || carregando}
          >
            <Text style={styles.enviarBtnTexto}>▶</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1A1A2E', paddingHorizontal: 16, paddingVertical: 14,
  },
  fechar: { padding: 4 },
  fecharTexto: { color: '#FFF', fontSize: 22, fontWeight: '300' },
  headerTitulo: { color: '#FFF', fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center' },
  headerInfo: { flex: 1, alignItems: 'center' },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
  badgePremium: { backgroundColor: '#F59E0B', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgePremiumTexto: { color: '#FFF', fontSize: 10, fontWeight: '800' },

  uploadContent: { padding: 24, alignItems: 'center' },
  excelinoProImage: { 
    width: 100, 
    height: 100, 
    marginBottom: 16 
  },
  uploadTitulo: { fontSize: 24, fontWeight: '800', color: '#222', textAlign: 'center', marginBottom: 8 },
  uploadSubtitulo: { fontSize: 14, color: '#777', textAlign: 'center', lineHeight: 21, marginBottom: 20 },

  limiteBadge: {
    backgroundColor: '#FFF3CD', borderRadius: 20, paddingHorizontal: 16,
    paddingVertical: 8, marginBottom: 32, borderWidth: 1, borderColor: '#F59E0B',
  },
  limiteTexto: { color: '#92600A', fontSize: 13, fontWeight: '600' },

  loadingContainer: { alignItems: 'center', marginTop: 40 },
  loadingTexto: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 16 },
  loadingSubTexto: { fontSize: 13, color: '#999', marginTop: 6 },

  opcoes: { width: '100%', gap: 12 },
  opcaoCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 20,
    flexDirection: 'row', alignItems: 'center',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    borderLeftWidth: 4, borderLeftColor: '#F59E0B',
  },
  opcaoEmoji: { fontSize: 32, marginRight: 16 },
  opcaoTitulo: { fontSize: 16, fontWeight: '700', color: '#222' },
  opcaoSub: { fontSize: 12, color: '#999', marginTop: 2 },

  colarContainer: { width: '100%', marginTop: 20 },
  colarTitulo: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 10 },
  colarInput: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 14,
    fontSize: 13, color: '#333', borderWidth: 1, borderColor: '#DDD',
    fontFamily: 'monospace', height: 160,
  },
  colarBtn: {
    backgroundColor: '#F59E0B', borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 12,
  },
  colarBtnTexto: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  chatContainer: { flex: 1 },
  mensagens: { flex: 1 },
  mensagem: { marginBottom: 16, maxWidth: '88%' },
  mensagemUsuario: { alignSelf: 'flex-end' },
  mensagemIA: { alignSelf: 'flex-start' },
  mensagemIALabel: { fontSize: 11, color: '#F59E0B', fontWeight: '700', marginBottom: 6 },
  mensagemTexto: { fontSize: 14, lineHeight: 21, borderRadius: 16, padding: 14 },
  mensagemTextoUsuario: { backgroundColor: '#1E88E5', color: '#FFF', borderBottomRightRadius: 4 },
  mensagemTextoIA: { backgroundColor: '#FFF', color: '#333', borderBottomLeftRadius: 4, elevation: 1 },

  sugestoes: { maxHeight: 44, marginBottom: 8 },
  sugestaoChip: {
    backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 14,
    paddingVertical: 8, borderWidth: 1, borderColor: '#F59E0B',
  },
  sugestaoTexto: { fontSize: 12, color: '#F59E0B', fontWeight: '600' },

  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-end',
    backgroundColor: '#FFF', margin: 12, borderRadius: 16, padding: 8,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
  },
  input: { flex: 1, fontSize: 14, color: '#333', paddingHorizontal: 8, maxHeight: 100, paddingVertical: 6 },
  enviarBtn: { backgroundColor: '#F59E0B', borderRadius: 12, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  enviarBtnDisabled: { backgroundColor: '#DDD' },
  enviarBtnTexto: { color: '#FFF', fontSize: 16 },
});

export default PlanilhaIAScreen;
