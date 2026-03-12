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
  Dimensions,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { usePremium } from '../../hooks/usePremium';
import PaywallModal from '../../components/PaywallModal';
import { theme } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const WIKI_IMAGES: Record<string, any> = {
  financeiro: require('../../../assets/mascots/Wiki/excelino_financa.png'),
  administrativo: require('../../../assets/mascots/Wiki/excelino_adm.png'),
  rh: require('../../../assets/mascots/Wiki/excelino_rh.png'),
  vendas: require('../../../assets/mascots/Wiki/excelino_comercial.png'),
  logistica: require('../../../assets/mascots/Wiki/excelino_logistica.png'),
  empreendedores: require('../../../assets/mascots/Wiki/excelino_empreendedor.png'),
  contabilidade: require('../../../assets/mascots/Wiki/excelino_contador.png'),
  educacao: require('../../../assets/mascots/Wiki/excelino_professor.png'),
  marketing: require('../../../assets/mascots/Wiki/excelino_marketing.png'),
  engenharia: require('../../../assets/mascots/Wiki/excelino_engenharia.png'),
};

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

interface Video {
  id: string;
  titulo: string;
  url: string;
  emoji: string;
}

// ─── VÍDEOS ──────────────────────────────────────────────────────────────────
const VIDEOS: Video[] = [
  { id: '1', titulo: 'Como destacar o maior valor no gráfico', url: 'https://www.instagram.com/p/DOb4sPqETqX/', emoji: '📊' },
  { id: '2', titulo: 'Como criar barra de progresso', url: 'https://www.instagram.com/p/DMfk90IsF32/', emoji: '📶' },
  { id: '3', titulo: 'Como formatar data por extenso', url: 'https://www.instagram.com/p/DUWSx6GEc9b/', emoji: '📅' },
  { id: '4', titulo: 'Como incluir formatação na tabela', url: 'https://www.instagram.com/p/DURIPUAEYlV/', emoji: '🎨' },
  { id: '5', titulo: 'Como criar gráfico de Meta vs Real', url: 'https://www.instagram.com/p/DUJG5b2EeYO/', emoji: '🎯' },
  { id: '6', titulo: 'Como criar planilha de acompanhamento de projeto', url: 'https://www.instagram.com/p/DUGXU-xEY-s/', emoji: '📋' },
  { id: '7', titulo: 'Como criar validação de dados condicional', url: 'https://www.instagram.com/p/DUEHtlpEV5J/', emoji: '✅' },
  { id: '8', titulo: 'Como adicionar calendário na planilha', url: 'https://www.instagram.com/p/DT00rj6EQP4/', emoji: '🗓️' },
  { id: '9', titulo: 'Como criar árvore hierárquica', url: 'https://www.instagram.com/p/DTx3iwXEWVs/', emoji: '🌳' },
  { id: '10', titulo: 'Como fazer agendamentos no Outlook', url: 'https://www.instagram.com/p/DTOSdUbkX6j/', emoji: '📧' },
  { id: '11', titulo: 'Como criar gráfico de evolução %', url: 'https://www.instagram.com/p/DTLz-4nkS6x/', emoji: '📈' },
  { id: '12', titulo: 'Como criar barra de pesquisa', url: 'https://www.instagram.com/p/DS5M8s1kRs4/', emoji: '🔍' },
  { id: '13', titulo: 'Como fazer lista de tarefas com checkbox', url: 'https://www.instagram.com/p/DS2bdAHkWet/', emoji: '☑️' },
  { id: '14', titulo: 'Como destacar positivo e negativo no gráfico', url: 'https://www.instagram.com/p/DS0GxNckYJE/', emoji: '↕️' },
  { id: '15', titulo: 'Como redimensionar colunas automaticamente', url: 'https://www.instagram.com/p/DSyMJt9EdcW/', emoji: '↔️' },
  { id: '16', titulo: 'Como criar um calendário', url: 'https://www.instagram.com/p/DSkj2bokQhj/', emoji: '📆' },
  { id: '17', titulo: 'Como conectar Google Sheets com Excel', url: 'https://www.instagram.com/p/DQZYEP3kYgm/', emoji: '🔗' },
  { id: '18', titulo: 'Como criar código de barras', url: 'https://www.instagram.com/p/DNCHnZTMA8B/', emoji: '▦' },
  { id: '19', titulo: 'Como inserir Logos automaticamente', url: 'https://www.instagram.com/p/DLnqCjBSTKC/', emoji: '🖼️' },
  { id: '20', titulo: 'Como unificar várias abas', url: 'https://www.instagram.com/p/DSbLrWFkQ5i/', emoji: '📑' },
];

// ─── ÁREAS ───────────────────────────────────────────────────────────────────
const AREAS: Area[] = [
  {
    id: 'financeiro',
    nome: 'Financeiro',
    emoji: '💰',
    cor: theme.colors.primary,
    corClara: theme.colors.primaryLight,
    descricao: 'Fórmulas essenciais para análise financeira, fluxo de caixa e investimentos.',
    formulas: [
      { nome: 'VPL', sintaxe: '=VPL(taxa; valor1; [valor2]; ...)', descricao: 'Calcula o Valor Presente Líquido de um investimento.', exemplo: '=VPL(0,1; -1000; 400; 500; 600)' },
      { nome: 'TIR', sintaxe: '=TIR(valores; [estimativa])', descricao: 'Calcula a Taxa Interna de Retorno de um fluxo de caixa.', exemplo: '=TIR(A1:A5)' },
      { nome: 'PGTO', sintaxe: '=PGTO(taxa; nper; vp)', descricao: 'Calcula o pagamento periódico de um empréstimo.', exemplo: '=PGTO(0,01; 36; 10000)' },
      { nome: 'SOMASE', sintaxe: '=SOMASE(intervalo; critério; soma_intervalo)', descricao: 'Soma valores que atendem a um critério específico.', exemplo: '=SOMASE(A2:A10; "Receita"; B2:B10)' },
      { nome: 'PROCV', sintaxe: '=PROCV(valor; tabela; col; [exato])', descricao: 'Busca um valor em uma tabela e retorna dado correspondente.', exemplo: '=PROCV(A2; Tabela!A:C; 3; 0)' },
      { nome: 'TAXA', sintaxe: '=TAXA(nper; pgto; vp)', descricao: 'Calcula a taxa de juros por período de um investimento.', exemplo: '=TAXA(12; -500; 5000)' },
      { nome: 'IPGTO', sintaxe: '=IPGTO(taxa; período; nper; vp)', descricao: 'Retorna a parte de juros de uma parcela de financiamento.', exemplo: '=IPGTO(0,01; 1; 36; 10000)' },
      { nome: 'PPGTO', sintaxe: '=PPGTO(taxa; período; nper; vp)', descricao: 'Retorna a parte de amortização de cada parcela.', exemplo: '=PPGTO(0,01; 1; 36; 10000)' },
      { nome: 'XVPL', sintaxe: '=XVPL(taxa; valores; datas)', descricao: 'Calcula o VPL com fluxos de caixa em datas irregulares.', exemplo: '=XVPL(0,12; B2:B10; A2:A10)' },
      { nome: 'TENDÊNCIA', sintaxe: '=TENDÊNCIA(y_conhecido; x_conhecido; x_novo)', descricao: 'Projeta valores futuros usando regressão linear nos dados históricos.', exemplo: '=TENDÊNCIA(B2:B12; A2:A12; A13:A15)' },
    ],
    dicas: [
      { titulo: 'Formate como moeda', descricao: 'Use Ctrl+1 para abrir formatação e escolha "Moeda" para exibir R$ automaticamente em todas as células.' },
      { titulo: 'Tabela de amortização', descricao: 'Combine PGTO, IPGTO e PPGTO para montar uma tabela de amortização completa e visualizar o saldo devedor mês a mês.' },
      { titulo: 'Gráfico de fluxo de caixa', descricao: 'Use o gráfico de cascata (waterfall) para visualizar entradas, saídas e saldo acumulado de forma clara.' },
      { titulo: 'Proteja fórmulas financeiras', descricao: 'Bloqueie células com fórmulas via Revisão > Proteger Planilha para evitar alterações acidentais.' },
      { titulo: 'Nomeie intervalos', descricao: 'Nomeie células-chave como "TaxaMensal" ou "PrazoMeses" para deixar as fórmulas mais legíveis e fáceis de auditar.' },
      { titulo: 'Use Tabela Dinâmica para DRE', descricao: 'Importe lançamentos e crie um DRE automático agrupando por categoria com Tabela Dinâmica.' },
      { titulo: 'Cenários financeiros', descricao: 'Use Dados > Gerenciador de Cenários para simular otimista, realista e pessimista no mesmo arquivo com um clique.' },
      { titulo: 'Negativos em vermelho', descricao: 'Aplique o formato personalizado: R$ #.##0,00;[Vermelho]-R$ #.##0,00 para destacar valores negativos automaticamente.' },
      { titulo: 'Congelar linha de títulos', descricao: 'Use Exibir > Congelar Painéis para manter o cabeçalho visível ao rolar planilhas com muitas linhas.' },
      { titulo: 'Atalho para soma rápida', descricao: 'Selecione um intervalo e pressione Alt+= para inserir a função SOMA automaticamente sem digitar nada.' },
    ],
  },
  {
    id: 'administrativo',
    nome: 'Administrativo',
    emoji: '🏢',
    cor: theme.colors.primaryMid,
    corClara: theme.colors.primaryLight,
    descricao: 'Organize processos, controle tarefas e gerencie informações administrativas.',
    formulas: [
      { nome: 'CONT.SE', sintaxe: '=CONT.SE(intervalo; critério)', descricao: 'Conta células que atendem a um critério específico.', exemplo: '=CONT.SE(B2:B100; "Pendente")' },
      { nome: 'HOJE', sintaxe: '=HOJE()', descricao: 'Retorna a data atual e se atualiza automaticamente a cada abertura.', exemplo: '=HOJE()' },
      { nome: 'DATEDIF', sintaxe: '=DATEDIF(data_inicial; data_final; unidade)', descricao: 'Calcula a diferença entre duas datas em dias, meses ou anos.', exemplo: '=DATEDIF(A2; HOJE(); "D")' },
      { nome: 'SE', sintaxe: '=SE(teste; valor_verdadeiro; valor_falso)', descricao: 'Retorna valores diferentes baseado em uma condição lógica.', exemplo: '=SE(C2>90%; "Aprovado"; "Reprovado")' },
      { nome: 'CONCATENAR', sintaxe: '=CONCATENAR(texto1; texto2; ...)', descricao: 'Une textos de várias células em uma só — use & como atalho.', exemplo: '=CONCATENAR(A2; " "; B2)' },
      { nome: 'MAIÚSCULA', sintaxe: '=MAIÚSCULA(texto)', descricao: 'Converte todo o texto para letras maiúsculas.', exemplo: '=MAIÚSCULA(A2)' },
      { nome: 'PRI.MAIÚSCULA', sintaxe: '=PRI.MAIÚSCULA(texto)', descricao: 'Capitaliza a primeira letra de cada palavra do texto.', exemplo: '=PRI.MAIÚSCULA(A2)' },
      { nome: 'ARRUMAR', sintaxe: '=ARRUMAR(texto)', descricao: 'Remove espaços extras no início, fim e entre palavras.', exemplo: '=ARRUMAR(A2)' },
      { nome: 'NÚMSEMANA', sintaxe: '=NÚMSEMANA(data; [tipo])', descricao: 'Retorna o número da semana no ano para organizar relatórios semanais.', exemplo: '=NÚMSEMANA(HOJE(); 2)' },
      { nome: 'DIATRABALHOTOTAL', sintaxe: '=DIATRABALHOTOTAL(início; fim; [feriados])', descricao: 'Conta os dias úteis entre duas datas, excluindo fins de semana e feriados.', exemplo: '=DIATRABALHOTOTAL(A2; B2; Feriados!A:A)' },
    ],
    dicas: [
      { titulo: 'Validação de dados', descricao: 'Use Dados > Validação para criar listas suspensas e evitar erros de digitação nos campos de formulários.' },
      { titulo: 'Formatação condicional', descricao: 'Destaque automaticamente tarefas atrasadas com formatação condicional baseada na data de vencimento.' },
      { titulo: 'Proteja a planilha', descricao: 'Use Revisão > Proteger Planilha para evitar alterações acidentais em dados e estruturas críticas.' },
      { titulo: 'Hiperlinks internos', descricao: 'Crie um índice com hiperlinks para navegar entre abas: Inserir > Link > Inserir neste documento.' },
      { titulo: 'Comentários nas células', descricao: 'Use Shift+F2 para adicionar notas explicativas sem poluir visualmente a planilha.' },
      { titulo: 'Atalho para filtro', descricao: 'Pressione Ctrl+Shift+L para ativar ou desativar filtros rapidamente em qualquer tabela de dados.' },
      { titulo: 'Localizar e substituir em massa', descricao: 'Use Ctrl+H para substituir textos em toda a planilha de uma vez — economiza horas de edição manual.' },
      { titulo: 'Colar especial', descricao: 'Use Ctrl+Alt+V para colar apenas valores, sem trazer fórmulas ou formatação indesejada de outras planilhas.' },
      { titulo: 'Agrupe linhas e colunas', descricao: 'Use Dados > Agrupar para criar seções recolhíveis e deixar a planilha mais organizada e fácil de navegar.' },
      { titulo: 'Tabela formatada com Ctrl+T', descricao: 'Pressione Ctrl+T para converter um intervalo em tabela e ganhar filtros automáticos, estilos e expansão dinâmica.' },
    ],
  },
  {
    id: 'rh',
    nome: 'RH',
    emoji: '👥',
    cor: theme.colors.primary,
    corClara: theme.colors.primaryLight,
    descricao: 'Gestão de pessoas, folha de pagamento, férias e indicadores de RH.',
    formulas: [
      { nome: 'FIMMÊS', sintaxe: '=FIMMÊS(data_inicial; meses)', descricao: 'Retorna o último dia do mês — útil para vencimento de contratos.', exemplo: '=FIMMÊS(A2; 0)' },
      { nome: 'DIATRABALHOTOTAL', sintaxe: '=DIATRABALHOTOTAL(início; fim; [feriados])', descricao: 'Conta os dias úteis — essencial para cálculo de férias e prazo de aviso.', exemplo: '=DIATRABALHOTOTAL(A2; B2; Feriados!A:A)' },
      { nome: 'MÉDIA', sintaxe: '=MÉDIA(número1; [número2]; ...)', descricao: 'Calcula a média salarial ou de avaliações de desempenho.', exemplo: '=MÉDIA(C2:C50)' },
      { nome: 'ÍNDICE + CORRESP', sintaxe: '=ÍNDICE(col_retorno; CORRESP(valor; col_busca; 0))', descricao: 'Busca avançada — encontra dados de colaboradores em qualquer direção.', exemplo: '=ÍNDICE(C2:C100; CORRESP(A2; A2:A100; 0))' },
      { nome: 'CONT.SES', sintaxe: '=CONT.SES(intervalo1; critério1; intervalo2; critério2)', descricao: 'Conta colaboradores com múltiplos critérios como departamento e status.', exemplo: '=CONT.SES(A2:A100; "RH"; B2:B100; "Ativo")' },
      { nome: 'SOMASES', sintaxe: '=SOMASES(soma; intervalo1; critério1; ...)', descricao: 'Soma folha de pagamento filtrando por departamento e tipo de vínculo.', exemplo: '=SOMASES(C2:C100; A2:A100; "Vendas"; B2:B100; "CLT")' },
      { nome: 'INT (anos de empresa)', sintaxe: '=INT(DATEDIF(A2;HOJE();"D")/365)', descricao: 'Calcula os anos completos de empresa para calcular benefícios.', exemplo: '=INT(DATEDIF(A2;HOJE();"D")/365)' },
      { nome: 'MÁXIMO', sintaxe: '=MÁXIMO(número1; [número2]; ...)', descricao: 'Retorna o maior salário ou avaliação do intervalo selecionado.', exemplo: '=MÁXIMO(D2:D100)' },
      { nome: 'MÍNIMO', sintaxe: '=MÍNIMO(número1; [número2]; ...)', descricao: 'Retorna o menor valor — útil para identificar o menor salário da faixa.', exemplo: '=MÍNIMO(D2:D100)' },
      { nome: 'DESVPAD', sintaxe: '=DESVPAD(número1; [número2]; ...)', descricao: 'Calcula o desvio padrão salarial para análise de equidade de remuneração.', exemplo: '=DESVPAD(D2:D100)' },
    ],
    dicas: [
      { titulo: 'Controle de férias', descricao: 'Use DIATRABALHOTOTAL para calcular automaticamente os dias de férias disponíveis por colaborador, descontando feriados.' },
      { titulo: 'Dashboard de RH', descricao: 'Crie gráficos de pizza para visualizar distribuição de cargos, faixas etárias e tempo de empresa.' },
      { titulo: 'Tabela dinâmica de headcount', descricao: 'Cruce dados de headcount por departamento, cargo e período para relatórios de gestão de pessoas.' },
      { titulo: 'Alerta de vencimento de contrato', descricao: 'Use SE + HOJE para destacar automaticamente contratos que vencem nos próximos 30 dias.' },
      { titulo: 'Cálculo de horas extras', descricao: 'Formate células de hora como [h]:mm para somar mais de 24 horas sem erro no cálculo de banco de horas.' },
      { titulo: 'Organograma com SmartArt', descricao: 'Use Inserir > SmartArt > Hierarquia para criar organogramas visuais e profissionais diretamente no Excel.' },
      { titulo: 'Indicadores de turnover', descricao: 'Calcule com: (admissões + demissões) / 2 / total de funcionários × 100 para monitorar a rotatividade.' },
      { titulo: 'Classificação de cargos', descricao: 'Use SE aninhado para classificar automaticamente: Júnior, Pleno e Sênior com base na faixa salarial.' },
      { titulo: 'Banco de horas', descricao: 'Crie uma planilha com entrada, saída, horas trabalhadas e saldo acumulado formatando tudo como [h]:mm.' },
      { titulo: 'Proteção de dados sensíveis', descricao: 'Proteja abas com salários e dados pessoais via Revisão > Proteger Planilha > definir senha de acesso.' },
    ],
  },
  {
    id: 'vendas',
    nome: 'Comercial / Vendas',
    emoji: '📈',
    cor: theme.colors.primaryMid,
    corClara: theme.colors.primaryLight,
    descricao: 'Acompanhe metas, comissões, pipeline e desempenho da equipe comercial.',
    formulas: [
      { nome: 'SOMASES', sintaxe: '=SOMASES(soma_intervalo; intervalo1; critério1; ...)', descricao: 'Soma vendas filtrando por vendedor, produto e período simultaneamente.', exemplo: '=SOMASES(C2:C100; A2:A100; "João"; B2:B100; "Jan")' },
      { nome: 'CONT.SES', sintaxe: '=CONT.SES(intervalo1; critério1; ...)', descricao: 'Conta negócios fechados com múltiplos filtros ao mesmo tempo.', exemplo: '=CONT.SES(A2:A100; "Fechado"; B2:B100; ">1000")' },
      { nome: 'MAIOR', sintaxe: '=MAIOR(intervalo; k)', descricao: 'Retorna o k-ésimo maior valor — ideal para construir rankings de vendedores.', exemplo: '=MAIOR(B2:B50; 1)' },
      { nome: 'ORDEM', sintaxe: '=ORDEM(valor; intervalo; ordem)', descricao: 'Classifica o vendedor no ranking de forma automática e dinâmica.', exemplo: '=ORDEM(C2; C$2:C$20; 0)' },
      { nome: 'CRESCIMENTO', sintaxe: '=CRESCIMENTO(y_conhecido; x_conhecido; x_novo)', descricao: 'Projeta crescimento exponencial de vendas para os próximos meses.', exemplo: '=CRESCIMENTO(B2:B12; A2:A12; A13)' },
      { nome: 'SOMARPRODUTO', sintaxe: '=SOMARPRODUTO(quantidade; preço)', descricao: 'Multiplica quantidade por preço e soma — calcula o faturamento total.', exemplo: '=SOMARPRODUTO(B2:B10; C2:C10)' },
      { nome: '% META', sintaxe: '=realizado/meta', descricao: 'Calcula o percentual de atingimento de meta — formate a célula como %.', exemplo: '=C2/D2' },
      { nome: 'PREVISÃO.LINEAR', sintaxe: '=PREVISÃO.LINEAR(x; y_conhecido; x_conhecido)', descricao: 'Projeta vendas futuras com base na tendência dos dados históricos.', exemplo: '=PREVISÃO.LINEAR(13; B2:B12; A2:A12)' },
      { nome: 'ÍNDICE + CORRESP', sintaxe: '=ÍNDICE(nomes; CORRESP(MÁXIMO(vendas); vendas; 0))', descricao: 'Retorna automaticamente o nome do melhor vendedor do período.', exemplo: '=ÍNDICE(A2:A20; CORRESP(MÁXIMO(C2:C20); C2:C20; 0))' },
      { nome: 'SE + E (comissão especial)', sintaxe: '=SE(E(C2>=meta; D2>=90%); C2*0,1; C2*0,05)', descricao: 'Calcula comissão diferenciada quando múltiplas metas são atingidas juntas.', exemplo: '=SE(E(C2>=meta; D2>=90%); C2*0,1; C2*0,05)' },
    ],
    dicas: [
      { titulo: 'Funil de vendas visual', descricao: 'Crie um funil com gráfico de barras invertido: barra transparente para offset + barra colorida com a quantidade em cada etapa.' },
      { titulo: 'Semáforo de meta', descricao: 'Formatação condicional: vermelho <80%, amarelo entre 80% e 99%, verde ≥100% para visualizar atingimento de relance.' },
      { titulo: 'Ranking automático', descricao: 'Use MAIOR e ÍNDICE+CORRESP para criar um ranking que se atualiza automaticamente ao inserir novos resultados.' },
      { titulo: 'Dashboard com segmentação', descricao: 'Combine Tabela Dinâmica + Segmentação de Dados para criar filtros interativos por período, produto e vendedor.' },
      { titulo: 'Ticket médio', descricao: 'Calcule com =faturamento_total/quantidade_de_pedidos e acompanhe a evolução mês a mês em um gráfico de linha.' },
      { titulo: 'Taxa de conversão por vendedor', descricao: 'Divida negócios fechados por leads recebidos para cada vendedor e identifique quem converte melhor.' },
      { titulo: 'Previsão de fechamento', descricao: 'Use PREVISÃO.LINEAR com dados históricos para estimar o faturamento até o fim do mês corrente.' },
      { titulo: 'Comissão escalonada', descricao: 'Use SE aninhado: até 80% da meta = 3%, até 100% = 5%, acima de 100% = 8% sobre o total vendido.' },
      { titulo: 'Mapa de calor de vendas', descricao: 'Aplique formatação condicional com escala de cores para identificar os melhores dias da semana e produtos.' },
      { titulo: 'Gráfico Meta vs Realizado', descricao: 'Plote meta como linha e realizado como barra no mesmo gráfico combinado para visualização instantânea.' },
    ],
  },
  {
    id: 'logistica',
    nome: 'Logística / Estoque',
    emoji: '📦',
    cor: theme.colors.primary,
    corClara: theme.colors.primaryLight,
    descricao: 'Controle de estoque, prazos de entrega e gestão da cadeia de suprimentos.',
    formulas: [
      { nome: 'MÍNIMO', sintaxe: '=MÍNIMO(número1; [número2]; ...)', descricao: 'Retorna o menor valor — ideal para controlar o estoque mínimo de segurança.', exemplo: '=MÍNIMO(B2:B100)' },
      { nome: 'SE + E (reposição)', sintaxe: '=SE(E(B2<10; C2="Ativo"); "Repor"; "OK")', descricao: 'Verifica se o estoque está abaixo do mínimo e o item está ativo.', exemplo: '=SE(E(B2<10; C2="Ativo"); "Repor"; "OK")' },
      { nome: 'ARRED', sintaxe: '=ARRED(número; num_dígitos)', descricao: 'Arredonda quantidades para o inteiro mais próximo em pedidos de compra.', exemplo: '=ARRED(A2*1,1; 0)' },
      { nome: 'DIAS', sintaxe: '=DIAS(data_final; data_inicial)', descricao: 'Calcula dias entre datas — fundamental para controlar prazo de entrega.', exemplo: '=DIAS(B2; HOJE())' },
      { nome: 'ÚNICO', sintaxe: '=ÚNICO(intervalo)', descricao: 'Retorna valores únicos da lista de produtos sem duplicatas (Excel 365).', exemplo: '=ÚNICO(A2:A100)' },
      { nome: 'CONT.VALORES', sintaxe: '=CONT.VALORES(intervalo)', descricao: 'Conta células não vazias — útil para contar total de SKUs ativos no catálogo.', exemplo: '=CONT.VALORES(A2:A500)' },
      { nome: 'SOMARPRODUTO (valor estoque)', sintaxe: '=SOMARPRODUTO(quantidade; custo_unitário)', descricao: 'Calcula o valor total do estoque multiplicando quantidade por custo.', exemplo: '=SOMARPRODUTO(B2:B100; C2:C100)' },
      { nome: 'DIATRABALHO', sintaxe: '=DIATRABALHO(data_inicial; dias; [feriados])', descricao: 'Calcula a data prevista de entrega somando dias úteis ao pedido.', exemplo: '=DIATRABALHO(HOJE(); 5; Feriados!A:A)' },
      { nome: 'PROCX', sintaxe: '=PROCX(valor; matriz_busca; matriz_retorno)', descricao: 'Versão moderna do PROCV — busca em qualquer direção sem índice de coluna (Excel 365).', exemplo: '=PROCX(A2; Produtos!A:A; Produtos!C:C)' },
      { nome: 'CLASSIFICAR', sintaxe: '=CLASSIFICAR(intervalo; [índice]; [ordem])', descricao: 'Ordena dinamicamente a lista de produtos por estoque ou valor sem usar filtros manuais.', exemplo: '=CLASSIFICAR(A2:C100; 2; -1)' },
    ],
    dicas: [
      { titulo: 'Alerta de estoque mínimo', descricao: 'Use formatação condicional para pintar automaticamente em vermelho os produtos abaixo do estoque mínimo.' },
      { titulo: 'Código de barras no Excel', descricao: 'Instale a fonte "Code 39" gratuitamente e formate a célula com ela para exibir códigos de barras funcionais.' },
      { titulo: 'Giro de estoque', descricao: 'Calcule com: CMV / estoque médio para identificar produtos parados que estão consumindo capital de giro.' },
      { titulo: 'Curva ABC de produtos', descricao: 'Ordene por valor decrescente, calcule % acumulado e classifique: A=80%, B=15%, C=5% do faturamento.' },
      { titulo: 'Ponto de reposição', descricao: 'Calcule com: consumo_médio_diário × lead_time + estoque_segurança para nunca ficar sem o produto.' },
      { titulo: 'Dashboard de estoque', descricao: 'Mostre em uma tela: total em estoque, itens críticos, valor total, giro médio e os 10 produtos mais movimentados.' },
      { titulo: 'Congelar primeira coluna', descricao: 'Use Exibir > Congelar Painéis > Congelar Primeira Coluna para manter o código do produto visível ao rolar.' },
      { titulo: 'Validação de entrada numérica', descricao: 'Use Dados > Validação > Número inteiro para garantir que quantidades negativas não sejam inseridas por engano.' },
      { titulo: 'Tabela dinâmica por fornecedor', descricao: 'Agrupe compras por fornecedor com Tabela Dinâmica para negociar volumes, prazos e condições melhores.' },
      { titulo: 'Histórico de movimentações', descricao: 'Mantenha uma aba com entradas e saídas por data e use SOMASE por produto para calcular o estoque atual.' },
    ],
  },
  {
    id: 'empreendedores',
    nome: 'Empreendedores',
    emoji: '🚀',
    cor: theme.colors.primaryMid,
    corClara: theme.colors.primaryLight,
    descricao: 'Ferramentas para startups, precificação, DRE simplificado e análise de viabilidade.',
    formulas: [
      { nome: 'TAXA', sintaxe: '=TAXA(nper; pgto; vp)', descricao: 'Calcula a taxa de juros de um financiamento ou investimento mensal.', exemplo: '=TAXA(12; -200; 2000)' },
      { nome: 'SOMARPRODUTO (faturamento)', sintaxe: '=SOMARPRODUTO(quantidade; preço)', descricao: 'Calcula o faturamento total multiplicando quantidade por preço de cada produto.', exemplo: '=SOMARPRODUTO(B2:B10; C2:C10)' },
      { nome: 'SE aninhado', sintaxe: '=SE(A2>100000;"Grande";SE(A2>10000;"Médio";"Pequeno"))', descricao: 'Classifica clientes ou produtos automaticamente por faixa de valor.', exemplo: '=SE(A2>100000;"Grande";SE(A2>10000;"Médio";"Pequeno"))' },
      { nome: 'SEERRO', sintaxe: '=SEERRO(fórmula; valor_alternativo)', descricao: 'Evita erros visíveis como #DIV/0! substituindo por zero ou texto.', exemplo: '=SEERRO(A2/B2; 0)' },
      { nome: 'VPL (viabilidade)', sintaxe: '=VPL(taxa; -investimento; fluxo1; fluxo2; ...)', descricao: 'Avalia se o negócio é financeiramente viável antes de investir.', exemplo: '=VPL(0,15; -50000; 15000; 20000; 25000)' },
      { nome: 'PONTO DE EQUILÍBRIO', sintaxe: '=custos_fixos/(preço_venda - custo_variável)', descricao: 'Calcula quantas unidades precisam ser vendidas para cobrir todos os custos.', exemplo: '=B2/(C2-D2)' },
      { nome: 'MARGEM DE CONTRIBUIÇÃO', sintaxe: '=(preço - custo_variável)/preço', descricao: 'Percentual que cada venda contribui para cobrir os custos fixos do negócio.', exemplo: '=(C2-D2)/C2' },
      { nome: 'PAYBACK', sintaxe: '=investimento/lucro_médio_mensal', descricao: 'Calcula em quantos meses o investimento inicial se paga completamente.', exemplo: '=A2/MÉDIA(B2:B13)' },
      { nome: 'CAC', sintaxe: '=total_investido_marketing/clientes_adquiridos', descricao: 'Custo de Aquisição por Cliente — quanto custa trazer cada novo cliente.', exemplo: '=C2/D2' },
      { nome: 'LTV', sintaxe: '=ticket_médio × frequência × tempo_retenção', descricao: 'Valor do cliente ao longo de todo o seu tempo de relacionamento com a empresa.', exemplo: '=B2*C2*D2' },
    ],
    dicas: [
      { titulo: 'DRE simplificado', descricao: 'Monte: Receita Bruta → (-) Impostos → Receita Líquida → (-) CMV → Lucro Bruto → (-) Despesas → Lucro Líquido.' },
      { titulo: 'Ponto de equilíbrio visual', descricao: 'Crie um gráfico de linhas com Receita Total e Custo Total — o ponto de cruzamento é o break-even.' },
      { titulo: 'Cenários de crescimento', descricao: 'Use Dados > Gerenciador de Cenários para simular crescimento de 10%, 20% e 30% e apresentar ao investidor.' },
      { titulo: 'Precificação com markup', descricao: 'Calcule o preço de venda com: custo / (1 - margem_desejada) para garantir a lucratividade de cada produto.' },
      { titulo: 'Projeção de 12 meses', descricao: 'Use TENDÊNCIA ou CRESCIMENTO nos dados históricos para projetar receita e despesa nos próximos meses.' },
      { titulo: 'Análise de sensibilidade', descricao: 'Use Dados > Tabela de Dados para ver como o lucro muda ao variar simultaneamente o preço e o volume.' },
      { titulo: 'Controle de inadimplência', descricao: 'Calcule a taxa com: valor_inadimplente / faturamento_total e acompanhe mensalmente para agir rápido.' },
      { titulo: 'Margem por produto', descricao: 'Calcule a margem de contribuição de cada produto para focar os esforços nos mais rentáveis do portfólio.' },
      { titulo: 'Meta de faturamento reversa', descricao: 'Defina o lucro desejado e use Atingir Meta (Dados > Teste de Hipóteses) para descobrir o faturamento necessário.' },
      { titulo: 'Dashboard do negócio', descricao: 'Crie cards com: faturamento, margem, CAC, LTV, churn e NPS para ter a saúde do negócio em uma tela.' },
    ],
  },
  {
    id: 'contabilidade',
    nome: 'Contabilidade',
    emoji: '📊',
    cor: theme.colors.primary,
    corClara: theme.colors.primaryLight,
    descricao: 'Lançamentos contábeis, conciliação bancária e relatórios financeiros.',
    formulas: [
      { nome: 'SOMASE (D/C)', sintaxe: '=SOMASE(tipo; "Débito"; valor)', descricao: 'Soma separadamente débitos e créditos por natureza do lançamento.', exemplo: '=SOMASE(A2:A100; "Débito"; C2:C100)' },
      { nome: 'ABS', sintaxe: '=ABS(número)', descricao: 'Retorna o valor absoluto — imprescindível para identificar divergências em conciliações.', exemplo: '=ABS(A2-B2)' },
      { nome: 'ARREDONDAR.PARA.CIMA', sintaxe: '=ARREDONDAR.PARA.CIMA(número; dígitos)', descricao: 'Arredonda sempre para cima — regra obrigatória em cálculo de impostos.', exemplo: '=ARREDONDAR.PARA.CIMA(A2*0,12; 2)' },
      { nome: 'TEXTO (formato data)', sintaxe: '=TEXTO(valor; "DD/MM/AAAA")', descricao: 'Formata datas e números como texto com máscara específica para relatórios.', exemplo: '=TEXTO(A2; "DD/MM/AAAA")' },
      { nome: 'BDSOMA', sintaxe: '=BDSOMA(banco_dados; campo; critérios)', descricao: 'Soma registros de um banco de lançamentos com critérios avançados em tabela.', exemplo: '=BDSOMA(A1:D100; "Valor"; F1:F2)' },
      { nome: 'PROCV (conciliação)', sintaxe: '=PROCV(valor; tabela; col; 0)', descricao: 'Cruza lançamentos internos com extrato bancário para localizar divergências.', exemplo: '=PROCV(A2; Extrato!A:C; 3; 0)' },
      { nome: 'SEERRO', sintaxe: '=SEERRO(fórmula; "Não encontrado")', descricao: 'Sinaliza lançamentos sem correspondência na conciliação bancária.', exemplo: '=SEERRO(PROCV(A2;B:C;2;0); "Divergente")' },
      { nome: 'CONT.SE (por tipo)', sintaxe: '=CONT.SE(intervalo; critério)', descricao: 'Conta lançamentos por tipo, conta contábil ou centro de custo.', exemplo: '=CONT.SE(B2:B1000; "Receita")' },
      { nome: 'SOMASES (centro de custo)', sintaxe: '=SOMASES(valor; conta; "X"; mês; "Jan")', descricao: 'Totaliza despesas filtrando por conta contábil e período simultaneamente.', exemplo: '=SOMASES(C2:C1000; A2:A1000; "Despesa"; B2:B1000; "Jan")' },
      { nome: 'MÉDIASE', sintaxe: '=MÉDIASE(intervalo; critério; média_intervalo)', descricao: 'Calcula o ticket médio dos lançamentos por categoria ou conta.', exemplo: '=MÉDIASE(A2:A100; "Receita"; C2:C100)' },
    ],
    dicas: [
      { titulo: 'Conciliação bancária eficiente', descricao: 'Use PROCV para cruzar extrato bancário com lançamentos internos e SEERRO para marcar os itens divergentes.' },
      { titulo: 'Balancete com Tabela Dinâmica', descricao: 'Agrupe lançamentos por conta contábil na Tabela Dinâmica para gerar o balancete com um único clique.' },
      { titulo: 'Auditoria com Ctrl+`', descricao: 'Pressione Ctrl+` para alternar entre exibir valores e fórmulas e revisar toda a lógica dos cálculos.' },
      { titulo: 'Rastrear precedentes', descricao: 'Em Fórmulas > Rastrear Precedentes, visualize graficamente quais células alimentam cada cálculo contábil.' },
      { titulo: 'Formato contábil de negativos', descricao: 'Use o formato #.##0,00;(#.##0,00) para exibir valores negativos entre parênteses, seguindo o padrão contábil.' },
      { titulo: 'Proteger lançamentos conciliados', descricao: 'Bloqueie as linhas já conciliadas para evitar alterações retroativas que desequilibram o balancete.' },
      { titulo: 'Planilha de lançamentos centralizada', descricao: 'Mantenha uma aba única com colunas: data, conta débito, conta crédito, histórico e valor para todos os lançamentos.' },
      { titulo: 'Validação do plano de contas', descricao: 'Use Dados > Validação com lista suspensa do plano de contas para garantir que só contas válidas sejam usadas.' },
      { titulo: 'DRE com Tabela Dinâmica', descricao: 'Agrupe contas por grupo (Receitas, Custos, Despesas) na Tabela Dinâmica para gerar o DRE automaticamente.' },
      { titulo: 'Comparativo de períodos', descricao: 'Adicione uma coluna de variação percentual entre meses para destacar aumentos ou quedas relevantes nas contas.' },
    ],
  },
  {
    id: 'educacao',
    nome: 'Educação',
    emoji: '🎓',
    cor: theme.colors.primaryMid,
    corClara: theme.colors.primaryLight,
    descricao: 'Controle de notas, frequência, boletins e relatórios pedagógicos.',
    formulas: [
      { nome: 'MÉDIA', sintaxe: '=MÉDIA(número1; número2; ...)', descricao: 'Calcula a média aritmética das notas do aluno no período letivo.', exemplo: '=MÉDIA(B2:E2)' },
      { nome: 'SE (situação)', sintaxe: '=SE(MÉDIA(B2:E2)>=7; "Aprovado"; "Reprovado")', descricao: 'Define automaticamente a situação do aluno com base na média calculada.', exemplo: '=SE(MÉDIA(B2:E2)>=7; "Aprovado"; "Reprovado")' },
      { nome: 'CONT.SE (presenças)', sintaxe: '=CONT.SE(intervalo; "P")', descricao: 'Conta todas as presenças marcadas com "P" no diário de classe.', exemplo: '=CONT.SE(B2:AF2; "P")' },
      { nome: 'ORDEM (ranking)', sintaxe: '=ORDEM(valor; intervalo; ordem)', descricao: 'Classifica o aluno automaticamente no ranking geral da turma.', exemplo: '=ORDEM(F2; F$2:F$40; 0)' },
      { nome: 'MÉDIA PONDERADA', sintaxe: '=SOMARPRODUTO(notas; pesos)/SOMA(pesos)', descricao: 'Calcula a média ponderada com pesos diferentes para cada avaliação.', exemplo: '=SOMARPRODUTO(B2:E2; pesos_ref)/SOMA(pesos_ref)' },
      { nome: 'MÍNIMO (menor nota)', sintaxe: '=MÍNIMO(B2:E2)', descricao: 'Identifica a menor nota do aluno para indicar a disciplina de recuperação.', exemplo: '=MÍNIMO(B2:E2)' },
      { nome: 'FREQUÊNCIA %', sintaxe: '=CONT.SE(B2:AF2;"P")/CONT.VALORES(B2:AF2)', descricao: 'Calcula o percentual de frequência do aluno no período.', exemplo: '=CONT.SE(B2:AF2;"P")/CONT.VALORES(B2:AF2)' },
      { nome: 'CONT.VALORES (aulas)', sintaxe: '=CONT.VALORES(intervalo)', descricao: 'Conta o total de aulas registradas no diário de classe.', exemplo: '=CONT.VALORES(B1:AF1)' },
      { nome: 'MAIOR (destaques)', sintaxe: '=MAIOR(intervalo; k)', descricao: 'Retorna as melhores notas da turma para destacar alunos de excelência.', exemplo: '=MAIOR(F2:F40; 1)' },
      { nome: 'SEERRO + PROCV', sintaxe: '=SEERRO(PROCV(A2; Cadastro!A:E; 3; 0); "Não cadastrado")', descricao: 'Busca dados do aluno pelo número de matrícula sem gerar erro para matrículas não encontradas.', exemplo: '=SEERRO(PROCV(A2; Cadastro!A:E; 3; 0); "Não cadastrado")' },
    ],
    dicas: [
      { titulo: 'Boletim automático', descricao: 'Monte um template que puxa notas de uma aba de lançamento com PROCV — atualize uma vez e todos os boletins são gerados.' },
      { titulo: 'Gráfico de evolução de notas', descricao: 'Use gráfico de linha para mostrar a evolução do aluno bimestre a bimestre ao longo do ano letivo.' },
      { titulo: 'Semáforo de aprovação', descricao: 'Formatação condicional: vermelho abaixo de 5, amarelo entre 5 e 6,9, verde acima de 7 para visualização rápida.' },
      { titulo: 'Alerta de frequência crítica', descricao: 'Destaque em vermelho alunos com frequência abaixo de 75% usando formatação condicional automática.' },
      { titulo: 'Diário de classe digital', descricao: 'Crie colunas para cada aula e linhas para alunos — use P, F e J para presença, falta e justificada.' },
      { titulo: 'Ranking automático da turma', descricao: 'Use ORDEM e ÍNDICE+CORRESP para exibir automaticamente o nome e nota dos três primeiros colocados.' },
      { titulo: 'Área de impressão do boletim', descricao: 'Use Arquivo > Imprimir > Imprimir área para configurar o recorte exato do boletim de cada aluno.' },
      { titulo: 'Relatório por disciplina', descricao: 'Crie uma Tabela Dinâmica com disciplinas nas linhas e estatísticas (média, máximo, mínimo) nas colunas.' },
      { titulo: 'Mapa de calor da turma', descricao: 'Aplique escala de cores nas notas para enxergar de relance quais alunos e disciplinas precisam de atenção.' },
      { titulo: 'Lista de recuperação automática', descricao: 'Use SE para gerar automaticamente a lista com nome do aluno, média atual e nota mínima necessária na recuperação.' },
    ],
  },
  {
    id: 'marketing',
    nome: 'Marketing',
    emoji: '📣',
    cor: theme.colors.primary,
    corClara: theme.colors.primaryLight,
    descricao: 'Métricas de campanhas, ROI, CAC, LTV e análise de canais digitais.',
    formulas: [
      { nome: 'ROI', sintaxe: '=(receita - custo) / custo', descricao: 'Calcula o retorno sobre o investimento de cada campanha — formate como %.', exemplo: '=(C2-B2)/B2' },
      { nome: 'CPL / CPA', sintaxe: '=investimento / conversões', descricao: 'Custo por Lead ou por Aquisição — quanto custa cada novo cliente ou lead.', exemplo: '=B2/C2' },
      { nome: 'TAXA DE CONVERSÃO', sintaxe: '=conversões / visitantes', descricao: 'Percentual de visitantes que realizaram a ação desejada na campanha.', exemplo: '=C2/B2' },
      { nome: 'PREVISÃO.LINEAR', sintaxe: '=PREVISÃO.LINEAR(x; y_conhecido; x_conhecido)', descricao: 'Projeta leads ou receita futura com base na tendência dos dados históricos.', exemplo: '=PREVISÃO.LINEAR(13; B2:B12; A2:A12)' },
      { nome: 'SOMASES (por canal)', sintaxe: '=SOMASES(valor; canal; "Instagram"; mês; "Jan")', descricao: 'Soma investimento ou receita filtrando por canal e período simultaneamente.', exemplo: '=SOMASES(C2:C100; A2:A100; "Instagram"; B2:B100; "Jan")' },
      { nome: 'CTR', sintaxe: '=cliques / impressões', descricao: 'Click-Through Rate — eficiência do anúncio em transformar impressões em cliques.', exemplo: '=C2/B2' },
      { nome: 'ROAS', sintaxe: '=receita_gerada / investimento_ads', descricao: 'Retorno sobre gasto em anúncios — quanto cada R$1 investido gerou de receita.', exemplo: '=D2/B2' },
      { nome: 'DESVPAD (consistência)', sintaxe: '=DESVPAD(intervalo)', descricao: 'Mede a consistência dos resultados das campanhas ao longo do tempo.', exemplo: '=DESVPAD(C2:C30)' },
      { nome: 'CONT.SES (leads qualificados)', sintaxe: '=CONT.SES(status;"Qualificado"; canal;"Google")', descricao: 'Conta leads qualificados por canal de aquisição simultaneamente.', exemplo: '=CONT.SES(A2:A100;"Qualificado";B2:B100;"Google")' },
      { nome: 'CHURN RATE', sintaxe: '=clientes_perdidos / clientes_início_período', descricao: 'Taxa de cancelamento ou perda de clientes — indicador de saúde da base.', exemplo: '=B2/A2' },
    ],
    dicas: [
      { titulo: 'Dashboard de campanha', descricao: 'Crie um painel com impressões, cliques, leads e conversões por canal em gráficos lado a lado.' },
      { titulo: 'Análise de coorte', descricao: 'Agrupe clientes por mês de aquisição e acompanhe a retenção ao longo do tempo em uma matriz colorida.' },
      { titulo: 'A/B Test no Excel', descricao: 'Compare duas campanhas calculando médias, desvio padrão e variação % para decidir a versão vencedora.' },
      { titulo: 'Mapa de calor de canais', descricao: 'Aplique escala de cores por canal e mês para identificar visualmente os melhores períodos para cada canal.' },
      { titulo: 'Funil de marketing completo', descricao: 'Monte: Impressões > Cliques > Leads > MQLs > SQLs > Clientes com taxa de conversão em cada etapa.' },
      { titulo: 'Benchmarking de CTR', descricao: 'Compare seu CTR com a média do setor (Google Ads ~2%, Instagram ~1%) para avaliar a performance dos anúncios.' },
      { titulo: 'Calendário editorial', descricao: 'Crie um calendário mensal com datas, canais, formatos e responsáveis usando formatação condicional por status.' },
      { titulo: 'Atribuição de receita por canal', descricao: 'Use PROCV para cruzar a origem do lead com a venda realizada e calcular o ROI real de cada canal.' },
      { titulo: 'LTV vs CAC', descricao: 'Monitore sempre a relação LTV/CAC — o ideal é ≥ 3x. Abaixo disso o crescimento não é sustentável.' },
      { titulo: 'Relatório semanal automático', descricao: 'Use SOMASES com datas dinâmicas para calcular automaticamente os KPIs da semana atual sem ajuste manual.' },
    ],
  },
  {
    id: 'engenharia',
    nome: 'Engenharia / Projetos',
    emoji: '⚙️',
    cor: theme.colors.primaryMid,
    corClara: theme.colors.primaryLight,
    descricao: 'Cronogramas, cálculos técnicos, Gantt e gestão de projetos.',
    formulas: [
      { nome: 'DIATRABALHO', sintaxe: '=DIATRABALHO(data_inicial; dias; [feriados])', descricao: 'Calcula a data de término de uma tarefa somando apenas dias úteis.', exemplo: '=DIATRABALHO(A2; 30; Feriados!A:A)' },
      { nome: 'SE + HOJE (status)', sintaxe: '=SE(HOJE()>C2; "Atrasado"; "No prazo")', descricao: 'Indica automaticamente se cada tarefa está atrasada ou no prazo.', exemplo: '=SE(HOJE()>C2; "Atrasado"; "No prazo")' },
      { nome: '% CONCLUSÃO PONDERADA', sintaxe: '=SOMARPRODUTO(pesos; percentuais)/SOMA(pesos)', descricao: 'Calcula o percentual de conclusão geral do projeto ponderado por complexidade.', exemplo: '=SOMARPRODUTO(B2:B10; C2:C10)/SOMA(B2:B10)' },
      { nome: 'POTÊNCIA', sintaxe: '=POTÊNCIA(número; potência)', descricao: 'Eleva um número a uma potência — fundamental em cálculos de engenharia.', exemplo: '=POTÊNCIA(A2; 2)' },
      { nome: 'RAIZ', sintaxe: '=RAIZ(número)', descricao: 'Calcula a raiz quadrada — muito usada em fórmulas de física e engenharia.', exemplo: '=RAIZ(A2^2 + B2^2)' },
      { nome: 'DIAS (prazo restante)', sintaxe: '=DIAS(prazo; HOJE())', descricao: 'Mostra quantos dias faltam para o prazo de entrega de cada entregável.', exemplo: '=DIAS(C2; HOJE())' },
      { nome: 'PI', sintaxe: '=PI()', descricao: 'Retorna o valor exato de π — usado em cálculos de área circular e volume.', exemplo: '=PI()*A2^2' },
      { nome: 'ARREDONDAR', sintaxe: '=ARREDONDAR(número; casas)', descricao: 'Arredonda resultados de cálculos técnicos com a precisão necessária.', exemplo: '=ARREDONDAR(A2*3,14159; 2)' },
      { nome: 'SEERRO (verificação)', sintaxe: '=SEERRO(fórmula; "Verificar")', descricao: 'Sinaliza automaticamente cálculos com erro para revisão técnica imediata.', exemplo: '=SEERRO(A2/B2; "Verificar")' },
      { nome: 'CONVERTER', sintaxe: '=CONVERTER(número; de_unidade; para_unidade)', descricao: 'Converte automaticamente entre unidades de medida (m, ft, kg, lb, etc).', exemplo: '=CONVERTER(A2; "m"; "ft")' },
    ],
    dicas: [
      { titulo: 'Gráfico de Gantt', descricao: 'Crie com barras empilhadas: primeira barra transparente (offset até o início) + segunda colorida (duração da tarefa).' },
      { titulo: 'Baseline vs Realizado', descricao: 'Mantenha o plano original em colunas separadas e compare com o realizado usando formatação condicional por variação.' },
      { titulo: 'EAP no Excel', descricao: 'Use recuo de células e formatação hierárquica para representar a Estrutura Analítica do Projeto com clareza visual.' },
      { titulo: 'Semáforo de status do projeto', descricao: 'Use formatação condicional com ícones: 🔴 Atrasado, 🟡 Em risco, 🟢 No prazo para visão geral imediata.' },
      { titulo: 'Cronograma com datas encadeadas', descricao: 'Use DIATRABALHO encadeado para que o início de cada tarefa seja calculado automaticamente pelo fim da anterior.' },
      { titulo: 'Controle de horas por tarefa', descricao: 'Formate células como [h]:mm para somar horas além de 24h e calcular corretamente o esforço total do projeto.' },
      { titulo: 'Identificar caminho crítico', descricao: 'Colorie em vermelho as tarefas sem folga — qualquer atraso nelas impacta diretamente a data de entrega final.' },
      { titulo: 'Dashboard de projeto', descricao: 'Mostre em uma tela: % concluído, dias restantes, tarefas em atraso, orçamento consumido e desvio do cronograma.' },
      { titulo: 'Curva S do projeto', descricao: 'Plote % acumulado planejado vs realizado em um gráfico de linha para visualizar o avanço físico do projeto.' },
      { titulo: 'Checklist de entregáveis', descricao: 'Insira caixas de seleção via Desenvolvedor > Inserir > Caixa de Seleção vinculadas a células para marcar entregas concluídas.' },
    ],
  },
];

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
type Aba = 'formulas' | 'dicas';
type Tela = 'wiki' | 'videos';

const WikiExcelScreen = () => {
  const { isPremium } = usePremium();
  const [tela, setTela] = useState<Tela>('wiki');
  const [busca, setBusca] = useState('');
  const [areaSelecionada, setAreaSelecionada] = useState<Area | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<Aba>('formulas');
  const [videoAtivo, setVideoAtivo] = useState<Video | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  // Limitar vídeos para usuários free
  const videosVisiveis = isPremium ? VIDEOS : VIDEOS.slice(0, 5);

  // Funções para limitar fórmulas e dicas
  const getFormulas = (area: Area) => isPremium ? area.formulas : area.formulas.slice(0, 3);
  const getDicas = (area: Area) => isPremium ? area.dicas : area.dicas.slice(0, 3);

  const areasFiltradas = AREAS.filter(
    (a) =>
      a.nome.toLowerCase().includes(busca.toLowerCase()) ||
      a.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  // ── Tela de Vídeos ──────────────────────────────────────────────────────────
  if (tela === 'videos') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <TouchableOpacity onPress={() => { setTela('wiki'); setVideoAtivo(null); }} style={styles.backBtn}>
            <Text style={styles.backBtnTexto}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>🎬 Aulas em Vídeo</Text>
          <Text style={styles.headerSubtitulo}>Aprenda na prática com o Johni</Text>
        </View>

        {videoAtivo ? (
          <View style={styles.playerContainer}>
            <View style={styles.playerTopBar}>
              <TouchableOpacity onPress={() => setVideoAtivo(null)} style={styles.fecharPlayer}>
                <Text style={styles.fecharPlayerTexto}>✕ Fechar</Text>
              </TouchableOpacity>
              <Text style={styles.playerTitulo} numberOfLines={1}>{videoAtivo.emoji} {videoAtivo.titulo}</Text>
            </View>
            <WebView
              source={{ uri: videoAtivo.url }}
              style={styles.webview}
              allowsFullscreenVideo
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled
              domStorageEnabled
            />
          </View>
        ) : (
          <FlatList
            data={VIDEOS}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const bloqueado = !isPremium && index >= 5;
              return (
                <TouchableOpacity
                  style={[styles.videoCard, bloqueado && styles.videoCardBloqueado]}
                  onPress={() => bloqueado ? setShowPaywall(true) : setVideoAtivo(item)}
                  activeOpacity={0.8}
                >
                  <View style={styles.videoThumb}>
                    {bloqueado && (
                      <View style={styles.lockOverlay}>
                        <Text style={styles.lockEmoji}>🔒</Text>
                      </View>
                    )}
                    <Text style={styles.videoNumero}>{String(index + 1).padStart(2, '0')}</Text>
                    <Text style={styles.videoEmoji}>{item.emoji}</Text>
                    <View style={[styles.playBtn, bloqueado && { backgroundColor: '#999' }]}>
                      <Text style={styles.playBtnText}>{bloqueado ? '🔒' : '▶'}</Text>
                    </View>
                  </View>
                  <View style={styles.videoInfo}>
                    <Text style={[styles.videoTitulo, bloqueado && { color: '#999' }]}>{item.titulo}</Text>
                    <Text style={styles.videoSubtitulo}>{bloqueado ? '⭐ Apenas Premium' : 'Toque para assistir'}</Text>
                  </View>
                  <Text style={styles.videoSeta}>›</Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </SafeAreaView>
    );
  }

  // ── Tela Principal (Wiki) ───────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Wiki do Excel</Text>
        <Text style={styles.headerSubtitulo}>Fórmulas e dicas por área profissional</Text>
      </View>

      {/* Banner de Vídeos */}
      <TouchableOpacity style={styles.videoBanner} onPress={() => setTela('videos')} activeOpacity={0.85}>
        <View style={styles.videoBannerLeft}>
          <Text style={styles.videoBannerEmoji}>🎬</Text>
        </View>
        <View style={styles.videoBannerInfo}>
          <Text style={styles.videoBannerTitulo}>Aulas em Vídeo</Text>
          <Text style={styles.videoBannerSub}>Aprenda com reels práticos</Text>
        </View>
        <Text style={[styles.cardSeta, { color: theme.colors.primary, marginLeft: 8 }]}>›</Text>
      </TouchableOpacity>

      {/* Campo de Busca */}
      <View style={styles.buscaContainer}>
        <Text style={styles.buscaIcone}>🔍</Text>
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar área profissional..."
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

      {/* Lista de Áreas */}
      <FlatList
        data={areasFiltradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => { setAreaSelecionada(item); setAbaAtiva('formulas'); }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#0A1628', '#217346']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <Image source={WIKI_IMAGES[item.id]} style={styles.cardEmojiImg} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardNome}>{item.nome}</Text>
                <Text style={styles.cardDescricao} numberOfLines={2}>{item.descricao}</Text>
              </View>
              <Text style={styles.cardSeta}>›</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>🔍</Text>
            <Text style={styles.vazioTexto}>Nenhuma área encontrada</Text>
          </View>
        }
      />

      {/* Modal de Detalhes da Área */}
      <Modal visible={!!areaSelecionada} animationType="slide" onRequestClose={() => setAreaSelecionada(null)}>
        {areaSelecionada && (
          <SafeAreaView style={styles.modalContainer}>
            {/* Header do Modal */}
            <LinearGradient
              colors={['#0A1628', '#217346']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalHeader}
            >
              <TouchableOpacity style={styles.backBtn} onPress={() => setAreaSelecionada(null)}>
                <Text style={styles.backBtnTexto}>‹ Voltar</Text>
              </TouchableOpacity>
              <Image source={WIKI_IMAGES[areaSelecionada.id]} style={styles.modalEmojiImg} />
              <Text style={styles.modalTitulo}>{areaSelecionada.nome}</Text>
              <Text style={styles.modalSubtitulo}>{areaSelecionada.descricao}</Text>
            </LinearGradient>

            {/* Abas */}
            <View style={styles.abas}>
              {(['formulas', 'dicas'] as Aba[]).map((aba) => (
                <TouchableOpacity
                  key={aba}
                  style={[styles.aba, abaAtiva === aba && { borderBottomColor: areaSelecionada.cor, borderBottomWidth: 3 }]}
                  onPress={() => setAbaAtiva(aba)}
                >
                  <Text style={[styles.abaTexto, abaAtiva === aba && { color: areaSelecionada.cor, fontWeight: '700' }]}>
                    {aba === 'formulas' ? '📐 Fórmulas' : '💡 Dicas Práticas'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Conteúdo */}
            <ScrollView style={styles.modalConteudo} showsVerticalScrollIndicator={false}>
              {abaAtiva === 'formulas'
                ? getFormulas(areaSelecionada).map((formula, index) => (
                    <View key={index} style={styles.formulaCard}>
                      <View style={styles.formulaHeader}>
                        <View style={[styles.formulaNomeBadge, { backgroundColor: areaSelecionada.corClara }]}>
                          <Text style={[styles.formulaNome, { color: areaSelecionada.cor }]}>{formula.nome}</Text>
                        </View>
                        <Text style={styles.formulaIndex}>#{index + 1}</Text>
                      </View>
                      <Text style={styles.formulaDescricao}>{formula.descricao}</Text>
                      <View style={styles.formulaSintaxeBox}>
                        <Text style={styles.formulaSintaxeLabel}>SINTAXE</Text>
                        <Text style={styles.formulaSintaxe}>{formula.sintaxe}</Text>
                      </View>
                      <View style={styles.formulaExemploBox}>
                        <Text style={styles.formulaExemploLabel}>EXEMPLO PRÁTICO</Text>
                        <Text style={styles.formulaExemplo}>{formula.exemplo}</Text>
                      </View>
                    </View>
                  ))
                : getDicas(areaSelecionada).map((dica, index) => (
                    <View key={index} style={styles.dicaCard}>
                      <View style={[styles.dicaIcone, { backgroundColor: areaSelecionada.corClara }]}>
                        <Text style={styles.dicaNumero}>{index + 1}</Text>
                      </View>
                      <View style={styles.dicaInfo}>
                        <Text style={[styles.dicaTitulo, { color: areaSelecionada.cor }]}>{dica.titulo}</Text>
                        <Text style={styles.dicaDescricao}>{dica.descricao}</Text>
                      </View>
                    </View>
                  ))}

              {/* Card de bloqueio para fórmulas/dicas */}
              {!isPremium && (
                <TouchableOpacity style={styles.bloqueioCard} onPress={() => setShowPaywall(true)}>
                  <Text style={styles.bloqueioEmoji}>🔒</Text>
                  <Text style={styles.bloqueioTitulo}>
                    +{abaAtiva === 'formulas' 
                      ? areaSelecionada.formulas.length - 3 
                      : areaSelecionada.dicas.length - 3} itens bloqueados
                  </Text>
                  <Text style={styles.bloqueioSub}>Seja Premium para ver tudo</Text>
                  <View style={styles.bloqueioBtn}>
                    <Text style={styles.bloqueioBtnTexto}>⭐ Desbloquear</Text>
                  </View>
                </TouchableOpacity>
              )}

              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>

      <PaywallModal
        visivel={showPaywall}
        onFechar={() => setShowPaywall(false)}
        onSuccess={() => setShowPaywall(false)}
      />
    </SafeAreaView>
  );
};

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  header: { backgroundColor: theme.colors.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerTitulo: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  headerSubtitulo: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },

  backBtn: { marginBottom: 12 },
  backBtnTexto: { color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: '600' },

  videoBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', marginHorizontal: 16, marginTop: 16,
    borderRadius: 14, padding: 16, borderLeftWidth: 5, borderLeftColor: theme.colors.primary,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
  },
  videoBannerLeft: { marginRight: 14 },
  videoBannerEmoji: { fontSize: 32 },
  videoBannerInfo: { flex: 1 },
  videoBannerTitulo: { fontSize: 16, fontWeight: '700', color: theme.colors.primary },
  videoBannerSub: { fontSize: 12, color: '#888', marginTop: 2 },

  buscaContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    margin: 16, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  buscaIcone: { fontSize: 16, marginRight: 8 },
  buscaInput: { flex: 1, fontSize: 15, color: '#333' },
  buscaLimpar: { fontSize: 16, color: '#999', paddingLeft: 8 },

  lista: { paddingHorizontal: 16, paddingBottom: 20 },

  card: {
    borderRadius: 16, marginBottom: 12, overflow: 'hidden',
    elevation: 6, shadowColor: '#217346', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  cardGradient: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
  },
  cardEmojiImg: { width: 52, height: 52, borderRadius: 12, marginRight: 14 },
  cardInfo: { flex: 1 },
  cardNome: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 3 },
  cardDescricao: { fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 17 },
  cardMeta: { alignItems: 'flex-end', marginLeft: 8 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 6 },
  badgeTexto: { fontSize: 11, fontWeight: '700' },
  cardSeta: { fontSize: 22, color: 'rgba(255,255,255,0.7)' },

  vazio: { alignItems: 'center', marginTop: 60 },
  vazioEmoji: { fontSize: 40, marginBottom: 12 },
  vazioTexto: { fontSize: 16, color: '#999' },

  // ── Vídeos ──
  playerContainer: { flex: 1, backgroundColor: '#000' },
  playerTopBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', paddingHorizontal: 16, paddingVertical: 12 },
  fecharPlayer: { marginRight: 12 },
  fecharPlayerTexto: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  playerTitulo: { flex: 1, color: '#FFF', fontSize: 14, fontWeight: '600' },
  webview: { flex: 1 },
  videoCard: {
    backgroundColor: '#FFF', borderRadius: 14, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', overflow: 'hidden',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  videoThumb: {
    width: 88, height: 88, backgroundColor: '#1A1A2E',
    justifyContent: 'center', alignItems: 'center',
  },
  videoNumero: { position: 'absolute', top: 8, left: 8, color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700' },
  videoEmoji: { fontSize: 28, marginBottom: 4 },
  playBtn: { backgroundColor: theme.colors.primary, borderRadius: 20, width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  playBtnText: { color: '#FFF', fontSize: 12 },
  videoInfo: { flex: 1, paddingHorizontal: 14, paddingVertical: 12 },
  videoTitulo: { fontSize: 14, fontWeight: '600', color: '#222', lineHeight: 20 },
  videoSubtitulo: { fontSize: 11, color: '#999', marginTop: 4 },
  videoSeta: { fontSize: 22, color: '#CCC', paddingRight: 12 },

  // ── Modal ──
  modalContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  modalHeader: { padding: 20, paddingTop: 16, paddingBottom: 20 },
  modalEmojiImg: { width: 72, height: 72, borderRadius: 16, marginBottom: 8 },
  modalTitulo: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  modalSubtitulo: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 6, lineHeight: 19 },
  modalStats: { flexDirection: 'row', alignItems: 'center', marginTop: 16, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: 12 },
  modalStatItem: { flex: 1, alignItems: 'center' },
  modalStatNum: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  modalStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  modalStatDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)' },

  abas: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  aba: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  abaTexto: { fontSize: 14, color: '#888', fontWeight: '500' },
  modalConteudo: { flex: 1, padding: 16 },

  formulaCard: {
    backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 14,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 1 },
  },
  formulaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  formulaNomeBadge: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  formulaNome: { fontSize: 14, fontWeight: '700' },
  formulaIndex: { fontSize: 12, color: '#CCC', fontWeight: '600' },
  formulaDescricao: { fontSize: 13, color: '#555', marginBottom: 12, lineHeight: 19 },
  formulaSintaxeBox: { backgroundColor: '#1A1A2E', borderRadius: 10, padding: 14, marginBottom: 8 },
  formulaSintaxeLabel: { fontSize: 9, color: '#555', marginBottom: 6, fontWeight: '700', letterSpacing: 1 },
  formulaSintaxe: { fontSize: 13, color: '#58CC02', fontFamily: 'monospace', lineHeight: 20 },
  formulaExemploBox: { backgroundColor: '#F8F8F8', borderRadius: 10, padding: 14, borderLeftWidth: 3, borderLeftColor: '#DDD' },
  formulaExemploLabel: { fontSize: 9, color: '#AAA', marginBottom: 6, fontWeight: '700', letterSpacing: 1 },
  formulaExemplo: { fontSize: 13, color: '#444', fontFamily: 'monospace' },

  dicaCard: {
    backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'flex-start',
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 1 },
  },
  dicaIcone: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  dicaNumero: { fontSize: 15, fontWeight: '800', color: '#555' },
  dicaInfo: { flex: 1 },
  dicaTitulo: { fontSize: 15, fontWeight: '700', marginBottom: 5 },
  dicaDescricao: { fontSize: 13, color: '#666', lineHeight: 19 },

  // Estilos de bloqueio
  videoCardBloqueado: { opacity: 0.6 },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  lockEmoji: { fontSize: 24 },
  bloqueioCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
  },
  bloqueioEmoji: { fontSize: 32, marginBottom: 8 },
  bloqueioTitulo: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 4 },
  bloqueioSub: { fontSize: 13, color: '#777', marginBottom: 12 },
  bloqueioBtn: { backgroundColor: '#F59E0B', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 8 },
  bloqueioBtnTexto: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});

export default WikiExcelScreen;
