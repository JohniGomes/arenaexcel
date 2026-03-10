import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Verificar se usuário existe
    const existingUser = await prisma.users.findUnique({
      where: { email: 'john@doe.com' }
    });

    if (existingUser) {
      console.log('✅ Usuário de teste encontrado:', existingUser.email);
      console.log('   ID:', existingUser.id);
      console.log('   Has password:', existingUser.passwordhash ? 'Sim' : 'Não');
      
      // Buscar trilhas para este usuário
      const trails = await prisma.trails.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          _count: { select: { questions: true } },
          userProgress: { where: { userId: existingUser.id } },
        },
      });
      
      console.log('\n📋 Trilhas no banco:');
      trails.forEach(trail => {
        console.log(`  ${trail.icon} ${trail.name}`);
        console.log(`     - Order: ${trail.order}`);
        console.log(`     - Questões: ${trail._count.questions}`);
        console.log(`     - Progresso: ${trail.userProgress.length > 0 ? 'Sim' : 'Não'}`);
      });
      
      return;
    }

    console.log('❌ Usuário de teste não existe. Crie um usuário via signup primeiro.');
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
