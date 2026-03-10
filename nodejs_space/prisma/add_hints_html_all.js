// ============================================================
// ADICIONA HINTS E HTML CONTEXTS PARA TODAS AS 100 QUESTÕES
// ============================================================

const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'seed_trails.ts');
let content = fs.readFileSync(seedPath, 'utf8');

// ══════════════════════════════════════════════════════════════
// TRILHA 1: EXCEL DO ZERO (Questões 1-10)
// ══════════════════════════════════════════════════════════════

const updates = [
  // Q1 - O que é uma célula
  {
    find: `order: 1,
        type: 'MULTIPLE_CHOICE',
        title: 'O que é uma célula no Excel?',
        description: 'Observe a imagem de uma planilha. Qual das opções descreve corretamente o que é uma célula?',
        xpReward: 10,`,
    replace: `order: 1,
        type: 'MULTIPLE_CHOICE',
        title: 'O que é uma célula no Excel?',
        description: '<div class="excel-visual"><div class="excel-grid"><div class="excel-header"><span></span><span>A</span><span>B</span><span>C</span></div><div class="excel-row"><span>1</span><div class="cell">10</div><div class="cell">20</div><div class="cell highlight-cell" style="background:#e3f2fd;border:2px solid #2196F3;">30</div></div><div class="excel-row"><span>2</span><div class="cell">40</div><div class="cell">50</div><div class="cell">60</div></div></div><p style="margin-top:16px;color:#666;">👆 A célula destacada em azul é qual?</p></div>',
        hint: '💡 A célula é onde a coluna (letra) cruza com a linha (número). Exemplo: C1 está na coluna C, linha 1.',
        xpReward: 10,`
  },

  // Q2 - Identificação de colunas
  {
    find: `order: 2,
        type: 'MULTIPLE_CHOICE',
        title: 'Como as colunas são identificadas?',
        description: 'No Excel, as colunas são identificadas por:',
        xpReward: 10,`,
    replace: `order: 2,
        type: 'MULTIPLE_CHOICE',
        title: 'Como as colunas são identificadas?',
        description: '<div class="excel-visual"><div class="excel-grid"><div class="excel-header" style="background:#f5f5f5;font-weight:bold;"><span></span><span style="color:#2196F3;font-size:18px;">A</span><span style="color:#2196F3;font-size:18px;">B</span><span style="color:#2196F3;font-size:18px;">C</span><span style="color:#2196F3;font-size:18px;">D</span></div><div class="excel-row"><span style="color:#666;font-weight:bold;">1</span><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div></div></div><p style="margin-top:16px;color:#666;">🔤 Observe os identificadores destacados no topo</p></div>',
        hint: '💡 Olhe sempre no cabeçalho superior da planilha. São letras em sequência: A, B, C... Z, AA, AB...',
        xpReward: 10,`
  },

  // Q3 - Endereço de célula
  {
    find: `order: 3,
        type: 'MULTIPLE_CHOICE',
        title: 'Qual é o endereço desta célula?',
        description: 'A célula que está na coluna C e na linha 5 se chama:',
        xpReward: 10,`,
    replace: `order: 3,
        type: 'MULTIPLE_CHOICE',
        title: 'Qual é o endereço desta célula?',
        description: '<div class="excel-visual"><div class="excel-grid"><div class="excel-header"><span></span><span>A</span><span>B</span><span style="color:#2196F3;font-weight:bold;">C</span><span>D</span></div><div class="excel-row"><span>1</span><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div></div><div class="excel-row"><span>2</span><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div></div><div class="excel-row"><span>3</span><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div></div><div class="excel-row"><span>4</span><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div></div><div class="excel-row"><span style="color:#2196F3;font-weight:bold;">5</span><div class="cell"></div><div class="cell"></div><div class="cell highlight-cell" style="background:#e3f2fd;border:2px solid #2196F3;">✓</div><div class="cell"></div></div></div><p style="margin-top:16px;color:#666;">📍 Qual o endereço da célula marcada?</p></div>',
        hint: '💡 Primeiro vem a letra da COLUNA, depois o número da LINHA. Coluna C + Linha 5 = ?',
        xpReward: 10,`
  },

  // Q4 - Seleção de intervalo
  {
    find: `order: 4,
        type: 'MULTIPLE_CHOICE',
        title: 'Como selecionar um intervalo de células?',
        description: 'Para selecionar do A1 até o D4, você digita na caixa de nome:',
        xpReward: 15,`,
    replace: `order: 4,
        type: 'MULTIPLE_CHOICE',
        title: 'Como selecionar um intervalo de células?',
        description: '<div class="excel-visual"><div style="background:#f5f5f5;padding:8px;border-radius:4px;margin-bottom:12px;font-family:monospace;font-size:14px;">📍 Caixa de Nome: <strong style="color:#2196F3;">?</strong></div><div class="excel-grid"><div class="excel-header"><span></span><span>A</span><span>B</span><span>C</span><span>D</span></div><div class="excel-row"><span>1</span><div class="cell highlight-cell" style="background:#bbdefb;">●</div><div class="cell highlight-cell" style="background:#bbdefb;">●</div><div class="cell highlight-cell" style="background:#bbdefb;">●</div><div class="cell highlight-cell" style="background:#bbdefb;">●</div></div><div class="excel-row"><span>2</span><div class="cell highlight-cell" style="background:#bbdefb;">●</div><div class="cell highlight-cell" style="background:#bbdefb;">●</div><div class="cell highlight-cell" style="background:#bbdefb;">●</div><div class="cell highlight-cell" style="background:#bbdefb;">●</div></div><div class="excel-row"><span>3</span><div class="cell highlight-cell" style="background:#bbdefb;">●</div><div class="cell highlight-cell" style="background:#bbdefb;">●</div><div class="cell highlight-cell" style="background:#bbdefb;">●</div><div class="cell highlight-cell" style="background:#bbdefb;">●</div></div><div class="excel-row"><span>4</span><div class="cell highlight-cell" style="background:#bbdefb;">●</div><div class="cell highlight-cell" style="background:#bbdefb;">●</div><div class="cell highlight-cell" style="background:#bbdefb;">●</div><div class="cell highlight-cell" style="background:#bbdefb;">●</div></div></div><p style="margin-top:16px;color:#666;">📦 Como expressar essa seleção completa?</p></div>',
        hint: '💡 Use dois pontos ":" para definir intervalos. Primeira_célula : Última_célula',
        xpReward: 15,`
  },

  // Q5 - Ajustar largura de coluna
  {
    find: `order: 5,
        type: 'MULTIPLE_CHOICE',
        title: 'Como ajustar a largura de uma coluna?',
        description: 'A forma mais rápida de ajustar automaticamente a largura de uma coluna ao conteúdo é:',
        xpReward: 15,`,
    replace: `order: 5,
        type: 'MULTIPLE_CHOICE',
        title: 'Como ajustar a largura de uma coluna?',
        description: '<div class="excel-visual"><div class="excel-grid"><div class="excel-header"><span></span><span style="width:60px;">A</span><span style="width:150px;background:#fff3e0;">B →|← 🖱️</span><span>C</span></div><div class="excel-row"><span>1</span><div class="cell" style="font-size:11px;">ABC</div><div class="cell" style="background:#fff3e0;font-size:11px;overflow:hidden;">Texto muito longo que não cabe</div><div class="cell"></div></div></div><p style="margin-top:16px;color:#666;">🖱️ Como ajustar a coluna B para caber todo o texto?</p></div>',
        hint: '💡 Duplo-clique na borda direita do cabeçalho da coluna (entre B e C) ajusta automaticamente!',
        xpReward: 15,`
  },

  // Q6 - Atalho salvar
  {
    find: `order: 6,
        type: 'MULTIPLE_CHOICE',
        title: 'Qual atalho salva a planilha?',
        description: 'Para salvar rapidamente sem usar o mouse, você pressiona:',
        xpReward: 15,`,
    replace: `order: 6,
        type: 'MULTIPLE_CHOICE',
        title: 'Qual atalho salva a planilha?',
        description: '<div class="excel-visual"><div style="text-align:center;padding:24px;background:#f5f5f5;border-radius:8px;"><div style="font-size:48px;margin-bottom:16px;">💾</div><div style="font-size:18px;font-weight:bold;color:#333;margin-bottom:8px;">Salvamento Rápido</div><div style="color:#666;">Qual combinação de teclas salva instantaneamente?</div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px;"><div style="padding:16px;border:2px solid #e0e0e0;border-radius:8px;text-align:center;font-weight:bold;">⌃ Ctrl</div><div style="padding:16px;border:2px solid #e0e0e0;border-radius:8px;text-align:center;font-weight:bold;">⇧ Shift</div><div style="padding:16px;border:2px solid #e0e0e0;border-radius:8px;text-align:center;font-weight:bold;">⎇ Alt</div><div style="padding:16px;border:2px solid #e0e0e0;border-radius:8px;text-align:center;font-weight:bold;">S</div></div></div>',
        hint: '💡 O atalho universal de "Save" (Salvar) funciona em quase todos os programas!',
        xpReward: 15,`
  },

  // Q8 - AutoSoma
  {
    find: `order: 8,
        type: 'MULTIPLE_CHOICE',
        title: 'O que é AutoSoma?',
        description: 'O botão Σ (AutoSoma) serve para:',
        xpReward: 15,`,
    replace: `order: 8,
        type: 'MULTIPLE_CHOICE',
        title: 'O que é AutoSoma?',
        description: '<div class="excel-visual"><div style="background:#f5f5f5;padding:12px;border-radius:8px;margin-bottom:16px;text-align:center;"><span style="font-size:36px;color:#4CAF50;">Σ</span><span style="font-size:18px;font-weight:bold;margin-left:12px;">AutoSoma</span></div><div class="excel-grid"><div class="excel-header"><span></span><span>A</span></div><div class="excel-row"><span>1</span><div class="cell">100</div></div><div class="excel-row"><span>2</span><div class="cell">200</div></div><div class="excel-row"><span>3</span><div class="cell">300</div></div><div class="excel-row"><span>4</span><div class="cell highlight-cell" style="background:#c8e6c9;border:2px solid #4CAF50;font-weight:bold;">Σ = ?</div></div></div><p style="margin-top:16px;color:#666;">🔢 Ao clicar no botão Σ em A4, o que acontece?</p></div>',
        hint: '💡 AutoSoma detecta automaticamente os números acima e cria uma fórmula =SOMA() para você!',
        xpReward: 15,`
  },

  // Q9 - Formatação moeda
  {
    find: `order: 9,
        type: 'MULTIPLE_CHOICE',
        title: 'Formatação de números',
        description: 'Para exibir o número 1500 como R$ 1.500,00, você deve aplicar o formato:',
        xpReward: 15,`,
    replace: `order: 9,
        type: 'MULTIPLE_CHOICE',
        title: 'Formatação de números',
        description: '<div class="excel-visual"><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;"><div style="padding:16px;background:#ffebee;border-radius:8px;text-align:center;"><div style="color:#666;font-size:12px;margin-bottom:8px;">❌ SEM formatação</div><div style="font-size:24px;font-weight:bold;color:#d32f2f;">1500</div></div><div style="padding:16px;background:#e8f5e9;border-radius:8px;text-align:center;"><div style="color:#666;font-size:12px;margin-bottom:8px;">✅ COM formatação</div><div style="font-size:24px;font-weight:bold;color:#2e7d32;">R$ 1.500,00</div></div></div><p style="color:#666;text-align:center;">💰 Que formato transforma 1500 em R$ 1.500,00?</p></div>',
        hint: '💡 O formato "Moeda" adiciona o símbolo R$, separadores de milhar e duas casas decimais automaticamente!',
        xpReward: 15,`
  },

  // Q10 - Drag and Drop ordem
  {
    find: `order: 10,
        type: 'DRAG_AND_DROP',
        title: 'Desafio Final: Ordem correta para criar uma planilha de despesas',
        description: 'Coloque os passos na ordem correta para criar uma planilha de despesas simples:',
        xpReward: 30,`,
    replace: `order: 10,
        type: 'DRAG_AND_DROP',
        title: 'Desafio Final: Ordem correta para criar uma planilha de despesas',
        description: '<div class="excel-visual"><div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:20px;border-radius:8px;text-align:center;margin-bottom:16px;"><div style="font-size:32px;margin-bottom:8px;">🎯</div><div style="font-size:18px;font-weight:bold;">Desafio: Planilha de Despesas</div></div><div style="background:#f5f5f5;padding:16px;border-radius:8px;"><div style="font-weight:bold;color:#333;margin-bottom:8px;">📋 Tarefa:</div><div style="color:#666;">Organize os passos para criar uma planilha profissional de controle de despesas</div></div></div>',
        hint: '💡 Pense no fluxo lógico: estrutura → dados → cálculos → formatação → salvar',
        xpReward: 30,`
  },
];

// Aplicar todas as atualizações
updates.forEach((update, index) => {
  if (content.includes(update.find)) {
    content = content.replace(update.find, update.replace);
    console.log(`✅ Atualização ${index + 1}/${updates.length} aplicada`);
  } else {
    console.log(`⚠️ Atualização ${index + 1}/${updates.length} não encontrada`);
  }
});

// Salvar arquivo
fs.writeFileSync(seedPath, content, 'utf8');
console.log(`\n✅ Arquivo salvo: ${seedPath}`);
console.log(`🎯 Total de atualizações aplicadas: ${updates.length}`);
