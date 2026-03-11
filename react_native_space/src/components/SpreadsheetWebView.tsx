// SpreadsheetWebView.tsx
// Componente React Native que carrega a planilha interativa via WebView
// Comunicação bidirecional: RN ↔ WebView via postMessage

import React, { useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

// ─── TIPOS ────────────────────────────────────────────────────

export type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'SPREADSHEET_INPUT'
  | 'FORMULA_BUILDER'
  | 'CHART_BUILDER'
  | 'FILL_IN_BLANK'
  | 'DRAG_AND_DROP';

export interface SpreadsheetContext {
  cells?: Record<string, string | number>;
  highlight?: string;
  chartType?: 'column' | 'bar' | 'line' | 'pie';
  dataRange?: string;
}

export interface SpreadsheetWebViewProps {
  questionType: QuestionType;
  spreadsheetContext: SpreadsheetContext;
  expectedValue: string;
  targetCell?: string;
  onCorrect: (value: string) => void;
  onWrong: (value: string) => void;
  onHintRequest?: () => void;
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────

export const SpreadsheetWebView: React.FC<SpreadsheetWebViewProps> = ({
  questionType,
  spreadsheetContext,
  expectedValue,
  targetCell,
  onCorrect,
  onWrong,
}) => {
  const webViewRef = useRef<WebView>(null);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.type === 'ANSWER_SUBMITTED') {
          let normalized = (data.value ?? '').trim().toUpperCase();
          let expected = (expectedValue ?? '').trim().toUpperCase();

          normalized = normalized.replace(/\s+/g, '').replace(/;/g, ',').replace(/\$/g, '');
          expected = expected.replace(/\s+/g, '').replace(/;/g, ',').replace(/\$/g, '');

          if (normalized === expected) {
            onCorrect(data.value);
            webViewRef.current?.injectJavaScript('window.showSuccess(); true;');
          } else {
            onWrong(data.value);
            webViewRef.current?.injectJavaScript('window.showError(); true;');
          }
        }

        if (data.type === 'DRAG_ORDER_SUBMITTED') {
          const userOrder = data.order ?? [];
          const correctOrder = JSON.parse(expectedValue || '[]');
          const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);

          if (isCorrect) {
            onCorrect(JSON.stringify(data.order));
            webViewRef.current?.injectJavaScript('window.showSuccess(); true;');
          } else {
            onWrong(JSON.stringify(data.order));
            webViewRef.current?.injectJavaScript('window.showError(); true;');
          }
        }
      } catch {
        /* ignora mensagens malformadas */
      }
    },
    [expectedValue, onCorrect, onWrong]
  );

  const dragItems =
    questionType === 'DRAG_AND_DROP'
      ? (spreadsheetContext as any)?.dragItems ?? []
      : [];

  const html = generateHTML(questionType, spreadsheetContext, targetCell, dragItems);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            style={StyleSheet.absoluteFill}
            color="#217346"
            size="large"
          />
        )}
        keyboardDisplayRequiresUserAction={false}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback
        originWhitelist={['*']}
      />
    </View>
  );
};

// ─── GERADOR DE HTML ──────────────────────────────────────────

function generateHTML(
  type: QuestionType,
  ctx: SpreadsheetContext,
  targetCell?: string,
  dragItems?: string[]
): string {
  const cells = ctx.cells ?? {};
  const highlight = targetCell ?? ctx.highlight ?? 'A1';

  return /* html */ `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
<title>Arena Excel</title>
<style>
  /* ── RESET & BASE ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --excel:   #217346;
    --excel-mid: #2E9E5B;
    --excel-light: #E8F5E9;
    --excel-vivid: #27AE60;
    --text:    #1A1A2E;
    --text2:   #4A4A6A;
    --bg:      #F7F9F7;
    --border:  #E0E5E0;
    --white:   #FFFFFF;
    --yellow:  #F59E0B;
    --yellow-light: #FEF3C7;
    --success: #27AE60;
    --error:   #E74C3C;
    --gray:    #B0BEC5;
    --radius:  8px;
    --shadow:  0 2px 12px rgba(0,0,0,.08);
    --font:    -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --mono:    'Consolas', 'Courier New', monospace;
  }
  html, body {
    height: 100%;
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    overflow: hidden;
  }
  .app { display: flex; flex-direction: column; height: 100vh; padding: 10px; gap: 8px; }

  /* ── FORMULA BAR ── */
  .formula-bar {
    display: flex; align-items: center; gap: 8px;
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: var(--radius); padding: 8px 12px;
    box-shadow: var(--shadow);
  }
  .cell-ref {
    font-size: 13px; font-weight: 700; color: var(--excel);
    min-width: 36px; text-align: center;
    border-right: 1.5px solid var(--border); padding-right: 10px;
    font-family: var(--mono);
  }
  .fx-label {
    font-size: 13px; font-style: italic; color: var(--excel-mid);
    font-weight: 700; padding-right: 4px;
  }
  .formula-input {
    flex: 1; border: none; outline: none;
    font-size: 14px; font-family: var(--mono);
    color: var(--text); background: transparent;
  }

  /* ── GRID ── */
  .grid-wrapper {
    flex: 1; overflow: auto;
    border-radius: var(--radius); box-shadow: var(--shadow);
    border: 1.5px solid var(--border); background: var(--white);
  }
  table { border-collapse: collapse; width: max-content; min-width: 100%; }
  th, td { border: 1px solid var(--border); }
  .row-idx {
    background: var(--excel-light); color: var(--excel);
    font-size: 11px; font-weight: 700; text-align: center;
    padding: 4px 8px; min-width: 28px; user-select: none;
  }
  .col-hdr {
    background: var(--excel-light); color: var(--excel);
    font-size: 11px; font-weight: 700; text-align: center;
    padding: 6px 12px; min-width: 72px; user-select: none;
    position: sticky; top: 0; z-index: 2;
    border-bottom: 2px solid var(--excel);
  }
  .cell {
    padding: 6px 10px; font-size: 13px; min-width: 72px;
    height: 32px; vertical-align: middle; cursor: pointer;
    transition: background .15s;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    color: var(--text);
  }
  .cell:hover  { background: var(--excel-light); }
  .cell.selected {
    background: #C8E6C9;
    outline: 2px solid var(--excel); outline-offset: -2px;
  }
  .cell.highlight {
    background: var(--yellow-light);
    outline: 2px dashed var(--yellow); outline-offset: -2px;
    font-weight: 700; color: var(--text);
  }
  .cell.correct { background: var(--excel-light); outline: 2px solid var(--success); outline-offset: -2px; }
  .cell.wrong   { background: #FFEBEE; outline: 2px solid var(--error); outline-offset: -2px; }
  .cell.editable { cursor: text; }

  /* ── INPUT INLINE ── */
  .cell-input {
    width: 100%; height: 100%; border: none; outline: none;
    background: transparent; font-size: 13px; font-family: var(--mono);
    color: var(--text);
  }

  /* ── BOTÃO CONFIRMAR ── */
  .btn-confirm {
    background: var(--excel); color: #fff;
    border: none; border-radius: var(--radius);
    padding: 14px; font-size: 15px; font-weight: 700;
    cursor: pointer; letter-spacing: .3px;
    transition: background .2s, transform .1s;
    box-shadow: 0 3px 8px rgba(33,115,70,.35);
  }
  .btn-confirm:active { transform: scale(.97); }
  .btn-confirm:hover  { background: var(--excel-mid); }
  .btn-confirm:disabled {
    background: var(--border); color: var(--gray); box-shadow: none; cursor: default;
  }

  /* ── FEEDBACK TOAST ── */
  .toast {
    position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
    padding: 10px 24px; border-radius: 24px; font-size: 14px; font-weight: 600;
    opacity: 0; transition: opacity .3s; pointer-events: none; z-index: 99;
    white-space: nowrap;
  }
  .toast.show { opacity: 1; }
  .toast.ok   { background: var(--success); color: #fff; }
  .toast.fail { background: var(--error);   color: #fff; }

  /* ── FORMULA BUILDER ESPECÍFICO ── */
  .formula-focus {
    background: var(--white); border-radius: var(--radius);
    border: 2px solid var(--excel); padding: 12px 16px;
    box-shadow: 0 2px 12px rgba(33,115,70,.15);
  }
  .formula-focus-label {
    font-size: 11px; font-weight: 700; color: var(--excel);
    text-transform: uppercase; letter-spacing: .8px; margin-bottom: 6px;
  }
  .formula-focus-bar {
    display: flex; align-items: center; gap: 8px;
  }
  .equals-sign {
    font-size: 20px; font-weight: 900; color: var(--excel);
    font-family: var(--mono); user-select: none;
  }
  .formula-main-input {
    flex: 1; border: none; border-bottom: 2px solid var(--excel);
    outline: none; font-size: 16px; font-family: var(--mono);
    color: var(--text); background: transparent; padding: 4px 2px;
  }

  /* ── DRAG AND DROP ── */
  .dnd-list {
    list-style: none; display: flex; flex-direction: column; gap: 8px; padding: 4px;
  }
  .dnd-item {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: var(--radius); padding: 12px 14px;
    font-size: 14px; cursor: grab; user-select: none;
    display: flex; align-items: center; gap: 10px;
    box-shadow: var(--shadow); transition: box-shadow .15s, transform .15s;
    touch-action: none; color: var(--text);
  }
  .dnd-item:active { cursor: grabbing; box-shadow: 0 6px 20px rgba(0,0,0,.15); transform: scale(1.02); }
  .dnd-badge {
    width: 26px; height: 26px; border-radius: 13px;
    background: var(--excel-light); border: 1.5px solid var(--excel);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: var(--excel); flex-shrink: 0;
  }
  .drag-icon { color: var(--gray); font-size: 16px; flex-shrink: 0; }

  /* ── CHART SELECTOR ── */
  .chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .chart-card {
    border: 2px solid var(--border); border-radius: var(--radius);
    padding: 16px 12px; text-align: center; cursor: pointer;
    background: var(--white); transition: all .2s;
  }
  .chart-card:hover  { border-color: var(--excel); background: var(--excel-light); }
  .chart-card.active { border-color: var(--excel); background: var(--excel-light); }
  .chart-card.active .label { color: var(--excel); }
  .chart-card .icon  { font-size: 32px; }
  .chart-card .label { font-size: 13px; margin-top: 6px; font-weight: 600; color: var(--text2); }

  /* ── FILL IN BLANK ── */
  .formula-blank {
    font-family: var(--mono); font-size: 15px; line-height: 2.2;
    background: var(--white); border-radius: var(--radius);
    padding: 14px 16px; box-shadow: var(--shadow);
    border: 1.5px solid var(--border); color: var(--text);
  }
  .blank-input {
    display: inline-block; min-width: 80px;
    border-bottom: 2.5px solid var(--excel);
    text-align: center; outline: none;
    font-family: var(--mono); font-size: 15px;
    color: var(--excel); font-weight: 700; background: transparent;
  }

  /* ── LABEL SEÇÃO ── */
  .section-label {
    font-size: 12px; color: var(--text2); padding: 2px;
    font-weight: 600; letter-spacing: .3px;
  }
</style>
</head>
<body>
<div class="app" id="app">
  ${renderByType(type, cells, highlight, ctx, dragItems)}
</div>

<div class="toast" id="toast"></div>

<script>
const $ = id => document.getElementById(id);

function postToRN(payload) {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(payload));
  }
}

function showToast(msg, kind) {
  const t = $('toast');
  t.textContent = msg;
  t.className = 'toast show ' + kind;
  setTimeout(() => t.className = 'toast', 2400);
}

window.showError = function() {
  showToast('❌ Resposta incorreta. Tente novamente!', 'fail');
  const target = document.querySelector('.cell.highlight');
  if (target) {
    target.classList.add('wrong');
    setTimeout(() => target.classList.remove('wrong'), 1500);
  }
};

window.showSuccess = function() {
  showToast('✅ Resposta correta!', 'ok');
  const target = document.querySelector('.cell.highlight');
  if (target) target.classList.add('correct');
  const focusInput = $('formula-main-input');
  if (focusInput) {
    focusInput.style.borderBottomColor = '#27AE60';
    focusInput.disabled = true;
  }
};

const QUESTION_TYPE = "${type}";

// ── SPREADSHEET / FORMULA INPUT ──────────────────────────────
if (['SPREADSHEET_INPUT','FORMULA_BUILDER'].includes(QUESTION_TYPE)) {
  const targetCell = "${highlight}";
  const formulaInput = $('formula-input') || $('formula-main-input');
  const cellRef = $('cell-ref');

  if (formulaInput) {
    formulaInput.addEventListener('input', () => {
      const cell = document.querySelector('[data-cell="'+targetCell+'"]');
      if (cell) {
        const val = formulaInput.value;
        cell.textContent = val;
      }
    });
    formulaInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); submitAnswer(); }
    });
  }

  document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => {
      document.querySelectorAll('.cell').forEach(c => c.classList.remove('selected'));
      cell.classList.add('selected');
      const ref = cell.dataset.cell;
      if (cellRef) cellRef.textContent = ref;
      if (formulaInput && cell.classList.contains('highlight')) {
        formulaInput.focus();
      }
    });
  });

  window.submitAnswer = function() {
    const val = (formulaInput?.value ?? '').trim();
    if (!val) { showToast('⚠️ Digite uma fórmula ou valor', 'fail'); return; }
    postToRN({ type: 'ANSWER_SUBMITTED', value: val });
  };
}

// ── CHART BUILDER ────────────────────────────────────────────
if (QUESTION_TYPE === 'CHART_BUILDER') {
  let selected = null;
  document.querySelectorAll('.chart-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.chart-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selected = card.dataset.chart;
      const btn = $('btn-confirm');
      if (btn) btn.removeAttribute('disabled');
    });
  });
  window.submitAnswer = function() {
    if (!selected) { showToast('⚠️ Selecione um tipo de gráfico', 'fail'); return; }
    postToRN({ type: 'ANSWER_SUBMITTED', value: selected });
  };
}

// ── DRAG AND DROP ────────────────────────────────────────────
if (QUESTION_TYPE === 'DRAG_AND_DROP') {
  let dragSrc = null;
  const list = $('dnd-list');

  function updateBadges() {
    document.querySelectorAll('.dnd-badge').forEach((badge, i) => {
      badge.textContent = i + 1;
    });
  }

  if (list) {
    list.addEventListener('dragstart', e => {
      dragSrc = e.target.closest('.dnd-item');
      e.dataTransfer.effectAllowed = 'move';
    });
    list.addEventListener('dragover', e => {
      e.preventDefault();
      const target = e.target.closest('.dnd-item');
      if (target && target !== dragSrc) {
        const rect = target.getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) list.insertBefore(dragSrc, target);
        else list.insertBefore(dragSrc, target.nextSibling);
        updateBadges();
      }
    });
    list.addEventListener('touchstart', e => {
      dragSrc = e.target.closest('.dnd-item');
      if (dragSrc) dragSrc.style.opacity = '0.55';
    }, { passive: true });
    list.addEventListener('touchmove', e => {
      if (!dragSrc) return;
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.dnd-item');
      if (target && target !== dragSrc) {
        const rect = target.getBoundingClientRect();
        if (touch.clientY < rect.top + rect.height / 2) list.insertBefore(dragSrc, target);
        else list.insertBefore(dragSrc, target.nextSibling);
        updateBadges();
      }
    }, { passive: true });
    list.addEventListener('touchend', () => {
      if (dragSrc) dragSrc.style.opacity = '1';
      dragSrc = null;
    }, { passive: true });
  }

  window.submitAnswer = function() {
    const order = [...document.querySelectorAll('.dnd-item')].map(i => decodeURIComponent(i.dataset.value));
    postToRN({ type: 'DRAG_ORDER_SUBMITTED', order });
  };
}

// ── FILL IN BLANK ────────────────────────────────────────────
if (QUESTION_TYPE === 'FILL_IN_BLANK') {
  window.submitAnswer = function() {
    const inputs = [...document.querySelectorAll('.blank-input')];
    const values = inputs.map(i => i.value.trim());
    postToRN({ type: 'ANSWER_SUBMITTED', value: values.join('|') });
  };
}
</script>
</body>
</html>`;
}

// ─── RENDERERS POR TIPO ───────────────────────────────────────

function renderByType(
  type: QuestionType,
  cells: Record<string, string | number>,
  highlight: string,
  ctx: SpreadsheetContext,
  dragItems?: string[]
): string {
  switch (type) {
    case 'SPREADSHEET_INPUT':
      return renderSpreadsheet(cells, highlight);
    case 'FORMULA_BUILDER':
      return renderFormulaBuilder(cells, highlight);
    case 'CHART_BUILDER':
      return renderChartSelector();
    case 'DRAG_AND_DROP':
      return renderDragDrop(dragItems ?? []);
    case 'FILL_IN_BLANK':
      return renderFillBlank('=SE(___>=7,"Aprovado","___")');
    default:
      return renderSpreadsheet(cells, highlight);
  }
}

// SPREADSHEET_INPUT — planilha real com dados e célula alvo
function renderSpreadsheet(
  cells: Record<string, string | number>,
  highlight: string
): string {
  const COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
  const ROWS = 8;

  let html = `
    <div class="formula-bar">
      <span class="cell-ref" id="cell-ref">${highlight}</span>
      <span class="fx-label">fx</span>
      <input class="formula-input" id="formula-input"
        placeholder="Digite sua fórmula (ex: =SOMA(A1:A5))"
        autocorrect="off" autocapitalize="none" spellcheck="false"/>
    </div>
    <div class="grid-wrapper">
      <table>
        <thead><tr>
          <th class="row-idx"></th>
          ${COLS.map(c => `<th class="col-hdr">${c}</th>`).join('')}
        </tr></thead>
        <tbody>`;

  for (let r = 1; r <= ROWS; r++) {
    html += `<tr><td class="row-idx">${r}</td>`;
    for (const c of COLS) {
      const addr = `${c}${r}`;
      const val = cells[addr] ?? '';
      const isHighlight = addr === highlight;
      const cls = isHighlight ? 'cell highlight editable' : 'cell';
      html += `<td class="${cls}" data-cell="${addr}">${isHighlight ? '' : val}</td>`;
    }
    html += `</tr>`;
  }

  html += `
        </tbody>
      </table>
    </div>
    <button class="btn-confirm" onclick="submitAnswer()">✓ Confirmar Resposta</button>`;

  return html;
}

// FORMULA_BUILDER — foco na barra de fórmula + grade reduzida
function renderFormulaBuilder(
  cells: Record<string, string | number>,
  highlight: string
): string {
  const COLS = ['A', 'B', 'C', 'D'];
  const ROWS = 5;

  let grid = `
    <div class="grid-wrapper" style="max-height:160px;">
      <table>
        <thead><tr>
          <th class="row-idx"></th>
          ${COLS.map(c => `<th class="col-hdr">${c}</th>`).join('')}
        </tr></thead>
        <tbody>`;

  for (let r = 1; r <= ROWS; r++) {
    grid += `<tr><td class="row-idx">${r}</td>`;
    for (const c of COLS) {
      const addr = `${c}${r}`;
      const val = cells[addr] ?? '';
      const isHighlight = addr === highlight;
      const cls = isHighlight ? 'cell highlight editable' : 'cell';
      grid += `<td class="${cls}" data-cell="${addr}">${isHighlight ? '' : val}</td>`;
    }
    grid += `</tr>`;
  }

  grid += `</tbody></table></div>`;

  return `
    ${grid}
    <div class="formula-focus">
      <div class="formula-focus-label">✏️ Célula ${highlight} — Digite a fórmula</div>
      <div class="formula-focus-bar">
        <span class="equals-sign">=</span>
        <input class="formula-main-input" id="formula-main-input"
          placeholder="ex: SOMA(A1:A4)"
          autocorrect="off" autocapitalize="none" spellcheck="false"
          autofocus/>
      </div>
    </div>
    <div class="formula-bar" style="display:none;">
      <span class="cell-ref" id="cell-ref">${highlight}</span>
      <span class="fx-label">fx</span>
      <input id="formula-input" style="display:none;" autocorrect="off"/>
    </div>
    <button class="btn-confirm" onclick="submitAnswer()">✓ Confirmar Fórmula</button>`;
}

// CHART_BUILDER — seletor de tipo de gráfico
function renderChartSelector(): string {
  const charts = [
    { type: 'column', icon: '📊', label: 'Colunas' },
    { type: 'bar',    icon: '📉', label: 'Barras'  },
    { type: 'line',   icon: '📈', label: 'Linhas'  },
    { type: 'pie',    icon: '🥧', label: 'Pizza'   },
  ];

  return `
    <p class="section-label">Selecione o tipo de gráfico mais adequado:</p>
    <div class="chart-grid">
      ${charts.map(c => `
        <div class="chart-card" data-chart="${c.type}">
          <div class="icon">${c.icon}</div>
          <div class="label">${c.label}</div>
        </div>`).join('')}
    </div>
    <button class="btn-confirm" id="btn-confirm" disabled onclick="submitAnswer()">
      ✓ Confirmar Gráfico
    </button>`;
}

// DRAG_AND_DROP — itens ordenáveis com badge numérico
function renderDragDrop(items: string[]): string {
  const placeholders = items.length
    ? items
    : ['Passo 1', 'Passo 2', 'Passo 3'];

  return `
    <p class="section-label">Arraste para colocar na ordem correta:</p>
    <div style="flex:1; overflow:auto;">
      <ul class="dnd-list" id="dnd-list">
        ${placeholders.map((item, i) => `
          <li class="dnd-item" draggable="true" data-value="${encodeURIComponent(item)}">
            <span class="dnd-badge">${i + 1}</span>
            <span style="flex:1;">${item}</span>
            <span class="drag-icon">⠿</span>
          </li>`).join('')}
      </ul>
    </div>
    <button class="btn-confirm" onclick="submitAnswer()">✓ Confirmar Ordem</button>`;
}

// FILL_IN_BLANK — fórmula com lacunas para preencher
function renderFillBlank(template: string): string {
  const filled = template.replace(
    /___/g,
    `<input class="blank-input" size="6" autocorrect="off" autocapitalize="none"/>`
  );
  return `
    <p class="section-label">Complete a fórmula:</p>
    <div class="formula-blank">${filled}</div>
    <button class="btn-confirm" onclick="submitAnswer()">✓ Confirmar</button>`;
}

// ─── ESTILOS ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F7F9F7',
    shadowColor: '#217346',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: Platform.OS === 'ios' ? 0 : 2,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default SpreadsheetWebView;
