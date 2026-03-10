"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function createTable(data, highlight) {
    let html = '<table style="border-collapse: collapse; margin: 20px auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">';
    html += '<thead><tr>';
    data.headers.forEach((h, i) => {
        const isHighlight = highlight?.col === i;
        html += `<th style="background: ${isHighlight ? '#FFD700' : '#2196F3'}; color: ${isHighlight ? '#333' : 'white'}; padding: 12px 20px; border: 2px solid ${isHighlight ? '#FFA000' : '#1976D2'}; font-weight: bold;">${h}</th>`;
    });
    html += '</tr></thead>';
    html += '<tbody>';
    data.rows.forEach((row, rowIndex) => {
        html += '<tr>';
        row.forEach((cell, colIndex) => {
            const isHighlight = highlight?.row === rowIndex && highlight?.col === colIndex;
            html += `<td style="padding: 12px 20px; border: 1px solid #ddd; text-align: center; background: ${isHighlight ? '#FFEB3B' : 'white'}; ${isHighlight ? 'font-weight: bold; border: 3px solid #FFA000;' : ''}">${cell}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
}
const contexts = {
    'fundamentos-excel': {
        3: `<div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
      <h3 style="margin-bottom: 15px;">🔢 Funções Estatísticas</h3>
      <div style="background: white; padding: 20px; border-radius: 8px; color: #333;">
        ${createTable({
            headers: ['Função', 'O que faz', 'Exemplo'],
            rows: [
                ['=SOMA()', 'Soma valores', '=SOMA(A1:A5) → 150'],
                ['=MÉDIA()', 'Calcula média', '=MÉDIA(A1:A5) → 30'],
                ['=MÁXIMO()', 'Maior valor', '=MÁXIMO(A1:A5) → 50'],
                ['=MÍNIMO()', 'Menor valor', '=MÍNIMO(A1:A5) → 10'],
            ]
        })}
        <div style="margin-top: 15px; padding: 12px; background: #E3F2FD; border-left: 4px solid #2196F3; border-radius: 4px;">
          <p style="margin: 0; color: #1976D2;"><strong>💡 Qual função retorna o MENOR valor?</strong></p>
        </div>
      </div>
    </div>`,
        4: `<div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; color: white;">
      <h3 style="margin-bottom: 15px;">📊 Dados de Exemplo</h3>
      <div style="background: white; padding: 20px; border-radius: 8px; color: #333;">
        ${createTable({
            headers: ['Produto', 'Vendas'],
            rows: [
                ['Notebook', '15'],
                ['Mouse', '42'],
                ['Teclado', '28'],
                ['Monitor', '89'],
                ['Webcam', '33'],
                ['Fone', '67'],
                ['HD Externo', '21'],
                ['Pendrive', '95'],
                ['Hub USB', '12'],
                ['Cabo HDMI', '58'],
            ]
        })}
        <div style="margin-top: 15px; padding: 12px; background: #FFF3CD; border-left: 4px solid #FFA000; border-radius: 4px;">
          <p style="margin: 0; color: #856404;"><strong>🎯 Se você usar =MÁXIMO(B1:B10), qual será o resultado?</strong></p>
        </div>
      </div>
    </div>`,
        7: `<div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border-radius: 12px; color: white;">
      <h3 style="margin-bottom: 15px;">📌 Referências no Excel</h3>
      <div style="background: white; padding: 20px; border-radius: 8px; color: #333;">
        <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
          <div style="flex: 1; min-width: 200px; padding: 15px; background: #E8F5E9; border: 3px solid #4CAF50; border-radius: 8px;">
            <div style="font-size: 24px; text-align: center; margin-bottom: 10px;">🔄</div>
            <h4 style="margin: 0 0 10px 0; text-align: center; color: #2E7D32;">Relativa</h4>
            <p style="margin: 5px 0; font-size: 14px; text-align: center;"><code style="background: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">A1</code></p>
            <p style="margin: 10px 0 0 0; font-size: 13px; color: #555;">Muda ao copiar</p>
          </div>
          <div style="flex: 1; min-width: 200px; padding: 15px; background: #E3F2FD; border: 3px solid #2196F3; border-radius: 8px;">
            <div style="font-size: 24px; text-align: center; margin-bottom: 10px;">🔒</div>
            <h4 style="margin: 0 0 10px 0; text-align: center; color: #1976D2;">Absoluta</h4>
            <p style="margin: 5px 0; font-size: 14px; text-align: center;"><code style="background: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">$A$1</code></p>
            <p style="margin: 10px 0 0 0; font-size: 13px; color: #555;">NÃO muda ao copiar</p>
          </div>
        </div>
        <div style="margin-top: 20px; padding: 15px; background: #FFF3CD; border-left: 4px solid #FFA000; border-radius: 4px;">
          <p style="margin: 0; color: #856404;"><strong>💡 O símbolo $ "trava" a referência!</strong></p>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #555;">Use <kbd style="background: white; padding: 2px 6px; border: 1px solid #ccc; border-radius: 3px;">F4</kbd> para alternar entre tipos</p>
        </div>
      </div>
    </div>`,
        8: `<div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; color: white;">
      <h3 style="margin-bottom: 15px;">📋 Quando usar $A$1?</h3>
      <div style="background: white; padding: 20px; border-radius: 8px; color: #333;">
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 15px 0; color: #2196F3;">Exemplo: Tabela de Preços com Taxa</h4>
          ${createTable({
            headers: ['Produto', 'Preço', 'Taxa (10%)', 'Total'],
            rows: [
                ['Item A', 'R$ 100', '=C1*$E$1', '=B2+C2'],
                ['Item B', 'R$ 200', '=C2*$E$1', '=B3+C3'],
                ['Item C', 'R$ 150', '=C3*$E$1', '=B4+C4'],
            ]
        })}
          <div style="text-align: center; margin-top: 15px; padding: 10px; background: #FFEB3B; border-radius: 4px;">
            <strong>Taxa: 10% (célula E1)</strong>
          </div>
        </div>
        <div style="padding: 15px; background: #E8F5E9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <p style="margin: 0; color: #2E7D32;"><strong>✅ $E$1 garante que TODAS as fórmulas usem a mesma taxa!</strong></p>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #555;">Sem o $, cada linha pegaria uma célula diferente</p>
        </div>
      </div>
    </div>`,
        9: `<div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); border-radius: 12px;">
      <h3 style="margin-bottom: 15px; color: #333;">➗ Operadores Matemáticos</h3>
      <div style="background: white; padding: 20px; border-radius: 8px;">
        ${createTable({
            headers: ['Operador', 'Operação', 'Exemplo', 'Resultado'],
            rows: [
                ['+', 'Adição', '=10+5', '15'],
                ['-', 'Subtração', '=10-5', '5'],
                ['*', 'Multiplicação', '=10*5', '50'],
                ['/', 'Divisão', '=10/5', '2'],
                ['^', 'Potência', '=10^2', '100'],
                ['%', 'Porcentagem', '=10%', '0,1'],
            ]
        })}
        <div style="margin-top: 15px; padding: 12px; background: #FFF3CD; border-left: 4px solid #FFA000; border-radius: 4px;">
          <p style="margin: 0; color: #856404;"><strong>⚠️ Ordem de precedência: ^ → * / → + -</strong></p>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #555;">Use parênteses ( ) para forçar uma ordem específica</p>
        </div>
      </div>
    </div>`,
    },
    'formulas-essenciais': {
        4: `<div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
      <h3 style="margin-bottom: 15px;">🔍 PROCV vs PROCH</h3>
      <div style="background: white; padding: 20px; border-radius: 8px; color: #333;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div style="padding: 15px; background: #E3F2FD; border: 3px solid #2196F3; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #1976D2; text-align: center;">PROCV (Vertical) ⬇️</h4>
            ${createTable({
            headers: ['ID', 'Nome', 'Cargo'],
            rows: [
                ['101', 'Ana', 'Gerente'],
                ['102', 'Bruno', 'Analista'],
                ['103', 'Carla', 'Diretora'],
            ]
        })}
            <p style="margin: 10px 0 0 0; font-size: 13px; text-align: center; color: #555;">Busca em COLUNAS</p>
          </div>
          <div style="padding: 15px; background: #FCE4EC; border: 3px solid #E91E63; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #C2185B; text-align: center;">PROCH (Horizontal) ➡️</h4>
            ${createTable({
            headers: ['Mês', 'Jan', 'Fev', 'Mar'],
            rows: [
                ['Vendas', '100', '120', '150'],
            ]
        })}
            <p style="margin: 10px 0 0 0; font-size: 13px; text-align: center; color: #555;">Busca em LINHAS</p>
          </div>
        </div>
        <div style="padding: 15px; background: #FFF3CD; border-left: 4px solid #FFA000; border-radius: 4px;">
          <p style="margin: 0; color: #856404;"><strong>🎯 Diferença Principal:</strong></p>
          <p style="margin: 5px 0; font-size: 14px; color: #555;">📊 PROCV = dados organizados em COLUNAS (mais comum)</p>
          <p style="margin: 5px 0; font-size: 14px; color: #555;">📈 PROCH = dados organizados em LINHAS (menos usado)</p>
        </div>
      </div>
    </div>`,
        8: `<div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); border-radius: 12px;">
      <h3 style="margin-bottom: 15px; color: #333;">📝 Função TEXTO</h3>
      <div style="background: white; padding: 20px; border-radius: 8px;">
        <h4 style="margin: 0 0 15px 0; color: #FF6B6B;">Formatar Números como Texto</h4>
        ${createTable({
            headers: ['Valor', 'Fórmula', 'Resultado'],
            rows: [
                ['1234.56', '=TEXTO(A1,"R$ #.##0,00")', 'R$ 1.234,56'],
                ['0.85', '=TEXTO(A2,"0%")', '85%'],
                ['42389', '=TEXTO(A3,"DD/MM/AAAA")', '01/01/2016'],
                ['1500000', '=TEXTO(A4,"#.##0")', '1.500.000'],
            ]
        })}
        <div style="margin-top: 15px; padding: 12px; background: #E8F5E9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <p style="margin: 0; color: #2E7D32;"><strong>✅ TEXTO() converte números em texto formatado</strong></p>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #555;">Útil para relatórios, etiquetas e concatenações</p>
        </div>
      </div>
    </div>`,
        9: `<div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border-radius: 12px; color: white;">
      <h3 style="margin-bottom: 15px;">🪆 SE Aninhado (Múltiplas Condições)</h3>
      <div style="background: white; padding: 20px; border-radius: 8px; color: #333;">
        <div style="padding: 15px; background: #E3F2FD; border-radius: 8px; margin-bottom: 15px;">
          <code style="display: block; font-size: 14px; color: #1976D2; white-space: pre-wrap;">=SE(nota>=9, "A",
   SE(nota>=7, "B",
      SE(nota>=5, "C", "D")))</code>
        </div>
        ${createTable({
            headers: ['Nota', 'Conceito'],
            rows: [
                ['9.5', 'A'],
                ['7.8', 'B'],
                ['6.2', 'C'],
                ['4.1', 'D'],
            ]
        })}
        <div style="margin-top: 15px; padding: 12px; background: #FFF3CD; border-left: 4px solid #FFA000; border-radius: 4px;">
          <p style="margin: 0; color: #856404;"><strong>📌 Limite do Excel:</strong></p>
          <p style="margin: 5px 0; font-size: 14px; color: #555;">✅ Excel 2007+: até <strong>64 SEs aninhados</strong></p>
          <p style="margin: 5px 0; font-size: 14px; color: #555;">🎯 Recomendado: máximo 7 níveis para legibilidade</p>
        </div>
      </div>
    </div>`,
    },
};
async function main() {
    console.log('🎨 Adicionando mais contextos visuais...\n');
    let totalUpdated = 0;
    for (const [slug, questionsContexts] of Object.entries(contexts)) {
        const trail = await prisma.trails.findUnique({ where: { slug } });
        if (!trail)
            continue;
        console.log(`📚 ${trail.name}`);
        for (const [orderStr, htmlContext] of Object.entries(questionsContexts)) {
            const order = parseInt(orderStr);
            const question = await prisma.questions.findFirst({
                where: { trailId: trail.id, order }
            });
            if (!question)
                continue;
            let newContext = JSON.stringify({ htmlView: htmlContext });
            if (question.spreadsheetContext) {
                try {
                    const existing = JSON.parse(question.spreadsheetContext);
                    existing.htmlView = htmlContext;
                    newContext = JSON.stringify(existing);
                }
                catch { }
            }
            await prisma.questions.update({
                where: { id: question.id },
                data: { spreadsheetContext: newContext },
            });
            totalUpdated++;
            process.stdout.write('✓');
        }
        console.log('  ✅\n');
    }
    console.log(`\n🎉 ${totalUpdated} contextos visuais adicionados!`);
}
main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=add_all_visual_contexts.js.map