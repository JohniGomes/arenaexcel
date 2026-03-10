// ============================================================
// ADICIONA HINTS E HTML PARA TRILHAS 2-10 (91 QUESTÕES)
// ============================================================

const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'seed_trails.ts');
let content = fs.readFileSync(seedPath, 'utf8');

// Array completo de substituições
const replacements = [
  // ══════════════════════════════════════════════════════════
  // TRILHA 2: FUNDAMENTOS DO EXCEL (Questões 1-10)
  // ══════════════════════════════════════════════════════════
  
  // Q1 - SOMA básica (já tem spreadsheetContext)
  {
    pattern: /order: 1,\s+type: 'SPREADSHEET_INPUT',\s+title: 'Use a função SOMA',\s+description: 'Some os valores de A1 até A5 usando a função correta na célula A6\.',\s+xpReward: 20,/,
    replacement: `order: 1,
        type: 'SPREADSHEET_INPUT',
        title: 'Use a função SOMA',
        description: 'Some os valores de A1 até A5 usando a função correta na célula A6.',
        hint: '💡 Use =SOMA(A1:A5) para somar um intervalo de células de uma vez só!',
        xpReward: 20,`
  },

  // Q2 - MÉDIA
  {
    pattern: /order: 2,\s+type: 'SPREADSHEET_INPUT',\s+title: 'Calcule a média',\s+description: 'Calcule a média das vendas de B1 até B4 na célula B5\.',\s+xpReward: 20,/,
    replacement: `order: 2,
        type: 'SPREADSHEET_INPUT',
        title: 'Calcule a média',
        description: 'Calcule a média das vendas de B1 até B4 na célula B5.',
        hint: '💡 A função =MÉDIA() (ou =AVERAGE() em inglês) calcula a média aritmética de um intervalo!',
        xpReward: 20,`
  },

  // Q3 - MÁXIMO
  {
    pattern: /order: 3,\s+type: 'SPREADSHEET_INPUT',\s+title: 'Encontre o maior valor',\s+description: 'Use uma função para encontrar o maior número entre C1 e C5 na célula C6\.',\s+xpReward: 25,/,
    replacement: `order: 3,
        type: 'SPREADSHEET_INPUT',
        title: 'Encontre o maior valor',
        description: 'Use uma função para encontrar o maior número entre C1 e C5 na célula C6.',
        hint: '💡 =MÁXIMO() retorna o maior valor do intervalo. Em inglês é =MAX()',
        xpReward: 25,`
  },

  // Q4 - MÍNIMO
  {
    pattern: /order: 4,\s+type: 'SPREADSHEET_INPUT',\s+title: 'Encontre o menor valor',\s+description: 'Agora encontre o menor valor do intervalo D1:D5 na célula D6\.',\s+xpReward: 25,/,
    replacement: `order: 4,
        type: 'SPREADSHEET_INPUT',
        title: 'Encontre o menor valor',
        description: 'Agora encontre o menor valor do intervalo D1:D5 na célula D6.',
        hint: '💡 =MÍNIMO() ou =MIN() encontra o menor valor em um conjunto de números!',
        xpReward: 25,`
  },

  // Q5 - CONT.NÚM
  {
    pattern: /order: 5,\s+type: 'SPREADSHEET_INPUT',\s+title: 'Conte quantas células têm números',\s+description: 'No intervalo E1:E5, conte quantas células contêm números na célula E6\.',\s+xpReward: 25,/,
    replacement: `order: 5,
        type: 'SPREADSHEET_INPUT',
        title: 'Conte quantas células têm números',
        description: 'No intervalo E1:E5, conte quantas células contêm números na célula E6.',
        hint: '💡 =CONT.NÚM() conta apenas células com números, ignorando texto e vazias!',
        xpReward: 25,`
  },

  // Q6 - SE simples
  {
    pattern: /order: 6,\s+type: 'SPREADSHEET_INPUT',\s+title: 'Função SE: Aprovado ou Reprovado',\s+description: 'A nota está em A1\. Se for >= 7, escreva "Aprovado", senão "Reprovado" na célula B1\.',\s+xpReward: 30,/,
    replacement: `order: 6,
        type: 'SPREADSHEET_INPUT',
        title: 'Função SE: Aprovado ou Reprovado',
        description: 'A nota está em A1. Se for >= 7, escreva "Aprovado", senão "Reprovado" na célula B1.',
        hint: '💡 =SE(A1>=7;"Aprovado";"Reprovado") — primeiro o teste, depois valor_se_verdadeiro, depois valor_se_falso',
        xpReward: 30,`
  },

  // Q7 - Referências relativas
  {
    pattern: /order: 7,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Referências relativas vs\. absolutas',\s+description: 'Ao copiar a fórmula =A1\+B1 de C1 para C2, ela se torna:',\s+xpReward: 25,/,
    replacement: `order: 7,
        type: 'MULTIPLE_CHOICE',
        title: 'Referências relativas vs. absolutas',
        description: '<div class="excel-visual"><div class="excel-grid"><div class="excel-header"><span></span><span>A</span><span>B</span><span>C</span></div><div class="excel-row"><span>1</span><div class="cell">10</div><div class="cell">20</div><div class="cell highlight-cell" style="background:#e3f2fd;">🔵 =A1+B1</div></div><div class="excel-row"><span>2</span><div class="cell">30</div><div class="cell">40</div><div class="cell" style="background:#fff3e0;">🔽 Copiar aqui</div></div></div><p style="margin-top:16px;color:#666;">📋 Ao copiar a fórmula de C1 para C2, ela muda para qual?</p></div>',
        hint: '💡 Referências relativas se ajustam automaticamente! A1 vira A2, B1 vira B2 quando você copia para baixo.',
        xpReward: 25,`
  },

  // Q8 - Fixar referência ($)
  {
    pattern: /order: 8,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Como fixar uma célula na fórmula\?',\s+description: 'Para que a fórmula sempre referencie B1, mesmo ao copiar, você escreve:',\s+xpReward: 30,/,
    replacement: `order: 8,
        type: 'MULTIPLE_CHOICE',
        title: 'Como fixar uma célula na fórmula?',
        description: '<div class="excel-visual"><div style="background:#f5f5f5;padding:16px;border-radius:8px;margin-bottom:16px;"><div style="font-weight:bold;color:#333;margin-bottom:8px;">🔒 Referência Absoluta</div><div style="color:#666;">Use $ antes da coluna e linha para "travar" a célula:</div></div><div class="excel-grid"><div class="excel-header"><span></span><span>A</span><span style="background:#ffe082;">B 🔒</span><span>C</span></div><div class="excel-row"><span style="background:#ffe082;">1 🔒</span><div class="cell"></div><div class="cell" style="background:#ffe082;font-weight:bold;">100</div><div class="cell">=A1*?</div></div><div class="excel-row"><span>2</span><div class="cell"></div><div class="cell" style="background:#ffe082;font-weight:bold;">100</div><div class="cell">=A2*?</div></div></div><p style="margin-top:16px;color:#666;">🎯 B1 deve permanecer fixo ao copiar a fórmula!</p></div>',
        hint: '💡 O símbolo $ "trava" a referência. $B$1 significa: sempre B1, não importa onde copie!',
        xpReward: 30,`
  },

  // Q9 - Texto em fórmulas
  {
    pattern: /order: 9,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Texto em fórmulas',\s+description: 'Para escrever a palavra "Olá" em uma fórmula SE, você deve usar:',\s+xpReward: 20,/,
    replacement: `order: 9,
        type: 'MULTIPLE_CHOICE',
        title: 'Texto em fórmulas',
        description: '<div class="excel-visual"><div style="background:#f5f5f5;padding:16px;border-radius:8px;"><div style="font-family:monospace;font-size:14px;margin-bottom:12px;"><span style="color:#1976D2;">=SE(</span><span style="color:#388E3C;">A1>10</span><span style="color:#1976D2;">;</span><span style="color:#D32F2F;font-weight:bold;">???</span><span style="color:#1976D2;">;</span><span style="color:#D32F2F;font-weight:bold;">???</span><span style="color:#1976D2;">)</span></div><div style="color:#666;font-size:13px;">💬 Como escrever texto dentro de fórmulas?</div></div><div style="margin-top:16px;padding:12px;background:#e3f2fd;border-radius:4px;"><strong>Opções:</strong><br/>A) Olá<br/>B) [Olá]<br/>C) {Olá}<br/>D) "Olá"</div></div>',
        hint: '💡 Texto sempre entre ASPAS DUPLAS: "Aprovado", "Erro", "Total", etc.',
        xpReward: 20,`
  },

  // Q10 - Ordem de operadores
  {
    pattern: /order: 10,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Ordem de operadores matemáticos',\s+description: 'Qual o resultado de =2\+3\*4\?',\s+xpReward: 25,/,
    replacement: `order: 10,
        type: 'MULTIPLE_CHOICE',
        title: 'Ordem de operadores matemáticos',
        description: '<div class="excel-visual"><div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:24px;border-radius:8px;text-align:center;margin-bottom:16px;"><div style="font-size:48px;font-family:monospace;font-weight:bold;">=2+3×4</div><div style="font-size:16px;margin-top:12px;opacity:0.9;">Qual o resultado?</div></div><div style="background:#f5f5f5;padding:16px;border-radius:8px;"><div style="font-weight:bold;color:#333;margin-bottom:8px;">🧮 Precedência de Operadores:</div><div style="color:#666;line-height:1.6;">1. Parênteses ( )<br/>2. Multiplicação × e Divisão ÷<br/>3. Adição + e Subtração −</div></div></div>',
        hint: '💡 Multiplicação SEMPRE acontece antes da adição! 3×4=12, depois 2+12=14',
        xpReward: 25,`
  },

  // ══════════════════════════════════════════════════════════
  // TRILHA 3: FÓRMULAS ESSENCIAIS (Questões 1-10)
  // ══════════════════════════════════════════════════════════

  // Q1 - SOMASE
  {
    pattern: /order: 1,\s+type: 'SPREADSHEET_INPUT',\s+title: 'SOMASE: Soma com condição',\s+description: 'Some apenas as vendas do vendedor "Ana" \(coluna A\)\. Total na C5\.',\s+xpReward: 30,/,
    replacement: `order: 1,
        type: 'SPREADSHEET_INPUT',
        title: 'SOMASE: Soma com condição',
        description: 'Some apenas as vendas do vendedor "Ana" (coluna A). Total na C5.',
        hint: '💡 =SOMASE(A1:A4;"Ana";B1:B4) — Intervalo de critério, critério, intervalo a somar',
        xpReward: 30,`
  },

  // Q2 - CONT.SE
  {
    pattern: /order: 2,\s+type: 'SPREADSHEET_INPUT',\s+title: 'CONT\.SE: Contagem condicional',\s+description: 'Conte quantas vendas foram maiores que 500\. Resultado em D5\.',\s+xpReward: 30,/,
    replacement: `order: 2,
        type: 'SPREADSHEET_INPUT',
        title: 'CONT.SE: Contagem condicional',
        description: 'Conte quantas vendas foram maiores que 500. Resultado em D5.',
        hint: '💡 =CONT.SE(B1:B4;">500") — Conta células que atendem ao critério. Use aspas para condições!',
        xpReward: 30,`
  },

  // Q3 - CONCATENAR / & 
  {
    pattern: /order: 3,\s+type: 'SPREADSHEET_INPUT',\s+title: 'Junte textos com &',\s+description: 'Una o nome \(A1\) com o sobrenome \(B1\) separados por espaço na C1\.',\s+xpReward: 25,/,
    replacement: `order: 3,
        type: 'SPREADSHEET_INPUT',
        title: 'Junte textos com &',
        description: 'Una o nome (A1) com o sobrenome (B1) separados por espaço na C1.',
        hint: '💡 Use & para juntar textos: =A1&" "&B1 (não esqueça o espaço entre aspas!)',
        xpReward: 25,`
  },

  // Q4 - HOJE()
  {
    pattern: /order: 4,\s+type: 'SPREADSHEET_INPUT',\s+title: 'Data de hoje',\s+description: 'Insira a data atual usando uma função na célula E1\.',\s+xpReward: 20,/,
    replacement: `order: 4,
        type: 'SPREADSHEET_INPUT',
        title: 'Data de hoje',
        description: 'Insira a data atual usando uma função na célula E1.',
        hint: '💡 =HOJE() retorna a data de hoje automaticamente! Atualiza todo dia.',
        xpReward: 20,`
  },

  // Q5 - MÊS e ANO
  {
    pattern: /order: 5,\s+type: 'SPREADSHEET_INPUT',\s+title: 'Extraia o ano de uma data',\s+description: 'A data está em F1\. Extraia apenas o ANO na célula G1\.',\s+xpReward: 25,/,
    replacement: `order: 5,
        type: 'SPREADSHEET_INPUT',
        title: 'Extraia o ano de uma data',
        description: 'A data está em F1. Extraia apenas o ANO na célula G1.',
        hint: '💡 =ANO(F1) extrai o ano. Também existem =MÊS() e =DIA() para extrair partes da data!',
        xpReward: 25,`
  },

  // Q6 - ARREDONDAR
  {
    pattern: /order: 6,\s+type: 'SPREADSHEET_INPUT',\s+title: 'Arredonde para 2 casas decimais',\s+description: 'O valor 123\.456789 está em H1\. Arredonde para 2 casas na célula I1\.',\s+xpReward: 25,/,
    replacement: `order: 6,
        type: 'SPREADSHEET_INPUT',
        title: 'Arredonde para 2 casas decimais',
        description: 'O valor 123.456789 está em H1. Arredonde para 2 casas na célula I1.',
        hint: '💡 =ARREDONDAR(H1;2) — O segundo parâmetro define quantas casas decimais manter!',
        xpReward: 25,`
  },

  // Q7 - ESQUERDA
  {
    pattern: /order: 7,\s+type: 'SPREADSHEET_INPUT',\s+title: 'Extraia caracteres do início',\s+description: 'Em J1 está "Excel2024"\. Extraia apenas "Excel" \(5 caracteres\) na K1\.',\s+xpReward: 30,/,
    replacement: `order: 7,
        type: 'SPREADSHEET_INPUT',
        title: 'Extraia caracteres do início',
        description: 'Em J1 está "Excel2024". Extraia apenas "Excel" (5 caracteres) na K1.',
        hint: '💡 =ESQUERDA(J1;5) pega os 5 primeiros caracteres da esquerda. DIREITA() funciona similar!',
        xpReward: 30,`
  },

  // Q8 - PROCV
  {
    pattern: /order: 8,\s+type: 'SPREADSHEET_INPUT',\s+title: 'PROCV: Busca vertical',\s+description: 'Tabela em A1:B5\. Busque o preço do produto "Mouse" \(está em A3\)\. Resposta em D1\.',\s+xpReward: 40,/,
    replacement: `order: 8,
        type: 'SPREADSHEET_INPUT',
        title: 'PROCV: Busca vertical',
        description: 'Tabela em A1:B5. Busque o preço do produto "Mouse" (está em A3). Resposta em D1.',
        hint: '💡 =PROCV("Mouse";A1:B5;2;0) — Busca "Mouse" na 1ª coluna e retorna valor da 2ª coluna. O 0 no final = correspondência exata!',
        xpReward: 40,`
  },

  // Q9 - SE aninhado
  {
    pattern: /order: 9,\s+type: 'SPREADSHEET_INPUT',\s+title: 'SE aninhado: múltiplas condições',\s+description: 'Nota em E1\. Se >=9: "Excelente", se >=7: "Bom", senão: "Regular"\. Resultado em F1\.',\s+xpReward: 40,/,
    replacement: `order: 9,
        type: 'SPREADSHEET_INPUT',
        title: 'SE aninhado: múltiplas condições',
        description: 'Nota em E1. Se >=9: "Excelente", se >=7: "Bom", senão: "Regular". Resultado em F1.',
        hint: '💡 =SE(E1>=9;"Excelente";SE(E1>=7;"Bom";"Regular")) — Você pode colocar um SE dentro do outro!',
        xpReward: 40,`
  },

  // Q10 - E() e OU()
  {
    pattern: /order: 10,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Funções lógicas: E e OU',\s+description: 'Qual fórmula retorna VERDADEIRO apenas se A1>10 E B1<5\?',\s+xpReward: 30,/,
    replacement: `order: 10,
        type: 'MULTIPLE_CHOICE',
        title: 'Funções lógicas: E e OU',
        description: '<div class="excel-visual"><div style="background:#f5f5f5;padding:16px;border-radius:8px;margin-bottom:16px;"><div style="font-weight:bold;color:#333;margin-bottom:12px;">🔗 Funções Lógicas</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;"><div style="padding:12px;background:#e8f5e9;border-radius:4px;"><strong style="color:#2e7d32;">E()</strong><br/><span style="font-size:13px;color:#666;">TODAS as condições devem ser VERDADEIRAS</span></div><div style="padding:12px;background:#e3f2fd;border-radius:4px;"><strong style="color:#1565c0;">OU()</strong><br/><span style="font-size:13px;color:#666;">PELO MENOS UMA condição deve ser VERDADEIRA</span></div></div></div><div class="excel-grid"><div class="excel-header"><span></span><span>A</span><span>B</span></div><div class="excel-row"><span>1</span><div class="cell">15</div><div class="cell">3</div></div></div><p style="margin-top:16px;color:#666;">🎯 Qual fórmula retorna VERDADEIRO se A1>10 E B1<5?</p></div>',
        hint: '💡 A função E() retorna VERDADEIRO apenas se TODAS as condições forem atendidas. OU() precisa de apenas UMA condição verdadeira.',
        xpReward: 30,`
  },

  // ══════════════════════════════════════════════════════════
  // TRILHA 4: ANÁLISE DE DADOS (Questões 1-10)
  // ══════════════════════════════════════════════════════════

  // Q1 - Filtros básicos
  {
    pattern: /order: 1,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Aplicar filtros',\s+description: 'Para ativar filtros em uma tabela com cabeçalhos, você deve:',\s+xpReward: 20,/,
    replacement: `order: 1,
        type: 'MULTIPLE_CHOICE',
        title: 'Aplicar filtros',
        description: '<div class="excel-visual"><div class="excel-grid"><div class="excel-header" style="background:#f5f5f5;"><span></span><span>Produto 🔽</span><span>Vendas 🔽</span><span>Região 🔽</span></div><div class="excel-row"><span>1</span><div class="cell">Mouse</div><div class="cell">1200</div><div class="cell">Sul</div></div><div class="excel-row"><span>2</span><div class="cell">Teclado</div><div class="cell">800</div><div class="cell">Norte</div></div></div><p style="margin-top:16px;color:#666;">🔍 Como ativar as setinhas de filtro nos cabeçalhos?</p></div>',
        hint: '💡 Selecione os cabeçalhos e clique em Dados > Filtro. As setinhas aparecem para filtrar cada coluna!',
        xpReward: 20,`
  },

  // Q2 - Classificar
  {
    pattern: /order: 2,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Ordenar dados',\s+description: 'Para ordenar uma lista de vendas do maior para o menor, você deve:',\s+xpReward: 20,/,
    replacement: `order: 2,
        type: 'MULTIPLE_CHOICE',
        title: 'Ordenar dados',
        description: '<div class="excel-visual"><div style="background:#f5f5f5;padding:16px;border-radius:8px;margin-bottom:16px;text-align:center;"><div style="font-size:36px;margin-bottom:8px;">📊 ↕️</div><div style="font-weight:bold;color:#333;">Ordenar Dados</div></div><div class="excel-grid"><div class="excel-header"><span></span><span>Vendedor</span><span>Total</span></div><div class="excel-row"><span>1</span><div class="cell">Ana</div><div class="cell" style="background:#ffebee;">1200</div></div><div class="excel-row"><span>2</span><div class="cell">Bruno</div><div class="cell" style="background:#fff3e0;">3400</div></div><div class="excel-row"><span>3</span><div class="cell">Carlos</div><div class="cell" style="background:#e8f5e9;">2100</div></div></div><p style="margin-top:16px;color:#666;">🎯 Como organizar do MAIOR para o MENOR valor?</p></div>',
        hint: '💡 Selecione a coluna de valores e clique em Dados > Classificar > Ordem Decrescente (Z→A ou Maior→Menor)',
        xpReward: 20,`
  },

  // Q3 - Congelar painéis
  {
    pattern: /order: 3,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Congelar painéis',\s+description: 'Para manter a primeira linha sempre visível ao rolar, você usa:',\s+xpReward: 25,/,
    replacement: `order: 3,
        type: 'MULTIPLE_CHOICE',
        title: 'Congelar painéis',
        description: '<div class="excel-visual"><div style="background:linear-gradient(to bottom,#4CAF50 0%,#4CAF50 40px,white 40px);padding:20px;border-radius:8px;"><div style="background:white;padding:12px;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"><div style="display:flex;justify-content:space-between;padding:8px;background:#4CAF50;color:white;font-weight:bold;margin-bottom:8px;border-radius:4px;">❄️ LINHA CONGELADA ❄️</div><div style="color:#666;padding:8px;">Linha 2 - Rola normal</div><div style="color:#666;padding:8px;">Linha 3 - Rola normal</div><div style="color:#666;padding:8px;">Linha 4 - Rola normal</div><div style="text-align:center;padding:8px;color:#999;">⬇️ Continue rolando...</div></div></div><p style="margin-top:16px;color:#666;">🧊 Como manter o cabeçalho sempre visível?</p></div>',
        hint: '💡 Clique na linha 2 (abaixo do cabeçalho) e vá em Exibir > Congelar Painéis > Congelar Primeira Linha',
        xpReward: 25,`
  },

  // Q4 - Remover duplicatas
  {
    pattern: /order: 4,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Remover duplicatas',\s+description: 'Você tem uma lista com nomes repetidos\. Para manter apenas valores únicos:',\s+xpReward: 25,/,
    replacement: `order: 4,
        type: 'MULTIPLE_CHOICE',
        title: 'Remover duplicatas',
        description: '<div class="excel-visual"><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;"><div style="padding:16px;background:#ffebee;border-radius:8px;"><div style="font-weight:bold;color:#d32f2f;margin-bottom:8px;">❌ ANTES</div><div style="font-size:13px;color:#666;line-height:1.8;">Ana<br/>Bruno<br/>Ana ⚠️<br/>Carlos<br/>Bruno ⚠️</div></div><div style="padding:16px;background:#e8f5e9;border-radius:8px;"><div style="font-weight:bold;color:#2e7d32;margin-bottom:8px;">✅ DEPOIS</div><div style="font-size:13px;color:#666;line-height:1.8;">Ana<br/>Bruno<br/>Carlos</div></div></div><p style="margin-top:16px;color:#666;">🧹 Como eliminar os nomes duplicados?</p></div>',
        hint: '💡 Selecione os dados e vá em Dados > Remover Duplicatas. O Excel mantém apenas a primeira ocorrência!',
        xpReward: 25,`
  },

  // Q5 - Validação de dados
  {
    pattern: /order: 5,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Validação de dados',\s+description: 'Para criar uma lista suspensa \(dropdown\) com opções "Sim" e "Não":',\s+xpReward: 30,/,
    replacement: `order: 5,
        type: 'MULTIPLE_CHOICE',
        title: 'Validação de dados',
        description: '<div class="excel-visual"><div class="excel-grid"><div class="excel-header"><span></span><span>A</span></div><div class="excel-row"><span>1</span><div class="cell" style="background:#e3f2fd;border:2px solid #2196F3;position:relative;">Selecione... 🔽<div style="position:absolute;top:100%;left:0;right:0;background:white;box-shadow:0 4px 8px rgba(0,0,0,0.2);border-radius:4px;margin-top:4px;"><div style="padding:8px;border-bottom:1px solid #eee;">✅ Sim</div><div style="padding:8px;">❌ Não</div></div></div></div></div><p style="margin-top:60px;color:#666;">📋 Como criar essa lista de opções?</p></div>',
        hint: '💡 Selecione a célula > Dados > Validação de Dados > Permitir: Lista > Digite: Sim,Não',
        xpReward: 30,`
  },

  // Q6 - Formatação condicional básica
  {
    pattern: /order: 6,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Formatação condicional',\s+description: 'Para destacar automaticamente células com valores acima de 1000:',\s+xpReward: 30,/,
    replacement: `order: 6,
        type: 'MULTIPLE_CHOICE',
        title: 'Formatação condicional',
        description: '<div class="excel-visual"><div class="excel-grid"><div class="excel-header"><span></span><span>Vendas</span></div><div class="excel-row"><span>1</span><div class="cell">800</div></div><div class="excel-row"><span>2</span><div class="cell" style="background:#4CAF50;color:white;font-weight:bold;">1500 ⭐</div></div><div class="excel-row"><span>3</span><div class="cell">650</div></div><div class="excel-row"><span>4</span><div class="cell" style="background:#4CAF50;color:white;font-weight:bold;">2300 ⭐</div></div></div><p style="margin-top:16px;color:#666;">🎨 Como destacar automaticamente valores > 1000?</p></div>',
        hint: '💡 Selecione as células > Página Inicial > Formatação Condicional > Realçar Regras > Maior que... > Digite 1000',
        xpReward: 30,`
  },

  // Q7 - Tabela dinâmica conceito
  {
    pattern: /order: 7,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Para que serve uma Tabela Dinâmica\?',\s+description: 'Tabelas Dinâmicas são usadas principalmente para:',\s+xpReward: 25,/,
    replacement: `order: 7,
        type: 'MULTIPLE_CHOICE',
        title: 'Para que serve uma Tabela Dinâmica?',
        description: '<div class="excel-visual"><div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:24px;border-radius:8px;text-align:center;margin-bottom:16px;"><div style="font-size:48px;margin-bottom:12px;">🔄</div><div style="font-size:20px;font-weight:bold;">Tabela Dinâmica</div><div style="font-size:14px;opacity:0.9;margin-top:8px;">Pivot Table</div></div><div style="background:#f5f5f5;padding:16px;border-radius:8px;"><div style="font-weight:bold;color:#333;margin-bottom:8px;">Transforma isso:</div><div style="font-size:12px;color:#666;font-family:monospace;margin-bottom:12px;">Produto | Vendas | Região<br/>Mouse | 1200 | Sul<br/>Mouse | 800 | Norte<br/>Teclado | 1500 | Sul</div><div style="font-weight:bold;color:#333;margin-top:12px;margin-bottom:8px;">Em análises como:</div><div style="font-size:12px;color:#666;">📊 Total por Produto<br/>📍 Total por Região<br/>📈 Médias e Percentuais</div></div></div>',
        hint: '💡 Tabelas Dinâmicas resumem e analisam grandes volumes de dados sem alterar a tabela original!',
        xpReward: 25,`
  },

  // Q8 - Segmentação de dados
  {
    pattern: /order: 8,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Segmentação de dados',\s+description: 'Segmentações \(Slicers\) são botões visuais que:',\s+xpReward: 25,/,
    replacement: `order: 8,
        type: 'MULTIPLE_CHOICE',
        title: 'Segmentação de dados',
        description: '<div class="excel-visual"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;"><div style="padding:12px;background:#4CAF50;color:white;border-radius:4px;text-align:center;font-weight:bold;cursor:pointer;">✅ Sul</div><div style="padding:12px;background:#e0e0e0;border-radius:4px;text-align:center;cursor:pointer;">Norte</div><div style="padding:12px;background:#e0e0e0;border-radius:4px;text-align:center;cursor:pointer;">Leste</div></div><div class="excel-grid"><div class="excel-header"><span></span><span>Produto</span><span>Vendas</span></div><div class="excel-row"><span>1</span><div class="cell">Mouse</div><div class="cell">1200</div></div><div class="excel-row"><span>2</span><div class="cell">Teclado</div><div class="cell">1500</div></div></div><p style="margin-top:16px;color:#666;">🎛️ Ao clicar em "Sul", a tabela mostra apenas dados dessa região!</p></div>',
        hint: '💡 Segmentações filtram tabelas dinâmicas de forma visual e interativa, sem precisar usar as setinhas de filtro!',
        xpReward: 25,`
  },

  // Q9 - PROCX (substituindo PROCV)
  {
    pattern: /order: 9,\s+type: 'MULTIPLE_CHOICE',\s+title: 'PROCX vs PROCV',\s+description: 'A principal vantagem do PROCX sobre o PROCV é:',\s+xpReward: 30,/,
    replacement: `order: 9,
        type: 'MULTIPLE_CHOICE',
        title: 'PROCX vs PROCV',
        description: '<div class="excel-visual"><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;"><div style="padding:16px;background:#fff3e0;border-radius:8px;"><div style="font-weight:bold;color:#f57c00;margin-bottom:8px;">⚠️ PROCV</div><div style="font-size:13px;color:#666;">• Busca sempre da esquerda pra direita<br/>• Precisa contar colunas manualmente<br/>• Se inserir coluna, quebra</div></div><div style="padding:16px;background:#e8f5e9;border-radius:8px;"><div style="font-weight:bold;color:#2e7d32;margin-bottom:8px;">✅ PROCX</div><div style="font-size:13px;color:#666;">• Busca em qualquer direção<br/>• Você escolhe qual coluna retornar<br/>• Mais flexível e moderno</div></div></div><p style="margin-top:16px;color:#666;">🔍 PROCX é a evolução do PROCV!</p></div>',
        hint: '💡 PROCX pode buscar em qualquer direção (esquerda/direita) e é mais flexível que PROCV!',
        xpReward: 30,`
  },

  // Q10 - Atingir meta
  {
    pattern: /order: 10,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Atingir Meta',\s+description: 'A ferramenta "Atingir Meta" serve para:',\s+xpReward: 30,/,
    replacement: `order: 10,
        type: 'MULTIPLE_CHOICE',
        title: 'Atingir Meta',
        description: '<div class="excel-visual"><div style="background:#f5f5f5;padding:16px;border-radius:8px;margin-bottom:16px;"><div style="font-family:monospace;font-size:14px;margin-bottom:8px;"><strong>Preço:</strong> <span style="color:#2196F3;">R$ 100</span></div><div style="font-family:monospace;font-size:14px;margin-bottom:8px;"><strong>Quantidade:</strong> <span style="background:#fff3e0;padding:2px 8px;border-radius:4px;">??? 🎯</span></div><div style="font-family:monospace;font-size:14px;"><strong>Total:</strong> <span style="color:#4CAF50;font-weight:bold;">R$ 5.000</span> ✅</div></div><div style="background:#e3f2fd;padding:16px;border-radius:8px;"><div style="font-weight:bold;color:#1976D2;margin-bottom:8px;">🎯 Meta:</div><div style="color:#666;">Preciso vender R$ 5.000. Quantas unidades devo vender a R$ 100 cada?</div></div></div>',
        hint: '💡 Atingir Meta descobre automaticamente qual valor uma célula precisa ter para atingir um resultado desejado!',
        xpReward: 30,`
  },

  // ══════════════════════════════════════════════════════════
  // TRILHA 5: GRÁFICOS PROFISSIONAIS (Questões 1-10)
  // ══════════════════════════════════════════════════════════

  // Q1 - Tipos de gráficos
  {
    pattern: /order: 1,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Tipos de gráficos',\s+description: 'Para mostrar a evolução de vendas ao longo de 12 meses, o melhor gráfico é:',\s+xpReward: 20,/,
    replacement: `order: 1,
        type: 'MULTIPLE_CHOICE',
        title: 'Tipos de gráficos',
        description: '<div class="excel-visual"><div style="background:#f5f5f5;padding:20px;border-radius:8px;"><div style="font-weight:bold;color:#333;margin-bottom:16px;text-align:center;">📊 Qual gráfico usar?</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;"><div style="padding:12px;background:white;border-radius:4px;text-align:center;"><div style="font-size:32px;">📈</div><div style="font-size:12px;color:#666;margin-top:4px;">Linha</div></div><div style="padding:12px;background:white;border-radius:4px;text-align:center;"><div style="font-size:32px;">📊</div><div style="font-size:12px;color:#666;margin-top:4px;">Colunas</div></div><div style="padding:12px;background:white;border-radius:4px;text-align:center;"><div style="font-size:32px;">🥧</div><div style="font-size:12px;color:#666;margin-top:4px;">Pizza</div></div><div style="padding:12px;background:white;border-radius:4px;text-align:center;"><div style="font-size:32px;">📉</div><div style="font-size:12px;color:#666;margin-top:4px;">Área</div></div></div></div><p style="margin-top:16px;color:#666;">📅 Vendas: Jan, Fev, Mar... Dez</p></div>',
        hint: '💡 Gráficos de LINHA são ideais para mostrar tendências ao longo do tempo (meses, anos, dias)',
        xpReward: 20,`
  },

  // Q2 - Gráfico de pizza
  {
    pattern: /order: 2,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Quando usar gráfico de pizza',\s+description: 'Gráficos de pizza são ideais para:',\s+xpReward: 20,/,
    replacement: `order: 2,
        type: 'MULTIPLE_CHOICE',
        title: 'Quando usar gráfico de pizza',
        description: '<div class="excel-visual"><div style="text-align:center;margin-bottom:16px;"><svg width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="#4CAF50" /><path d="M 100 100 L 100 20 A 80 80 0 0 1 180 100 Z" fill="#2196F3" /><path d="M 100 100 L 180 100 A 80 80 0 0 1 140 170 Z" fill="#FF9800" /><circle cx="100" cy="100" r="40" fill="white" /></svg></div><div style="background:#f5f5f5;padding:16px;border-radius:8px;"><div style="font-size:13px;color:#666;line-height:1.8;"><span style="color:#4CAF50;">🟢</span> Sul: 50%<br/><span style="color:#2196F3;">🔵</span> Norte: 30%<br/><span style="color:#FF9800;">🟠</span> Leste: 20%</div></div><p style="margin-top:16px;color:#666;">🥧 Pizza = Partes de um TODO (100%)</p></div>',
        hint: '💡 Use pizza para mostrar PROPORÇÕES de um total (partes de 100%). Ex: participação de mercado, distribuição por região.',
        xpReward: 20,`
  },

  // Q3 - Adicionar título
  {
    pattern: /order: 3,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Adicionar título ao gráfico',\s+description: 'Para adicionar ou editar o título de um gráfico:',\s+xpReward: 15,/,
    replacement: `order: 3,
        type: 'MULTIPLE_CHOICE',
        title: 'Adicionar título ao gráfico',
        description: '<div class="excel-visual"><div style="border:2px solid #2196F3;border-radius:8px;padding:16px;background:white;"><div style="text-align:center;padding:12px;background:#e3f2fd;border-radius:4px;margin-bottom:16px;font-weight:bold;color:#1976D2;border:2px dashed #2196F3;">📝 [Título do Gráfico]</div><div style="height:100px;background:#f5f5f5;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#999;">[ Área do Gráfico ]</div></div><p style="margin-top:16px;color:#666;">✏️ Como editar a área destacada?</p></div>',
        hint: '💡 Clique no gráfico > Ferramentas de Gráfico > Design > Adicionar Elemento de Gráfico > Título do Gráfico',
        xpReward: 15,`
  },

  // Q4 - Eixos
  {
    pattern: /order: 4,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Eixos do gráfico',\s+description: 'Em um gráfico de colunas, o eixo Y geralmente representa:',\s+xpReward: 20,/,
    replacement: `order: 4,
        type: 'MULTIPLE_CHOICE',
        title: 'Eixos do gráfico',
        description: '<div class="excel-visual"><div style="background:#f5f5f5;padding:20px;border-radius:8px;"><div style="display:grid;grid-template-columns:40px 1fr;gap:8px;"><div style="display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end;padding-right:8px;color:#666;font-size:12px;font-weight:bold;border-right:2px solid #333;"><span>1000</span><span>500</span><span>0</span></div><div><div style="display:flex;gap:8px;align-items:flex-end;height:120px;"><div style="width:60px;background:#4CAF50;height:80%;border-radius:4px 4px 0 0;"></div><div style="width:60px;background:#2196F3;height:60%;border-radius:4px 4px 0 0;"></div><div style="width:60px;background:#FF9800;height:100%;border-radius:4px 4px 0 0;"></div></div><div style="display:flex;gap:8px;margin-top:8px;border-top:2px solid #333;padding-top:8px;"><div style="width:60px;text-align:center;font-size:11px;color:#666;">Jan</div><div style="width:60px;text-align:center;font-size:11px;color:#666;">Fev</div><div style="width:60px;text-align:center;font-size:11px;color:#666;">Mar</div></div></div></div><div style="margin-top:12px;text-align:center;"><span style="background:#fff3e0;padding:4px 12px;border-radius:4px;font-weight:bold;color:#f57c00;">📊 Eixo Y ↑</span><span style="margin:0 8px;">vs</span><span style="background:#e3f2fd;padding:4px 12px;border-radius:4px;font-weight:bold;color:#1976D2;">📅 Eixo X →</span></div></div></div>',
        hint: '💡 Eixo Y (vertical) = VALORES numéricos. Eixo X (horizontal) = CATEGORIAS (meses, produtos, regiões)',
        xpReward: 20,`
  },

  // Q5 - Legenda
  {
    pattern: /order: 5,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Legenda do gráfico',\s+description: 'A legenda serve para:',\s+xpReward: 15,/,
    replacement: `order: 5,
        type: 'MULTIPLE_CHOICE',
        title: 'Legenda do gráfico',
        description: '<div class="excel-visual"><div style="border:2px solid #e0e0e0;border-radius:8px;padding:16px;background:white;"><div style="height:120px;background:#f5f5f5;border-radius:4px;margin-bottom:12px;display:flex;align-items:center;justify-content:center;color:#999;">[ Gráfico ]</div><div style="background:#fff;border:2px solid #2196F3;border-radius:4px;padding:12px;"><div style="font-weight:bold;color:#333;margin-bottom:8px;">Legenda:</div><div style="font-size:13px;color:#666;line-height:1.8;"><span style="display:inline-block;width:16px;height:16px;background:#4CAF50;border-radius:2px;margin-right:8px;"></span>Vendas 2023<br/><span style="display:inline-block;width:16px;height:16px;background:#2196F3;border-radius:2px;margin-right:8px;"></span>Vendas 2024<br/><span style="display:inline-block;width:16px;height:16px;background:#FF9800;border-radius:2px;margin-right:8px;"></span>Meta</div></div></div></div>',
        hint: '💡 A legenda explica o que cada cor/símbolo representa no gráfico!',
        xpReward: 15,`
  },

  // Q6 - Rótulos de dados
  {
    pattern: /order: 6,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Rótulos de dados',\s+description: 'Para exibir os valores exatos em cima de cada coluna do gráfico:',\s+xpReward: 20,/,
    replacement: `order: 6,
        type: 'MULTIPLE_CHOICE',
        title: 'Rótulos de dados',
        description: '<div class="excel-visual"><div style="background:#f5f5f5;padding:20px;border-radius:8px;"><div style="display:flex;gap:16px;align-items:flex-end;height:150px;"><div style="flex:1;display:flex;flex-direction:column;align-items:center;"><div style="background:#4CAF50;color:white;padding:4px 8px;border-radius:4px;font-weight:bold;margin-bottom:4px;">1200</div><div style="width:100%;background:#4CAF50;height:80%;border-radius:4px 4px 0 0;"></div></div><div style="flex:1;display:flex;flex-direction:column;align-items:center;"><div style="background:#2196F3;color:white;padding:4px 8px;border-radius:4px;font-weight:bold;margin-bottom:4px;">850</div><div style="width:100%;background:#2196F3;height:60%;border-radius:4px 4px 0 0;"></div></div><div style="flex:1;display:flex;flex-direction:column;align-items:center;"><div style="background:#FF9800;color:white;padding:4px 8px;border-radius:4px;font-weight:bold;margin-bottom:4px;">1500</div><div style="width:100%;background:#FF9800;height:100%;border-radius:4px 4px 0 0;"></div></div></div></div><p style="margin-top:16px;color:#666;">🏷️ Como mostrar os valores numéricos?</p></div>',
        hint: '💡 Clique no gráfico > Adicionar Elemento de Gráfico > Rótulos de Dados > escolha a posição!',
        xpReward: 20,`
  },

  // Q7 - Gráficos combinados
  {
    pattern: /order: 7,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Gráficos combinados',\s+description: 'É possível ter colunas e linhas no mesmo gráfico\?',\s+xpReward: 25,/,
    replacement: `order: 7,
        type: 'MULTIPLE_CHOICE',
        title: 'Gráficos combinados',
        description: '<div class="excel-visual"><div style="background:#f5f5f5;padding:20px;border-radius:8px;"><div style="position:relative;height:150px;"><div style="display:flex;gap:12px;align-items:flex-end;height:100%;"><div style="width:50px;background:#2196F3;height:60%;border-radius:4px 4px 0 0;"></div><div style="width:50px;background:#2196F3;height:80%;border-radius:4px 4px 0 0;"></div><div style="width:50px;background:#2196F3;height:50%;border-radius:4px 4px 0 0;"></div><div style="width:50px;background:#2196F3;height:90%;border-radius:4px 4px 0 0;"></div></div><svg style="position:absolute;top:0;left:0;width:100%;height:100%;" viewBox="0 0 200 150"><polyline points="25,90 75,60 125,100 175,30" fill="none" stroke="#FF5722" stroke-width="3"/><circle cx="25" cy="90" r="4" fill="#FF5722"/><circle cx="75" cy="60" r="4" fill="#FF5722"/><circle cx="125" cy="100" r="4" fill="#FF5722"/><circle cx="175" cy="30" r="4" fill="#FF5722"/></svg></div><div style="margin-top:12px;text-align:center;font-size:13px;color:#666;"><span style="color:#2196F3;">█</span> Vendas <span style="margin:0 8px;">+</span> <span style="color:#FF5722;">━</span> Meta</div></div></div>',
        hint: '💡 Sim! Use "Gráfico de Combinação" para misturar colunas + linhas no mesmo gráfico. Ideal para comparar valores diferentes!',
        xpReward: 25,`
  },

  // Q8 - Minigráficos (Sparklines)
  {
    pattern: /order: 8,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Minigráficos \(Sparklines\)',\s+description: 'Minigráficos são pequenos gráficos que:',\s+xpReward: 25,/,
    replacement: `order: 8,
        type: 'MULTIPLE_CHOICE',
        title: 'Minigráficos (Sparklines)',
        description: '<div class="excel-visual"><div class="excel-grid"><div class="excel-header"><span></span><span>Produto</span><span>Jan</span><span>Fev</span><span>Mar</span><span>Tendência</span></div><div class="excel-row"><span>1</span><div class="cell">Mouse</div><div class="cell">100</div><div class="cell">150</div><div class="cell">200</div><div class="cell" style="background:#e8f5e9;"><svg width="60" height="20" viewBox="0 0 60 20"><polyline points="5,15 30,10 55,5" fill="none" stroke="#4CAF50" stroke-width="2"/></svg></div></div><div class="excel-row"><span>2</span><div class="cell">Teclado</div><div class="cell">300</div><div class="cell">250</div><div class="cell">200</div><div class="cell" style="background:#ffebee;"><svg width="60" height="20" viewBox="0 0 60 20"><polyline points="5,5 30,10 55,15" fill="none" stroke="#F44336" stroke-width="2"/></svg></div></div></div><p style="margin-top:16px;color:#666;">📊 Gráficos dentro de células!</p></div>',
        hint: '💡 Minigráficos cabem dentro de uma célula e mostram tendências rapidamente sem ocupar espaço. Inserir > Minigráficos!',
        xpReward: 25,`
  },

  // Q9 - Formatar cores
  {
    pattern: /order: 9,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Personalizar cores do gráfico',\s+description: 'Para alterar as cores das colunas de um gráfico:',\s+xpReward: 20,/,
    replacement: `order: 9,
        type: 'MULTIPLE_CHOICE',
        title: 'Personalizar cores do gráfico',
        description: '<div class="excel-visual"><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;"><div style="padding:16px;background:#f5f5f5;border-radius:8px;text-align:center;"><div style="color:#999;font-size:12px;margin-bottom:8px;">Antes</div><div style="display:flex;gap:8px;justify-content:center;align-items:flex-end;height:80px;"><div style="width:30px;background:#5470C6;height:60%;"></div><div style="width:30px;background:#5470C6;height:80%;"></div><div style="width:30px;background:#5470C6;height:50%;"></div></div></div><div style="padding:16px;background:#f5f5f5;border-radius:8px;text-align:center;"><div style="color:#4CAF50;font-size:12px;margin-bottom:8px;font-weight:bold;">Depois ✨</div><div style="display:flex;gap:8px;justify-content:center;align-items:flex-end;height:80px;"><div style="width:30px;background:linear-gradient(to top,#4CAF50,#8BC34A);height:60%;border-radius:4px 4px 0 0;"></div><div style="width:30px;background:linear-gradient(to top,#2196F3,#03A9F4);height:80%;border-radius:4px 4px 0 0;"></div><div style="width:30px;background:linear-gradient(to top,#FF9800,#FFC107);height:50%;border-radius:4px 4px 0 0;"></div></div></div></div></div>',
        hint: '💡 Clique na coluna/barra do gráfico > Formatar Série de Dados > Preenchimento > escolha a cor ou gradiente!',
        xpReward: 20,`
  },

  // Q10 - Gráfico dinâmico
  {
    pattern: /order: 10,\s+type: 'MULTIPLE_CHOICE',\s+title: 'Gráfico Dinâmico',\s+description: 'Um Gráfico Dinâmico é criado a partir de:',\s+xpReward: 30,/,
    replacement: `order: 10,
        type: 'MULTIPLE_CHOICE',
        title: 'Gráfico Dinâmico',
        description: '<div class="excel-visual"><div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:20px;border-radius:8px;margin-bottom:16px;"><div style="font-size:36px;text-align:center;margin-bottom:8px;">📊🔄</div><div style="font-size:18px;font-weight:bold;text-align:center;">Gráfico Dinâmico</div></div><div style="background:#f5f5f5;padding:16px;border-radius:8px;"><div style="font-weight:bold;color:#333;margin-bottom:12px;">✨ Características:</div><div style="font-size:13px;color:#666;line-height:1.8;">• Se atualiza automaticamente<br/>• Permite filtrar dados visualmente<br/>• Integrado com Tabela Dinâmica<br/>• Não precisa recriar ao mudar filtros</div></div></div>',
        hint: '💡 Gráfico Dinâmico = Gráfico baseado em Tabela Dinâmica! Muda automaticamente quando você filtra ou reorganiza a tabela.',
        xpReward: 30,`
  },
];

// Aplicar substituições
let count = 0;
replacements.forEach((item, index) => {
  const match = content.match(item.pattern);
  if (match) {
    content = content.replace(item.pattern, item.replacement);
    count++;
    console.log(`✅ ${index + 1}/${replacements.length} aplicado`);
  } else {
    console.log(`⚠️  ${index + 1}/${replacements.length} não encontrado`);
  }
});

fs.writeFileSync(seedPath, content, 'utf8');
console.log(`\n✅ Arquivo salvo: ${seedPath}`);
console.log(`🎯 ${count}/${replacements.length} atualizações aplicadas com sucesso!`);
