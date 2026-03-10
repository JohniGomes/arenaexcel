"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        const existingUser = await prisma.users.findUnique({
            where: { email: 'john@doe.com' }
        });
        if (existingUser) {
            console.log('✅ Usuário de teste encontrado:', existingUser.email);
            console.log('   ID:', existingUser.id);
            console.log('   Has password:', existingUser.passwordhash ? 'Sim' : 'Não');
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
    }
    catch (error) {
        console.error('❌ Erro:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=create-test-user.js.map