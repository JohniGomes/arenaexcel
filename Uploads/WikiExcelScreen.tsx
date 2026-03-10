import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  TextInput,
  FlatList,
} from 'react-native';

// ─── TIPOS ───────────────────────────────────────────────────────────────────
interface Formula {
  nome: string;
  sintaxe: string;
  descricao: string;
  exemplo: string;
}

interface Dica {
  titulo: string;
  descricao: string;
}

interface Area {
  id: string;
  nome: string;
  emoji: string;
  cor: string;
  corClara: string;
  descricao: string;
  formulas: Formula[];
  dicas: Dica[];
}

// ─── DADOS ───────────────────────────────────────────────────────────────────
const AREAS: Area[] = [
  {
    id: 'financeiro',
    nome: 'Financeiro',
    emoji: '💰',
    cor: '#2E7D32',
    corClara: '#E8F5E9',
    descricao: 'Fórmulas essenciais para análise financeira, fluxo de caixa e investimentos.',
    formulas: [
      {
        nome: 'VPL',
        sintaxe: '=VPL(taxa; valor1; [valor2]; ...)',
        descricao: 'Calcula o Valor Presente Líquido de um investimento.',
        exemplo: '=VPL(0,1; -1000; 400; 500; 600)',
      },
      {
        nome: 'TIR',
        sintaxe: '=TIR(valores; [estimativa])',
        descricao: 'Calcula a Taxa Interna de Retorno de um fluxo de caixa.',
        exemplo: '=TIR(A1:A5)',
      },
      {
        nome: 'PGTO',
        sintaxe: '=PGTO(taxa; nper; vp)',
        descricao: 'Calcula o pagamento periódico de um empréstimo.',
        exemplo: '=PGTO(0,01; 36; 10000)',
      },
      {
        nome: 'SOMASE',
        sintaxe: '=SOMASE(intervalo; critério; [soma_intervalo])',
        descricao: 'Soma valores que atendem a um critério específico.',
        exemplo: '=SOMASE(A2:A10; "Receita"; B2:B10)',
      },
      {
        nome: 'PROCV',
        sintaxe: '=PROCV(valor; tabela; col; [exato])',
        descricao: 'Busca um valor em uma tabela e retorna dado correspondente.',
        exemplo: '=PROCV(A2; Tabela!A:C; 3; 0)',
      },
    ],
    dicas: [
      { titulo: 'Formate como moeda', descricao: 'Use Ctrl+1 para abrir formatação e escolha "Moeda" para exibir R$ automaticamente.' },
      { titulo: 'Tabela de amortização', descricao: 'Combine PGTO, IPGTO e PPGTO para montar uma tabela de amortização completa.' },
      { titulo: 'Gráfico de fluxo de caixa', descricao: 'Selecione seus dados de entrada/saída e insira um gráfico de barras para visualizar o fluxo.' },
    ],
  },
  {
    id: 'administrativo',
    nome: 'Administrativo',
    emoji: '🏢',
    cor: '#1565C0',
    corClara: '#E3F2FD',
    descricao: 'Organize processos, controle tarefas e gerencie informações administrativas.',
    formulas: [
      {
        nome: 'CONT.SE',
        sintaxe: '=CONT.SE(intervalo; critério)',
        descricao: 'Conta células que atendem a um critério.',
        exemplo: '=CONT.SE(B2:B100; "Pendente")',
      },
      {
        nome: 'HOJE',
        sintaxe: '=HOJE()',
        descricao: 'Retorna a data atual automaticamente.',
        exemplo: '=HOJE()',
      },
      {
        nome: 'DATEDIF',
        sintaxe: '=DATEDIF(data_inicial; data_final; unidade)',
        descricao: 'Calcula a diferença entre duas datas.',
        exemplo: '=DATEDIF(A2; HOJE(); "D")',
      },
      {
        nome: 'SE',
        sintaxe: '=SE(teste; valor_se_verdadeiro; valor_se_falso)',
        descricao: 'Retorna valores diferentes baseado em uma condição.',
        exemplo: '=SE(C2>90%; "Aprovado"; "Reprovado")',
      },
      {
        nome: 'CONCATENAR',
        sintaxe: '=CONCATENAR(texto1; texto2; ...)',
        descricao: 'Une textos de várias células em uma.',
        exemplo: '=CONCATENAR(A2; " "; B2)',
      },
    ],
    dicas: [
      { titulo: 'Validação de dados', descricao: 'Use Dados > Validação para criar listas suspensas e evitar erros de digitação.' },
      { titulo: 'Formatação condicional', descricao: 'Destaque automaticamente tarefas atrasadas com formatação condicional baseada na data.' },
      { titulo: 'Proteja a planilha', descricao: 'Use Revisão > Proteger Planilha para evitar alterações acidentais em dados importantes.' },
    ],
  },
  {
    id: 'rh',
    nome: 'RH',
    emoji: '👥',
    cor: '#6A1B9A',
    corClara: '#F3E5F5',
    descricao: 'Gestão de pessoas, folha de pagamento, férias e indicadores de RH.',
    formulas: [
      {
        nome: 'FIMMÊS',
        sintaxe: '=FIMMÊS(data_inicial; meses)',
        descricao: 'Retorna o último dia do mês após N meses.',
        exemplo: '=FIMMÊS(A2; 0)',
      },
      {
        nome: 'DIATRABALHOTOTAL',
        sintaxe: '=DIATRABALHOTOTAL(início; fim; [feriados])',
        descricao: 'Conta os dias úteis entre duas datas.',
        exemplo: '=DIATRABALHOTOTAL(A2; B2; Feriados!A:A)',
      },
      {
        nome: 'MÉDIA',
        sintaxe: '=MÉDIA(número1; [número2]; ...)',
        descricao: 'Calcula a média de um intervalo de valores.',
        exemplo: '=MÉDIA(C2:C50)',
      },
      {
        nome: 'MÁXIMO',
        sintaxe: '=MÁXIMO(número1; [número2]; ...)',
        descricao: 'Retorna o maior valor de um intervalo.',
        exemplo: '=MÁXIMO(D2:D100)',
      },
      {
        nome: 'ÍNDICE + CORRESP',
        sintaxe: '=ÍNDICE(col_retorno; CORRESP(valor; col_busca; 0))',
        descricao: 'Alternativa poderosa ao PROCV, busca em qualquer direção.',
        exemplo: '=ÍNDICE(C2:C100; CORRESP(A2; A2:A100; 0))',
      },
    ],
    dicas: [
      { titulo: 'Controle de férias', descricao: 'Use DIATRABALHOTOTAL para calcular automaticamente os dias de férias disponíveis por colaborador.' },
      { titulo: 'Dashboard de RH', descricao: 'Crie gráficos de pizza para visualizar a distribuição de cargos e departamentos.' },
      { titulo: 'Tabela dinâmica', descricao: 'Use Tabelas Dinâmicas para cruzar dados de headcount por departamento e período.' },
    ],
  },
  {
    id: 'vendas',
    nome: 'Comercial / Vendas',
    emoji: '📈',
    cor: '#E65100',
    corClara: '#FFF3E0',
    descricao: 'Acompanhe metas, comissões, pipeline e desempenho da equipe comercial.',
    formulas: [
      {
        nome: 'SOMASES',
        sintaxe: '=SOMASES(soma_intervalo; intervalo1; critério1; ...)',
        descricao: 'Soma valores com múltiplos critérios.',
        exemplo: '=SOMASES(C2:C100; A2:A100; "João"; B2:B100; "Jan")',
      },
      {
        nome: 'CONT.SES',
        sintaxe: '=CONT.SES(intervalo1; critério1; ...)',
        descricao: 'Conta células com múltiplos critérios.',
        exemplo: '=CONT.SES(A2:A100; "Fechado"; B2:B100; ">1000")',
      },
      {
        nome: 'CRESCIMENTO',
        sintaxe: '=CRESCIMENTO(y_conhecido; x_conhecido; x_novo)',
        descricao: 'Projeta valores usando crescimento exponencial.',
        exemplo: '=CRESCIMENTO(B2:B12; A2:A12; A13)',
      },
      {
        nome: 'PORCENTAGEM',
        sintaxe: '=valor/total',
        descricao: 'Calcula o percentual de atingimento de meta.',
        exemplo: '=C2/D2 (formate como %)',
      },
      {
        nome: 'MAIOR',
        sintaxe: '=MAIOR(intervalo; k)',
        descricao: 'Retorna o k-ésimo maior valor do intervalo.',
        exemplo: '=MAIOR(B2:B50; 1)',
      },
    ],
    dicas: [
      { titulo: 'Funil de vendas', descricao: 'Use gráfico de barras invertido para criar um funil visual do pipeline de vendas.' },
      { titulo: 'Meta vs Realizado', descricao: 'Crie uma coluna de % atingido com formatação condicional: vermelho <80%, amarelo <100%, verde ≥100%.' },
      { titulo: 'Ranking de vendedores', descricao: 'Use MAIOR e ÍNDICE+CORRESP para criar um ranking automático de vendedores por mês.' },
    ],
  },
  {
    id: 'logistica',
    nome: 'Logística / Estoque',
    emoji: '📦',
    cor: '#00695C',
    corClara: '#E0F2F1',
    descricao: 'Controle de estoque, prazos de entrega e gestão da cadeia de suprimentos.',
    formulas: [
      {
        nome: 'MÍNIMO',
        sintaxe: '=MÍNIMO(número1; [número2]; ...)',
        descricao: 'Retorna o menor valor — útil para estoque mínimo.',
        exemplo: '=MÍNIMO(B2:B100)',
      },
      {
        nome: 'SE + E',
        sintaxe: '=SE(E(cond1; cond2); valor_v; valor_f)',
        descricao: 'Verifica múltiplas condições ao mesmo tempo.',
        exemplo: '=SE(E(B2<10; C2="Ativo"); "Repor"; "OK")',
      },
      {
        nome: 'ARRED',
        sintaxe: '=ARRED(número; num_dígitos)',
        descricao: 'Arredonda valores para a quantidade de casas desejada.',
        exemplo: '=ARRED(A2*1,1; 0)',
      },
      {
        nome: 'DIAS',
        sintaxe: '=DIAS(data_final; data_inicial)',
        descricao: 'Calcula a diferença em dias entre duas datas.',
        exemplo: '=DIAS(B2; HOJE())',
      },
      {
        nome: 'ÚNICO',
        sintaxe: '=ÚNICO(intervalo)',
        descricao: 'Retorna valores únicos de uma lista (Excel 365).',
        exemplo: '=ÚNICO(A2:A100)',
      },
    ],
    dicas: [
      { titulo: 'Ponto de reposição', descricao: 'Crie uma coluna com alerta automático quando o estoque atingir o ponto mínimo de reposição.' },
      { titulo: 'Código de barras', descricao: 'Use a fonte "Code 39" para exibir códigos de barras diretamente no Excel.' },
      { titulo: 'Giro de estoque', descricao: 'Calcule o giro dividindo o CMV pelo estoque médio para identificar produtos parados.' },
    ],
  },
  {
    id: 'empreendedores',
    nome: 'Empreendedores',
    emoji: '🚀',
    cor: '#C62828',
    corClara: '#FFEBEE',
    descricao: 'Ferramentas para startups, precificação, DRE simplificado e análise de viabilidade.',
    formulas: [
      {
        nome: 'TAXA',
        sintaxe: '=TAXA(nper; pgto; vp)',
        descricao: 'Calcula a taxa de juros de um investimento.',
        exemplo: '=TAXA(12; -200; 2000)',
      },
      {
        nome: 'ATINGIRMETA',
        sintaxe: 'Dados > Teste de Hipóteses > Atingir Meta',
        descricao: 'Descobre qual valor de entrada gera o resultado desejado.',
        exemplo: 'Qual preço gera lucro de R$10.000?',
      },
      {
        nome: 'SE (aninhado)',
        sintaxe: '=SE(cond1; val1; SE(cond2; val2; val3))',
        descricao: 'Múltiplas condições encadeadas para classificações.',
        exemplo: '=SE(A2>100000;"Grande";SE(A2>10000;"Médio";"Pequeno"))',
      },
      {
        nome: 'SOMARPRODUTO',
        sintaxe: '=SOMARPRODUTO(array1; array2)',
        descricao: 'Multiplica e soma arrays — ótimo para faturamento.',
        exemplo: '=SOMARPRODUTO(B2:B10; C2:C10)',
      },
      {
        nome: 'ÉERROS',
        sintaxe: '=SE(ÉERROS(fórmula); 0; fórmula)',
        descricao: 'Evita erros visíveis nas células quando há divisão por zero.',
        exemplo: '=SE(ÉERROS(A2/B2); 0; A2/B2)',
      },
    ],
    dicas: [
      { titulo: 'DRE simplificado', descricao: 'Monte um DRE com Receita, CMV, Lucro Bruto, Despesas e Lucro Líquido com fórmulas simples.' },
      { titulo: 'Ponto de equilíbrio', descricao: 'Calcule o break-even dividindo os custos fixos pela margem de contribuição unitária.' },
      { titulo: 'Cenários', descricao: 'Use Dados > Gerenciador de Cenários para simular resultados otimista, realista e pessimista.' },
    ],
  },
  {
    id: 'contabilidade',
    nome: 'Contabilidade',
    emoji: '📊',
    cor: '#4527A0',
    corClara: '#EDE7F6',
    descricao: 'Lançamentos contábeis, conciliação bancária e relatórios financeiros.',
    formulas: [
      {
        nome: 'SOMASE (débito/crédito)',
        sintaxe: '=SOMASE(intervalo; critério; soma)',
        descricao: 'Soma separadamente débitos e créditos por conta.',
        exemplo: '=SOMASE(A2:A100; "Débito"; C2:C100)',
      },
      {
        nome: 'ABS',
        sintaxe: '=ABS(número)',
        descricao: 'Retorna o valor absoluto — útil em conciliações.',
        exemplo: '=ABS(A2-B2)',
      },
      {
        nome: 'ARREDONDAR.PARA.CIMA',
        sintaxe: '=ARREDONDAR.PARA.CIMA(número; dígitos)',
        descricao: 'Arredonda sempre para cima — útil em impostos.',
        exemplo: '=ARREDONDAR.PARA.CIMA(A2*0,12; 2)',
      },
      {
        nome: 'BDSOMAP',
        sintaxe: '=BDSOMA(banco; campo; critérios)',
        descricao: 'Soma registros de um banco de dados com critérios.',
        exemplo: '=BDSOMA(A1:D100; "Valor"; F1:F2)',
      },
      {
        nome: 'TEXTO',
        sintaxe: '=TEXTO(valor; formato)',
        descricao: 'Formata números como texto com máscara específica.',
        exemplo: '=TEXTO(A2; "DD/MM/AAAA")',
      },
    ],
    dicas: [
      { titulo: 'Conciliação bancária', descricao: 'Use PROCV para cruzar o extrato bancário com os lançamentos internos e identificar divergências.' },
      { titulo: 'Balancete automático', descricao: 'Use Tabela Dinâmica para agrupar lançamentos por conta contábil e gerar o balancete.' },
      { titulo: 'Auditoria de fórmulas', descricao: 'Use Ctrl+` para alternar entre exibir valores e fórmulas na planilha.' },
    ],
  },
  {
    id: 'educacao',
    nome: 'Educação',
    emoji: '🎓',
    cor: '#1976D2',
    corClara: '#E3F2FD',
    descricao: 'Controle de notas, frequência, boletins e relatórios pedagógicos.',
    formulas: [
      {
        nome: 'MÉDIA',
        sintaxe: '=MÉDIA(número1; número2; ...)',
        descricao: 'Calcula a média das notas do aluno.',
        exemplo: '=MÉDIA(B2:E2)',
      },
      {
        nome: 'SE (aprovação)',
        sintaxe: '=SE(média>=7; "Aprovado"; "Reprovado")',
        descricao: 'Define situação do aluno automaticamente.',
        exemplo: '=SE(MÉDIA(B2:E2)>=7; "Aprovado"; "Reprovado")',
      },
      {
        nome: 'CONT.SE (frequência)',
        sintaxe: '=CONT.SE(intervalo; "P")',
        descricao: 'Conta presenças marcadas com "P".',
        exemplo: '=CONT.SE(B2:AF2; "P")',
      },
      {
        nome: 'PERCENTUAL',
        sintaxe: '=CONT.SE(intervalo;"P")/CONT.VALORES(intervalo)',
        descricao: 'Calcula o percentual de frequência.',
        exemplo: '=CONT.SE(B2:AF2;"P")/CONT.VALORES(B2:AF2)',
      },
      {
        nome: 'CLASSIFICAÇÃO',
        sintaxe: '=ORDEM(valor; intervalo; ordem)',
        descricao: 'Classifica o aluno no ranking da turma.',
        exemplo: '=ORDEM(F2; F$2:F$40; 0)',
      },
    ],
    dicas: [
      { titulo: 'Boletim automático', descricao: 'Monte um template de boletim que puxa notas de uma aba de lançamento com PROCV.' },
      { titulo: 'Gráfico de desempenho', descricao: 'Use gráfico de linha para mostrar a evolução das notas do aluno ao longo do ano.' },
      { titulo: 'Alertas de reprovação', descricao: 'Use formatação condicional para destacar em vermelho alunos com média abaixo de 5 ou frequência abaixo de 75%.' },
    ],
  },
  {
    id: 'marketing',
    nome: 'Marketing',
    emoji: '📣',
    cor: '#AD1457',
    corClara: '#FCE4EC',
    descricao: 'Métricas de campanhas, ROI, CAC, LTV e análise de canais digitais.',
    formulas: [
      {
        nome: 'ROI',
        sintaxe: '=(receita - custo) / custo',
        descricao: 'Calcula o retorno sobre investimento de uma campanha.',
        exemplo: '=(C2-B2)/B2 (formate como %)',
      },
      {
        nome: 'CPL / CPA',
        sintaxe: '=investimento / conversões',
        descricao: 'Custo por lead ou por aquisição.',
        exemplo: '=B2/C2',
      },
      {
        nome: 'TAXA DE CONVERSÃO',
        sintaxe: '=conversões / visitantes',
        descricao: 'Percentual de visitantes que converteram.',
        exemplo: '=C2/B2 (formate como %)',
      },
      {
        nome: 'PREVISÃO.LINEAR',
        sintaxe: '=PREVISÃO.LINEAR(x; y_conhecido; x_conhecido)',
        descricao: 'Projeta valores futuros baseado na tendência.',
        exemplo: '=PREVISÃO.LINEAR(13; B2:B12; A2:A12)',
      },
      {
        nome: 'ÚNICO + CONT.SE',
        sintaxe: 'Combinação para análise de canais',
        descricao: 'Liste canais únicos e conte leads por canal.',
        exemplo: '=CONT.SE(A2:A100; E2)',
      },
    ],
    dicas: [
      { titulo: 'Dashboard de campanha', descricao: 'Crie um painel com gráficos de impressões, cliques, leads e conversões por canal.' },
      { titulo: 'Análise de coorte', descricao: 'Agrupe clientes por mês de aquisição e acompanhe a retenção ao longo do tempo.' },
      { titulo: 'A/B Test simples', descricao: 'Use médias e desvio padrão para comparar a performance de duas versões de uma campanha.' },
    ],
  },
  {
    id: 'engenharia',
    nome: 'Engenharia / Projetos',
    emoji: '⚙️',
    cor: '#37474F',
    corClara: '#ECEFF1',
    descricao: 'Cronogramas, cálculos técnicos, Gantt e gestão de projetos.',
    formulas: [
      {
        nome: 'DIATRABALHO',
        sintaxe: '=DIATRABALHO(data_inicial; dias; [feriados])',
        descricao: 'Calcula a data de término somando dias úteis.',
        exemplo: '=DIATRABALHO(A2; 30; Feriados!A:A)',
      },
      {
        nome: 'SE + HOJE (status)',
        sintaxe: '=SE(hoje>prazo; "Atrasado"; "No prazo")',
        descricao: 'Indica automaticamente se a tarefa está atrasada.',
        exemplo: '=SE(HOJE()>C2; "Atrasado"; "No prazo")',
      },
      {
        nome: 'SOMAPRODUTO (% concluído)',
        sintaxe: '=SOMARPRODUTO(pesos; percentuais)/SOMA(pesos)',
        descricao: 'Calcula o percentual de conclusão ponderado do projeto.',
        exemplo: '=SOMARPRODUTO(B2:B10; C2:C10)/SOMA(B2:B10)',
      },
      {
        nome: 'POTÊNCIA',
        sintaxe: '=POTÊNCIA(número; potência)',
        descricao: 'Eleva um número a uma potência — útil em cálculos técnicos.',
        exemplo: '=POTÊNCIA(A2; 2)',
      },
      {
        nome: 'RAIZ',
        sintaxe: '=RAIZ(número)',
        descricao: 'Calcula a raiz quadrada de um valor.',
        exemplo: '=RAIZ(A2^2 + B2^2)',
      },
    ],
    dicas: [
      { titulo: 'Gráfico de Gantt', descricao: 'Crie um Gantt com gráfico de barras empilhadas: barra transparente + barra colorida com duração.' },
      { titulo: 'Baseline vs Realizado', descricao: 'Mantenha o plano original em colunas separadas e compare com o realizado usando formatação condicional.' },
      { titulo: 'EAP no Excel', descricao: 'Use recuo e formatação de células para representar a Estrutura Analítica do Projeto (EAP).' },
    ],
  },
];

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
const WikiExcelScreen = () => {
  const [busca, setBusca] = useState('');
  const [areaSelecionada, setAreaSelecionada] = useState<Area | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<'formulas' | 'dicas'>('formulas');

  const areasFiltradas = AREAS.filter(
    (a) =>
      a.nome.toLowerCase().includes(busca.toLowerCase()) ||
      a.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>📚 Wiki do Excel</Text>
        <Text style={styles.headerSubtitulo}>Fórmulas e dicas por área profissional</Text>
      </View>

      {/* Busca */}
      <View style={styles.buscaContainer}>
        <Text style={styles.buscaIcone}>🔍</Text>
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar área..."
          placeholderTextColor="#999"
          value={busca}
          onChangeText={setBusca}
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Text style={styles.buscaLimpar}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de áreas */}
      <FlatList
        data={areasFiltradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { borderLeftColor: item.cor }]}
            onPress={() => {
              setAreaSelecionada(item);
              setAbaAtiva('formulas');
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.cardEmoji, { backgroundColor: item.corClara }]}>
              <Text style={styles.cardEmojiText}>{item.emoji}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome}>{item.nome}</Text>
              <Text style={styles.cardDescricao} numberOfLines={2}>
                {item.descricao}
              </Text>
            </View>
            <View style={styles.cardMeta}>
              <View style={[styles.badge, { backgroundColor: item.corClara }]}>
                <Text style={[styles.badgeTexto, { color: item.cor }]}>
                  {item.formulas.length} fórmulas
                </Text>
              </View>
              <Text style={styles.cardSeta}>›</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioTexto}>Nenhuma área encontrada</Text>
          </View>
        }
      />

      {/* Modal de detalhes */}
      <Modal
        visible={!!areaSelecionada}
        animationType="slide"
        onRequestClose={() => setAreaSelecionada(null)}
      >
        {areaSelecionada && (
          <SafeAreaView style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { backgroundColor: areaSelecionada.cor }]}>
              <TouchableOpacity
                style={styles.modalVoltar}
                onPress={() => setAreaSelecionada(null)}
              >
                <Text style={styles.modalVoltarTexto}>‹ Voltar</Text>
              </TouchableOpacity>
              <Text style={styles.modalEmoji}>{areaSelecionada.emoji}</Text>
              <Text style={styles.modalTitulo}>{areaSelecionada.nome}</Text>
              <Text style={styles.modalSubtitulo}>{areaSelecionada.descricao}</Text>
            </View>

            {/* Abas */}
            <View style={styles.abas}>
              <TouchableOpacity
                style={[styles.aba, abaAtiva === 'formulas' && { borderBottomColor: areaSelecionada.cor, borderBottomWidth: 3 }]}
                onPress={() => setAbaAtiva('formulas')}
              >
                <Text style={[styles.abaTexto, abaAtiva === 'formulas' && { color: areaSelecionada.cor, fontWeight: '700' }]}>
                  📐 Fórmulas
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.aba, abaAtiva === 'dicas' && { borderBottomColor: areaSelecionada.cor, borderBottomWidth: 3 }]}
                onPress={() => setAbaAtiva('dicas')}
              >
                <Text style={[styles.abaTexto, abaAtiva === 'dicas' && { color: areaSelecionada.cor, fontWeight: '700' }]}>
                  💡 Dicas
                </Text>
              </TouchableOpacity>
            </View>

            {/* Conteúdo */}
            <ScrollView style={styles.modalConteudo} showsVerticalScrollIndicator={false}>
              {abaAtiva === 'formulas' ? (
                areaSelecionada.formulas.map((formula, index) => (
                  <View key={index} style={styles.formulaCard}>
                    <View style={[styles.formulaNomeBadge, { backgroundColor: areaSelecionada.corClara }]}>
                      <Text style={[styles.formulaNome, { color: areaSelecionada.cor }]}>{formula.nome}</Text>
                    </View>
                    <Text style={styles.formulaDescricao}>{formula.descricao}</Text>
                    <View style={styles.formulaSintaxeBox}>
                      <Text style={styles.formulaSintaxeLabel}>Sintaxe</Text>
                      <Text style={styles.formulaSintaxe}>{formula.sintaxe}</Text>
                    </View>
                    <View style={styles.formulaExemploBox}>
                      <Text style={styles.formulaExemploLabel}>Exemplo</Text>
                      <Text style={styles.formulaExemplo}>{formula.exemplo}</Text>
                    </View>
                  </View>
                ))
              ) : (
                areaSelecionada.dicas.map((dica, index) => (
                  <View key={index} style={styles.dicaCard}>
                    <View style={[styles.dicaIcone, { backgroundColor: areaSelecionada.corClara }]}>
                      <Text style={{ fontSize: 20 }}>💡</Text>
                    </View>
                    <View style={styles.dicaInfo}>
                      <Text style={[styles.dicaTitulo, { color: areaSelecionada.cor }]}>{dica.titulo}</Text>
                      <Text style={styles.dicaDescricao}>{dica.descricao}</Text>
                    </View>
                  </View>
                ))
              )}
              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  header: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitulo: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  headerSubtitulo: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },

  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buscaIcone: { fontSize: 16, marginRight: 8 },
  buscaInput: { flex: 1, fontSize: 15, color: '#333' },
  buscaLimpar: { fontSize: 16, color: '#999', paddingLeft: 8 },

  lista: { paddingHorizontal: 16, paddingBottom: 20 },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardEmoji: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardEmojiText: { fontSize: 24 },
  cardInfo: { flex: 1 },
  cardNome: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 3 },
  cardDescricao: { fontSize: 12, color: '#777', lineHeight: 17 },
  cardMeta: { alignItems: 'flex-end', marginLeft: 8 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 6 },
  badgeTexto: { fontSize: 11, fontWeight: '600' },
  cardSeta: { fontSize: 22, color: '#CCC' },

  vazio: { alignItems: 'center', marginTop: 60 },
  vazioTexto: { fontSize: 16, color: '#999' },

  // Modal
  modalContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  modalHeader: { padding: 20, paddingTop: 16, paddingBottom: 24 },
  modalVoltar: { marginBottom: 12 },
  modalVoltarTexto: { color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: '600' },
  modalEmoji: { fontSize: 40, marginBottom: 8 },
  modalTitulo: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  modalSubtitulo: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 6, lineHeight: 19 },

  abas: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  aba: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  abaTexto: { fontSize: 14, color: '#888', fontWeight: '500' },

  modalConteudo: { flex: 1, padding: 16 },

  formulaCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  formulaNomeBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  formulaNome: { fontSize: 14, fontWeight: '700' },
  formulaDescricao: { fontSize: 13, color: '#555', marginBottom: 12, lineHeight: 19 },
  formulaSintaxeBox: {
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  formulaSintaxeLabel: { fontSize: 10, color: '#888', marginBottom: 4, fontWeight: '600' },
  formulaSintaxe: { fontSize: 13, color: '#58CC02', fontFamily: 'monospace' },
  formulaExemploBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#DDD',
  },
  formulaExemploLabel: { fontSize: 10, color: '#999', marginBottom: 4, fontWeight: '600' },
  formulaExemplo: { fontSize: 13, color: '#444', fontFamily: 'monospace' },

  dicaCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  dicaIcone: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  dicaInfo: { flex: 1 },
  dicaTitulo: { fontSize: 15, fontWeight: '700', marginBottom: 5 },
  dicaDescricao: { fontSize: 13, color: '#666', lineHeight: 19 },
});

export default WikiExcelScreen;
