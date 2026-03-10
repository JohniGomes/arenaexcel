const fs = require('fs');

// Ler seed atual
let seed = fs.readFileSync('prisma/seed_trails.ts', 'utf8');

// Aplicar correção Q7 do Excel do Zero (aceitar =A1+B1 e =SOMA)
seed = seed.replace(
  /order: 7,\s+type: 'SPREADSHEET_INPUT',\s+title: 'Digite sua primeira fórmula!',[\s\S]*?expectedValue: '=A1\+B1',/,
  `order: 7,
        type: 'SPREADSHEET_INPUT',
        title: 'Digite sua primeira fórmula!',
        description: 'A célula A1 tem o valor 10 e B1 tem 20. Na célula C1, escreva uma fórmula para somar os dois.',
        hint: 'Você pode somar A1 e B1 de duas formas: =A1+B1 ou =SOMA(A1,B1). Ambas estão corretas!',
        xpReward: 20,
        spreadsheetContext: JSON.stringify({
          cells: { A1: 10, B1: 20 },
          highlight: 'C1',
        }),
        expectedValue: '=A1+B1',`
);

fs.writeFileSync('prisma/seed_trails.ts', seed);
console.log('✅ Correções aplicadas!');
