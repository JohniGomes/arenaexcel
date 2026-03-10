const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'seed_trails.ts');
let content = fs.readFileSync(seedPath, 'utf8');

console.log('🔧 Adicionando descriptions nas trilhas...\n');

const fixes = [
  {
    find: `slug: 'excel-do-zero',
    name: 'Excel do Zero',
    icon: '🚀',
    profession: TrailProfession.GENERAL,
    order: 1,
    color: '#4CAF50',`,
    replace: `slug: 'excel-do-zero',
    name: 'Excel do Zero',
    icon: '🚀',
    description: 'Ideal para quem nunca abriu o Excel.',
    profession: TrailProfession.GENERAL,
    order: 1,
    color: '#4CAF50',`
  },
  {
    find: `slug: 'fundamentos-excel',
    name: 'Fundamentos do Excel',
    icon: '📊',
    profession: TrailProfession.GENERAL,
    order: 2,
    color: '#2196F3',`,
    replace: `slug: 'fundamentos-excel',
    name: 'Fundamentos do Excel',
    icon: '📊',
    description: 'Para quem já abriu o Excel, mas não domina fórmulas.',
    profession: TrailProfession.GENERAL,
    order: 2,
    color: '#2196F3',`
  },
  {
    find: `slug: 'formulas-essenciais',
    name: 'Fórmulas Essenciais',
    icon: '🧮',
    profession: TrailProfession.ANALYST,
    order: 3,
    color: '#FF9800',`,
    replace: `slug: 'formulas-essenciais',
    name: 'Fórmulas Essenciais',
    icon: '🧮',
    description: 'Domine as fórmulas mais usadas no mercado.',
    profession: TrailProfession.ANALYST,
    order: 3,
    color: '#FF9800',`
  },
  {
    find: `slug: 'analise-dados',
    name: 'Análise de Dados',
    icon: '📈',
    profession: TrailProfession.ANALYST,
    order: 4,
    color: '#9C27B0',`,
    replace: `slug: 'analise-dados',
    name: 'Análise de Dados',
    icon: '📈',
    description: 'Filtros, tabelas dinâmicas e formatação avançada.',
    profession: TrailProfession.ANALYST,
    order: 4,
    color: '#9C27B0',`
  },
  {
    find: `slug: 'graficos-profissionais',
    name: 'Gráficos Profissionais',
    icon: '📊',
    profession: TrailProfession.ANALYST,
    order: 5,
    color: '#00BCD4',`,
    replace: `slug: 'graficos-profissionais',
    name: 'Gráficos Profissionais',
    icon: '📊',
    description: 'Visualize dados com gráficos impactantes.',
    profession: TrailProfession.ANALYST,
    order: 5,
    color: '#00BCD4',`
  },
  {
    find: `slug: 'excel-logistica',
    name: 'Excel para Logística',
    icon: '📦',
    profession: TrailProfession.LOGISTICS,
    order: 6,
    color: '#795548',`,
    replace: `slug: 'excel-logistica',
    name: 'Excel para Logística',
    icon: '📦',
    description: 'Controle estoque, pedidos e entregas.',
    profession: TrailProfession.LOGISTICS,
    order: 6,
    color: '#795548',`
  },
  {
    find: `slug: 'excel-financas',
    name: 'Excel para Finanças',
    icon: '💰',
    profession: TrailProfession.FINANCE,
    order: 7,
    color: '#4CAF50',`,
    replace: `slug: 'excel-financas',
    name: 'Excel para Finanças',
    icon: '💰',
    description: 'Fluxo de caixa, VPL, TIR e análises financeiras.',
    profession: TrailProfession.FINANCE,
    order: 7,
    color: '#4CAF50',`
  },
  {
    find: `slug: 'produtividade-excel',
    name: 'Produtividade no Excel',
    icon: '⚡',
    profession: TrailProfession.MANAGER,
    order: 8,
    color: '#FFC107',`,
    replace: `slug: 'produtividade-excel',
    name: 'Produtividade no Excel',
    icon: '⚡',
    description: 'Atalhos e truques para trabalhar mais rápido.',
    profession: TrailProfession.MANAGER,
    order: 8,
    color: '#FFC107',`
  },
  {
    find: `slug: 'excel-avancado',
    name: 'Excel Avançado',
    icon: '🧠',
    profession: TrailProfession.GENERAL,
    order: 9,
    color: '#F44336',`,
    replace: `slug: 'excel-avancado',
    name: 'Excel Avançado',
    icon: '🧠',
    description: 'Macros, Power Query e técnicas de especialista.',
    profession: TrailProfession.GENERAL,
    order: 9,
    color: '#F44336',`
  },
  {
    find: `slug: 'excel-ia',
    name: 'Excel + IA',
    icon: '🤖',
    profession: TrailProfession.GENERAL,
    order: 10,
    color: '#673AB7',`,
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
    console.log(`✅ Trilha ${index + 1}/10 corrigida`);
  } else {
    console.log(`⚠️  Trilha ${index + 1}/10 não encontrada`);
  }
});

fs.writeFileSync(seedPath, content, 'utf8');
console.log(`\n✅ ${count}/10 descriptions adicionadas!`);
