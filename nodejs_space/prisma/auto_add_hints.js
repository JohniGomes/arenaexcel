const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'seed_trails.ts');
let content = fs.readFileSync(seedPath, 'utf8');

console.log('🚀 Adicionando hints automaticamente para questões sem hint...\n');

// Regex para encontrar blocos de questões
const questionPattern = /{[\s\S]*?order: (\d+),[\s\S]*?type: '([^']+)',[\s\S]*?title: '([^']+)',[\s\S]*?xpReward: (\d+),/g;

let matches = [];
let match;
while ((match = questionPattern.exec(content)) !== null) {
  const fullMatch = match[0];
  const order = match[1];
  const type = match[2];
  const title = match[3];
  const xpReward = match[4];
  
  // Verificar se já tem hint olhando após o xpReward
  const endPos = match.index + fullMatch.length;
  const next200 = content.substring(endPos, endPos + 200);
  const hasHint = next200.trim().startsWith('hint:');
  
  if (!hasHint) {
    matches.push({
      order,
      type,
      title,
      xpReward,
      matchIndex: match.index,
      fullMatch
    });
  }
}

console.log(`📊 Encontradas ${matches.length} questões SEM hint\n`);

// Gerar hints genéricos mas úteis baseados no título
function generateHint(title, type) {
  title = title.toLowerCase();
  
  // Hints específicos por palavras-chave
  if (title.includes('soma') || title.includes('somar')) {
    return '💡 Use =SOMA() para somar intervalos. Ex: =SOMA(A1:A10) soma todas as células de A1 até A10!';
  }
  if (title.includes('média') || title.includes('average')) {
    return '💡 =MÉDIA() ou =AVERAGE() calcula a média aritmética de um intervalo de números!';
  }
  if (title.includes('máximo') || title.includes('maior')) {
    return '💡 =MÁXIMO() ou =MAX() retorna o maior valor de um conjunto de números!';
  }
  if (title.includes('mínimo') || title.includes('menor')) {
    return '💡 =MÍNIMO() ou =MIN() retorna o menor valor de um conjunto de números!';
  }
  if (title.includes('procv')) {
    return '💡 =PROCV(valor;tabela;coluna;0) busca valores verticalmente. O "0" no final significa correspondência exata!';
  }
  if (title.includes('se(') || title.includes('if(') || title.includes('se ') || title.includes('condicional')) {
    return '💡 =SE(teste;valor_se_verdadeiro;valor_se_falso) — A função SE toma decisões baseadas em condições!';
  }
  if (title.includes('cont.') || title.includes('count') || title.includes('contar')) {
    return '💡 Funções de contagem: =CONT.NÚM() conta números, =CONT.SE() conta com condição, =CONT.VALORES() conta células não vazias!';
  }
  if (title.includes('somase') || title.includes('sumif')) {
    return '💡 =SOMASE(intervalo_critério;critério;intervalo_soma) — Soma apenas valores que atendem à condição!';
  }
  if (title.includes('gráfico') || title.includes('chart')) {
    return '💡 Escolha o tipo certo: Linha para tendências, Colunas para comparações, Pizza para proporções!';
  }
  if (title.includes('filtro') || title.includes('filter')) {
    return '💡 Use filtros para visualizar apenas os dados que você precisa sem alterar a planilha original!';
  }
  if (title.includes('tabela dinâmica') || title.includes('pivot')) {
    return '💡 Tabelas Dinâmicas resumem grandes volumes de dados sem alterar a planilha original!';
  }
  if (title.includes('formatação condicional') || title.includes('conditional')) {
    return '💡 Formatação Condicional destaca automaticamente células que atendem a critérios específicos!';
  }
  if (title.includes('$') || title.includes('absolut') || title.includes('fixa')) {
    return '💡 Use $ para travar referências: $A$1 sempre será A1, mesmo ao copiar a fórmula!';
  }
  if (title.includes('concatenar') || title.includes('concat') || title.includes('juntar') || title.includes('&')) {
    return '💡 Use & para juntar textos: =A1&" "&B1 junta células com espaço entre elas!';
  }
  if (title.includes('data') || title.includes('hoje') || title.includes('agora')) {
    return '💡 Funções de data: =HOJE() retorna a data atual, =AGORA() retorna data e hora!';
  }
  if (title.includes('validação')) {
    return '💡 Validação de Dados restringe o que pode ser digitado em uma célula (listas, números, datas)!';
  }
  if (title.includes('dashboard') || title.includes('painel')) {
    return '💡 Dashboards combinam gráficos, tabelas e métricas em uma visão consolidada e visual!';
  }
  if (title.includes('atalho') || title.includes('shortcut') || title.includes('ctrl')) {
    return '💡 Atalhos economizam tempo! Pratique os mais usados até virar automático.';
  }
  if (title.includes('macro')) {
    return '💡 Macros automatizam tarefas repetitivas. Grave uma vez, execute quantas vezes quiser!';
  }
  if (title.includes('power query') || title.includes('power bi')) {
    return '💡 Power Query/BI transformam Excel em ferramenta de Business Intelligence profissional!';
  }
  if (title.includes('ia') || title.includes('inteligência artificial')) {
    return '💡 Excel 365 tem IA integrada! Use Analisar Dados para insights automáticos.';
  }
  
  // Hints genéricos por tipo
  if (type === 'SPREADSHEET_INPUT' || type === 'FORMULA_BUILDER') {
    return '💡 Lembre-se: toda fórmula começa com = (igual). Referências de células atualizam automaticamente!';
  }
  if (type === 'MULTIPLE_CHOICE') {
    return '💡 Leia todas as opções com atenção. A resposta correta geralmente está nos detalhes!';
  }
  if (type === 'DRAG_AND_DROP') {
    return '💡 Pense na sequência lógica: preparação → execução → validação → finalização!';
  }
  if (type === 'CHART_BUILDER') {
    return '💡 Um bom gráfico conta uma história. Escolha o tipo que melhor representa seus dados!';
  }
  
  // Hint padrão
  return '💡 Preste atenção nos detalhes da pergunta. A prática leva à perfeição!';
}

// Aplicar hints (de trás para frente para não bagunçar os índices)
matches.reverse().forEach((q, index) => {
  const hint = generateHint(q.title, q.type);
  const hintLine = `\n        hint: '${hint}',`;
  
  // Encontrar posição logo após "xpReward: N,"
  const xpRewardPos = q.fullMatch.lastIndexOf(`xpReward: ${q.xpReward},`);
  if (xpRewardPos !== -1) {
    const absoluteInsertPos = q.matchIndex + xpRewardPos + `xpReward: ${q.xpReward},`.length;
    content = content.substring(0, absoluteInsertPos) + hintLine + content.substring(absoluteInsertPos);
    console.log(`✅ [${q.order}] ${q.title.substring(0, 50)}...`);
  }
});

fs.writeFileSync(seedPath, content, 'utf8');
console.log(`\n✅ Arquivo salvo!`);
console.log(`🎯 ${matches.length} hints adicionados com sucesso!`);
