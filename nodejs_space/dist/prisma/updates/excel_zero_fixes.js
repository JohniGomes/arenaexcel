"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excelZeroUpdates = void 0;
exports.excelZeroUpdates = [
    {
        order: 1,
        hint: 'No Excel, você pode abrir um arquivo novo pressionando Ctrl+N ou clicando em "Novo" no menu Arquivo.',
        spreadsheetContext: JSON.stringify({
            htmlView: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; border-radius: 8px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">💻 Interface do Excel</h3>
          <div style="background: white; padding: 15px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
              <div style="padding: 8px 16px; background: #4CAF50; color: white; border-radius: 4px; font-weight: bold;">📄 Arquivo</div>
              <div style="padding: 8px 16px; background: #eee; border-radius: 4px;">Página Inicial</div>
              <div style="padding: 8px 16px; background: #eee; border-radius: 4px;">Inserir</div>
            </div>
            <p style="color: #555; margin: 10px 0;">Clique em <strong>Arquivo → Novo</strong> para criar uma nova pasta de trabalho.</p>
            <div style="margin-top: 15px; padding: 10px; background: #e3f2fd; border-left: 4px solid #2196F3; border-radius: 4px;">
              <strong>📌 Dica:</strong> Atalho rápido: <kbd style="padding: 2px 6px; background: #fff; border: 1px solid #ccc; border-radius: 3px;">Ctrl + N</kbd>
            </div>
          </div>
        </div>
      `
        }),
    },
    {
        order: 2,
        hint: 'As colunas do Excel são identificadas por letras (A, B, C...) e ficam no topo da planilha.',
        spreadsheetContext: JSON.stringify({
            htmlView: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; border-radius: 8px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">📊 Estrutura da Planilha</h3>
          <div style="background: white; padding: 15px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow-x: auto;">
            <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
              <thead>
                <tr>
                  <th style="background: #4CAF50; color: white; padding: 10px; border: 2px solid #388E3C; font-size: 16px; font-weight: bold;">A</th>
                  <th style="background: #4CAF50; color: white; padding: 10px; border: 2px solid #388E3C; font-size: 16px; font-weight: bold;">B</th>
                  <th style="background: #4CAF50; color: white; padding: 10px; border: 2px solid #388E3C; font-size: 16px; font-weight: bold;">C</th>
                  <th style="background: #4CAF50; color: white; padding: 10px; border: 2px solid #388E3C; font-size: 16px; font-weight: bold;">D</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Célula A1</td>
                  <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Célula B1</td>
                  <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Célula C1</td>
                  <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Célula D1</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Célula A2</td>
                  <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Célula B2</td>
                  <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Célula C2</td>
                  <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Célula D2</td>
                </tr>
              </tbody>
            </table>
            <p style="margin-top: 15px; color: #555;">👆 As <strong>colunas</strong> são as letras no topo (A, B, C, D...)</p>
          </div>
        </div>
      `
        }),
    },
    {
        order: 3,
        hint: 'A célula C5 está na coluna C (terceira coluna) e linha 5 (quinta linha).',
        spreadsheetContext: JSON.stringify({
            htmlView: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; border-radius: 8px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">📍 Localizando a Célula C5</h3>
          <div style="background: white; padding: 15px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow-x: auto;">
            <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
              <thead>
                <tr>
                  <th style="background: #eee; padding: 8px; border: 1px solid #ddd; width: 40px;"></th>
                  <th style="background: #2196F3; color: white; padding: 10px; border: 2px solid #1976D2;">A</th>
                  <th style="background: #2196F3; color: white; padding: 10px; border: 2px solid #1976D2;">B</th>
                  <th style="background: #FFD700; color: #333; padding: 10px; border: 3px solid #FFA000; font-weight: bold;">C ←</th>
                  <th style="background: #2196F3; color: white; padding: 10px; border: 2px solid #1976D2;">D</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">1</td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td></tr>
                <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">2</td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td></tr>
                <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">3</td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td></tr>
                <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">4</td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td></tr>
                <tr><td style="background: #FFD700; padding: 8px; border: 3px solid #FFA000; font-weight: bold; text-align: center;">5 ↑</td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="background: #FFEB3B; padding: 10px; border: 3px solid #FFA000; font-weight: bold; text-align: center;">C5 ✓</td><td style="padding: 10px; border: 1px solid #ddd;"></td></tr>
              </tbody>
            </table>
            <p style="margin-top: 15px; color: #555; font-weight: bold; font-size: 16px;">✅ A célula <span style="background: #FFEB3B; padding: 2px 8px; border-radius: 4px;">C5</span> está destacada em amarelo!</p>
          </div>
        </div>
      `
        }),
    },
    {
        order: 4,
        hint: 'Para selecionar A1:D4, clique em A1 e arraste até D4, ou clique em A1, segure Shift e clique em D4.',
        spreadsheetContext: JSON.stringify({
            htmlView: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; border-radius: 8px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">🔲 Selecionando Intervalo A1:D4</h3>
          <div style="background: white; padding: 15px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow-x: auto;">
            <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
              <thead>
                <tr>
                  <th style="background: #eee; padding: 8px; border: 1px solid #ddd; width: 40px;"></th>
                  <th style="background: #2196F3; color: white; padding: 10px; border: 2px solid #1976D2;">A</th>
                  <th style="background: #2196F3; color: white; padding: 10px; border: 2px solid #1976D2;">B</th>
                  <th style="background: #2196F3; color: white; padding: 10px; border: 2px solid #1976D2;">C</th>
                  <th style="background: #2196F3; color: white; padding: 10px; border: 2px solid #1976D2;">D</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">1</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3; font-weight: bold;">A1</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3;">B1</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3;">C1</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3;">D1</td></tr>
                <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">2</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3;">A2</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3;">B2</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3;">C2</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3;">D2</td></tr>
                <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">3</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3;">A3</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3;">B3</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3;">C3</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3;">D3</td></tr>
                <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">4</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3;">A4</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3;">B4</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3;">C4</td><td style="background: #BBDEFB; padding: 10px; border: 2px solid #2196F3; font-weight: bold;">D4</td></tr>
                <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">5</td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td><td style="padding: 10px; border: 1px solid #ddd;"></td></tr>
              </tbody>
            </table>
            <p style="margin-top: 15px; color: #555;">✅ Células de <strong>A1 até D4</strong> selecionadas (16 células em azul)</p>
            <div style="margin-top: 10px; padding: 10px; background: #e3f2fd; border-left: 4px solid #2196F3; border-radius: 4px;">
              <strong>💡 Como selecionar:</strong><br>
              • Clique em A1, arraste até D4<br>
              • Ou: Clique em A1, segure Shift + clique em D4
            </div>
          </div>
        </div>
      `
        }),
    },
    {
        order: 5,
        hint: 'Posicione o cursor entre os cabeçalhos das colunas (entre A e B, por exemplo). Quando virar uma seta dupla ↔, clique duas vezes para ajustar automaticamente.',
        spreadsheetContext: JSON.stringify({
            htmlView: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; border-radius: 8px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">↔️ Ajustar Largura da Coluna</h3>
          <div style="background: white; padding: 15px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow-x: auto;">
            <table style="border-collapse: collapse; width: 100%;">
              <thead>
                <tr>
                  <th style="background: #2196F3; color: white; padding: 10px; border: 2px solid #1976D2; position: relative; width: 150px;">A</th>
                  <th style="background: transparent; width: 10px; position: relative;">
                    <div style="position: absolute; left: -5px; top: 0; bottom: 0; width: 10px; background: #FFD700; border: 2px solid #FFA000; cursor: col-resize;">
                      <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 16px;">↔️</span>
                    </div>
                  </th>
                  <th style="background: #2196F3; color: white; padding: 10px; border: 2px solid #1976D2; width: 150px;">B</th>
                  <th style="background: #2196F3; color: white; padding: 10px; border: 2px solid #1976D2; width: 150px;">C</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">Dados A1</td>
                  <td></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">Dados B1</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">Dados C1</td>
                </tr>
              </tbody>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #FFA000; border-radius: 4px;">
              <strong>🎯 Passos:</strong><br>
              1️⃣ Posicione o cursor na <strong>borda entre duas colunas</strong> (veja a área amarela ↔️)<br>
              2️⃣ O cursor vira uma <strong>seta dupla</strong> ↔️<br>
              3️⃣ <strong>Duplo clique</strong> para ajustar automaticamente ao conteúdo<br>
              4️⃣ Ou <strong>arraste</strong> para ajustar manualmente
            </div>
          </div>
        </div>
      `
        }),
    },
    {
        order: 6,
        hint: 'Ctrl + S é o atalho universal para salvar em praticamente todos os programas, incluindo o Excel.',
    },
    {
        order: 7,
        hint: 'Você pode somar A1 e B1 de duas formas: =A1+B1 ou =SOMA(A1,B1). Ambas estão corretas!',
    },
    {
        order: 8,
        hint: 'O botão Σ (AutoSoma) fica na aba "Página Inicial", no grupo "Edição", lado direito da faixa de opções.',
        spreadsheetContext: JSON.stringify({
            htmlView: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; border-radius: 8px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">Σ Botão AutoSoma</h3>
          <div style="background: white; padding: 15px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
              <div style="padding: 8px 16px; background: #4CAF50; color: white; border-radius: 4px; font-weight: bold;">Arquivo</div>
              <div style="padding: 8px 16px; background: #2196F3; color: white; border-radius: 4px; font-weight: bold;">Página Inicial</div>
              <div style="padding: 8px 16px; background: #eee; border-radius: 4px;">Inserir</div>
              <div style="padding: 8px 16px; background: #eee; border-radius: 4px;">Layout da Página</div>
            </div>
            <div style="padding: 15px; background: #e3f2fd; border-radius: 4px; border: 2px solid #2196F3;">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                <div>
                  <div style="font-size: 12px; color: #666; margin-bottom: 5px;">← Área de Trabalho</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Grupo "Edição" →</div>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <div style="padding: 12px 20px; background: #FFD700; border: 3px solid #FFA000; border-radius: 6px; font-size: 24px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
                      Σ AutoSoma
                    </div>
                    <div style="padding: 10px 16px; background: #eee; border-radius: 4px; font-size: 14px;">Preencher</div>
                    <div style="padding: 10px 16px; background: #eee; border-radius: 4px; font-size: 14px;">Limpar</div>
                  </div>
                </div>
              </div>
            </div>
            <div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-left: 4px solid #FFA000; border-radius: 4px;">
              <strong>📍 Localização:</strong><br>
              Aba <strong>"Página Inicial"</strong> → Grupo <strong>"Edição"</strong> (canto direito) → Botão <strong>Σ AutoSoma</strong>
            </div>
          </div>
        </div>
      `
        }),
    },
    {
        order: 9,
        hint: 'No Excel, você formata números como moeda clicando no botão R$ na faixa de opções, ou usando Ctrl+Shift+4.',
    },
];
//# sourceMappingURL=excel_zero_fixes.js.map