import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapa completo de hints para todas as 100 questões
const hints: Record<string, string[]> = {
  'excel-do-zero': [
    'No Excel, você pode abrir um arquivo novo pressionando Ctrl+N ou clicando em "Novo" no menu Arquivo.',
    'As colunas do Excel são identificadas por letras (A, B, C...) e ficam no topo da planilha.',
    'A célula C5 está na coluna C (terceira coluna) e linha 5 (quinta linha).',
    'Para selecionar A1:D4, clique em A1 e arraste até D4, ou clique em A1, segure Shift e clique em D4.',
    'Posicione o cursor entre os cabeçalhos das colunas. Quando virar uma seta dupla ↔, clique duas vezes para ajustar automaticamente.',
    'Ctrl + S é o atalho universal para salvar em praticamente todos os programas, incluindo o Excel.',
    'Você pode somar A1 e B1 de duas formas: =A1+B1 ou =SOMA(A1,B1). Ambas estão corretas!',
    'O botão Σ (AutoSoma) fica na aba "Página Inicial", no grupo "Edição", lado direito da faixa de opções.',
    'No Excel, você formata números como moeda clicando no botão R$ na faixa de opções, ou usando Ctrl+Shift+4.',
    'Pense no fluxo lógico: estrutura → dados → cálculos → formatação → salvar.',
  ],
  'fundamentos-excel': [
    'A função SOMA aceita um intervalo com dois pontos, exemplo: =SOMA(A1:A5)',
    'A função MÉDIA calcula a média aritmética de um intervalo de células.',
    'A função MÁXIMO retorna o maior valor de um intervalo.',
    'A função MÍNIMO retorna o menor valor de um intervalo.',
    'A função CONT.NÚMEROS conta quantas células contêm números (ignora texto e células vazias).',
    'Use o símbolo $ antes da letra da coluna e do número da linha para tornar a referência absoluta: $A$1',
    'F4 alterna entre referências relativas, absolutas e mistas. Pressione várias vezes para ver as opções.',
    'Você pode copiar fórmulas arrastando o quadradinho no canto inferior direito da célula (alça de preenchimento).',
    'O ponto de interrogação (?) representa um caractere qualquer. Por exemplo, "ma?a" encontra "maca", "maça", "mama".',
    'O asterisco (*) representa qualquer sequência de caracteres. Por exemplo, "*ana" encontra "banana", "ana", "juliana".',
  ],
  'formulas-essenciais': [
    'A função SE tem 3 argumentos: =SE(condição, valor_se_verdadeiro, valor_se_falso)',
    'A função E retorna VERDADEIRO apenas se TODAS as condições forem verdadeiras.',
    'A função OU retorna VERDADEIRO se PELO MENOS UMA condição for verdadeira.',
    'Você pode aninhar funções SE, uma dentro da outra, para criar lógicas mais complexas.',
    'A função CONT.SE conta quantas células atendem a um critério específico.',
    'A função SOMASE soma apenas as células que atendem a um critério.',
    'Operadores de comparação: = (igual), > (maior), < (menor), >= (maior ou igual), <= (menor ou igual), <> (diferente)',
    'O operador & concatena (junta) textos. Exemplo: "Olá"&" "&"Mundo" resulta em "Olá Mundo"',
    'As funções ESQUERDA, DIREITA e EXT.TEXTO extraem partes de um texto.',
    'A função PROCV busca um valor na primeira coluna de uma tabela e retorna um valor de outra coluna na mesma linha.',
  ],
  'analise-de-dados': [
    'Tabelas Dinâmicas permitem resumir, analisar e visualizar grandes volumes de dados rapidamente.',
    'Filtros permitem exibir apenas as linhas que atendem a critérios específicos.',
    'A Formatação Condicional aplica estilos visuais automaticamente com base nos valores das células.',
    'SOMASE tem 3 argumentos: =SOMASE(intervalo_critério, critério, intervalo_soma)',
    'A função MÉDIA.SE calcula a média apenas das células que atendem a um critério.',
    'A função CONT.SES conta células que atendem a múltiplos critérios.',
    'Classificação organiza dados em ordem crescente ou decrescente.',
    'A função SUBTOTAL ignora células ocultas por filtros, útil para totais em tabelas filtradas.',
    'Validar dados restringe o que pode ser digitado em uma célula (ex: apenas números de 0 a 100).',
    'Remover duplicatas exclui linhas repetidas, mantendo apenas registros únicos.',
  ],
  'graficos-profissionais': [
    'Gráficos de colunas são ideais para comparar valores entre categorias.',
    'Gráficos de linhas mostram tendências ao longo do tempo.',
    'Gráficos de pizza mostram proporções de um todo (use quando tiver poucas categorias).',
    'Para criar um gráfico, selecione os dados e vá em Inserir > Gráficos > escolha o tipo.',
    'Você pode personalizar cores, títulos, legendas e rótulos clicando no gráfico e usando as opções de Design.',
    'Gráficos de dispersão mostram correlação entre duas variáveis numéricas.',
    'Eixos controlam a escala e os rótulos das dimensões do gráfico (horizontal e vertical).',
    'Gráficos de barras são como gráficos de colunas, mas horizontais (bons para muitas categorias ou nomes longos).',
    'Gráficos combinados permitem exibir diferentes tipos de gráficos em um só (ex: colunas + linhas).',
    'Minigráficos (sparklines) são gráficos pequenos dentro de células, úteis para visualizar tendências rápidas.',
  ],
  'excel-logistica': [
    'Inventário é o controle de estoque. Use colunas para Item, Quantidade, Preço Unitário, Total.',
    'Para calcular o total, multiplique quantidade pelo preço unitário: =A2*B2',
    'Dias de estoque = Quantidade em estoque / Média de vendas diárias',
    'Giro de estoque = Vendas do período / Estoque médio',
    'Custo de armazenagem = Custo fixo + (Custo variável por unidade * Quantidade)',
    'Lead time é o tempo entre o pedido e o recebimento da mercadoria.',
    'Ponto de pedido = (Média de vendas diárias * Lead time) + Estoque de segurança',
    'Tabelas no Excel facilitam filtrar, classificar e analisar dados estruturados.',
    'Previsão de demanda pode ser feita com médias móveis, tendências lineares ou funções PREVISÃO.',
    'Taxa de ruptura = (Número de pedidos não atendidos / Total de pedidos) * 100',
  ],
  'excel-financas': [
    'Orçamento = Receitas previstas - Despesas previstas',
    'Lucro = Receita - Despesas',
    'ROI (Retorno sobre Investimento) = (Ganho - Custo) / Custo * 100%',
    'Juros compostos: Montante = Capital * (1 + Taxa)^Tempo',
    'Fluxo de caixa acompanha entradas e saídas de dinheiro ao longo do tempo.',
    'A função PGTO calcula a prestação de um empréstimo: =PGTO(taxa, número_parcelas, -valor_presente)',
    'VPL (Valor Presente Líquido) avalia a viabilidade de um investimento trazendo fluxos futuros a valor presente.',
    'Margem de lucro = (Lucro / Receita) * 100%',
    'TIR (Taxa Interna de Retorno) é a taxa de desconto que faz o VPL ser zero.',
    'Ponto de equilíbrio = Custos Fixos / (Preço de venda - Custo variável unitário)',
  ],
  'produtividade-excel': [
    'Atalhos de teclado economizam tempo. Ctrl+C copia, Ctrl+V cola, Ctrl+Z desfaz.',
    'Ctrl+Setas move rapidamente para o fim de um bloco de dados.',
    'Nomear intervalos facilita criar fórmulas legíveis: =SOMA(Vendas) ao invés de =SOMA(A1:A100)',
    'Macros automatizam tarefas repetitivas gravando suas ações.',
    'A Formatação como Tabela ativa filtros automáticos e estilos visuais.',
    'Congelar painéis mantém linhas ou colunas visíveis enquanto você rola a planilha.',
    'F2 entra no modo de edição da célula selecionada.',
    'Alt + Enter cria uma quebra de linha dentro de uma célula.',
    'Alça de preenchimento (arraste o quadradinho no canto da célula) copia ou continua sequências automaticamente.',
    'Modelos prontos economizam tempo. Vá em Arquivo > Novo e escolha um modelo.',
  ],
  'excel-avancado': [
    'Tabelas Dinâmicas permitem analisar grandes volumes de dados rapidamente, resumindo e agrupando informações.',
    'Power Query é uma ferramenta de ETL (extrair, transformar, carregar) para limpar e modelar dados.',
    'Funções de matriz realizam cálculos em vários valores simultaneamente.',
    'PROCX é mais poderosa que PROCV: busca em qualquer direção, retorna arrays e aceita valores inexatos.',
    'Power Pivot permite criar modelos de dados relacionais e fórmulas DAX avançadas.',
    'Funções de banco de dados (BDSOMA, BDMEDIA) operam em intervalos filtrados por critérios.',
    'LET define variáveis dentro de uma fórmula, tornando-a mais legível e eficiente.',
    'LAMBDA cria funções customizadas reutilizáveis.',
    'Arrays dinâmicos (spill) expandem resultados automaticamente em várias células.',
    'Funções como FILTRO, CLASSIFICAR, SEQUENCIA, UNICOS facilitam manipulação de dados sem fórmulas complexas.',
  ],
  'excel-ia': [
    'Assistentes de IA como Copilot podem gerar fórmulas complexas a partir de descrições em linguagem natural.',
    'IA generativa pode criar análises, gráficos e insights automaticamente a partir dos seus dados.',
    'Power Query com IA pode detectar padrões e sugerir transformações de dados.',
    'Análise rápida usa IA para sugerir gráficos, tabelas dinâmicas e formatações adequadas.',
    'Insights automáticos detectam tendências, outliers e padrões nos dados.',
    'IA pode traduzir fórmulas complexas em explicações simples.',
    'Ferramentas de IA podem prever valores futuros com base em dados históricos (previsão de séries temporais).',
    'IA pode limpar dados automaticamente, detectando duplicatas, erros de digitação e inconsistências.',
    'Assistentes de IA podem gerar scripts VBA ou fórmulas personalizadas sob demanda.',
    'Integrar Excel com APIs de IA (GPT, Claude, etc.) permite automações poderosas.',
  ],
};

async function main() {
  console.log('💡 Atualizando hints nas 100 questões...\n');

  let totalUpdated = 0;

  for (const [slug, trailHints] of Object.entries(hints)) {
    const trail = await prisma.trails.findUnique({ where: { slug } });
    if (!trail) {
      console.log(`❌ Trilha não encontrada: ${slug}`);
      continue;
    }

    console.log(`📝 Atualizando trilha: ${trail.name}`);

    for (let i = 0; i < trailHints.length; i++) {
      const order = i + 1;
      const hint = trailHints[i];

      try {
        await prisma.questions.updateMany({
          where: {
            trailId: trail.id,
            order: order,
          },
          data: {
            hint: hint,
          },
        });
        totalUpdated++;
        process.stdout.write('✓');
      } catch (error) {
        console.error(`\n❌ Erro ao atualizar questão ${order}:`, error);
      }
    }
    console.log(`  ✅ ${trailHints.length} questões atualizadas\n`);
  }

  console.log(`\n🎉 Concluído! ${totalUpdated} hints adicionados.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
