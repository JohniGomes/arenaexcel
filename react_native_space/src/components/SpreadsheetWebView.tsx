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
          // Server always validates — expectedValue is intentionally empty (anti-cheat)
          // Just forward the answer to the server via onCorrect
          if (!expectedValue) {
            onCorrect(data.value);
            return;
          }

          // Local validation fallback (only when expectedValue is explicitly provided)
          let normalized = (data.value ?? '').trim().toUpperCase();
          let expected = (expectedValue ?? '').trim().toUpperCase();
          normalized = normalized.replace(/\s+/g, '').replace(/;/g, ',').replace(/\$/g, '');
          expected = expected.replace(/\s+/g, '').replace(/;/g, ',').replace(/\$/g, '');

          if (normalized === expected) {
            onCorrect(data.value);
            webViewRef.current?.injectJavaScript('window.showSuccess && window.showSuccess(); true;');
          } else {
            onWrong(data.value);
            webViewRef.current?.injectJavaScript('window.showError && window.showError(); true;');
          }
        }

        if (data.type === 'DRAG_ORDER_SUBMITTED') {
          // Always submit to server — server has the correct order
          onCorrect(JSON.stringify(data.order));
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
  const dragN = dragItems?.length ?? 3;

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
    --excel:        #217346;
    --excel-mid:    #2E9E5B;
    --excel-light:  #E8F5E9;
    --excel-vivid:  #27AE60;
    --text:         #1A1A2E;
    --text2:        #4A4A6A;
    --bg:           #F7F9F7;
    --border:       #E0E5E0;
    --white:        #FFFFFF;
    --yellow:       #F59E0B;
    --yellow-light: #FEF3C7;
    --success:      #27AE60;
    --error:        #E74C3C;
    --gray:         #B0BEC5;
    --radius:       8px;
    --shadow:       0 2px 12px rgba(0,0,0,.08);
    --font:         -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --mono:         'Consolas', 'Courier New', monospace;
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

  /* ── LABEL SEÇÃO ── */
  .section-label {
    font-size: 12px; color: var(--text2); padding: 2px;
    font-weight: 600; letter-spacing: .3px;
  }

  /* ── DRAG AND DROP (novo modelo: clicar para preencher) ── */
  .dnd-slots { display: flex; flex-direction: column; gap: 6px; }
  .slot {
    display: flex; align-items: center; gap: 10px;
    border-radius: var(--radius); padding: 10px 12px;
    min-height: 42px; transition: all .2s; font-size: 13px;
  }
  .slot.empty {
    background: var(--white); border: 2px dashed var(--gray);
    color: var(--gray); cursor: default;
  }
  .slot.filled {
    background: var(--excel-light); border: 2px solid var(--excel);
    color: var(--text); cursor: pointer;
  }
  .slot-num {
    width: 24px; height: 24px; border-radius: 12px; flex-shrink: 0;
    background: var(--excel-light); border: 1.5px solid var(--excel);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: var(--excel);
  }
  .slot.filled .slot-num { background: var(--excel); color: #fff; border-color: var(--excel); }
  .slot-text { flex: 1; }
  .slot-undo { font-size: 10px; color: var(--gray); flex-shrink: 0; }
  .dnd-options { display: flex; flex-direction: column; gap: 5px; }
  .option-chip {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: var(--radius); padding: 10px 14px;
    font-size: 13px; cursor: pointer; transition: all .15s;
    color: var(--text); user-select: none;
  }
  .option-chip:hover { border-color: var(--excel); background: var(--excel-light); }
  .option-chip.used { display: none; }

  /* ── CHART SELECTOR ── */
  .chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .chart-card {
    border: 2px solid var(--border); border-radius: var(--radius);
    padding: 8px 6px; text-align: center; cursor: pointer;
    background: var(--white); transition: all .2s;
  }
  .chart-card:hover  { border-color: var(--excel); background: var(--excel-light); }
  .chart-card.active { border-color: var(--excel); background: var(--excel-light); }
  .chart-card.active .chart-label { color: var(--excel); font-weight: 700; }
  .chart-card .chart-icon  { font-size: 22px; }
  .chart-card .chart-label { font-size: 11px; margin-top: 3px; font-weight: 600; color: var(--text2); }
  .chart-preview {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
    width: 100%; min-height: 160px;
    display: flex; align-items: center; justify-content: center;
  }
  .chart-preview svg { width: 100%; height: auto; display: block; }

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
</style>
</head>
<body>
<div class="app" id="app">
  ${renderByType(type, cells, highlight, ctx, dragItems)}
</div>

<div class="toast" id="toast"></div>

<script>
var $ = function(id){ return document.getElementById(id); };

function postToRN(payload) {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(payload));
  }
}

function showToast(msg, kind) {
  var t = $('toast');
  t.textContent = msg;
  t.className = 'toast show ' + kind;
  setTimeout(function(){ t.className = 'toast'; }, 2400);
}

window.showError = function() {
  showToast('❌ Resposta incorreta. Tente novamente!', 'fail');
  var target = document.querySelector('.cell.highlight');
  if (target) {
    target.classList.add('wrong');
    setTimeout(function(){ target.classList.remove('wrong'); }, 1500);
  }
};

window.showSuccess = function() {
  showToast('✅ Resposta correta!', 'ok');
  var target = document.querySelector('.cell.highlight');
  if (target) target.classList.add('correct');
  var focusInput = $('formula-main-input');
  if (focusInput) {
    focusInput.style.borderBottomColor = '#27AE60';
    focusInput.disabled = true;
  }
};

var QUESTION_TYPE = "${type}";

// ── SPREADSHEET_INPUT / FORMULA_BUILDER ──────────────────────
if (QUESTION_TYPE === 'SPREADSHEET_INPUT' || QUESTION_TYPE === 'FORMULA_BUILDER') {
  var targetCell = "${highlight}";
  var formulaInput = $('formula-input') || $('formula-main-input');
  var cellRef = $('cell-ref');

  if (formulaInput) {
    formulaInput.addEventListener('input', function() {
      var cell = document.querySelector('[data-cell="' + targetCell + '"]');
      if (cell) cell.textContent = formulaInput.value;
    });
    formulaInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); window.submitAnswer(); }
    });
  }

  document.querySelectorAll('.cell').forEach(function(cell) {
    cell.addEventListener('click', function() {
      document.querySelectorAll('.cell').forEach(function(c){ c.classList.remove('selected'); });
      cell.classList.add('selected');
      var ref = cell.dataset.cell;
      if (cellRef) cellRef.textContent = ref;
      if (formulaInput && cell.classList.contains('highlight')) formulaInput.focus();
    });
  });

  window.submitAnswer = function() {
    var val = (formulaInput ? formulaInput.value : '').trim();
    if (!val) { showToast('⚠️ Digite uma fórmula ou valor', 'fail'); return; }
    postToRN({ type: 'ANSWER_SUBMITTED', value: val });
  };
}

// ── CHART_BUILDER ─────────────────────────────────────────────
if (QUESTION_TYPE === 'CHART_BUILDER') {
  var selectedChart = null;
  var cellData = ${JSON.stringify(cells)};

  // Extrai labels (coluna A) e valores (coluna B) a partir da linha 2
  var chartLabels = [], chartValues = [];
  for (var r = 2; r <= 10; r++) {
    var lbl = cellData['A' + r];
    var val = parseFloat(cellData['B' + r]);
    if (lbl !== undefined && lbl !== '') {
      chartLabels.push(String(lbl));
      chartValues.push(isNaN(val) ? 0 : val);
    }
  }
  var maxVal = Math.max.apply(null, chartValues.concat([1]));

  // viewBox-based SVGs — responsivos (width="100%" via CSS)
  var VW = 300, VH = 180;

  function svgColumnChart() {
    var n = chartLabels.length;
    if (!n) return '<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg"><text x="150" y="90" text-anchor="middle" fill="#aaa" font-size="14">Sem dados</text></svg>';
    var pad = 36, bw = Math.max(10, Math.floor((VW - pad - 10) / n) - 8);
    var out = '';
    for (var i = 0; i < n; i++) {
      var bh = Math.max(4, Math.floor((chartValues[i] / maxVal) * (VH - pad - 18)));
      var x = pad + i * ((VW - pad - 10) / n) + ((VW - pad - 10) / n - bw) / 2;
      var y = VH - pad - bh;
      out += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh + '" fill="#217346" rx="3"/>';
      out += '<text x="' + (x + bw/2) + '" y="' + (VH - 6) + '" text-anchor="middle" font-size="10" fill="#555">' + chartLabels[i].slice(0,6) + '</text>';
      out += '<text x="' + (x + bw/2) + '" y="' + (y - 4) + '" text-anchor="middle" font-size="9" fill="#217346" font-weight="bold">' + chartValues[i] + '</text>';
    }
    out += '<line x1="' + pad + '" y1="' + (VH - pad) + '" x2="' + (VW - 5) + '" y2="' + (VH - pad) + '" stroke="#ccc" stroke-width="1"/>';
    out += '<line x1="' + pad + '" y1="10" x2="' + pad + '" y2="' + (VH - pad) + '" stroke="#ccc" stroke-width="1"/>';
    return '<svg viewBox="0 0 ' + VW + ' ' + VH + '" xmlns="http://www.w3.org/2000/svg">' + out + '</svg>';
  }

  function svgBarChart() {
    var n = chartLabels.length;
    if (!n) return '<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg"><text x="150" y="90" text-anchor="middle" fill="#aaa" font-size="14">Sem dados</text></svg>';
    var lblW = 62, pad = 10, bh = Math.max(10, Math.floor((VH - pad * 2) / n) - 6);
    var out = '';
    for (var i = 0; i < n; i++) {
      var bw = Math.max(4, Math.floor((chartValues[i] / maxVal) * (VW - lblW - 36)));
      var y = pad + i * ((VH - pad * 2) / n) + ((VH - pad * 2) / n - bh) / 2;
      out += '<rect x="' + lblW + '" y="' + y + '" width="' + bw + '" height="' + bh + '" fill="#217346" rx="3"/>';
      out += '<text x="' + (lblW - 4) + '" y="' + (y + bh/2 + 4) + '" text-anchor="end" font-size="10" fill="#555">' + chartLabels[i].slice(0,8) + '</text>';
      out += '<text x="' + (lblW + bw + 5) + '" y="' + (y + bh/2 + 4) + '" font-size="9" fill="#217346" font-weight="bold">' + chartValues[i] + '</text>';
    }
    out += '<line x1="' + lblW + '" y1="' + pad + '" x2="' + lblW + '" y2="' + (VH - pad) + '" stroke="#ccc" stroke-width="1"/>';
    return '<svg viewBox="0 0 ' + VW + ' ' + VH + '" xmlns="http://www.w3.org/2000/svg">' + out + '</svg>';
  }

  function svgLineChart() {
    var n = chartLabels.length;
    if (!n) return '<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg"><text x="150" y="90" text-anchor="middle" fill="#aaa" font-size="14">Sem dados</text></svg>';
    var pad = 36;
    var stepX = (VW - pad - 12) / Math.max(n - 1, 1);
    var pts = [], dotsHtml = '';
    for (var i = 0; i < n; i++) {
      var x = pad + i * stepX;
      var y = (VH - pad - 10) - Math.floor((chartValues[i] / maxVal) * (VH - pad - 26)) + 10;
      pts.push(x + ',' + y);
      dotsHtml += '<circle cx="' + x + '" cy="' + y + '" r="5" fill="#217346"/>';
      dotsHtml += '<circle cx="' + x + '" cy="' + y + '" r="2.5" fill="#fff"/>';
      dotsHtml += '<text x="' + x + '" y="' + (VH - 6) + '" text-anchor="middle" font-size="10" fill="#555">' + chartLabels[i].slice(0,5) + '</text>';
      dotsHtml += '<text x="' + x + '" y="' + (y - 9) + '" text-anchor="middle" font-size="9" fill="#217346" font-weight="bold">' + chartValues[i] + '</text>';
    }
    var axes = '<line x1="' + pad + '" y1="' + (VH - pad) + '" x2="' + (VW - 5) + '" y2="' + (VH - pad) + '" stroke="#ccc" stroke-width="1"/>';
    axes += '<line x1="' + pad + '" y1="10" x2="' + pad + '" y2="' + (VH - pad) + '" stroke="#ccc" stroke-width="1"/>';
    return '<svg viewBox="0 0 ' + VW + ' ' + VH + '" xmlns="http://www.w3.org/2000/svg">' + axes + '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#217346" stroke-width="2.5" stroke-linejoin="round"/>' + dotsHtml + '</svg>';
  }

  function svgPieChart() {
    var n = chartLabels.length;
    if (!n) return '<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg"><text x="150" y="90" text-anchor="middle" fill="#aaa" font-size="14">Sem dados</text></svg>';
    var colors = ['#217346','#27AE60','#2ECC71','#1E8449','#58D68D','#82E0AA'];
    var total = chartValues.reduce(function(a,b){ return a+b; }, 0) || 1;
    var cx = VW * 0.42, cy = VH / 2, r = Math.min(VH / 2 - 18, 64);
    var startAngle = -Math.PI / 2;
    var out = '';
    for (var i = 0; i < n; i++) {
      var angle = (chartValues[i] / total) * 2 * Math.PI;
      if (angle < 0.01) continue;
      var endAngle = startAngle + angle;
      var x1 = cx + r * Math.cos(startAngle);
      var y1 = cy + r * Math.sin(startAngle);
      var x2 = cx + r * Math.cos(endAngle);
      var y2 = cy + r * Math.sin(endAngle);
      var large = angle > Math.PI ? 1 : 0;
      var pct = Math.round(chartValues[i] / total * 100);
      out += '<path d="M' + cx + ',' + cy + ' L' + x1.toFixed(1) + ',' + y1.toFixed(1) + ' A' + r + ',' + r + ' 0 ' + large + ',1 ' + x2.toFixed(1) + ',' + y2.toFixed(1) + ' Z" fill="' + colors[i % colors.length] + '"/>';
      var midA = startAngle + angle / 2;
      var lx = cx + (r + 22) * Math.cos(midA);
      var ly = cy + (r + 22) * Math.sin(midA);
      out += '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" font-size="9" fill="#333">' + chartLabels[i].slice(0,8) + ' ' + pct + '%</text>';
      startAngle = endAngle;
    }
    return '<svg viewBox="0 0 ' + VW + ' ' + VH + '" xmlns="http://www.w3.org/2000/svg">' + out + '</svg>';
  }

  var svgRenderers = { column: svgColumnChart, bar: svgBarChart, line: svgLineChart, pie: svgPieChart };

  window.selectChart = function(type) {
    selectedChart = type;
    document.querySelectorAll('.chart-card').forEach(function(c){ c.classList.remove('active'); });
    var card = document.querySelector('.chart-card[data-chart="' + type + '"]');
    if (card) card.classList.add('active');
    var preview = $('chart-preview');
    if (preview && svgRenderers[type]) preview.innerHTML = svgRenderers[type]();
    var btn = $('btn-confirm');
    if (btn) btn.removeAttribute('disabled');
  };

  window.submitAnswer = function() {
    if (!selectedChart) { showToast('⚠️ Selecione um tipo de gráfico', 'fail'); return; }
    postToRN({ type: 'ANSWER_SUBMITTED', value: selectedChart });
  };
}

// ── DRAG AND DROP (clicar para preencher slots) ───────────────
if (QUESTION_TYPE === 'DRAG_AND_DROP') {
  var dndN = ${dragN};
  var slots = [];
  for (var si = 0; si < dndN; si++) slots.push(null); // null = empty

  window.chipClick = function(chipIdx) {
    var chip = document.querySelector('.option-chip[data-idx="' + chipIdx + '"]');
    if (!chip || chip.classList.contains('used')) return;
    var nextEmpty = -1;
    for (var j = 0; j < slots.length; j++) { if (slots[j] === null) { nextEmpty = j; break; } }
    if (nextEmpty === -1) { showToast('⚠️ Todos os espaços preenchidos. Clique num slot para desfazer.', 'fail'); return; }
    slots[nextEmpty] = chipIdx;
    chip.classList.add('used');
    var slot = document.querySelector('.slot[data-idx="' + nextEmpty + '"]');
    if (slot) {
      slot.querySelector('.slot-text').textContent = chip.textContent;
      slot.querySelector('.slot-undo').textContent = '✕ desfazer';
      slot.classList.remove('empty');
      slot.classList.add('filled');
      slot.dataset.chipIdx = chipIdx;
    }
  };

  window.slotClick = function(slotIdx) {
    var slot = document.querySelector('.slot[data-idx="' + slotIdx + '"]');
    if (!slot || slot.classList.contains('empty')) return;
    var chipIdx = parseInt(slot.dataset.chipIdx);
    slots[slotIdx] = null;
    var chip = document.querySelector('.option-chip[data-idx="' + chipIdx + '"]');
    if (chip) chip.classList.remove('used');
    slot.querySelector('.slot-text').textContent = '—';
    slot.querySelector('.slot-undo').textContent = '';
    slot.classList.remove('filled');
    slot.classList.add('empty');
    delete slot.dataset.chipIdx;
  };

  window.submitAnswer = function() {
    for (var k = 0; k < slots.length; k++) {
      if (slots[k] === null) { showToast('⚠️ Preencha todos os espaços', 'fail'); return; }
    }
    var items = ${JSON.stringify(dragItems ?? [])};
    var order = slots.map(function(chipIdx){ return items[chipIdx]; });
    postToRN({ type: 'DRAG_ORDER_SUBMITTED', order: order });
  };
}

// ── FILL IN BLANK ─────────────────────────────────────────────
if (QUESTION_TYPE === 'FILL_IN_BLANK') {
  window.submitAnswer = function() {
    var inputs = Array.from(document.querySelectorAll('.blank-input'));
    var values = inputs.map(function(i){ return i.value.trim(); });
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
    case 'FORMULA_BUILDER':  // unificado — mesmo visual
      return renderSpreadsheet(cells, highlight);
    case 'CHART_BUILDER':
      return renderChartSelector(cells, ctx);
    case 'DRAG_AND_DROP':
      return renderDragDrop(dragItems ?? []);
    case 'FILL_IN_BLANK':
      return renderFillBlank('=SE(___>=7,"Aprovado","___")');
    default:
      return renderSpreadsheet(cells, highlight);
  }
}

// SPREADSHEET_INPUT / FORMULA_BUILDER — planilha real com dados e célula alvo
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

// CHART_BUILDER — mini tabela de dados + seletor de gráfico + preview SVG
function renderChartSelector(
  cells: Record<string, string | number>,
  _ctx: SpreadsheetContext
): string {
  // Mini tabela com os dados (máx 7 linhas: header + 6 dados)
  const rows: string[] = [];
  for (let r = 1; r <= 7; r++) {
    const a = cells[`A${r}`] ?? '';
    const b = cells[`B${r}`] ?? '';
    const c = cells[`C${r}`] ?? '';
    if (a === '' && b === '' && c === '') break;
    const isH = r === 1;
    const bg = isH ? 'background:#E8F5E9;font-weight:700;color:#217346;' : 'background:#fff;color:#1A1A2E;';
    rows.push(`<tr>
      <td style="padding:4px 6px;border:1px solid #E0E5E0;background:#E8F5E9;font-size:10px;color:#217346;font-weight:700;text-align:center;">${r}</td>
      <td style="padding:4px 8px;border:1px solid #E0E5E0;${bg}font-size:11px;">${a}</td>
      <td style="padding:4px 8px;border:1px solid #E0E5E0;${bg}font-size:11px;">${b}</td>
      ${c !== '' ? `<td style="padding:4px 8px;border:1px solid #E0E5E0;${bg}font-size:11px;">${c}</td>` : ''}
    </tr>`);
  }

  const tableHtml = `
    <div style="overflow:auto;border-radius:6px;border:1.5px solid #E0E5E0;max-height:120px;margin-bottom:0;">
      <table style="border-collapse:collapse;width:100%;">
        <thead><tr>
          <th style="padding:3px;background:#E8F5E9;border:1px solid #E0E5E0;font-size:10px;color:#217346;"></th>
          ${['A','B','C'].map(c => `<th style="padding:4px 8px;background:#E8F5E9;border:1px solid #E0E5E0;font-size:10px;color:#217346;font-weight:700;">${c}</th>`).join('')}
        </tr></thead>
        <tbody>${rows.join('')}</tbody>
      </table>
    </div>`;

  const charts = [
    { type: 'column', icon: '📊', label: 'Colunas' },
    { type: 'bar',    icon: '📉', label: 'Barras'  },
    { type: 'line',   icon: '📈', label: 'Linhas'  },
    { type: 'pie',    icon: '🥧', label: 'Pizza'   },
  ];

  return `
    <p class="section-label">📋 Dados da planilha:</p>
    ${tableHtml}
    <p class="section-label" style="margin-top:6px;">📊 Selecione e visualize o tipo de gráfico:</p>
    <div class="chart-grid">
      ${charts.map(c => `
        <div class="chart-card" data-chart="${c.type}" onclick="selectChart('${c.type}')">
          <div class="chart-icon">${c.icon}</div>
          <div class="chart-label">${c.label}</div>
        </div>`).join('')}
    </div>
    <div class="chart-preview" id="chart-preview">
      <span style="color:var(--gray);font-size:12px;">← Toque para visualizar</span>
    </div>
    <button class="btn-confirm" id="btn-confirm" disabled onclick="submitAnswer()">
      ✓ Confirmar Gráfico
    </button>`;
}

// DRAG_AND_DROP — clicar para preencher slots em ordem
function renderDragDrop(items: string[]): string {
  const placeholders = items.length ? items : ['Passo 1', 'Passo 2', 'Passo 3'];

  const slotsHtml = placeholders
    .map((_, i) => `
      <div class="slot empty" data-idx="${i}" onclick="slotClick(${i})">
        <span class="slot-num">${i + 1}</span>
        <span class="slot-text">—</span>
        <span class="slot-undo"></span>
      </div>`)
    .join('');

  const optionsHtml = placeholders
    .map((item, i) => `
      <div class="option-chip" data-idx="${i}" data-value="${encodeURIComponent(item)}" onclick="chipClick(${i})">
        ${item}
      </div>`)
    .join('');

  return `
    <p class="section-label">📋 Coloque na ordem correta:</p>
    <div class="dnd-slots" id="dnd-slots">${slotsHtml}</div>
    <p class="section-label" style="margin-top:8px;">🎯 Opções — toque para selecionar:</p>
    <div class="dnd-options" id="dnd-options">${optionsHtml}</div>
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
