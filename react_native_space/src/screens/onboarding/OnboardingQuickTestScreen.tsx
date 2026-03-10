import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingStackParamList } from '../../navigation/types';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { theme } from '../../constants/theme';
import { useSound } from '../../contexts/SoundContext';
import { Ionicons } from '@expo/vector-icons';

type OnboardingQuickTestScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'QuickTest'>;
type OnboardingQuickTestScreenRouteProp = RouteProp<OnboardingStackParamList, 'QuickTest'>;

interface Props {
  navigation: OnboardingQuickTestScreenNavigationProp;
  route: OnboardingQuickTestScreenRouteProp;
}

const questions = [
  { id: 1, question: 'Qual fórmula soma valores de A1 até A10?', options: ['=SUM(A1:A10)', '=SOMA(A1:A10)', '=ADD(A1:A10)', '=TOTAL(A1:A10)'], correct: 1 },
  { id: 2, question: 'Para que serve a função SE?', options: ['Fazer cálculos', 'Testar condições', 'Somar valores', 'Contar células'], correct: 1 },
  { id: 3, question: 'Qual função busca valores em uma tabela?', options: ['BUSCAR', 'PROCV', 'ENCONTRAR', 'LOCALIZAR'], correct: 1 },
  { id: 4, question: 'Tabelas dinâmicas servem para:', options: ['Criar gráficos', 'Resumir e analisar dados', 'Formatar células', 'Validar dados'], correct: 1 },
  { id: 5, question: 'Como criar um gráfico no Excel?', options: ['Ctrl + G', 'Inserir > Gráfico', 'Alt + F1', 'Formatar > Gráfico'], correct: 1 },
  { id: 6, question: 'Qual função conta células não vazias?', options: ['=CONT.NÚM', '=CONTAR.VAZIO', '=CONT.VALORES', '=CONTAR'], correct: 2 },
  { id: 7, question: 'O que faz a função CONCATENAR?', options: ['Divide textos', 'Junta textos', 'Conta caracteres', 'Remove espaços'], correct: 1 },
  { id: 8, question: 'Qual atalho salva a planilha?', options: ['Ctrl + S', 'Ctrl + G', 'Ctrl + P', 'Ctrl + N'], correct: 0 },
  { id: 9, question: 'Para que serve a formatação condicional?', options: ['Validar dados', 'Destacar células com base em regras', 'Proteger planilha', 'Ordenar dados'], correct: 1 },
  { id: 10, question: 'Qual função retorna a data atual?', options: ['=AGORA()', '=HOJE()', '=DATA()', '=DIA()'], correct: 1 },
];

const OnboardingQuickTestScreen: React.FC<Props> = ({ navigation, route }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { playClick } = useSound();

  const handleNext = async () => {
    if (selectedOption !== null) {
      await playClick();
      const newAnswers = [...answers, selectedOption];
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // Calculate level based on answers
        const correctCount = newAnswers.filter((ans, idx) => ans === questions[idx].correct).length;
        let level = 'beginner';
        if (correctCount >= 8) level = 'advanced';
        else if (correctCount >= 5) level = 'intermediate';

        navigation.navigate('TestResult', { level, correctCount });
      }
    }
  };

  const question = questions[currentQuestion];
  const progress = (currentQuestion + 1) / questions.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Ionicons
          name="close"
          size={28}
          color={theme.colors.text}
          onPress={() => navigation.goBack()}
        />
        <ProgressBar progress={progress} style={styles.progressBar} />
        <Text style={styles.progressText}>{currentQuestion + 1}/{questions.length}</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('../../../assets/excelino_pensando.png')}
          style={styles.mascot}
          resizeMode="contain"
        />
        <Text style={styles.title}>Mini Teste de Avaliação</Text>
        <Text style={styles.question}>{question?.question}</Text>

        <RadioButton.Group
          onValueChange={(value) => setSelectedOption(parseInt(value))}
          value={selectedOption?.toString() ?? ''}
        >
          {question?.options?.map((option, index) => (
            <View key={index} style={styles.optionContainer}>
              <RadioButton.Item
                label={option}
                value={index.toString()}
                style={styles.radioButton}
              />
            </View>
          ))}
        </RadioButton.Group>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={currentQuestion < questions.length - 1 ? 'Próxima' : 'Finalizar'}
          onPress={handleNext}
          disabled={selectedOption === null}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  progressBar: { flex: 1, marginHorizontal: 16 },
  progressText: { fontSize: 14, fontWeight: '600', color: theme.colors.text, minWidth: 40, textAlign: 'right' },
  container: { flex: 1 },
  scrollContent: { padding: 24 },
  mascot: { width: 140, height: 140, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '700', color: theme.colors.primary, textAlign: 'center', marginBottom: 24 },
  question: { fontSize: 18, fontWeight: '600', color: theme.colors.text, marginBottom: 24 },
  optionContainer: { marginBottom: 8 },
  radioButton: { backgroundColor: theme.colors.surface, borderRadius: 12 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: theme.colors.border },
});

export default OnboardingQuickTestScreen;