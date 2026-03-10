import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Removendo trilha duplicada de Análise de Dados...\n');
  
  const trails = await prisma.trails.findMany({
    where: { name: 'Análise de Dados' },
    include: { questions: true },
    orderBy: { id: 'asc' }
  });

  console.log(`Encontradas ${trails.length} trilhas com nome "Análise de Dados"`);
  
  if (trails.length > 1) {
    const toKeep = trails[0];
    const toDelete = trails.slice(1);
    
    for (const trail of toDelete) {
      console.log(`\n❌ Deletando trilha ID ${trail.id} (${trail.questions.length} questões)`);
      
      await prisma.questions.deleteMany({
        where: { trailId: trail.id }
      });
      
      await prisma.usertrailprogress.deleteMany({
        where: { trailId: trail.id }
      });
      
      await prisma.trails.delete({
        where: { id: trail.id }
      });
      
      console.log(`✅ Trilha ${trail.id} deletada`);
    }
    
    console.log(`\n✅ Mantida trilha ID ${toKeep.id} com ${toKeep.questions.length} questões`);
  } else {
    console.log('\n✅ Não há duplicatas');
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
