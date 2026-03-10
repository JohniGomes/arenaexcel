"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
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
//# sourceMappingURL=update_design_system.js.map