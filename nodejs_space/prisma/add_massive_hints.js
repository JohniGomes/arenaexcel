// ============================================================
// ADICIONA HINTS PARA TODAS AS QUEST\u00d5ES RESTANTES
// ============================================================

const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'seed_trails.ts');
let content = fs.readFileSync(seedPath, 'utf8');

console.log('\ud83d\ude80 Adicionando hints para todas as quest\u00f5es restantes...\n');

// Fun\u00e7\u00e3o para adicionar hint ap\u00f3s "xpReward: X,"
function addHintAfterXpReward(questionTitle, hint) {
  // Procura o padr\u00e3o: title: 'TITULO', ... xpReward: N,
  // E adiciona o hint logo depois
  const titlePattern = `title: '${questionTitle}',`;
  
  // Encontrar a posi\u00e7\u00e3o do t\u00edtulo
  const titleIndex = content.indexOf(titlePattern);
  if (titleIndex === -1) {
    console.log(`\u26a0\ufe0f  N\u00e3o encontrado: "${questionTitle}"`);
    return false;
  }
  
  // Encontrar o pr\u00f3ximo "xpReward:" ap\u00f3s o t\u00edtulo
  const searchFrom = titleIndex;
  const xpRewardPattern = /xpReward: \d+,/;
  const remainingContent = content.substring(searchFrom);
  const xpMatch = remainingContent.match(xpRewardPattern);
  
  if (!xpMatch) {
    console.log(`\u26a0\ufe0f  xpReward n\u00e3o encontrado para: "${questionTitle}"`);
    return false;
  }
  
  const xpRewardFullMatch = xpMatch[0];
  const xpRewardIndex = content.indexOf(xpRewardFullMatch, searchFrom);
  
  // Verificar se j\u00e1 tem hint logo depois
  const afterXpReward = content.substring(xpRewardIndex + xpRewardFullMatch.length, xpRewardIndex + xpRewardFullMatch.length + 200);
  if (afterXpReward.trim().startsWith('hint:')) {
    console.log(`\u2705 Hint j\u00e1 existe: "${questionTitle}"`);
    return false;
  }
  
  // Adicionar o hint
  const insertPosition = xpRewardIndex + xpRewardFullMatch.length;
  const hintLine = `\n        hint: '${hint}',`;
  
  content = content.substring(0, insertPosition) + hintLine + content.substring(insertPosition);
  console.log(`\u2705 Hint adicionado: "${questionTitle}"`);
  return true;
}

// Lista de todas as quest\u00f5es com seus hints
const questionsWithHints = [
  // TRILHA 3 - F\u00d3RMULAS ESSENCIAIS
  { title: 'SOMASE: Soma com condi\u00e7\u00e3o', hint: '\ud83d\udca1 =SOMASE(intervalo_crit\u00e9rio;crit\u00e9rio;intervalo_soma) \u2014 Soma apenas valores que atendem \u00e0 condi\u00e7\u00e3o!' },
  { title: 'CONT.SE: Contar com condi\u00e7\u00e3o', hint: '\ud83d\udca1 =CONT.SE(intervalo;condi\u00e7\u00e3o) \u2014 Conta quantas c\u00e9lulas atendem ao crit\u00e9rio. Use aspas para texto!' },
  { title: 'SOMASES: M\u00faltiplas condi\u00e7\u00f5es', hint: '\ud83d\udca1 =SOMASES permite aplicar MAIS DE UM crit\u00e9rio ao mesmo tempo! Muito poderoso.' },
  { title: 'Concatenar com CONCATENAR()', hint: '\ud83d\udca1 =CONCATENAR(A1;\" \";B1) junta textos. Mais moderno: =A1&\" \"&B1 ou =UNIRTEXTO()' },
  { title: 'Fun\u00e7\u00e3o HOJE()', hint: '\ud83d\udca1 =HOJE() retorna a data atual. Atualiza automaticamente todo dia! \ud83d\udcc5' },
  { title: 'Fun\u00e7\u00e3o AGORA()', hint: '\ud83d\udca1 =AGORA() retorna data E hora atual. Diferente de =HOJE() que \u00e9 s\u00f3 a data!' },
  { title: 'Extrair ANO de uma data', hint: '\ud83d\udca1 =ANO(data) extrai o ano. Tamb\u00e9m existem =M\u00caS() e =DIA() para outras partes!' },
  { title: 'PROCV: Busca vertical', hint: '\ud83d\udca1 =PROCV(valor_procurado;tabela;n\u00famero_coluna;0) \u2014 O \"0\" no final significa correspond\u00eancia EXATA!' },
  { title: 'SE aninhado', hint: '\ud83d\udca1 Voc\u00ea pode colocar um =SE() dentro de outro! =SE(teste1;resultado1;SE(teste2;resultado2;resultado3))' },
  { title: 'Fun\u00e7\u00f5es E() e OU()', hint: '\ud83d\udca1 =E() precisa que TODAS condi\u00e7\u00f5es sejam verdadeiras. =OU() precisa de apenas UMA verdadeira!' },
  
  // TRILHA 4 - AN\u00c1LISE DE DADOS
  { title: 'Ativar filtros', hint: '\ud83d\udca1 Selecione os cabe\u00e7alhos > Dados > Filtro. Aparecem setinhas para filtrar!' },
  { title: 'Classificar dados', hint: '\ud83d\udca1 Selecione a coluna > Dados > Classificar > Crescente (A\u2192Z) ou Decrescente (Z\u2192A)' },
  { title: 'Congelar pain\u00e9is', hint: '\ud83d\udca1 Clique na linha ABAIXO do que quer congelar > Exibir > Congelar Pain\u00e9is > Congelar Primeira Linha' },
  { title: 'Remover duplicatas', hint: '\ud83d\udca1 Selecione os dados > Dados > Remover Duplicatas. Mant\u00e9m apenas a 1\u00aa ocorr\u00eancia!' },
  { title: 'Valida\u00e7\u00e3o de dados (lista suspensa)', hint: '\ud83d\udca1 Selecione a c\u00e9lula > Dados > Valida\u00e7\u00e3o > Permitir: Lista > Digite as op\u00e7\u00f5es separadas por v\u00edrgula' },
  { title: 'Formata\u00e7\u00e3o condicional', hint: '\ud83d\udca1 P\u00e1gina Inicial > Formata\u00e7\u00e3o Condicional > Real\u00e7ar Regras > defina a condi\u00e7\u00e3o e a cor!' },
  { title: 'Tabela Din\u00e2mica: conceito', hint: '\ud83d\udca1 Tabelas Din\u00e2micas resumem grandes volumes de dados sem alterar a planilha original!' },
  { title: 'Segmenta\u00e7\u00e3o de dados', hint: '\ud83d\udca1 Segmenta\u00e7\u00f5es (Slicers) s\u00e3o bot\u00f5es visuais para filtrar Tabelas Din\u00e2micas rapidamente!' },
  { title: 'PROCX vs PROCV', hint: '\ud83d\udca1 PROCX pode buscar em qualquer dire\u00e7\u00e3o (esquerda/direita). PROCV s\u00f3 busca da esquerda pra direita!' },
  { title: 'Atingir Meta', hint: '\ud83d\udca1 Dados > Teste de Hip\u00f3teses > Atingir Meta. Define automaticamente o valor necess\u00e1rio!' },
  
  // TRILHA 5 - GR\u00c1FICOS PROFISSIONAIS
  { title: 'Escolher tipo de gr\u00e1fico', hint: '\ud83d\udca1 Linha = tend\u00eancias no tempo. Colunas = compara\u00e7\u00f5es. Pizza = propor\u00e7\u00f5es de um total.' },
  { title: 'Gr\u00e1fico de pizza: quando usar', hint: '\ud83d\udca1 Use pizza para mostrar partes de um TODO (100%). Ex: participa\u00e7\u00e3o de mercado por regi\u00e3o.' },
  { title: 'Adicionar t\u00edtulo ao gr\u00e1fico', hint: '\ud83d\udca1 Clique no gr\u00e1fico > Ferramentas de Gr\u00e1fico > Design > Adicionar Elemento > T\u00edtulo do Gr\u00e1fico' },
  { title: 'Eixos X e Y', hint: '\ud83d\udca1 Eixo Y (vertical) = VALORES num\u00e9ricos. Eixo X (horizontal) = CATEGORIAS (meses, produtos)' },
  { title: 'Legenda', hint: '\ud83d\udca1 A legenda explica o significado de cada cor/s\u00edmbolo no gr\u00e1fico!' },
  { title: 'R\u00f3tulos de dados', hint: '\ud83d\udca1 Clique no gr\u00e1fico > Adicionar Elemento > R\u00f3tulos de Dados > escolha a posi\u00e7\u00e3o!' },
  { title: 'Gr\u00e1ficos combinados', hint: '\ud83d\udca1 Sim! Use \"Gr\u00e1fico de Combina\u00e7\u00e3o\" para misturar colunas + linhas. Ideal para escalas diferentes!' },
  { title: 'Minigr\u00e1ficos (Sparklines)', hint: '\ud83d\udca1 Inserir > Minigr\u00e1ficos. Cabem dentro de uma c\u00e9lula e mostram tend\u00eancias rapidamente!' },
  { title: 'Mudar cores do gr\u00e1fico', hint: '\ud83d\udca1 Clique na coluna/barra > Formatar S\u00e9rie de Dados > Preenchimento > escolha a cor!' },
  { title: 'Gr\u00e1fico Din\u00e2mico', hint: '\ud83d\udca1 Gr\u00e1fico Din\u00e2mico \u00e9 baseado em Tabela Din\u00e2mica. Se atualiza automaticamente ao filtrar!' },
  
  // TRILHA 6 - EXCEL PARA LOG\u00cdSTICA
  { title: 'Prazo de entrega com DIAS()', hint: '\ud83d\udca1 =DIAS(data_final;data_inicial) calcula quantos dias entre duas datas!' },
  { title: 'DIATRABALHO: dias \u00fateis', hint: '\ud83d\udca1 =DIATRABALHO(data_inicial;dias) adiciona dias \u00fateis, pulando s\u00e1bados e domingos!' },
  { title: 'Estoque m\u00ednimo', hint: '\ud83d\udca1 Use =SE() para verificar: se estoque < m\u00ednimo, alertar \"REABASTECER\"!' },
  { title: 'Tempo m\u00e9dio de entrega', hint: '\ud83d\udca1 Use =M\u00c9DIA() para calcular a m\u00e9dia de prazos. Ajuda no planejamento!' },
  { title: 'SOMASE para contar entregas por regi\u00e3o', hint: '\ud83d\udca1 =SOMASE(coluna_regi\u00e3o;\"Sul\";coluna_quantidade) soma apenas do Sul!' },
  { title: 'PROCV para buscar pre\u00e7o', hint: '\ud83d\udca1 =PROCV(c\u00f3digo_produto;tabela_pre\u00e7os;coluna_pre\u00e7o;0) busca o pre\u00e7o automaticamente!' },
  { title: 'Custo total de frete', hint: '\ud83d\udca1 Multiplique quantidade * pre\u00e7o unit\u00e1rio. Use =SOMA() para totalizar!' },
  { title: 'Forecast: proje\u00e7\u00e3o de demanda', hint: '\ud83d\udca1 Use =PREVIS\u00c3O.LINEAR() para prever valores futuros baseado em hist\u00f3rico!' },
  { title: 'ROT\u00c1VEL: performance de estoque', hint: '\ud83d\udca1 Rotatividade = Vendas / Estoque M\u00e9dio. Quanto maior, melhor!' },
  { title: 'Dashboard log\u00edstico', hint: '\ud83d\udca1 Combine gr\u00e1ficos, tabelas din\u00e2micas e formata\u00e7\u00e3o condicional para um painel visual!' },
  
  // TRILHA 7 - EXCEL PARA FINAN\u00c7AS
  { title: 'Juros simples', hint: '\ud83d\udca1 Juros Simples = Capital * Taxa * Tempo. F\u00f3rmula: =C1*taxa*meses' },
  { title: 'Juros compostos', hint: '\ud83d\udca1 Montante = Capital * (1+taxa)^tempo. Use =C1*(1+taxa)^meses' },
  { title: 'VPL: Valor Presente L\u00edquido', hint: '\ud83d\udca1 =VPL(taxa;fluxos) calcula o valor presente de investimentos futuros!' },
  { title: 'TIR: Taxa Interna de Retorno', hint: '\ud83d\udca1 =TIR(fluxos) retorna a taxa de retorno de um investimento. Quanto maior, melhor!' },
  { title: 'PGTO: Parcela de empr\u00e9stimo', hint: '\ud83d\udca1 =PGTO(taxa;n\u00famero_per\u00edodos;valor_presente) calcula a parcela mensal!' },
  { title: 'Amortiza\u00e7\u00e3o: sistema SAC', hint: '\ud83d\udca1 SAC = Amortiza\u00e7\u00e3o constante. Parcelas decrescentes ao longo do tempo!' },
  { title: 'Markup e margem', hint: '\ud83d\udca1 Markup = Pre\u00e7o/Custo. Margem = (Pre\u00e7o-Custo)/Pre\u00e7o. S\u00e3o diferentes!' },
  { title: 'Ponto de equil\u00edbrio', hint: '\ud83d\udca1 PE = Custos Fixos / (Pre\u00e7o - Custo Vari\u00e1vel Unit\u00e1rio). Quando lucro = 0!' },
  { title: 'ROI: Retorno sobre investimento', hint: '\ud83d\udca1 ROI = (Ganho - Investimento) / Investimento * 100. Resultado em %!' },
  { title: 'DRE: Demonstra\u00e7\u00e3o do Resultado', hint: '\ud83d\udca1 DRE = Receitas - Custos - Despesas. Use estrutura hier\u00e1rquica com =SOMA()!' },
  
  // TRILHA 8 - PRODUTIVIDADE NO EXCEL
  { title: 'Atalho Ctrl+C / Ctrl+V', hint: '\ud83d\udca1 Ctrl+C copia. Ctrl+V cola. Ctrl+X recorta. Atalhos universais!' },
  { title: 'Preencher sem arrastar', hint: '\ud83d\udca1 Selecione as c\u00e9lulas > Ctrl+D preenche pra BAIXO. Ctrl+R preenche pra DIREITA!' },
  { title: 'Colar Especial: valores', hint: '\ud83d\udca1 Ctrl+Alt+V abre Colar Especial. Escolha \"Valores\" para colar SEM f\u00f3rmulas!' },
  { title: 'Localizar e Substituir', hint: '\ud83d\udca1 Ctrl+L localiza. Ctrl+U substitui. Troca texto em TODA a planilha de uma vez!' },
  { title: 'Ir para c\u00e9lula espec\u00edfica', hint: '\ud83d\udca1 Ctrl+G ou F5 > digite o endere\u00e7o (ex: Z999) > Enter. Pula direto!' },
  { title: 'Formatar como tabela', hint: '\ud83d\udca1 Selecione os dados > Ctrl+T transforma em Tabela. Adiciona filtros e estilo automaticamente!' },
  { title: 'Autofiltro r\u00e1pido', hint: '\ud83d\udca1 Ctrl+Shift+L ativa/desativa filtros rapidamente sem abrir menus!' },
  { title: 'Flash Fill: preenchimento inteligente', hint: '\ud83d\udca1 Digite 1-2 exemplos do padr\u00e3o. Ctrl+E completa o resto automaticamente! M\u00e1gico!' },
  { title: 'Remover formata\u00e7\u00e3o', hint: '\ud83d\udca1 P\u00e1gina Inicial > Limpar > Limpar Formatos. Remove cores/bordas mas mant\u00e9m conte\u00fado!' },
  { title: 'DRAG AND DROP: Reorganizar fluxo de trabalho', hint: '\ud83d\udca1 Organize tarefas em ordem l\u00f3gica: Preparar dados \u2192 Analisar \u2192 Criar relat\u00f3rio \u2192 Automatizar!' },
  
  // TRILHA 9 - EXCEL AVAN\u00c7ADO
  { title: 'Tabela Din\u00e2mica avan\u00e7ada', hint: '\ud83d\udca1 Arraste campos para \u00c1rea de Linhas, Colunas, Valores e Filtros. Reorganize livremente!' },
  { title: 'Campos calculados em TD', hint: '\ud83d\udca1 Dentro da Tabela Din\u00e2mica: Analisar > Campos > Item Calculado. Cria novas m\u00e9tricas!' },
  { title: '\u00cdndice + CORRESP', hint: '\ud83d\udca1 =\u00cdNDICE(matriz;CORRESP(valor;coluna;0)) \u00e9 mais flex\u00edvel que PROCV!' },
  { title: 'Tabelas estruturadas', hint: '\ud83d\udca1 Ao formatar como Tabela (Ctrl+T), use refer\u00eancias como: Tabela1[Vendas] em vez de $B$2:$B$10!' },
  { title: 'Fun\u00e7\u00e3o SEERRO', hint: '\ud83d\udca1 =SEERRO(f\u00f3rmula;valor_se_erro) esconde erros #DIV/0!, #N/D, etc. Ex: =SEERRO(A1/B1;0)' },
  { title: 'DESLOC: refer\u00eancias din\u00e2micas', hint: '\ud83d\udca1 =DESLOC(base;linhas;colunas;altura;largura) cria intervalos que crescem automaticamente!' },
  { title: 'Power Query: conectar dados', hint: '\ud83d\udca1 Dados > Obter Dados > importa de v\u00e1rias fontes e transforma antes de carregar!' },
  { title: 'Remover espa\u00e7os extras', hint: '\ud83d\udca1 =ARRUMAR(texto) remove espa\u00e7os extras no in\u00edcio, fim e entre palavras!' },
  { title: 'Macros: automatizar tarefas', hint: '\ud83d\udca1 Desenvolvedor > Gravar Macro. Fa\u00e7a as a\u00e7\u00f5es. Pare. Agora execute com um clique!' },
  { title: '\u00c9() para tipo de dado', hint: '\ud83d\udca1 =\u00c9.N\u00daM(A1) testa se \u00e9 n\u00famero. Tamb\u00e9m: =\u00c9.TEXTO(), =\u00c9.VAZIO(), =\u00c9.ERRO()' },
  
  // TRILHA 10 - EXCEL + IA
  { title: 'Fun\u00e7\u00e3o PREVER do Excel', hint: '\ud83d\udca1 =PREVIS\u00c3O.LINEAR() faz regress\u00e3o linear simples. Preveja valores futuros!' },
  { title: 'An\u00e1lise R\u00e1pida com IA', hint: '\ud83d\udca1 Selecione dados > bot\u00e3o An\u00e1lise R\u00e1pida (canto inferior direito) \u2192 sugest\u00f5es autom\u00e1ticas!' },
  { title: 'Insights autom\u00e1ticos', hint: '\ud83d\udca1 P\u00e1gina Inicial > Analisar Dados (365). IA sugere gr\u00e1ficos e tend\u00eancias!' },
  { title: 'Tipos de Dados (a\u00e7\u00f5es/geografia)', hint: '\ud83d\udca1 Digite nome de cidade/empresa > Dados > Tipos de Dados. IA busca informa\u00e7\u00f5es online!' },
  { title: 'FILTRAR() - f\u00f3rmula din\u00e2mica', hint: '\ud83d\udca1 =FILTRAR(matriz;condi\u00e7\u00e3o) retorna apenas linhas que atendem ao crit\u00e9rio. Atualiza sozinho!' },
  { title: '\u00danico() - remover duplicatas', hint: '\ud83d\udca1 =\u00danico(matriz) retorna apenas valores \u00fanicos. Mais r\u00e1pido que Remover Duplicatas!' },
  { title: 'SEQUÊNCIA() - gerar listas', hint: '\ud83d\udca1 =SEQU\u00caNCIA(linhas;colunas;in\u00edcio;incremento) cria listas autom\u00e1ticas. Ex: 1,2,3...100!' },
  { title: 'CLASSIFICAR() - ordenar automaticamente', hint: '\ud83d\udca1 =CLASSIFICAR(matriz;coluna_\u00edndice;ordem) ordena dados dinamicamente sem alterar originais!' },
  { title: 'Power BI: integra\u00e7\u00e3o', hint: '\ud83d\udca1 Exporte para Power BI Desktop para dashboards interativos avan\u00e7ados!' },
  { title: 'DRAG AND DROP: IA em a\u00e7\u00e3o', hint: '\ud83d\udca1 Organize os conceitos de IA aplicados ao Excel: dados \u2192 an\u00e1lise \u2192 automa\u00e7\u00e3o \u2192 insights!' },
];

// Aplicar hints
let count = 0;
questionsWithHints.forEach((q, index) => {
  const added = addHintAfterXpReward(q.title, q.hint);
  if (added) count++;
  if ((index + 1) % 10 === 0) {
    console.log(`\nProgresso: ${index + 1}/${questionsWithHints.length}`);
  }
});

// Salvar
fs.writeFileSync(seedPath, content, 'utf8');
console.log(`\n\u2705 Arquivo salvo: ${seedPath}`);
console.log(`\ud83c\udfaf Total: ${count}/${questionsWithHints.length} hints adicionados!`);
console.log(`\n\u2728 Todas as quest\u00f5es agora t\u00eam hints!`);
