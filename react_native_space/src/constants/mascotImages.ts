import { ImageSourcePropType } from 'react-native';

// Lições clássicas
export const LEVEL_IMAGES: Record<string, ImageSourcePropType> = {
  'Fundamentos':  require('../../assets/mascots/fundamentos.png'),
  'Básico':       require('../../assets/mascots/basico.png'),
  'Intermediário':require('../../assets/mascots/intermediario.png'),
  'Avançado':     require('../../assets/mascots/avancado.png'),
  'Especialista': require('../../assets/mascots/especialista.png'),
};

// Trilhas (por slug)
export const TRAIL_IMAGES: Record<string, ImageSourcePropType> = {
  'excel-do-zero':         require('../../assets/mascots/trilha_excel_do_zero.png'),
  'fundamentos-excel':     require('../../assets/mascots/trilha_fundamentos_do_excel.png'),
  'formulas-essenciais':   require('../../assets/mascots/trilha_formulas_essenciais.png'),
  'analise-dados':         require('../../assets/mascots/trilha_analises_dados.png'),
  'formulas-avancadas':    require('../../assets/mascots/trilha_formulas_avancadas.png'),
  'tabelas-formatacao':    require('../../assets/mascots/trilha_tabelas_formatacao.png'),
  'graficos-profissionais':require('../../assets/mascots/trilha_graficos_profissionais.png'),
  'funcoes-pesquisa':      require('../../assets/mascots/trilha_funcoes_pesquisa.png'),
  'funcoes-logicas':       require('../../assets/mascots/trilha_funcoes_logica.png'),
  'excel-avancado':        require('../../assets/mascots/trilha_excel_avancado.png'),
};

// Banner Trilhas Interativas
export const BANNER_IMAGE: ImageSourcePropType =
  require('../../assets/mascots/trilha_interativa.png');

// Estilo padrão do mascote (aplicar no container View)
export const MASCOT_SHADOW = {
  shadowColor: '#217346',
  shadowOpacity: 0.3,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 6,
} as const;
