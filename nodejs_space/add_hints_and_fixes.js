const fs = require('fs');

let seed = fs.readFileSync('prisma/seed_trails.ts', 'utf8');

// ========== EXCEL DO ZERO ==========
// Q1 - Adicionar hint
seed = seed.replace(
  /(order: 1,[\s\S]*?'Como você abre um arquivo novo no Excel\?',[\s\S]*?)xpReward: 15,/,
  `$1hint: 'No Excel, você pode abrir um arquivo novo pressionando Ctrl+N ou clicando em "Novo" no menu Arquivo.',\n        xpReward: 15,`
);

// Q2 - Adicionar hint
seed = seed.replace(
  /(order: 2,[\s\S]*?'O que são colunas no Excel\?',[\s\S]*?)xpReward: 15,/,
  `$1hint: 'As colunas do Excel são identificadas por letras (A, B, C...) e ficam no topo da planilha.',\n        xpReward: 15,`
);

// Q3 - Adicionar hint  
seed = seed.replace(
  /(order: 3,[\s\S]*?'Qual é o nome da célula destacada\?',[\s\S]*?)xpReward: 15,/,
  `$1hint: 'A célula C5 está na coluna C (terceira coluna) e linha 5 (quinta linha).',\n        xpReward: 15,`
);

// Q4 - Adicionar hint
seed = seed.replace(
  /(order: 4,[\s\S]*?'Selecionando um intervalo',[\s\S]*?)xpReward: 15,/,
  `$1hint: 'Para selecionar A1:D4, clique em A1 e arraste até D4, ou clique em A1, segure Shift e clique em D4.',\n        xpReward: 15,`
);

// Q5 - Adicionar hint
seed = seed.replace(
  /(order: 5,[\s\S]*?'Ajustar largura da coluna',[\s\S]*?)xpReward: 15,/,
  `$1hint: 'Posicione o cursor entre os cabeçalhos das colunas. Quando virar uma seta dupla ↔, clique duas vezes para ajustar automaticamente.',\n        xpReward: 15,`
);

// Q6 - Adicionar hint
seed = seed.replace(
  /(order: 6,[\s\S]*?'Qual atalho salva a planilha\?',[\s\S]*?)xpReward: 15,/,
  `$1hint: 'Ctrl + S é o atalho universal para salvar em praticamente todos os programas, incluindo o Excel.',\n        xpReward: 15,`
);

// Q7 - Já tem hint, não precisa adicionar

// Q8 - Adicionar hint
seed = seed.replace(
  /(order: 8,[\s\S]*?'O que é AutoSoma\?',[\s\S]*?)xpReward: 15,/,
  `$1hint: 'O botão Σ (AutoSoma) fica na aba "Página Inicial", no grupo "Edição", lado direito da faixa de opções.',\n        xpReward: 15,`
);

// Q9 - Adicionar hint
seed = seed.replace(
  /(order: 9,[\s\S]*?'Formatação de números',[\s\S]*?)xpReward: 15,/,
  `$1hint: 'No Excel, você formata números como moeda clicando no botão R$ na faixa de opções, ou usando Ctrl+Shift+4.',\n        xpReward: 15,`
);

// Q10 - Adicionar hint para drag-and-drop
seed = seed.replace(
  /(order: 10,[\s\S]*?'Desafio Final: Ordem correta',[\s\S]*?)xpReward: 30,/,
  `$1hint: 'Pense no fluxo lógico: estrutura → dados → cálculos → formatação → salvar.',\n        xpReward: 30,`
);

// ========== FUNDAMENTOS DO EXCEL ==========
// Q1 - Fundamentos - Corrigir expectedValue (estava como =SOMA(A1:A5))
seed = seed.replace(
  /(order: 1,[\s\S]*?'Use a função SOMA'[\s\S]*?expectedValue: ')=SOMA\(A1:A5\)(',)/,
  `$1=SOMA(A1:A5)$2`
);

// Adicionar hint para Q1-Q10 do Fundamentos
const fundamentosHints = [
  { order: 1, hint: 'A função SOMA aceita um intervalo com dois pontos, exemplo: =SOMA(A1:A5)' },
  { order: 2, hint: 'A função MÉDIA calcula a média aritmética de um intervalo de células.' },
  { order: 3, hint: 'A função MÁXIMO retorna o maior valor de um intervalo.' },
  { order: 4, hint: 'A função MÍNIMO retorna o menor valor de um intervalo.' },
  { order: 5, hint: 'A função CONT.NÚMEROS conta quantas células contêm números (ignora texto e células vazias).' },
  { order: 6, hint: 'Use o símbolo $ antes da letra da coluna e do número da linha para tornar a referência absoluta: $A$1' },
  { order: 7, hint: 'F4 alterna entre referências relativas, absolutas e mistas. Pressione várias vezes para ver as opções.' },
  { order: 8, hint: 'Você pode copiar fórmulas arrastando o quadradinho no canto inferior direito da célula (alça de preenchimento).' },
  { order: 9, hint: 'O ponto de interrogação (?) representa um caractere qualquer. Por exemplo, "ma?a" encontra "maca", "maça", "mama".' },
  { order: 10, hint: 'O asterisco (*) representa qualquer sequência de caracteres. Por exemplo, "*ana" encontra "banana", "ana", "juliana".' },
];

fundamentosHints.forEach(({ order, hint }) => {
  const regex = new RegExp(
    `(Fundamentos do Excel[\\s\\S]*?order: ${order},[\\s\\S]*?)(xpReward:)`,
    'g'
  );
  seed = seed.replace(regex, `$1hint: '${hint}',\n        $2`);
});

// ========== FÓRMULAS ESSENCIAIS ==========
const formulasHints = [
  { order: 1, hint: 'A função SE tem 3 argumentos: =SE(condição, valor_se_verdadeiro, valor_se_falso)' },
  { order: 2, hint: 'A função E retorna VERDADEIRO apenas se TODAS as condições forem verdadeiras.' },
  { order: 3, hint: 'A função OU retorna VERDADEIRO se PELO MENOS UMA condição for verdadeira.' },
  { order: 4, hint: 'Você pode aninhar funções SE, uma dentro da outra, para criar lógicas mais complexas.' },
  { order: 5, hint: 'A função CONT.SE conta quantas células atendem a um critério específico.' },
  { order: 6, hint: 'A função SOMASE soma apenas as células que atendem a um critério.' },
  { order: 7, hint: 'Operadores de comparação: = (igual), > (maior), < (menor), >= (maior ou igual), <= (menor ou igual), <> (diferente)' },
  { order: 8, hint: 'O operador & concatena (junta) textos. Exemplo: "Olá"&" "&"Mundo" resulta em "Olá Mundo"' },
  { order: 9, hint: 'As funções ESQUERDA, DIREITA e EXT.TEXTO extraem partes de um texto.' },
  { order: 10, hint: 'A função PROCV busca um valor na primeira coluna de uma tabela e retorna um valor de outra coluna na mesma linha.' },
];

formulasHints.forEach(({ order, hint }) => {
  const regex = new RegExp(
    `(Fórmulas Essenciais[\\s\\S]*?questions: \\[[\\s\\S]*?order: ${order},[\\s\\S]*?)(xpReward:)`,
    'g'
  );
  seed = seed.replace(regex, `$1hint: '${hint}',\n        $2`);
});

// ========== ANÁLISE DE DADOS ==========
const analiseHints = [
  { order: 1, hint: 'Tabelas Dinâmicas permitem resumir, analisar e visualizar grandes volumes de dados rapidamente.' },
  { order: 2, hint: 'Filtros permitem exibir apenas as linhas que atendem a critérios específicos.' },
  { order: 3, hint: 'A Formatação Condicional aplica estilos visuais automaticamente com base nos valores das células.' },
  { order: 4, hint: 'SOMASE tem 3 argumentos: =SOMASE(intervalo_critério, critério, intervalo_soma)' },
  { order: 5, hint: 'A função MÉDIA.SE calcula a média apenas das células que atendem a um critério.' },
  { order: 6, hint: 'A função CONT.SES conta células que atendem a múltiplos critérios.' },
  { order: 7, hint: 'Classificação organiza dados em ordem crescente ou decrescente.' },
  { order: 8, hint: 'A função SUBTOTAL ignora células ocultas por filtros, útil para totais em tabelas filtradas.' },
  { order: 9, hint: 'Validar dados restringe o que pode ser digitado em uma célula (ex: apenas números de 0 a 100).' },
  { order: 10, hint: 'Remover duplicatas exclui linhas repetidas, mantendo apenas registros únicos.' },
];

analiseHints.forEach(({ order, hint }) => {
  const regex = new RegExp(
    `(Análise de Dados[\\s\\S]*?questions: \\[[\\s\\S]*?order: ${order},[\\s\\S]*?)(xpReward:)`,
    'g'
  );
  seed = seed.replace(regex, `$1hint: '${hint}',\n        $2`);
});

// ========== GRÁFICOS PROFISSIONAIS ==========
const graficosHints = [
  { order: 1, hint: 'Gráficos de colunas são ideais para comparar valores entre categorias.' },
  { order: 2, hint: 'Gráficos de linhas mostram tendências ao longo do tempo.' },
  { order: 3, hint: 'Gráficos de pizza mostram proporções de um todo (use quando tiver poucas categorias).' },
  { order: 4, hint: 'Para criar um gráfico, selecione os dados e vá em Inserir > Gráficos > escolha o tipo.' },
  { order: 5, hint: 'Você pode personalizar cores, títulos, legendas e rótulos clicando no gráfico e usando as opções de Design.' },
  { order: 6, hint: 'Gráficos de dispersão mostram correlação entre duas variáveis numéricas.' },
  { order: 7, hint: 'Eixos controlam a escala e os rótulos das dimensões do gráfico (horizontal e vertical).' },
  { order: 8, hint: 'Gráficos de barras são como gráficos de colunas, mas horizontais (bons para muitas categorias ou nomes longos).' },
  { order: 9, hint: 'Gráficos combinados permitem exibir diferentes tipos de gráficos em um só (ex: colunas + linhas).' },
  { order: 10, hint: 'Minigráficos (sparklines) são gráficos pequenos dentro de células, úteis para visualizar tendências rápidas.' },
];

graficosHints.forEach(({ order, hint }) => {
  const regex = new RegExp(
    `(Gráficos Profissionais[\\s\\S]*?questions: \\[[\\s\\S]*?order: ${order},[\\s\\S]*?)(xpReward:)`,
    'g'
  );
  seed = seed.replace(regex, `$1hint: '${hint}',\n        $2`);
});

// ========== EXCEL PARA LOGÍSTICA ==========
const logisticaHints = [
  { order: 1, hint: 'Inventário é o controle de estoque. Use colunas para Item, Quantidade, Preço Unitário, Total.' },
  { order: 2, hint: 'Para calcular o total, multiplique quantidade pelo preço unitário: =A2*B2' },
  { order: 3, hint: 'Dias de estoque = Quantidade em estoque / Média de vendas diárias' },
  { order: 4, hint: 'Giro de estoque = Vendas do período / Estoque médio' },
  { order: 5, hint: 'Custo de armazenagem = Custo fixo + (Custo variável por unidade * Quantidade)' },
  { order: 6, hint: 'Lead time é o tempo entre o pedido e o recebimento da mercadoria.' },
  { order: 7, hint: 'Ponto de pedido = (Média de vendas diárias * Lead time) + Estoque de segurança' },
  { order: 8, hint: 'Tabelas no Excel facilitam filtrar, classificar e analisar dados estruturados.' },
  { order: 9, hint: 'Previsão de demanda pode ser feita com médias móveis, tendências lineares ou funções PREVISÃO.' },
  { order: 10, hint: 'Taxa de ruptura = (Número de pedidos não atendidos / Total de pedidos) * 100' },
];

logisticaHints.forEach(({ order, hint }) => {
  const regex = new RegExp(
    `(Excel para Logística[\\s\\S]*?questions: \\[[\\s\\S]*?order: ${order},[\\s\\S]*?)(xpReward:)`,
    'g'
  );
  seed = seed.replace(regex, `$1hint: '${hint}',\n        $2`);
});

// ========== EXCEL PARA FINANÇAS ==========
const financasHints = [
  { order: 1, hint: 'Orçamento = Receitas previstas - Despesas previstas' },
  { order: 2, hint: 'Lucro = Receita - Despesas' },
  { order: 3, hint: 'ROI (Retorno sobre Investimento) = (Ganho - Custo) / Custo * 100%' },
  { order: 4, hint: 'Juros compostos: Montante = Capital * (1 + Taxa)^Tempo' },
  { order: 5, hint: 'Fluxo de caixa acompanha entradas e saídas de dinheiro ao longo do tempo.' },
  { order: 6, hint: 'A função PGTO calcula a prestação de um empréstimo: =PGTO(taxa, número_parcelas, -valor_presente)' },
  { order: 7, hint: 'VPL (Valor Presente Líquido) avalia a viabilidade de um investimento trazendo fluxos futuros a valor presente.' },
  { order: 8, hint: 'Margem de lucro = (Lucro / Receita) * 100%' },
  { order: 9, hint: 'TIR (Taxa Interna de Retorno) é a taxa de desconto que faz o VPL ser zero.' },
  { order: 10, hint: 'Ponto de equilíbrio = Custos Fixos / (Preço de venda - Custo variável unitário)' },
];

financasHints.forEach(({ order, hint }) => {
  const regex = new RegExp(
    `(Excel para Finanças[\\s\\S]*?questions: \\[[\\s\\S]*?order: ${order},[\\s\\S]*?)(xpReward:)`,
    'g'
  );
  seed = seed.replace(regex, `$1hint: '${hint}',\n        $2`);
});

// ========== PRODUTIVIDADE NO EXCEL ==========
const produtividadeHints = [
  { order: 1, hint: 'Atalhos de teclado economizam tempo. Ctrl+C copia, Ctrl+V cola, Ctrl+Z desfaz.' },
  { order: 2, hint: 'Ctrl+Setas move rapidamente para o fim de um bloco de dados.' },
  { order: 3, hint: 'Nomear intervalos facilita criar fórmulas legíveis: =SOMA(Vendas) ao invés de =SOMA(A1:A100)' },
  { order: 4, hint: 'Macros automatizam tarefas repetitivas gravando suas ações.' },
  { order: 5, hint: 'A Formatação como Tabela ativa filtros automáticos e estilos visuais.' },
  { order: 6, hint: 'Congelar painéis mantém linhas ou colunas visíveis enquanto você rola a planilha.' },
  { order: 7, hint: 'F2 entra no modo de edição da célula selecionada.' },
  { order: 8, hint: 'Alt + Enter cria uma quebra de linha dentro de uma célula.' },
  { order: 9, hint: 'Alça de preenchimento (arraste o quadradinho no canto da célula) copia ou continua sequências automaticamente.' },
  { order: 10, hint: 'Modelos prontos economizam tempo. Vá em Arquivo > Novo e escolha um modelo.' },
];

produtividadeHints.forEach(({ order, hint }) => {
  const regex = new RegExp(
    `(Produtividade no Excel[\\s\\S]*?questions: \\[[\\s\\S]*?order: ${order},[\\s\\S]*?)(xpReward:)`,
    'g'
  );
  seed = seed.replace(regex, `$1hint: '${hint}',\n        $2`);
});

// ========== EXCEL AVANÇADO ==========
const avancadoHints = [
  { order: 1, hint: 'Tabelas Dinâmicas permitem analisar grandes volumes de dados rapidamente, resumindo e agrupando informações.' },
  { order: 2, hint: 'Power Query é uma ferramenta de ETL (extrair, transformar, carregar) para limpar e modelar dados.' },
  { order: 3, hint: 'Funções de matriz realizam cálculos em vários valores simultaneamente.' },
  { order: 4, hint: 'PROCX é mais poderosa que PROCV: busca em qualquer direção, retorna arrays e aceita valores inexatos.' },
  { order: 5, hint: 'Power Pivot permite criar modelos de dados relacionais e fórmulas DAX avançadas.' },
  { order: 6, hint: 'Funções de banco de dados (BDSOMA, BDMEDIA) operam em intervalos filtrados por critérios.' },
  { order: 7, hint: 'LET define variáveis dentro de uma fórmula, tornando-a mais legível e eficiente.' },
  { order: 8, hint: 'LAMBDA cria funções customizadas reutilizáveis.' },
  { order: 9, hint: 'Arrays dinâmicos (spill) expandem resultados automaticamente em várias células.' },
  { order: 10, hint: 'Funções como FILTRO, CLASSIFICAR, SEQUENCIA, UNICOS facilitam manipulação de dados sem fórmulas complexas.' },
];

avancadoHints.forEach(({ order, hint }) => {
  const regex = new RegExp(
    `(Excel Avançado[\\s\\S]*?questions: \\[[\\s\\S]*?order: ${order},[\\s\\S]*?)(xpReward:)`,
    'g'
  );
  seed = seed.replace(regex, `$1hint: '${hint}',\n        $2`);
});

// ========== EXCEL + IA ==========
const iaHints = [
  { order: 1, hint: 'Assistentes de IA como Copilot podem gerar fórmulas complexas a partir de descrições em linguagem natural.' },
  { order: 2, hint: 'IA generativa pode criar análises, gráficos e insights automaticamente a partir dos seus dados.' },
  { order: 3, hint: 'Power Query com IA pode detectar padrões e sugerir transformações de dados.' },
  { order: 4, hint: 'Análise rápida usa IA para sugerir gráficos, tabelas dinâmicas e formatações adequadas.' },
  { order: 5, hint: 'Insights automáticos detectam tendências, outliers e padrões nos dados.' },
  { order: 6, hint: 'IA pode traduzir fórmulas complexas em explicações simples.' },
  { order: 7, hint: 'Ferramentas de IA podem prever valores futuros com base em dados históricos (previsão de séries temporais).' },
  { order: 8, hint: 'IA pode limpar dados automaticamente, detectando duplicatas, erros de digitação e inconsistências.' },
  { order: 9, hint: 'Assistentes de IA podem gerar scripts VBA ou fórmulas personalizadas sob demanda.' },
  { order: 10, hint: 'Integrar Excel com APIs de IA (GPT, Claude, etc.) permite automações poderosas.' },
];

iaHints.forEach(({ order, hint }) => {
  const regex = new RegExp(
    `(Excel \\+ IA[\\s\\S]*?questions: \\[[\\s\\S]*?order: ${order},[\\s\\S]*?)(xpReward:)`,
    'g'
  );
  seed = seed.replace(regex, `$1hint: '${hint}',\n        $2`);
});

fs.writeFileSync('prisma/seed_trails.ts', seed);
console.log('✅ Hints adicionados em todas as 100 questões!');
