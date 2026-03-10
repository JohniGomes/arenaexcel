import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DS_STYLE = `<style>
.q-body { font-family: 'DM Sans', 'Segoe UI', sans-serif; color: #1A1A2E; }
.xl-wrap { overflow-x: auto; margin-bottom: 12px; border-radius: 8px; overflow: hidden; border: 1px solid #E0E5E0; }
.xl-grid { border-collapse: collapse; font-size: 13px; width: 100%; font-family: monospace; }
.xl-grid th { background: #F7F9F7; color: #4A4A6A; font-weight: 600; border: 1px solid #E0E5E0; padding: 5px 12px; text-align: center; font-size: 12px; }
.xl-grid td { border: 1px solid #E0E5E0; padding: 5px 12px; color: #1A1A2E; text-align: right; background: #fff; min-width: 44px; }
.xl-grid .rh { background: #F7F9F7; color: #4A4A6A; font-weight: 600; text-align: center; font-size: 12px; }
.cell-active { background: #E8F5E9 !important; border: 2px solid #2E9E5B !important; color: #217346 !important; font-weight: 700 !important; }
.cell-result { background: #FEF3C7 !important; border: 2px solid #F59E0B !important; color: #92400E !important; font-weight: 700 !important; }
.cell-text { text-align: left !important; }
.ctx-card { background: #fff; border: 1px solid #E0E5E0; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; }
.ctx-label { font-size: 10px; font-weight: 700; color: #4A4A6A; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 6px; }
.ctx-body { font-size: 13px; color: #1A1A2E; line-height: 1.6; }
.cell-badge { display: inline-block; background: #217346; color: white; font-family: monospace; font-size: 12px; font-weight: 700; padding: 1px 7px; border-radius: 5px; margin: 0 2px; }
.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
.compare-bad { background: #FEE2E2; border: 1px solid #FECACA; border-radius: 10px; padding: 14px; text-align: center; }
.compare-good { background: #E8F5E9; border: 1px solid #BBF7D0; border-radius: 10px; padding: 14px; text-align: center; }
.compare-label-bad { font-size: 10px; font-weight: 700; color: #E74C3C; letter-spacing: 0.8px; margin-bottom: 8px; }
.compare-label-good { font-size: 10px; font-weight: 700; color: #2E9E5B; letter-spacing: 0.8px; margin-bottom: 8px; }
.compare-value { font-size: 22px; font-weight: 800; }
.compare-value.bad { color: #E74C3C; }
.compare-value.good { color: #217346; }
.compare-sub { font-size: 11px; color: #4A4A6A; margin-top: 4px; }
.kbd { display: inline-flex; align-items: center; justify-content: center; background: #fff; border: 1.5px solid #E0E5E0; border-radius: 7px; padding: 4px 10px; font-size: 13px; font-weight: 700; color: #1A1A2E; box-shadow: 0 2px 0 #d0d5d0; margin: 0 3px; font-family: monospace; }
.kbd-row { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 12px; }
.icon-center { text-align: center; padding: 16px 0 12px; }
.icon-center .icon { font-size: 36px; margin-bottom: 8px; }
.icon-center .desc { font-size: 13px; color: #4A4A6A; }
</style>
<div class="q-body">`;

async function main() {
  console.log('🎨 Atualizando questões de exemplo com novo Design System...\n');

  // 1. Excel do Zero - Questão 1
  await prisma.questions.updateMany({
    where: { 
      title: 'O que é uma célula no Excel?',
      order: 1 
    },
    data: {
      description: `${DS_STYLE}
<div class="xl-wrap">
  <table class="xl-grid">
    <thead>
      <tr><th></th><th>A</th><th>B</th><th>C</th></tr>
    </thead>
    <tbody>
      <tr><td class="rh">1</td><td>10</td><td>20</td><td class="cell-active">30</td></tr>
      <tr><td class="rh">2</td><td>40</td><td>50</td><td>60</td></tr>
    </tbody>
  </table>
</div>
<div class="ctx-card">
  <div class="ctx-label">Identifique a célula</div>
  <div class="ctx-body">
    A célula destacada está na coluna <span class="cell-badge">C</span>
    e na linha <span class="cell-badge">1</span>. Qual o endereço dela?
  </div>
</div>
</div>`
    }
  });
  console.log('✅ Questão 1 (Excel do Zero) atualizada');

  // 2. Excel do Zero - Questão 2 (Como identificar colunas)
  await prisma.questions.updateMany({
    where: { 
      title: 'Como as colunas são identificadas?',
      order: 2 
    },
    data: {
      description: `${DS_STYLE}
<div class="xl-wrap">
  <table class="xl-grid">
    <thead>
      <tr><th></th><th class="cell-active">A</th><th class="cell-active">B</th><th class="cell-active">C</th><th>D</th></tr>
    </thead>
    <tbody>
      <tr><td class="rh">1</td><td>Excel</td><td>Word</td><td>Power</td><td>Access</td></tr>
    </tbody>
  </table>
</div>
<div class="ctx-card">
  <div class="ctx-label">Colunas destacadas</div>
  <div class="ctx-body">
    As três primeiras colunas estão destacadas. Como elas são identificadas no Excel?
  </div>
</div>
</div>`
    }
  });
  console.log('✅ Questão 2 (Excel do Zero) atualizada');

  // 3. Fundamentos - SOMA comparação
  await prisma.questions.updateMany({
    where: { 
      title: {contains: 'SOMA'},
      order: 1 
    },
    data: {
      description: `${DS_STYLE}
<div class="compare-grid">
  <div class="compare-bad">
    <div class="compare-label-bad">❌ Manual</div>
    <div class="compare-value bad">=A1+A2+A3+A4</div>
    <div class="compare-sub">lento e trabalhoso</div>
  </div>
  <div class="compare-good">
    <div class="compare-label-good">✅ Com SOMA</div>
    <div class="compare-value good">=SOMA(A1:A4)</div>
    <div class="compare-sub">rápido e profissional</div>
  </div>
</div>
<div class="ctx-card">
  <div class="ctx-label">Objetivo</div>
  <div class="ctx-body">
    A função <span class="cell-badge">SOMA</span> é a forma mais eficiente de somar valores. Qual a sintaxe correta?
  </div>
</div>
</div>`
    }
  });
  console.log('✅ Questão SOMA atualizada');

  // 4. Produtividade - Ctrl+S
  await prisma.questions.updateMany({
    where: { 
      title: {contains: 'Ctrl+S'},
    },
    data: {
      description: `${DS_STYLE}
<div class="ctx-card">
  <div class="icon-center">
    <div class="icon">💾</div>
    <div class="desc">Qual é o atalho universal para salvar documentos?</div>
  </div>
  <div class="kbd-row">
    <span class="kbd">Ctrl</span>
    <span style="font-size: 16px; color: #4A4A6A;">+</span>
    <span class="kbd">?</span>
  </div>
</div>
</div>`
    }
  });
  console.log('✅ Questão Ctrl+S atualizada');

  console.log('\n✨ Exemplos atualizados com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
