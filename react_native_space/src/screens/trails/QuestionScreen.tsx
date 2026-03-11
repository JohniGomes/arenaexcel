import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import ApiService from '../../services/api.service';
import { SpreadsheetWebView } from '../../components/SpreadsheetWebView';
import DragDropQuestion from '../../components/DragDropQuestion';
import ChartBuilderQuestion from '../../components/ChartBuilderQuestion';
import { theme } from '../../constants/theme';

interface QuestionScreenProps {
  route: {
    params: {
      slug: string;
      order: number;
    };
  };
  navigation: any;
}

interface Question {
  id: string;
  title: string;
  description: string;
  type: string;
  xpReward: number;
  options?: string[];
  spreadsheetContext?: any;
  targetCell?: string;
  hint?: string;
  correctOrder?: string[]; // Para DRAG_AND_DROP
}

export default function QuestionScreen({
  route,
  navigation,
}: QuestionScreenProps) {
  const { slug, order } = route.params;
  const { width } = useWindowDimensions();
  const [question, setQuestion] = useState<Question | null>(null);
  const [trailInfo, setTrailInfo] = useState<{ totalQuestions: number } | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [descHeight, setDescHeight] = useState(220);
  const [result, setResult] = useState<{
    isCorrect: boolean;
    explanation: string;
    xpEarned: number;
  } | null>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadTrailInfo();
  }, [slug]);

  useEffect(() => {
    loadQuestion();
  }, [slug, order]);

  const loadTrailInfo = async () => {
    try {
      const trail = await ApiService.getTrailDetails(slug);
      setTrailInfo({ totalQuestions: trail?.questions?.length ?? 10 });
    } catch (error) {
      console.error('Erro ao carregar info da trilha:', error);
    }
  };

  const loadQuestion = async () => {
    setQuestion(null);
    setSelected(null);
    setAnswered(false);
    setResult(null);
    try {
      const data = await ApiService.getQuestion(slug, order);
      setQuestion(data);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } catch (error: any) {
      // Se for erro 404, significa que acabaram as questões
      if (error?.response?.status === 404) {
        showCompletionScreen();
      } else {
        Alert.alert('Erro', 'Não foi possível carregar a questão');
        navigation.goBack();
      }
    }
  };

  const showCompletionScreen = () => {
    Alert.alert(
      '🎉 Trilha Concluída!',
      'Parabéns! Você completou todas as questões desta trilha.',
      [
        {
          text: 'Ver Trilhas',
          onPress: () => navigation.navigate('Trails'),
        },
      ]
    );
  };

  const submitAnswer = useCallback(
    async (value: string) => {
      if (answered || !question) return;
      setAnswered(true);
      try {
        const res = await ApiService.submitTrailAnswer({
          questionId: question.id,
          value,
          timeSpentMs: 0,
        });
        setResult(res);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível enviar a resposta');
        setAnswered(false);
      }
    },
    [answered, question]
  );

  const handleMultipleChoice = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    submitAnswer(String(idx));
  };

  const goNext = () => {
    const isLastQuestion = trailInfo && order >= trailInfo.totalQuestions;
    
    if (isLastQuestion) {
      // Marca trilha como concluída e volta para lista de trilhas
      Alert.alert(
        '🎉 Trilha Concluída!',
        `Parabéns! Você completou todas as ${trailInfo.totalQuestions} questões desta trilha.`,
        [
          {
            text: 'Ver Certificado',
            onPress: () => {
              // TODO: Implementar tela de certificado de conclusão
              navigation.navigate('Trails');
            },
          },
          {
            text: 'Ver Trilhas',
            onPress: () => navigation.navigate('Trails'),
          },
        ]
      );
    } else {
      navigation.replace('Question', { slug, order: order + 1 });
    }
  };

  if (!question) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const isInteractive = [
    'SPREADSHEET_INPUT',
    'FORMULA_BUILDER',
  ].includes(question.type);

  const isDragDrop = question.type === 'DRAG_AND_DROP';
  const isChartBuilder = question.type === 'CHART_BUILDER';

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <Text style={styles.questionNumber}>
              Questão {order}/{trailInfo?.totalQuestions ?? '?'}
            </Text>
            {question?.hint && (
              <TouchableOpacity
                onPress={() => setShowHint(!showHint)}
                style={styles.hintBtn}
              >
                <Text style={styles.hintIcon}>💡</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{question.xpReward} XP</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Título e descrição */}
          <Text style={styles.title}>{question.title}</Text>
          
          {/* Renderiza HTML se description começar com "<", senão texto puro */}
          {question.description?.startsWith('<') ? (
            <View style={[styles.htmlContainer, { height: Math.min(descHeight, 560) }]}>
              <WebView
                originWhitelist={['*']}
                source={{
                  html: `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; max-width: 100%; word-break: break-word; overflow-wrap: break-word; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #1A1A2E; line-height: 1.5; padding: 12px; background: transparent; overflow: hidden; }
  img, table, div, span { max-width: 100%; }
  .excel-visual { background: #fff; border-radius: 10px; padding: 14px; border: 1px solid #E0E5E0; overflow: hidden; }
  .excel-grid { background: #F7F9F7; border-radius: 8px; padding: 10px; margin-bottom: 10px; overflow-x: auto; }
  .excel-header { display: flex; font-weight: 700; font-size: 12px; color: #217346; margin-bottom: 4px; flex-wrap: wrap; }
  .excel-header span { min-width: 50px; text-align: center; padding: 4px; background: #E8F5E9; border-radius: 4px; }
  .excel-row { display: flex; margin: 2px 0; flex-wrap: wrap; }
  .excel-row span:first-child { min-width: 28px; text-align: center; font-weight: 600; font-size: 11px; color: #4A4A6A; background: #F7F9F7; padding: 6px 4px; border: 1px solid #E0E5E0; }
  .cell { min-width: 50px; padding: 6px 8px; border: 1px solid #E0E5E0; background: #fff; text-align: center; font-size: 12px; color: #1A1A2E; word-break: break-word; }
  .highlight-cell { background: #E8F5E9 !important; border: 2px solid #217346 !important; font-weight: 700; color: #217346; }
  p { margin-top: 10px; color: #4A4A6A; font-size: 13px; }
  strong { color: #217346; }
  [style*="font-family:monospace"], [style*="font-family: monospace"] { word-break: break-all; white-space: normal; }
  ${question.type === 'DRAG_AND_DROP' ? 'div[style*="linear-gradient(135deg,#217346"] { display: none !important; }' : ''}
</style>
</head>
<body>
${question.description}
</body>
</html>`
                }}
                scrollEnabled={true}
                style={{ flex: 1 }}
                javaScriptEnabled={true}
                injectedJavaScript={`
                  (function(){
                    var h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
                    window.ReactNativeWebView.postMessage(JSON.stringify({t:'h',v:h}));
                  })();
                  true;
                `}
                onMessage={(e) => {
                  try {
                    const d = JSON.parse(e.nativeEvent.data);
                    if (d.t === 'h') setDescHeight(d.v + 24);
                  } catch {}
                }}
              />
            </View>
          ) : (
            <Text style={styles.description}>{question.description}</Text>
          )}

          {/* Dica (se habilitada) */}
          {showHint && question.hint && (
            <View style={styles.hintBox}>
              <Text style={styles.hintTitle}>💡 Dica</Text>
              <Text style={styles.hintText}>{question.hint}</Text>
            </View>
          )}

          {/* Conteúdo por tipo */}
          {question.type === 'MULTIPLE_CHOICE' && (
            <View style={styles.options}>
              {question.options?.map((opt: string, i: number) => {
                const isCorrect =
                  answered && result?.isCorrect && selected === i;
                const isWrong =
                  answered && !result?.isCorrect && selected === i;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.option,
                      selected === i && styles.optionSelected,
                      isCorrect && styles.optionCorrect,
                      isWrong && styles.optionWrong,
                    ]}
                    onPress={() => handleMultipleChoice(i)}
                    disabled={answered}
                  >
                    <View style={styles.optionLetter}>
                      <Text style={styles.optionLetterText}>
                        {['A', 'B', 'C', 'D'][i]}
                      </Text>
                    </View>
                    <Text style={styles.optionText}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {isInteractive && (
            <View style={styles.webviewContainer}>
              <SpreadsheetWebView
                questionType={question.type as any}
                spreadsheetContext={question.spreadsheetContext ?? {}}
                expectedValue=""
                targetCell={question.targetCell}
                onCorrect={(val) => submitAnswer(val)}
                onWrong={() => {}}
              />
            </View>
          )}

          {isDragDrop && question.correctOrder && (
            <DragDropQuestion
              items={question.correctOrder}
              onSubmit={submitAnswer}
              answered={answered}
            />
          )}

          {isChartBuilder && (
            <ChartBuilderQuestion
              spreadsheetContext={question.spreadsheetContext ?? {}}
              onSubmit={submitAnswer}
              answered={answered}
            />
          )}

          {/* Feedback */}
          {result && (
            <View
              style={[
                styles.feedback,
                result.isCorrect ? styles.feedbackOk : styles.feedbackFail,
              ]}
            >
              <Text style={styles.feedbackIcon}>
                {result.isCorrect ? '🎉' : '💡'}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.feedbackTitle}>
                  {result.isCorrect
                    ? `+${result.xpEarned} XP ganhos!`
                    : 'Quase lá!'}
                </Text>
                <Text style={styles.feedbackText}>{result.explanation}</Text>
              </View>
            </View>
          )}

          {/* Próxima questão */}
          {answered && (
            <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
              <Text style={styles.nextBtnText}>
                {trailInfo && order >= trailInfo.totalQuestions 
                  ? '🎉 Finalizar Trilha' 
                  : 'Próxima Questão →'}
              </Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backBtn: { padding: 8 },
  backIcon: { fontSize: 22, color: '#333' },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  hintBtn: {
    padding: 6,
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFB300',
  },
  hintIcon: {
    fontSize: 18,
  },
  xpBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FDD835',
  },
  xpText: { fontSize: 13, fontWeight: '700', color: '#F57F17' },
  hintBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#FFD54F',
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F57F17',
    marginBottom: 6,
  },
  hintText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 8,
    lineHeight: 26,
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
    lineHeight: 22,
  },
  htmlContainer: {
    minHeight: 160,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  options: { gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    elevation: 2,
  },
  optionSelected: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryLight },
  optionCorrect: { borderColor: theme.colors.success, backgroundColor: theme.colors.primaryLight },
  optionWrong: { borderColor: theme.colors.error, backgroundColor: theme.colors.errorLight },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLetterText: { fontSize: 14, fontWeight: '700', color: '#333' },
  optionText: { flex: 1, fontSize: 14, color: '#333', lineHeight: 20 },
  webviewContainer: { flex: 1, minHeight: 320, marginBottom: 12 },
  feedback: {
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 12,
  },
  feedbackOk: {
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 1.5,
    borderColor: theme.colors.success,
  },
  feedbackFail: {
    backgroundColor: theme.colors.amberLight,
    borderWidth: 1.5,
    borderColor: theme.colors.amber,
  },
  feedbackIcon: { fontSize: 24 },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  feedbackText: { fontSize: 13, color: '#555', lineHeight: 18 },
  nextBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    elevation: 6,
  },
  nextBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
