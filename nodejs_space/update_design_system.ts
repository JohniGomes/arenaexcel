import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Atualizar todas as cores das trilhas para verde Excel
  console.log('🎨 Atualizando cores das trilhas...');
  await prisma.trails.updateMany({
    data: {
      color: '#217346',
    },
  });
  console.log('✅ Cores das trilhas atualizadas!');
  
  console.log('\n✨ Design system atualizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
