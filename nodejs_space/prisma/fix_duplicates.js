const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'seed_trails.ts');
let content = fs.readFileSync(seedPath, 'utf8');

console.log('🔧 Corrigindo duplicações...\n');

// Padrão para encontrar blocos de questões completos
const lines = content.split('\n');
const newLines = [];
let inQuestion = false;
let seenProps = new Set();
let questionStart = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  
  // Detectar início de questão
  if (trimmed.startsWith('order:')) {
    inQuestion = true;
    questionStart = i;
    seenProps = new Set();
    newLines.push(line);
    continue;
  }
  
  // Detectar fim de questão
  if (inQuestion && (trimmed.startsWith('}') && !trimmed.includes('}'))) {
    inQuestion = false;
    seenProps = new Set();
    newLines.push(line);
    continue;
  }
  
  // Se estamos em uma questão, verificar duplicações
  if (inQuestion) {
    // Extrair nome da propriedade
    const propMatch = trimmed.match(/^(\w+):/);
    if (propMatch) {
      const propName = propMatch[1];
      
      // Se já vimos essa propriedade, pular
      if (seenProps.has(propName)) {
        console.log(`❌ Removendo duplicação: ${propName} (linha ${i + 1})`);
        // Pular a linha e quaisquer linhas de continuação
        while (i < lines.length - 1 && !lines[i + 1].trim().match(/^\w+:/)) {
          i++;
        }
        continue;
      }
      
      seenProps.add(propName);
    }
  }
  
  newLines.push(line);
}

const newContent = newLines.join('\n');
fs.writeFileSync(seedPath, newContent, 'utf8');
console.log('\n✅ Duplicações corrigidas!');
