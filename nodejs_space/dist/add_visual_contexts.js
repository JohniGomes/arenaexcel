"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const visualContexts = {
    'excel-do-zero': {
        1: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
        <h3 style="margin-bottom: 15px; font-size: 20px;">📊 O que é uma Célula?</h3>
        <div style="background: rgba(255,255,255,0.95); padding: 20px; border-radius: 8px; color: #333;">
          <table style="border-collapse: collapse; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <thead>
              <tr>
                <th style="background: #4CAF50; color: white; padding: 12px 20px; border: 2px solid #388E3C; font-size: 16px;">A</th>
                <th style="background: #4CAF50; color: white; padding: 12px 20px; border: 2px solid #388E3C; font-size: 16px;">B</th>
                <th style="background: #4CAF50; color: white; padding: 12px 20px; border: 2px solid #388E3C; font-size: 16px;">C</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="background: #FFEB3B; padding: 15px 20px; border: 3px solid #FFA000; font-weight: bold; text-align: center; font-size: 18px;">📍 Esta é uma CÉLULA</td>
                <td style="padding: 15px 20px; border: 1px solid #ddd; text-align: center; background: white;">Célula B1</td>
                <td style="padding: 15px 20px; border: 1px solid #ddd; text-align: center; background: white;">Célula C1</td>
              </tr>
              <tr>
                <td style="padding: 15px 20px; border: 1px solid #ddd; text-align: center; background: white;">Célula A2</td>
                <td style="padding: 15px 20px; border: 1px solid #ddd; text-align: center; background: white;">Célula B2</td>
                <td style="padding: 15px 20px; border: 1px solid #ddd; text-align: center; background: white;">Célula C2</td>
              </tr>
            </tbody>
          </table>
          <p style="margin-top: 20px; text-align: center; font-size: 15px; color: #555;">☝️ Cada retângulo onde você digita dados é chamado de <strong>CÉLULA</strong></p>
        </div>
      </div>
    `,
        2: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #2196F3 0%, #00BCD4 100%); border-radius: 12px; color: white;">
        <h3 style="margin-bottom: 15px; font-size: 20px;">🔤 Colunas do Excel</h3>
        <div style="background: rgba(255,255,255,0.95); padding: 20px; border-radius: 8px; color: #333;">
          <table style="border-collapse: collapse; width: 100%; max-width: 600px; margin: 0 auto;">
            <thead>
              <tr style="background: linear-gradient(180deg, #2196F3 0%, #1976D2 100%);">
                <th style="color: white; padding: 15px; border: 2px solid #1565C0; font-size: 24px; font-weight: bold;">A ⬅️</th>
                <th style="color: white; padding: 15px; border: 2px solid #1565C0; font-size: 24px; font-weight: bold;">B ⬅️</th>
                <th style="color: white; padding: 15px; border: 2px solid #1565C0; font-size: 24px; font-weight: bold;">C ⬅️</th>
                <th style="color: white; padding: 15px; border: 2px solid #1565C0; font-size: 24px; font-weight: bold;">D ⬅️</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding: 12px; border: 1px solid #ddd; text-align: center; background: #f0f0f0;">1</td><td style="padding: 12px; border: 1px solid #ddd; text-align: center; background: #f0f0f0;">2</td><td style="padding: 12px; border: 1px solid #ddd; text-align: center; background: #f0f0f0;">3</td><td style="padding: 12px; border: 1px solid #ddd; text-align: center; background: #f0f0f0;">4</td></tr>
              <tr><td style="padding: 12px; border: 1px solid #ddd; text-align: center;">5</td><td style="padding: 12px; border: 1px solid #ddd; text-align: center;">6</td><td style="padding: 12px; border: 1px solid #ddd; text-align: center;">7</td><td style="padding: 12px; border: 1px solid #ddd; text-align: center;">8</td></tr>
            </tbody>
          </table>
          <div style="margin-top: 20px; padding: 15px; background: #E3F2FD; border-left: 5px solid #2196F3; border-radius: 5px;">
            <p style="margin: 0; font-size: 16px; color: #1976D2;"><strong>💡 As COLUNAS são as letras no topo:</strong> A, B, C, D, E... até XFD</p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #555;">📐 As LINHAS são os números na lateral: 1, 2, 3... até 1.048.576</p>
          </div>
        </div>
      </div>
    `,
        3: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #FF6B6B 0%, #C44569 100%); border-radius: 12px; color: white;">
        <h3 style="margin-bottom: 15px; font-size: 20px;">📍 Identificando uma Célula</h3>
        <div style="background: rgba(255,255,255,0.95); padding: 20px; border-radius: 8px; color: #333;">
          <p style="text-align: center; font-size: 16px; margin-bottom: 15px; color: #555;">🎯 Cada célula tem um <strong>endereço único</strong> formado por <span style="color: #2196F3; font-weight: bold;">COLUNA + LINHA</span></p>
          <table style="border-collapse: collapse; margin: 0 auto;">
            <thead>
              <tr>
                <th style="background: #eee; padding: 8px; border: 1px solid #ddd; width: 40px;"></th>
                <th style="background: #2196F3; color: white; padding: 12px 20px; border: 2px solid #1976D2;">A</th>
                <th style="background: #2196F3; color: white; padding: 12px 20px; border: 2px solid #1976D2;">B</th>
                <th style="background: #FFD700; color: #333; padding: 12px 20px; border: 3px solid #FFA000; font-weight: bold; font-size: 18px;">C 👈</th>
                <th style="background: #2196F3; color: white; padding: 12px 20px; border: 2px solid #1976D2;">D</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">1</td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td></tr>
              <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">2</td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td></tr>
              <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">3</td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td></tr>
              <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">4</td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td></tr>
              <tr><td style="background: #FFD700; padding: 8px; border: 3px solid #FFA000; font-weight: bold; text-align: center; font-size: 16px;">5 👈</td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="background: linear-gradient(135deg, #FFEB3B 0%, #FDD835 100%); padding: 15px; border: 4px solid #FFA000; font-weight: bold; text-align: center; font-size: 20px; box-shadow: 0 4px 12px rgba(255,193,7,0.5);">✅ C5</td><td style="padding: 12px; border: 1px solid #ddd;"></td></tr>
              <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">6</td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td></tr>
            </tbody>
          </table>
          <div style="margin-top: 20px; padding: 15px; background: #FFF3CD; border-left: 5px solid #FFA000; border-radius: 5px;">
            <p style="margin: 0; font-size: 18px; color: #856404;"><strong>🎯 Célula C5 = Coluna C + Linha 5</strong></p>
          </div>
        </div>
      </div>
    `,
        4: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; color: white;">
        <h3 style="margin-bottom: 15px; font-size: 20px;">🔲 Selecionando Intervalos</h3>
        <div style="background: rgba(255,255,255,0.95); padding: 20px; border-radius: 8px; color: #333;">
          <p style="text-align: center; font-size: 16px; margin-bottom: 15px; color: #555;">📦 Um <strong>intervalo</strong> é um grupo de células selecionadas</p>
          <table style="border-collapse: collapse; margin: 0 auto;">
            <thead>
              <tr>
                <th style="background: #eee; padding: 8px; border: 1px solid #ddd; width: 40px;"></th>
                <th style="background: #2196F3; color: white; padding: 12px 20px; border: 2px solid #1976D2;">A</th>
                <th style="background: #2196F3; color: white; padding: 12px 20px; border: 2px solid #1976D2;">B</th>
                <th style="background: #2196F3; color: white; padding: 12px 20px; border: 2px solid #1976D2;">C</th>
                <th style="background: #2196F3; color: white; padding: 12px 20px; border: 2px solid #1976D2;">D</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">1</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td></tr>
              <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">2</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td></tr>
              <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">3</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td></tr>
              <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">4</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td><td style="background: #BBDEFB; padding: 12px 20px; border: 2px solid #2196F3; font-weight: bold; text-align: center;">✓</td></tr>
              <tr><td style="background: #eee; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: center;">5</td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td><td style="padding: 12px; border: 1px solid #ddd;"></td></tr>
            </tbody>
          </table>
          <div style="margin-top: 20px; padding: 15px; background: #E3F2FD; border-left: 5px solid #2196F3; border-radius: 5px;">
            <p style="margin: 0; font-size: 18px; color: #1976D2;"><strong>📌 Intervalo A1:D4</strong> = 16 células selecionadas</p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #555;">💡 O símbolo <strong>:</strong> significa "até" (de A1 ATÉ D4)</p>
          </div>
        </div>
      </div>
    `,
        5: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; color: white;">
        <h3 style="margin-bottom: 15px; font-size: 20px;">↔️ Ajustando Largura da Coluna</h3>
        <div style="background: rgba(255,255,255,0.95); padding: 20px; border-radius: 8px; color: #333;">
          <div style="display: flex; justify-content: center; align-items: center; gap: 5px; margin-bottom: 20px;">
            <div style="background: #2196F3; color: white; padding: 15px 30px; border: 2px solid #1976D2; border-radius: 4px; font-weight: bold; font-size: 18px;">Coluna A</div>
            <div style="background: #FFD700; padding: 20px 5px; border: 3px dashed #FFA000; border-radius: 4px; cursor: col-resize; position: relative;">
              <div style="font-size: 24px;">↔️</div>
              <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); background: #FFA000; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; white-space: nowrap;">Arraste aqui</div>
            </div>
            <div style="background: #2196F3; color: white; padding: 15px 30px; border: 2px solid #1976D2; border-radius: 4px; font-weight: bold; font-size: 18px;">Coluna B</div>
          </div>
          <div style="padding: 15px; background: #FFF3CD; border-left: 5px solid #FFA000; border-radius: 5px; margin-top: 15px;">
            <p style="margin: 0 0 10px 0; font-size: 16px; color: #856404;"><strong>🎯 Como ajustar:</strong></p>
            <p style="margin: 5px 0; font-size: 14px; color: #555;">1️⃣ Posicione o mouse <strong>entre duas colunas</strong> no cabeçalho</p>
            <p style="margin: 5px 0; font-size: 14px; color: #555;">2️⃣ O cursor vira uma <strong>seta dupla</strong> ↔️</p>
            <p style="margin: 5px 0; font-size: 14px; color: #555;">3️⃣ <strong>Duplo clique</strong> = ajuste automático</p>
            <p style="margin: 5px 0; font-size: 14px; color: #555;">4️⃣ <strong>Arrastar</strong> = ajuste manual</p>
          </div>
        </div>
      </div>
    `,
        6: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border-radius: 12px; color: white;">
        <h3 style="margin-bottom: 15px; font-size: 20px;">💾 Salvando sua Planilha</h3>
        <div style="background: rgba(255,255,255,0.95); padding: 20px; border-radius: 8px; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 40px; border-radius: 12px; font-size: 24px; font-weight: bold; box-shadow: 0 4px 15px rgba(102,126,234,0.4);">
              💾 Ctrl + S
            </div>
          </div>
          <div style="padding: 15px; background: #E8F5E9; border-left: 5px solid #4CAF50; border-radius: 5px;">
            <p style="margin: 0 0 10px 0; font-size: 16px; color: #2E7D32;"><strong>✅ Atalho universal para SALVAR</strong></p>
            <p style="margin: 5px 0; font-size: 14px; color: #555;">📌 Funciona no Excel, Word, PowerPoint, Notepad, navegadores...</p>
            <p style="margin: 5px 0; font-size: 14px; color: #555;">💡 Salve frequentemente para não perder seu trabalho!</p>
          </div>
        </div>
      </div>
    `,
        8: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); border-radius: 12px;">
        <h3 style="margin-bottom: 15px; font-size: 20px; color: #333;">∑ AutoSoma — Soma Rápida</h3>
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="background: #E3F2FD; padding: 15px; border-radius: 8px; border: 2px solid #2196F3; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
              <div style="font-size: 14px; color: #666;">Aba "Página Inicial"</div>
              <div style="display: flex; gap: 10px; align-items: center;">
                <div style="padding: 8px 15px; background: #eee; border-radius: 4px; font-size: 13px;">Colar</div>
                <div style="padding: 8px 15px; background: #eee; border-radius: 4px; font-size: 13px;">Fonte</div>
                <div style="padding: 15px 25px; background: linear-gradient(135deg, #FFD700 0%, #FFA000 100%); border: 3px solid #FF6F00; border-radius: 8px; font-size: 28px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(255,193,7,0.5);">
                  ∑ AutoSoma
                </div>
              </div>
            </div>
          </div>
          <table style="border-collapse: collapse; margin: 20px auto;">
            <tbody>
              <tr><td style="background: #f5f5f5; padding: 10px 20px; border: 1px solid #ddd; font-size: 16px; text-align: right;">10</td></tr>
              <tr><td style="background: #f5f5f5; padding: 10px 20px; border: 1px solid #ddd; font-size: 16px; text-align: right;">20</td></tr>
              <tr><td style="background: #f5f5f5; padding: 10px 20px; border: 1px solid #ddd; font-size: 16px; text-align: right;">30</td></tr>
              <tr><td style="background: #FFE082; padding: 10px 20px; border: 2px solid #FFA000; font-size: 18px; font-weight: bold; text-align: right;">60 ← Soma</td></tr>
            </tbody>
          </table>
          <div style="padding: 15px; background: #FFF3CD; border-left: 5px solid #FFA000; border-radius: 5px;">
            <p style="margin: 0; font-size: 16px; color: #856404;"><strong>⚡ AutoSoma = Atalho para =SOMA()</strong></p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #555;">Selecione as células e clique em ∑ para somar automaticamente!</p>
          </div>
        </div>
      </div>
    `,
        9: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); border-radius: 12px;">
        <h3 style="margin-bottom: 15px; font-size: 20px; color: #333;">💰 Formatando como Moeda</h3>
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 20px;">
            <div>
              <div style="font-size: 14px; color: #999; margin-bottom: 5px; text-align: center;">❌ Sem formatação</div>
              <div style="background: #f5f5f5; padding: 15px 25px; border: 2px solid #ddd; border-radius: 4px; font-size: 20px; text-align: right;">1500</div>
            </div>
            <div style="font-size: 32px; color: #4CAF50;">➡️</div>
            <div>
              <div style="font-size: 14px; color: #4CAF50; margin-bottom: 5px; text-align: center; font-weight: bold;">✅ Formatado como R$</div>
              <div style="background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%); padding: 15px 25px; border: 3px solid #4CAF50; border-radius: 4px; font-size: 20px; font-weight: bold; text-align: right;">R$ 1.500,00</div>
            </div>
          </div>
          <div style="padding: 15px; background: #E8F5E9; border-left: 5px solid #4CAF50; border-radius: 5px; margin-top: 15px;">
            <p style="margin: 0 0 10px 0; font-size: 16px; color: #2E7D32;"><strong>💵 Como formatar como moeda:</strong></p>
            <p style="margin: 5px 0; font-size: 14px; color: #555;">1️⃣ Selecione as células com valores</p>
            <p style="margin: 5px 0; font-size: 14px; color: #555;">2️⃣ Clique no botão <strong>R$</strong> na barra de ferramentas</p>
            <p style="margin: 5px 0; font-size: 14px; color: #555;">3️⃣ Ou pressione <kbd style="background: #fff; padding: 2px 6px; border: 1px solid #ccc; border-radius: 3px;">Ctrl + Shift + 4</kbd></p>
          </div>
        </div>
      </div>
    `,
    },
};
async function main() {
    console.log('🎨 Adicionando contextos visuais HTML...\n');
    let totalUpdated = 0;
    for (const [slug, contexts] of Object.entries(visualContexts)) {
        const trail = await prisma.trails.findUnique({ where: { slug } });
        if (!trail) {
            console.log(`❌ Trilha não encontrada: ${slug}`);
            continue;
        }
        console.log(`🎨 Atualizando trilha: ${trail.name}`);
        for (const [orderStr, htmlContext] of Object.entries(contexts)) {
            const order = parseInt(orderStr);
            try {
                const question = await prisma.questions.findFirst({
                    where: { trailId: trail.id, order }
                });
                if (!question) {
                    console.log(`  ⚠️  Questão ${order} não encontrada`);
                    continue;
                }
                let newContext = htmlContext;
                if (question.spreadsheetContext) {
                    try {
                        const existingContext = JSON.parse(question.spreadsheetContext);
                        existingContext.htmlView = htmlContext;
                        newContext = JSON.stringify(existingContext);
                    }
                    catch {
                        newContext = JSON.stringify({ htmlView: htmlContext });
                    }
                }
                else {
                    newContext = JSON.stringify({ htmlView: htmlContext });
                }
                await prisma.questions.update({
                    where: { id: question.id },
                    data: { spreadsheetContext: newContext },
                });
                totalUpdated++;
                process.stdout.write('✓');
            }
            catch (error) {
                console.error(`\n❌ Erro ao atualizar questão ${order}:`, error);
            }
        }
        console.log(`  ✅ Contextos adicionados\n`);
    }
    console.log(`\n🎉 Concluído! ${totalUpdated} contextos visuais adicionados.`);
}
main()
    .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=add_visual_contexts.js.map