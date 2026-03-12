import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const NEW_ACHIEVEMENTS = [
  // ── TRILHAS CONCLUÍDAS ──────────────────────────────────────
  { name: 'Trilheiro Iniciante',   description: 'Conclua sua primeira trilha interativa',  icon: '🛤️',  criteria: { type: 'trails_completed', value: 1 } },
  { name: 'Explorador de Trilhas', description: 'Conclua 3 trilhas interativas',            icon: '🗺️',  criteria: { type: 'trails_completed', value: 3 } },
  { name: 'Mestre das Trilhas',    description: 'Conclua todas as 10 trilhas',              icon: '🏅',  criteria: { type: 'trails_completed', value: 10 } },

  // ── QUESTÕES DE TRILHAS ────────────────────────────────────
  { name: 'Primeiro Passo',        description: 'Responda 1 questão em trilhas',            icon: '👣',  criteria: { type: 'trail_questions', value: 1 } },
  { name: 'Em Ritmo',              description: 'Responda 10 questões em trilhas',          icon: '🎯',  criteria: { type: 'trail_questions', value: 10 } },
  { name: 'Determinado',           description: 'Responda 25 questões em trilhas',          icon: '💪',  criteria: { type: 'trail_questions', value: 25 } },
  { name: 'Cem Questões',          description: 'Responda 100 questões em trilhas',         icon: '💯',  criteria: { type: 'trail_questions', value: 100 } },

  // ── PRECISÃO / ACERTO ──────────────────────────────────────
  { name: 'Tiro Certeiro',         description: 'Acerte 10 questões de trilhas seguidas',  icon: '🎯',  criteria: { type: 'accuracy_streak', value: 10 } },
  { name: 'Atirador de Elite',     description: 'Acerte 25 questões de trilhas seguidas',  icon: '🏹',  criteria: { type: 'accuracy_streak', value: 25 } },
  { name: 'Infalível',             description: 'Atinja 90% de precisão geral',            icon: '🔮',  criteria: { type: 'accuracy', value: 90 } },

  // ── XP / NÍVEL ─────────────────────────────────────────────
  { name: 'Primeiros XP',          description: 'Acumule 50 XP',                           icon: '⚡',  criteria: { type: 'xp', value: 50 } },
  { name: 'Acumulador',            description: 'Acumule 500 XP',                          icon: '🔋',  criteria: { type: 'xp', value: 500 } },
  { name: 'Poderoso',              description: 'Acumule 2000 XP',                         icon: '💎',  criteria: { type: 'xp', value: 2000 } },
  { name: 'Lendário',              description: 'Acumule 5000 XP',                         icon: '🌟',  criteria: { type: 'xp', value: 5000 } },
  { name: 'Nível 5',               description: 'Alcance o nível 5',                       icon: '🔰',  criteria: { type: 'level', value: 5 } },
  { name: 'Nível 10',              description: 'Alcance o nível 10',                      icon: '🏆',  criteria: { type: 'level', value: 10 } },
  { name: 'Nível 15',              description: 'Alcance o nível 15',                      icon: '👑',  criteria: { type: 'level', value: 15 } },
  { name: 'Nível 20',              description: 'Alcance o nível máximo (20)',              icon: '🦁',  criteria: { type: 'level', value: 20 } },

  // ── STREAK ────────────────────────────────────────────────
  { name: 'Primeira Chama',        description: 'Mantenha um streak de 3 dias',            icon: '🔥',  criteria: { type: 'streak', value: 3 } },
  { name: 'Uma Semana',            description: 'Mantenha um streak de 7 dias',            icon: '📅',  criteria: { type: 'streak', value: 7 } },
  { name: 'Duas Semanas',          description: 'Mantenha um streak de 14 dias',           icon: '🗓️',  criteria: { type: 'streak', value: 14 } },
  { name: 'Um Mês Seguido',        description: 'Mantenha um streak de 30 dias',           icon: '🌙',  criteria: { type: 'streak', value: 30 } },
  { name: 'Cem Dias',              description: 'Mantenha um streak de 100 dias',          icon: '⭐',  criteria: { type: 'streak', value: 100 } },

  // ── LIÇÕES CLÁSSICAS ──────────────────────────────────────
  { name: 'Aprendiz',              description: 'Complete 5 lições clássicas',             icon: '📖',  criteria: { type: 'lessons_completed', value: 5 } },
  { name: 'Estudante Dedicado',    description: 'Complete 10 lições clássicas',            icon: '📚',  criteria: { type: 'lessons_completed', value: 10 } },
  { name: 'Veterano',              description: 'Complete 25 lições clássicas',            icon: '🎖️',  criteria: { type: 'lessons_completed', value: 25 } },
  { name: 'Mestre das Lições',     description: 'Complete todas as lições clássicas',      icon: '🏫',  criteria: { type: 'lessons_completed', value: 50 } },

  // ── FÓRMULAS ──────────────────────────────────────────────
  { name: 'Formulista',            description: 'Acerte 5 questões de fórmula',            icon: '🧮',  criteria: { type: 'formula_correct', value: 5 } },
  { name: 'Mago das Fórmulas',     description: 'Acerte 20 questões de fórmula',           icon: '🪄',  criteria: { type: 'formula_correct', value: 20 } },

  // ── GRÁFICOS ──────────────────────────────────────────────
  { name: 'Artista de Dados',      description: 'Acerte 5 questões de gráfico',            icon: '📊',  criteria: { type: 'chart_correct', value: 5 } },
  { name: 'Analista Visual',       description: 'Acerte 15 questões de gráfico',           icon: '📈',  criteria: { type: 'chart_correct', value: 15 } },

  // ── VÍDEOS / WIKI ─────────────────────────────────────────
  { name: 'Curioso',               description: 'Assista seu primeiro vídeo na Wiki',      icon: '▶️',  criteria: { type: 'videos_watched', value: 1 } },
  { name: 'Maratonista',           description: 'Assista 5 vídeos na Wiki',                icon: '🎬',  criteria: { type: 'videos_watched', value: 5 } },
  { name: 'Cinéfilo do Excel',     description: 'Assista 15 vídeos na Wiki',               icon: '🎥',  criteria: { type: 'videos_watched', value: 15 } },

  // ── LOGIN / CADASTRO ──────────────────────────────────────
  { name: 'Bem-vindo!',            description: 'Faça seu primeiro login',                 icon: '👋',  criteria: { type: 'logins', value: 1 } },
  { name: 'Fiel',                  description: 'Faça login por 7 dias diferentes',       icon: '🤝',  criteria: { type: 'logins', value: 7 } },
  { name: 'Cliente Fiel',          description: 'Faça login por 30 dias diferentes',      icon: '💙',  criteria: { type: 'logins', value: 30 } },

  // ── ESPECIAIS ─────────────────────────────────────────────
  { name: 'Premium',               description: 'Torne-se um membro Premium',             icon: '⭐',  criteria: { type: 'premium', value: 1 } },
  { name: 'Velocista',             description: 'Complete uma trilha em menos de 10 min', icon: '⚡',  criteria: { type: 'trail_speed', value: 600 } },
  { name: 'Perfeccionista',        description: 'Complete uma trilha com 100% de acerto', icon: '🎯',  criteria: { type: 'trail_perfect', value: 1 } },
  { name: 'Combo x10',             description: 'Acerte 10 questões seguidas',            icon: '🔥',  criteria: { type: 'combo', value: 10 } },
];

async function main() {
  console.log('🏆 Seeding achievements...');

  let created = 0;
  let skipped = 0;

  for (const ach of NEW_ACHIEVEMENTS) {
    try {
      await prisma.achievements.upsert({
        where: { name: ach.name },
        update: {
          description: ach.description,
          icon: ach.icon,
          criteria: ach.criteria,
        },
        create: ach,
      });
      created++;
    } catch (e) {
      console.error(`Error upserting achievement "${ach.name}":`, e);
      skipped++;
    }
  }

  const total = await prisma.achievements.count();
  console.log(`✅ Done. Upserted ${created}, errors: ${skipped}. Total in DB: ${total}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
