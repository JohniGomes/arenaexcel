import { useAuth } from '../contexts/AuthContext';

export const usePremium = () => {
  const { user } = useAuth();
  const isPremium = (user as any)?.isPremium ?? false;

  const checkAccess = (
    feature:
      | 'niveis_avancados'
      | 'vidas_ilimitadas'
      | 'chat_ilimitado'
      | 'videos_completos'
      | 'wiki_completa'
      | 'planilha_ia'
      | 'certificado'
  ): boolean => {
    if (isPremium) return true;
    // Nenhuma feature bloqueada é acessível no free
    return false;
  };

  return { isPremium, checkAccess };
};
