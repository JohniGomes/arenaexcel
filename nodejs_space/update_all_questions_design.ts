import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DS = `<style>
.q-body { font-family: 'DM Sans', 'Segoe UI', sans-serif; color: #1A1A2E; }
.xl-wrap { overflow-x: auto; margin-bottom: 12px; border-radius: 8px; overflow: hidden; border: 1px solid #E0E5E0; }
.xl-grid { border-collapse: collapse; font-size: 13px; width: 100%; font-family: monospace; }
.xl-grid th { background: #F7F9F7; color: #4A4A6A; font-weight: 600; border: 1px solid #E0E5E0; padding: 5px 12px; text-align: center; font-size: 12px; }
.xl-grid td { border: 1px solid #E0E5E0; padding: 5px 12px; color: #1A1A2E; text-align: right; background: #fff; min-width: 44px; }
.xl-grid .rh { background: #F7F9F7; color: #4A4A6A; font-weight: 600; text-align: center; font-size: 12px; }
.cell-active { background: #E8F5E9 !important; border: 2px solid #2E9E5B !important; color: #217346 !important; font-weight: 700 !important; }
.cell-result { background: #FEF3C7 !important; border: 2px solid #F59E0B !important; color: #92400E !important; font-weight: 700 !important; }
.cell-error { background: #FEE2E2 !important; border: 2px solid #E74C3C !important; color: #E74C3C !important; font-weight: 700 !important; }
.cell-text { text-align: left !important; }
.ctx-card { background: #fff; border: 1px solid #E0E5E0; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; }
.ctx-label { font-size: 10px; font-weight: 700; color: #4A4A6A; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 6px; }
.ctx-body { font-size: 13px; color: #1A1A2E; line-height: 1.6; }
.cell-badge { display: inline-block; background: #217346; color: white; font-family: monospace; font-size: 12px; font-weight: 700; padding: 1px 7px; border-radius: 5px; margin: 0 2px; }
.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
.compare-bad { background: #FEE2E2; border: 1px solid #FECACA; border-radius: 10px; padding: 14px; text-align: center; }
.compare-good { background: #E8F5E9; border: 1px solid #BBF7D0; border-radius: 10px; padding: 14px; text-align: center; }
.compare-label-bad { font-size: 10px; font-weight: 700; color: #E74C3C; letter-spacing: 0.8px; margin-bottom: 8px; text-transform: uppercase; }
.compare-label-good { font-size: 10px; font-weight: 700; color: #2E9E5B; letter-spacing: 0.8px; margin-bottom: 8px; text-transform: uppercase; }
.compare-value { font-size: 22px; font-weight: 800; }
.compare-value.bad { color: #E74C3C; }
.compare-value.good { color: #217346; }
.compare-sub { font-size: 11px; color: #4A4A6A; margin-top: 4px; }
.kbd { display: inline-flex; align-items: center; justify-content: center; background: #fff; border: 1.5px solid #E0E5E0; border-radius: 7px; padding: 4px 10px; font-size: 13px; font-weight: 700; color: #1A1A2E; box-shadow: 0 2px 0 #d0d5d0; margin: 0 3px; font-family: monospace; }
.kbd-row { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 12px; }
.icon-center { text-align: center; padding: 16px 0 12px; }
.icon-center .icon { font-size: 36px; margin-bottom: 8px; }
.icon-center .desc { font-size: 13px; color: #4A4A6A; }
.challenge-banner { background: linear-gradient(135deg, #217346, #2E9E5B); color: white; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 14px; }
.challenge-icon { font-size: 26px; margin-bottom: 6px; }
.challenge-title { font-weight: 800; font-size: 15px; }
.challenge-sub { opacity: 0.75; font-size: 12px; margin-top: 4px; }
.step-list { display: flex; flex-direction: column; gap: 6px; }
.step-item { background: #fff; border: 1px solid #E0E5E0; border-radius: 9px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; font-size: 13px; color: #1A1A2E; }
.step-num { width: 24px; height: 24px; border-radius: 50%; background: #E8F5E9; color: #217346; font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
</style>
<div class="q-body">`;

async function main() {
  console.log('🎨 Atualizando TODAS as 74 questões com novo Design System...\n');
  
  const trails = await prisma.trails.findMany({
    include: { questions: { orderBy: { order: 'asc' } } }
  });

  let updated = 0;

  for (const trail of trails) {
    console.log(`\n📚 ${trail.name} (${trail.questions.length} questões)`);
    
    for (const q of trail.questions) {
      let newDesc = '';
      
      // Lógica baseada no título e order da questão
      if (q.order === 10 || q.title.includes('Desafio Final') || q.title.includes('ordem correta')) {
        // TIPO E - Desafio Final
        newDesc = `${DS}
<div class="challenge-banner">
  <div class="challenge-icon">🏁</div>
  <div class="challenge-title">Desafio Final</div>
  <div class="challenge-sub">${trail.name}</div>
</div>
<div class="ctx-card">
  <div class="ctx-label">Sua tarefa</div>
  <div class="ctx-body">${q.title}</div>
</div>
</div>`;
      } else if (q.title.includes('atalho') || q.title.includes('Ctrl') || q.title.includes('tecla')) {
        // TIPO C - Atalho de teclado
        newDesc = `${DS}
<div class="ctx-card">
  <div class="icon-center">
    <div class="icon">⌨️</div>
    <div class="desc">${q.title}</div>
  </div>
</div>
</div>`;
      } else if (q.title.includes('formatação') || q.title.includes('formato') || q.title.includes('antes') || q.title.includes('diferença')) {
        // TIPO B - Comparação Antes/Depois
        newDesc = `${DS}
<div class="compare-grid">
  <div class="compare-bad">
    <div class="compare-label-bad">❌ Sem recurso</div>
    <div class="compare-value bad">Resultado ruim</div>
    <div class="compare-sub">difícil de ler</div>
  </div>
  <div class="compare-good">
    <div class="compare-label-good">✅ Com recurso</div>
    <div class="compare-value good">Resultado bom</div>
    <div class="compare-sub">profissional</div>
  </div>
</div>
<div class="ctx-card">
  <div class="ctx-label">Objetivo</div>
  <div class="ctx-body">${q.title}</div>
</div>
</div>`;
      } else if (q.title.includes('célula') || q.title.includes('coluna') || q.title.includes('linha') || q.title.includes('endereço') || q.title.includes('intervalo') || q.title.includes('fórmula') || q.title.includes('função')) {
        // TIPO A - Grid Excel
        newDesc = `${DS}
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
  <div class="ctx-label">Contexto</div>
  <div class="ctx-body">${q.title}</div>
</div>
</div>`;
      } else {
        // TIPO F - Ícone centralizado (conceitual)
        newDesc = `${DS}
<div class="ctx-card">
  <div class="icon-center">
    <div class="icon">📊</div>
    <div class="desc">${q.title}</div>
  </div>
</div>
</div>`;
      }

      await prisma.questions.update({
        where: { id: q.id },
        data: { description: newDesc }
      });
      
      updated++;
      process.stdout.write('.');
    }
  }

  console.log(`\n\n✅ ${updated} questões atualizadas com sucesso!`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
