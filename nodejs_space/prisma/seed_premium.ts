import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PREMIUM_EMAILS = [
  'contato@excelcomjohni.com.br',
];

async function main() {
  console.log('⭐ Setting premium users...');

  for (const email of PREMIUM_EMAILS) {
    const result = await prisma.users.updateMany({
      where: { email },
      data: { isPremium: true },
    });

    if (result.count > 0) {
      console.log(`✅ ${email} → isPremium = true`);
    } else {
      console.log(`⚠️  ${email} not found in DB`);
    }
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
