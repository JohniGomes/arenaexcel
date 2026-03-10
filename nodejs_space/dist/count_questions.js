"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const trails = await prisma.trails.findMany({
        include: { questions: true },
        orderBy: { id: 'asc' }
    });
    console.log('\n=== RESUMO DAS TRILHAS ===\n');
    let total = 0;
    for (const trail of trails) {
        console.log(`📚 ${trail.name}: ${trail.questions.length} questões`);
        total += trail.questions.length;
    }
    console.log(`\n📊 TOTAL: ${total} questões em ${trails.length} trilhas\n`);
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=count_questions.js.map