-- Script para atualizar descriptions com novo Design System
-- Baseado na paleta verde Excel

-- Excel do Zero (excel-do-zero)
UPDATE questions SET description = '<style>
  .q-body { font-family: ''DM Sans'', ''Segoe UI'', sans-serif; color: #1A1A2E; }
  .xl-wrap { overflow-x: auto; margin-bottom: 12px; border-radius: 8px; overflow: hidden; border: 1px solid #E0E5E0; }
  .xl-grid { border-collapse: collapse; font-size: 13px; width: 100%; font-family: monospace; }
  .xl-grid th { background: #F7F9F7; color: #4A4A6A; font-weight: 600; border: 1px solid #E0E5E0; padding: 5px 12px; text-align: center; font-size: 12px; }
  .xl-grid td { border: 1px solid #E0E5E0; padding: 5px 12px; color: #1A1A2E; text-align: right; background: #fff; min-width: 44px; }
  .xl-grid .rh { background: #F7F9F7; color: #4A4A6A; font-weight: 600; text-align: center; font-size: 12px; }
  .cell-active { background: #E8F5E9 !important; border: 2px solid #2E9E5B !important; color: #217346 !important; font-weight: 700 !important; }
  .ctx-card { background: #fff; border: 1px solid #E0E5E0; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; }
  .ctx-label { font-size: 10px; font-weight: 700; color: #4A4A6A; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 6px; }
  .ctx-body { font-size: 13px; color: #1A1A2E; line-height: 1.6; }
  .cell-badge { display: inline-block; background: #217346; color: white; font-family: monospace; font-size: 12px; font-weight: 700; padding: 1px 7px; border-radius: 5px; margin: 0 2px; }
</style>
<div class="q-body">
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
</div>'
WHERE title = 'O que é uma célula no Excel?' AND "order" = 1;

