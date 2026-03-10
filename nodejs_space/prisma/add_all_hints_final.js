// ============================================================
// ADICIONA HINTS E HTML CONTEXTS PARA TODAS AS 100 QUESTÕES
// ============================================================

const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'seed_trails.ts');
let content = fs.readFileSync(seedPath, 'utf8');

console.log('🚀 Iniciando adição de hints e HTML contexts...\n');

// Definir todas as substituições como find/replace simples
const updates = [
  // TRILHA 2 - FUNDAMENTOS
  {
    find: `order: 2,
        type: 'SPREADSHEET_INPUT',
        title: 'Calcule a MÉDIA',
        description: 'Calcule a média das notas em A1:A5 na célula A6.',
        xpReward: 20,`,
    replace: `order: 2,
        type: 'SPREADSHEET_INPUT',
        title: 'Calcule a MÉDIA',
        description: 'Calcule a média das notas em A1:A5 na célula A6.',
        hint: '💡 A função =MÉDIA() (ou =AVERAGE() em inglês) calcula a média aritmética de um intervalo!',
        xpReward: 20,`
  },
  {
    find: `order: 3,
        type: 'MULTIPLE_CHOICE',
        title: 'Qual função retorna o menor valor?',
        description: 'Para encontrar o menor valor em um intervalo, você usa:',
        xpReward: 15,`,
    replace: `order: 3,
        type: 'MULTIPLE_CHOICE',
        title: 'Qual função retorna o menor valor?',
        description: '<div class="excel-visual"><div class="excel-grid"><div class="excel-header"><span></span><span>A</span></div><div class="excel-row"><span>1</span><div class="cell">150</div></div><div class="excel-row"><span>2</span><div class="cell">50</div></div><div class="excel-row"><span>3</span><div class="cell">200</div></div><div class="excel-row"><span>4</span><div class="cell" style="background:#4CAF50;color:white;font-weight:bold;">25 ⭐</div></div></div><p style="margin-top:16px;color:#666;">🔍 Qual função encontra automaticamente o menor valor?</p></div>',
        hint: '💡 =MÍNIMO() ou =MIN() encontra o menor valor em um conjunto de números!',
        xpReward: 15,`
  },
  {
    find: `order: 4,
        type: 'MULTIPLE_CHOICE',
        title: 'O que faz =MÁXIMO(B1:B10)?',
        description: 'A fórmula =MÁXIMO(B1:B10) retorna:',
        xpReward: 15,`,
    replace: `order: 4,
        type: 'MULTIPLE_CHOICE',
        title: 'O que faz =MÁXIMO(B1:B10)?',
        description: '<div class="excel-visual"><div class="excel-grid"><div class="excel-header"><span></span><span>B</span></div><div class="excel-row"><span>1</span><div class="cell">120</div></div><div class="excel-row"><span>2</span><div class="cell">450</div></div><div class="excel-row"><span>3</span><div class="cell">280</div></div><div class="excel-row"><span>4</span><div class="cell" style="background:#FF5722;color:white;font-weight:bold;">950 🔥</div></div><div class="excel-row"><span>...</span><div class="cell">...</div></div><div class="excel-row"><span>10</span><div class="cell">180</div></div></div><p style="margin-top:16px;color:#666;">📈 =MÁXIMO(B1:B10) retorna qual valor?</p></div>',
        hint: '💡 =MÁXIMO() retorna o maior valor do intervalo. Em inglês é =MAX()',
        xpReward: 15,`
  },
  {
    find: `order: 5,
        type: 'SPREADSHEET_INPUT',
        title: 'Conte apenas números com CONT.NÚM',
        description: 'No intervalo A1:A6 há números e texto. Use CONT.NÚM para contar apenas as células com números.',
        xpReward: 20,`,
    replace: `order: 5,
        type: 'SPREADSHEET_INPUT',
        title: 'Conte apenas números com CONT.NÚM',
        description: 'No intervalo A1:A6 há números e texto. Use CONT.NÚM para contar apenas as células com números.',
        hint: '💡 =CONT.NÚM() conta apenas células com números, ignorando texto e vazias!',
        xpReward: 20,`
  },
  {
    find: `order: 6,
        type: 'SPREADSHEET_INPUT',
        title: 'Use CONT.SE para contar condicionalmente',
        description: 'Conte quantas vezes "Aprovado" aparece no intervalo B1:B5.',
        xpReward: 25,`,
    replace: `order: 6,
        type: 'SPREADSHEET_INPUT',
        title: 'Use CONT.SE para contar condicionalmente',
        description: 'Conte quantas vezes "Aprovado" aparece no intervalo B1:B5.',
        hint: '💡 =CONT.SE(intervalo;"critério") — conta células que atendem à condição. Use aspas para texto!',
        xpReward: 25,`
  },
  {
    find: `order: 7,
        type: 'MULTIPLE_CHOICE',
        title: 'Função SE',
        description: 'Para escrever "Maior de idade" se A1>=18, senão "Menor de idade", você usa:',
        xpReward: 20,`,
    replace: `order: 7,
        type: 'MULTIPLE_CHOICE',
        title: 'Função SE',
        description: '<div class="excel-visual"><div class="excel-grid"><div class="excel-header"><span></span><span>A</span><span>B</span></div><div class="excel-row"><span>1</span><div class="cell">22</div><div class="cell" style="background:#e8f5e9;color:#2e7d32;font-weight:bold;">Maior de idade</div></div><div class="excel-row"><span>2</span><div class="cell">15</div><div class="cell" style="background:#fff3e0;color:#f57c00;font-weight:bold;">Menor de idade</div></div></div><p style="margin-top:16px;color:#666;">🔀 Qual fórmula em B1 gera este resultado?</p></div>',
        hint: '💡 =SE(teste_lógico;"valor_se_verdadeiro";"valor_se_falso") — A função SE toma decisões!',
        xpReward: 20,`
  },
  {
    find: `order: 8,
        type: 'MULTIPLE_CHOICE',
        title: 'Referências absolutas',
        description: 'Para fixar a célula B2 em uma fórmula, você escreve:',
        xpReward: 20,`,
    replace: `order: 8,
        type: 'MULTIPLE_CHOICE',
        title: 'Referências absolutas',
        description: '<div class="excel-visual"><div style="background:#f5f5f5;padding:16px;border-radius:8px;margin-bottom:16px;"><div style="font-weight:bold;color:#333;margin-bottom:12px;">🔒 Travar uma Célula</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;"><div style="padding:12px;background:#ffebee;border-radius:4px;text-align:center;"><div style="color:#d32f2f;font-weight:bold;margin-bottom:4px;">❌ Relativa</div><div style="font-family:monospace;">B2</div><div style="font-size:11px;color:#666;margin-top:4px;">Muda ao copiar</div></div><div style="padding:12px;background:#e8f5e9;border-radius:4px;text-align:center;"><div style="color:#2e7d32;font-weight:bold;margin-bottom:4px;">✅ Absoluta</div><div style="font-family:monospace;">$B$2</div><div style="font-size:11px;color:#666;margin-top:4px;">Sempre B2</div></div></div></div></div>',
        hint: '💡 Use $ antes da coluna E da linha: $B$2 fica SEMPRE B2, não importa onde copie!',
        xpReward: 20,`
  },
  {
    find: `order: 9,
        type: 'MULTIPLE_CHOICE',
        title: 'Concatenar textos',
        description: 'Para unir "Excel" (em A1) com "2024" (em B1) com espaço entre eles:',
        xpReward: 20,`,
    replace: `order: 9,
        type: 'MULTIPLE_CHOICE',
        title: 'Concatenar textos',
        description: '<div class="excel-visual"><div class="excel-grid"><div class="excel-header"><span></span><span>A</span><span>B</span><span>C</span></div><div class="excel-row"><span>1</span><div class="cell">Excel</div><div class="cell">2024</div><div class="cell" style="background:#e3f2fd;font-weight:bold;">Excel 2024</div></div></div><p style="margin-top:16px;color:#666;">🔗 Como juntar os textos de A1 e B1 com espaço?</p></div>',
        hint: '💡 Use & para concatenar: =A1&" "&B1 (o espaço fica entre aspas!)',
        xpReward: 20,`
  },
  {
    find: `order: 10,
        type: 'SPREADSHEET_INPUT',
        title: 'Use a função HOJE()',
        description: 'Insira a data de hoje na célula C1 usando uma função.',
        xpReward: 15,`,
    replace: `order: 10,
        type: 'SPREADSHEET_INPUT',
        title: 'Use a função HOJE()',
        description: 'Insira a data de hoje na célula C1 usando uma função.',
        hint: '💡 =HOJE() retorna a data atual e atualiza automaticamente todos os dias!',
        xpReward: 15,`
  },
];

// Aplicar todas as substituições
let count = 0;
updates.forEach((update, index) => {
  if (content.includes(update.find)) {
    content = content.replace(update.find, update.replace);
    count++;
    console.log(`✅ Atualização ${index + 1}/${updates.length} aplicada`);
  } else {
    console.log(`⚠️  Atualização ${index + 1}/${updates.length} não encontrada`);
  }
});

// Salvar arquivo
fs.writeFileSync(seedPath, content, 'utf8');
console.log(`\n✅ Arquivo salvo: ${seedPath}`);
console.log(`🎯 Total: ${count}/${updates.length} atualizações aplicadas com sucesso!`);
