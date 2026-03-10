import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📝 Adicionando descrições em todas as questões...\n');
  
  const questions = await prisma.questions.findMany({
    orderBy: [{ trailId: 'asc' }, { order: 'asc' }]
  });

  let updated = 0;

  for (const q of questions) {
    // Se já tem description HTML, pula
    if (q.description && q.description.includes('<div class="q-body">')) {
      continue;
    }
    
    // Gera descrição contextual baseada no título
    let desc = '';
    
    if (q.title.toLowerCase().includes('arraste') || q.title.toLowerCase().includes('ordem')) {
      desc = `<p style="font-size: 14px; color: #555; margin-bottom: 12px;">
        📌 <strong>Instrução:</strong> Organize os itens na ordem correta arrastando-os com o mouse ou toque.
      </p>`;
    } else if (q.title.toLowerCase().includes('fórmula') || q.title.toLowerCase().includes('função')) {
      desc = `<p style="font-size: 14px; color: #555; margin-bottom: 12px;">
        📌 <strong>Instrução:</strong> Digite a fórmula correta do Excel na célula destacada.
      </p>`;
    } else if (q.title.toLowerCase().includes('gráfico') || q.title.toLowerCase().includes('chart')) {
      desc = `<p style="font-size: 14px; color: #555; margin-bottom: 12px;">
        📌 <strong>Instrução:</strong> Selecione o tipo de gráfico mais adequado para representar os dados.
      </p>`;
    } else if (q.title.toLowerCase().includes('célula') || q.title.toLowerCase().includes('endereço') || q.title.toLowerCase().includes('intervalo')) {
      desc = `<p style="font-size: 14px; color: #555; margin-bottom: 12px;">
        📊 <strong>Contexto:</strong> Observe a planilha e identifique corretamente ${q.title.toLowerCase().includes('célula') ? 'a célula' : 'o elemento'} solicitado.
      </p>`;
    } else if (q.title.toLowerCase().includes('atalho') || q.title.toLowerCase().includes('tecla') || q.title.toLowerCase().includes('ctrl')) {
      desc = `<p style="font-size: 14px; color: #555; margin-bottom: 12px;">
        ⌨️ <strong>Dica de Produtividade:</strong> Memorizar atalhos de teclado aumenta significativamente sua eficiência no Excel.
      </p>`;
    } else if (q.title.toLowerCase().includes('formatação') || q.title.toLowerCase().includes('formato')) {
      desc = `<p style="font-size: 14px; color: #555; margin-bottom: 12px;">
        🎨 <strong>Formatação:</strong> A apresentação correta dos dados torna a planilha mais profissional e fácil de entender.
      </p>`;
    } else {
      desc = `<p style="font-size: 14px; color: #555; margin-bottom: 12px;">
        💡 <strong>Desafio:</strong> ${q.title}
      </p>`;
    }
    
    await prisma.questions.update({
      where: { id: q.id },
      data: { 
        description: q.description && q.description.includes('<') 
          ? q.description  // Mantém HTML existente
          : desc + (q.description || '')  // Adiciona desc + texto existente
      }
    });
    
    updated++;
    process.stdout.write('.');
  }

  console.log(`\n\n✅ ${updated} questões atualizadas com descrições!`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
