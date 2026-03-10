/**
 * Utilitário para construir URLs de imagens de exercícios
 * Funciona automaticamente em localhost e produção
 */

/**
 * Obtém a URL base da API baseado no ambiente
 * @returns URL base da API (com trailing slash removido)
 */
export function getApiBaseUrl(): string {
  // SEMPRE usar URL de produção (não usar variáveis de ambiente do sistema)
  return 'https://arenaexcel.excelcomjohni.com.br';
}

/**
 * Constrói a URL completa de uma imagem de exercício
 * @param imageUrl - Caminho relativo da imagem (ex: /exercise-images/foto.png)
 * @returns URL completa da imagem ou null se não houver imagem
 */
export function getExerciseImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;
  
  // Se já é uma URL completa, retorna como está
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Constrói URL relativa
  const baseUrl = getApiBaseUrl();
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  
  return `${baseUrl}${cleanPath}`;
}

/**
 * Adiciona cache buster para forçar reload de imagens
 * Útil durante desenvolvimento quando você altera a imagem
 * @param url - URL da imagem
 * @param enableCacheBuster - Se true, adiciona timestamp
 * @returns URL com ou sem cache buster
 */
export function addCacheBuster(url: string, enableCacheBuster = false): string {
  if (!enableCacheBuster) return url;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
}
