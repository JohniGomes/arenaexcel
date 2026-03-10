const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'seed_trails.ts');
let content = fs.readFileSync(seedPath, 'utf8');

console.log('🔧 Corrigindo TODAS as trilhas...\n');

const fixes = [
  // Trilha 3
  {
    find: `slug: 'formulas-essenciais',
    name: 'Fórmulas Essenciais',
    icon: '🧮',
    profession: TrailProfession.GENERAL,
    order: 3,
    color: '#9C27B0',`,
    replace: `slug: 'formulas-essenciais',
    name: 'Fórmulas Essenciais',
    icon: '🧮',
    description: 'Domine as fórmulas mais usadas no mercado.',
    profession: TrailProfession.ANALYST,
    order: 3,
    color: '#FF9800',`
  },
  // Trilha 4
  {
    find: `slug: 'analise-de-dados',
    name: 'Análise de Dados',
    icon: '📈',
    profession: TrailProfession.ANALYST,
    order: 4,
    color: '#FF9800',`,
    replace: `slug: 'analise-dados',
    name: 'Análise de Dados',
    icon: '📈',
    description: 'Filtros, tabelas dinâmicas e formatação avançada.',
    profession: TrailProfession.ANALYST,
    order: 4,
    color: '#9C27B0',`
  },
  // Trilha 5
  {
    find: `slug: 'graficos-profissionais',
    name: 'Gráficos Profissionais',
    icon: '📊',
    profession: TrailProfession.MANAGER,
    order: 5,
    color: '#E91E63',`,
    replace: `slug: 'graficos-profissionais',
    name: 'Gráficos Profissionais',
    icon: '📊',
    description: 'Visualize dados com gráficos impactantes.',
    profession: TrailProfession.ANALYST,
    order: 5,
    color: '#00BCD4',`
  },
  // Trilha 8
  {
    find: `slug: 'produtividade-excel',
    name: 'Produtividade no Excel',
    icon: '⚡',
    profession: TrailProfession.GENERAL,
    order: 8,
    color: '#FF5722',`,
    replace: `slug: 'produtividade-excel',
    name: 'Produtividade no Excel',
    icon: '⚡',
    description: 'Atalhos e truques para trabalhar mais rápido.',
    profession: TrailProfession.MANAGER,
    order: 8,
    color: '#FFC107',`
  },
  // Trilha 9
  {
    find: `slug: 'excel-avancado',
    name: 'Excel Avançado',
    icon: '🧠',
    profession: TrailProfession.ANALYST,
    order: 9,
    color: '#3F51B5',`,
    replace: `slug: 'excel-avancado',
    name: 'Excel Avançado',
    icon: '🧠',
    description: 'Macros, Power Query e técnicas de especialista.',
    profession: TrailProfession.GENERAL,
    order: 9,
    color: '#F44336',`
  },
  // Trilha 10
  {
    find: `slug: 'excel-ia',
    name: 'Excel + IA',
    icon: '🤖',
    profession: TrailProfession.GENERAL,
    order: 10,
    color: '#00BCD4',`,
    replace: `slug: 'excel-ia',
    name: 'Excel + IA',
    icon: '🤖',
    description: 'Integre Inteligência Artificial ao Excel.',
    profession: TrailProfession.GENERAL,
    order: 10,
    color: '#673AB7',`
  },
];

let count = 0;
fixes.forEach((fix, index) => {
  if (content.includes(fix.find)) {
    content = content.replace(fix.find, fix.replace);
    count++;
    console.log(`✅ Correção ${index + 1}/${fixes.length} aplicada`);
  } else {
    console.log(`⚠️  Correção ${index + 1}/${fixes.length} não encontrada`);
  }
});

fs.writeFileSync(seedPath, content, 'utf8');
console.log(`\n✅ ${count}/${fixes.length} trilhas corrigidas!`);
