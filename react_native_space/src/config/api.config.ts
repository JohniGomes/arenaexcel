/**
 * API Configuration
 * 
 * IMPORTANTE: Esta URL é FIXA e não deve ser alterada por variáveis de ambiente do sistema.
 * Sempre usar o domínio de produção: arenaexcel.excelcomjohni.com.br
 */

export const API_CONFIG = {
  // URL de produção - NUNCA mudar
  PRODUCTION_URL: 'https://arenaexcel.excelcomjohni.com.br/',
  
  // Timeout padrão para requests (30 segundos)
  TIMEOUT: 30000,
};

// Log de segurança
console.log('🔒 API Config carregado:', API_CONFIG.PRODUCTION_URL);
