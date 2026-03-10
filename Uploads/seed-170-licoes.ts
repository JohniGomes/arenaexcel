import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════════════
// ARENA EXCEL — SEED COMPLETO: 170 LIÇÕES
//
// ESTRUTURA:
//   - 150 lições originais (trilhas geral + 7 profissionais)
//   - 20 lições novas de interação visual (5 tipos × 4 questões cada)
//
// TIPOS DE QUESTÃO:
//   multipla_escolha  → { pergunta, alternativas, correta, explicacao }
//   excel_simulado    → { instrucao, celulas[], explicacao }
//   fc_interativo     → formatação condicional visual
//   grafico           → criar e selecionar tipo de gráfico
//   formatacao_celula → toolbar de formatação (negrito, cor, moeda)
//   ordenar_filtrar   → sort e filter interativos
//   validacao_dados   → criar lista suspensa
// ═══════════════════════════════════════════════════════════════════

async function main() {
  await prisma.licao.deleteMany();

  const licoes = [

    // ════════════════════════════════════════
    // TRILHA GERAL — FUNDAMENTOS (1-16)
    // ════════════════════════════════════════
    {
      titulo: 'O que é o Excel?',
      descricao: 'Conheça a interface e os componentes básicos do Excel',
      nivel: 'fundamentos', trilha: 'geral', ordem: 1,
      tipo: 'multipla_escolha', xpRecompensa: 10,
      conteudo: {
        pergunta: 'O que é uma célula no Excel?',
        alternativas: ['Um arquivo do Excel', 'A interseção de uma linha com uma coluna', 'O nome de uma planilha', 'Um tipo de gráfico'],
        correta: 1,
        explicacao: 'Uma célula é o espaço formado pela interseção de uma linha (número) com uma coluna (letra), como A1, B2, C3.'
      }
    },
    {
      titulo: 'Navegando pela planilha',
      descricao: 'Aprenda a se mover pelas células e planilhas',
      nivel: 'fundamentos', trilha: 'geral', ordem: 2,
      tipo: 'multipla_escolha', xpRecompensa: 10,
      conteudo: {
        pergunta: 'Qual atalho do teclado leva você diretamente para a célula A1?',
        alternativas: ['Ctrl + End', 'Ctrl + Home', 'Ctrl + A', 'F5'],
        correta: 1,
        explicacao: 'Ctrl + Home leva o cursor diretamente para a célula A1, o início da planilha.'
      }
    },
    {
      titulo: 'Sua primeira fórmula',
      descricao: 'Digite sua primeira fórmula de soma no Excel',
      nivel: 'fundamentos', trilha: 'geral', ordem: 3,
      tipo: 'excel_simulado', xpRecompensa: 15,
      conteudo: {
        instrucao: 'Na célula B4, digite a fórmula para somar os valores de B1, B2 e B3.',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'Produto A',tipo:'label'},{ref:'B1',col:2,row:1,valor:'100',tipo:'number'},
          {ref:'A2',col:1,row:2,valor:'Produto B',tipo:'label'},{ref:'B2',col:2,row:2,valor:'200',tipo:'number'},
          {ref:'A3',col:1,row:3,valor:'Produto C',tipo:'label'},{ref:'B3',col:2,row:3,valor:'300',tipo:'number'},
          {ref:'A4',col:1,row:4,valor:'TOTAL',tipo:'label',bold:true},
          {ref:'B4',col:2,row:4,valor:'',editavel:true}
        ],
        aceitas: ['=SOMA(B1:B3)','=SUM(B1:B3)','=B1+B2+B3','=soma(b1:b3)'],
        explicacao: '=SOMA(B1:B3) soma os valores 100+200+300, resultando em 600.'
      }
    },
    {
      titulo: 'Formatação básica',
      descricao: 'Aprenda a formatar células com negrito e cores',
      nivel: 'fundamentos', trilha: 'geral', ordem: 4,
      tipo: 'multipla_escolha', xpRecompensa: 10,
      conteudo: {
        pergunta: 'Qual atalho aplica negrito a uma célula selecionada?',
        alternativas: ['Ctrl + I', 'Ctrl + U', 'Ctrl + B', 'Ctrl + N'],
        correta: 2,
        explicacao: 'Ctrl + B (Bold) aplica negrito. No Excel em português, Ctrl + N também funciona (Negrito).'
      }
    },
    {
      titulo: 'Tipos de dados',
      descricao: 'Entenda a diferença entre texto, número e data',
      nivel: 'fundamentos', trilha: 'geral', ordem: 5,
      tipo: 'multipla_escolha', xpRecompensa: 10,
      conteudo: {
        pergunta: 'Quando você digita um número e ele fica alinhado à esquerda na célula, isso significa que:',
        alternativas: ['O número está correto', 'O Excel reconheceu como texto, não como número', 'A formatação está errada', 'O número é negativo'],
        correta: 1,
        explicacao: 'Números ficam alinhados à direita por padrão. Se estiver à esquerda, o Excel está tratando como texto — isso causa erros em fórmulas.'
      }
    },
    {
      titulo: 'Função MÉDIA',
      descricao: 'Calcule a média de um conjunto de valores',
      nivel: 'fundamentos', trilha: 'geral', ordem: 6,
      tipo: 'excel_simulado', xpRecompensa: 15,
      conteudo: {
        instrucao: 'Na célula B6, calcule a média das notas de B1 a B5.',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'Aluno 1',tipo:'label'},{ref:'B1',col:2,row:1,valor:'7',tipo:'number'},
          {ref:'A2',col:1,row:2,valor:'Aluno 2',tipo:'label'},{ref:'B2',col:2,row:2,valor:'8',tipo:'number'},
          {ref:'A3',col:1,row:3,valor:'Aluno 3',tipo:'label'},{ref:'B3',col:2,row:3,valor:'6',tipo:'number'},
          {ref:'A4',col:1,row:4,valor:'Aluno 4',tipo:'label'},{ref:'B4',col:2,row:4,valor:'9',tipo:'number'},
          {ref:'A5',col:1,row:5,valor:'Aluno 5',tipo:'label'},{ref:'B5',col:2,row:5,valor:'10',tipo:'number'},
          {ref:'A6',col:1,row:6,valor:'MÉDIA',tipo:'label',bold:true},
          {ref:'B6',col:2,row:6,valor:'',editavel:true}
        ],
        aceitas: ['=MÉDIA(B1:B5)','=MEDIA(B1:B5)','=AVERAGE(B1:B5)','=média(b1:b5)'],
        explicacao: '=MÉDIA(B1:B5) calcula (7+8+6+9+10)/5 = 8.'
      }
    },
    {
      titulo: 'Referência de célula',
      descricao: 'Entenda como referenciar células em fórmulas',
      nivel: 'fundamentos', trilha: 'geral', ordem: 7,
      tipo: 'multipla_escolha', xpRecompensa: 10,
      conteudo: {
        pergunta: 'Se a célula A1 contém 50 e você digita =A1*2 em B1, qual será o resultado?',
        alternativas: ['A1*2', '502', '100', 'ERRO'],
        correta: 2,
        explicacao: 'A fórmula =A1*2 multiplica o valor de A1 (50) por 2, resultando em 100.'
      }
    },
    {
      titulo: 'Função MÁXIMO e MÍNIMO',
      descricao: 'Encontre o maior e menor valor de um intervalo',
      nivel: 'fundamentos', trilha: 'geral', ordem: 8,
      tipo: 'multipla_escolha', xpRecompensa: 10,
      conteudo: {
        pergunta: 'Qual fórmula retorna o maior valor do intervalo A1:A10?',
        alternativas: ['=MAIOR(A1:A10)', '=MAX(A1:A10)', '=MÁXIMO(A1:A10)', '=TOPO(A1:A10)'],
        correta: 2,
        explicacao: '=MÁXIMO(A1:A10) ou =MAX(A1:A10) retornam o maior valor do intervalo.'
      }
    },
    {
      titulo: 'Inserir e deletar linhas',
      descricao: 'Gerencie linhas e colunas na planilha',
      nivel: 'fundamentos', trilha: 'geral', ordem: 9,
      tipo: 'multipla_escolha', xpRecompensa: 10,
      conteudo: {
        pergunta: 'Ao inserir uma nova linha entre as linhas 3 e 4, o que acontece com a linha que estava na posição 4?',
        alternativas: ['Ela é deletada', 'Ela se torna a linha 5', 'Ela se torna a linha 3', 'Nada muda'],
        correta: 1,
        explicacao: 'Ao inserir uma linha, todas as linhas abaixo são deslocadas para baixo — a antiga linha 4 vira a linha 5.'
      }
    },
    {
      titulo: 'Salvar e formatos de arquivo',
      descricao: 'Conheça os formatos de arquivo do Excel',
      nivel: 'fundamentos', trilha: 'geral', ordem: 10,
      tipo: 'multipla_escolha', xpRecompensa: 10,
      conteudo: {
        pergunta: 'Qual formato de arquivo preserva macros VBA no Excel?',
        alternativas: ['.xlsx', '.xls', '.xlsm', '.csv'],
        correta: 2,
        explicacao: '.xlsm é o formato que suporta macros. O .xlsx não suporta macros por segurança.'
      }
    },
    {
      titulo: 'Copiar e colar especial',
      descricao: 'Use o colar especial para controlar o que é colado',
      nivel: 'fundamentos', trilha: 'geral', ordem: 11,
      tipo: 'multipla_escolha', xpRecompensa: 10,
      conteudo: {
        pergunta: 'Você quer colar apenas os valores de uma célula, sem a fórmula. Qual opção usar?',
        alternativas: ['Ctrl+V normal', 'Colar Especial > Fórmulas', 'Colar Especial > Valores', 'Colar Especial > Formatos'],
        correta: 2,
        explicacao: 'Colar Especial > Valores cola apenas o resultado da fórmula, sem a fórmula em si.'
      }
    },
    {
      titulo: 'Congelar painéis',
      descricao: 'Mantenha cabeçalhos visíveis ao rolar a planilha',
      nivel: 'fundamentos', trilha: 'geral', ordem: 12,
      tipo: 'multipla_escolha', xpRecompensa: 10,
      conteudo: {
        pergunta: 'Para congelar a primeira linha da planilha, você deve:',
        alternativas: ['Selecionar a linha 1 e pressionar Delete', 'Ir em Exibir > Congelar Painéis > Congelar Linha Superior', 'Clicar com botão direito e escolher Fixar', 'Não é possível congelar linhas'],
        correta: 1,
        explicacao: 'Em Exibir > Congelar Painéis > Congelar Linha Superior, a linha 1 permanece visível ao rolar.'
      }
    },
    {
      titulo: 'Função CONT.NÚM',
      descricao: 'Conte quantas células contêm números',
      nivel: 'fundamentos', trilha: 'geral', ordem: 13,
      tipo: 'excel_simulado', xpRecompensa: 15,
      conteudo: {
        instrucao: 'Na célula B7, conte quantas células de B1 a B6 contêm números.',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'Item 1',tipo:'label'},{ref:'B1',col:2,row:1,valor:'10',tipo:'number'},
          {ref:'A2',col:1,row:2,valor:'Item 2',tipo:'label'},{ref:'B2',col:2,row:2,valor:'',tipo:'label'},
          {ref:'A3',col:1,row:3,valor:'Item 3',tipo:'label'},{ref:'B3',col:2,row:3,valor:'30',tipo:'number'},
          {ref:'A4',col:1,row:4,valor:'Item 4',tipo:'label'},{ref:'B4',col:2,row:4,valor:'N/A',tipo:'label'},
          {ref:'A5',col:1,row:5,valor:'Item 5',tipo:'label'},{ref:'B5',col:2,row:5,valor:'50',tipo:'number'},
          {ref:'A6',col:1,row:6,valor:'Item 6',tipo:'label'},{ref:'B6',col:2,row:6,valor:'60',tipo:'number'},
          {ref:'A7',col:1,row:7,valor:'CONTAGEM',tipo:'label',bold:true},
          {ref:'B7',col:2,row:7,valor:'',editavel:true}
        ],
        aceitas: ['=CONT.NÚM(B1:B6)','=CONT.NUM(B1:B6)','=COUNT(B1:B6)'],
        explicacao: '=CONT.NÚM conta apenas células com números: B1, B3, B5 e B6 = 4 células.'
      }
    },
    {
      titulo: 'Formatação de números',
      descricao: 'Formate números como moeda, porcentagem e data',
      nivel: 'fundamentos', trilha: 'geral', ordem: 14,
      tipo: 'multipla_escolha', xpRecompensa: 10,
      conteudo: {
        pergunta: 'Como formatar a célula A1 para exibir o número 0,25 como 25%?',
        alternativas: ['Multiplicar por 100 manualmente', 'Aplicar formato Porcentagem na célula', 'Digitar 25% diretamente', 'Usar a fórmula =A1*100'],
        correta: 1,
        explicacao: 'Aplicando o formato Porcentagem, o Excel multiplica por 100 e adiciona o símbolo % automaticamente.'
      }
    },
    {
      titulo: 'Classificar dados',
      descricao: 'Ordene listas em ordem crescente ou decrescente',
      nivel: 'fundamentos', trilha: 'geral', ordem: 15,
      tipo: 'multipla_escolha', xpRecompensa: 10,
      conteudo: {
        pergunta: 'Ao classificar uma lista de nomes em ordem alfabética, você deve:',
        alternativas: ['Digitar os nomes novamente em ordem', 'Usar Dados > Classificar > A a Z', 'Copiar e reorganizar manualmente', 'Usar a fórmula =CLASSIFICAR()'],
        correta: 1,
        explicacao: 'Dados > Classificar > A a Z organiza automaticamente em ordem alfabética crescente.'
      }
    },
    {
      titulo: 'Filtrar dados',
      descricao: 'Use filtros para encontrar informações específicas',
      nivel: 'fundamentos', trilha: 'geral', ordem: 16,
      tipo: 'multipla_escolha', xpRecompensa: 10,
      conteudo: {
        pergunta: 'O AutoFiltro no Excel serve para:',
        alternativas: ['Calcular médias automaticamente', 'Exibir apenas as linhas que atendem a um critério', 'Deletar dados duplicados', 'Formatar células automaticamente'],
        correta: 1,
        explicacao: 'O AutoFiltro exibe apenas as linhas que correspondem ao critério escolhido, ocultando as demais.'
      }
    },

    // ════════════════════════════════════════
    // TRILHA GERAL — BÁSICO (17-32)
    // ════════════════════════════════════════
    {
      titulo: 'Função SE',
      descricao: 'Tome decisões automáticas com a função SE',
      nivel: 'basico', trilha: 'geral', ordem: 17,
      tipo: 'excel_simulado', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Na célula C1, use a função SE para mostrar "Aprovado" se B1 >= 7, ou "Reprovado" se for menor.',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'João',tipo:'label'},{ref:'B1',col:2,row:1,valor:'8',tipo:'number'},
          {ref:'C1',col:3,row:1,valor:'',editavel:true}
        ],
        aceitas: ['=SE(B1>=7,"Aprovado","Reprovado")','=IF(B1>=7,"Aprovado","Reprovado")','=se(b1>=7,"Aprovado","Reprovado")'],
        explicacao: '=SE(B1>=7,"Aprovado","Reprovado") verifica se a nota é maior ou igual a 7 e retorna o texto correspondente.'
      }
    },
    {
      titulo: 'PROCV básico',
      descricao: 'Busque valores em tabelas com PROCV',
      nivel: 'basico', trilha: 'geral', ordem: 18,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'Na fórmula =PROCV(A2,B1:D10,3,0), o número 3 representa:',
        alternativas: ['O número de linhas a buscar', 'A terceira coluna da tabela de busca', 'O valor a ser procurado', 'A margem de erro aceita'],
        correta: 1,
        explicacao: 'O 3 é o índice da coluna — indica que o resultado deve vir da 3ª coluna do intervalo B1:D10.'
      }
    },
    {
      titulo: 'CONT.SE',
      descricao: 'Conte células que atendem a um critério',
      nivel: 'basico', trilha: 'geral', ordem: 19,
      tipo: 'excel_simulado', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Na célula B7, conte quantas vezes "SP" aparece no intervalo A1:A6.',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'SP',tipo:'label'},{ref:'A2',col:1,row:2,valor:'RJ',tipo:'label'},
          {ref:'A3',col:1,row:3,valor:'SP',tipo:'label'},{ref:'A4',col:1,row:4,valor:'MG',tipo:'label'},
          {ref:'A5',col:1,row:5,valor:'SP',tipo:'label'},{ref:'A6',col:1,row:6,valor:'RJ',tipo:'label'},
          {ref:'A7',col:1,row:7,valor:'Total SP',tipo:'label',bold:true},
          {ref:'B7',col:2,row:7,valor:'',editavel:true}
        ],
        aceitas: ['=CONT.SE(A1:A6,"SP")','=COUNTIF(A1:A6,"SP")'],
        explicacao: '=CONT.SE(A1:A6,"SP") conta quantas células no intervalo contêm exatamente "SP". Resultado: 3.'
      }
    },
    {
      titulo: 'SOMASE',
      descricao: 'Some valores condicionalmente',
      nivel: 'basico', trilha: 'geral', ordem: 20,
      tipo: 'excel_simulado', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Na célula C7, some os valores de C1:C6 apenas onde A1:A6 for igual a "SP".',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'SP',tipo:'label'},{ref:'B1',col:2,row:1,valor:'Empresa A',tipo:'label'},{ref:'C1',col:3,row:1,valor:'5000',tipo:'number'},
          {ref:'A2',col:1,row:2,valor:'RJ',tipo:'label'},{ref:'B2',col:2,row:2,valor:'Empresa B',tipo:'label'},{ref:'C2',col:3,row:2,valor:'3000',tipo:'number'},
          {ref:'A3',col:1,row:3,valor:'SP',tipo:'label'},{ref:'B3',col:2,row:3,valor:'Empresa C',tipo:'label'},{ref:'C3',col:3,row:3,valor:'7000',tipo:'number'},
          {ref:'A4',col:1,row:4,valor:'MG',tipo:'label'},{ref:'B4',col:2,row:4,valor:'Empresa D',tipo:'label'},{ref:'C4',col:3,row:4,valor:'2000',tipo:'number'},
          {ref:'A5',col:1,row:5,valor:'SP',tipo:'label'},{ref:'B5',col:2,row:5,valor:'Empresa E',tipo:'label'},{ref:'C5',col:3,row:5,valor:'4000',tipo:'number'},
          {ref:'A6',col:1,row:6,valor:'RJ',tipo:'label'},{ref:'B6',col:2,row:6,valor:'Empresa F',tipo:'label'},{ref:'C6',col:3,row:6,valor:'6000',tipo:'number'},
          {ref:'A7',col:1,row:7,valor:'Total SP',tipo:'label',bold:true},
          {ref:'C7',col:3,row:7,valor:'',editavel:true}
        ],
        aceitas: ['=SOMASE(A1:A6,"SP",C1:C6)','=SUMIF(A1:A6,"SP",C1:C6)'],
        explicacao: '=SOMASE soma C1:C6 onde A1:A6 = "SP": 5000+7000+4000 = 16000.'
      }
    },
    {
      titulo: 'Referência absoluta',
      descricao: 'Use $ para fixar células em fórmulas',
      nivel: 'basico', trilha: 'geral', ordem: 21,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'Na fórmula =$A$1*B2, ao copiar para a célula abaixo, o que muda?',
        alternativas: ['Apenas $A$1 muda para $A$2', 'Apenas B2 muda para B3', 'Nada muda', 'Tudo muda'],
        correta: 1,
        explicacao: 'O $ trava a referência. $A$1 permanece fixo. B2 sem $ se ajusta para B3 ao copiar para baixo.'
      }
    },
    {
      titulo: 'Gráfico de colunas',
      descricao: 'Crie um gráfico de colunas a partir de dados',
      nivel: 'basico', trilha: 'geral', ordem: 22,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'Para criar um gráfico, o primeiro passo é:',
        alternativas: ['Ir em Inserir > Gráfico sem selecionar nada', 'Selecionar os dados e depois ir em Inserir > Gráfico', 'Ir em Página Inicial > Gráfico', 'Salvar o arquivo primeiro'],
        correta: 1,
        explicacao: 'Sempre selecione os dados primeiro, depois vá em Inserir > Gráfico para que o Excel saiba quais dados usar.'
      }
    },
    {
      titulo: 'Concatenar texto',
      descricao: 'Una textos de células diferentes',
      nivel: 'basico', trilha: 'geral', ordem: 23,
      tipo: 'excel_simulado', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Na célula C1, una o primeiro nome (A1) com o sobrenome (B1) com um espaço entre eles.',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'João',tipo:'label'},{ref:'B1',col:2,row:1,valor:'Silva',tipo:'label'},
          {ref:'C1',col:3,row:1,valor:'',editavel:true}
        ],
        aceitas: ['=A1&" "&B1','=CONCATENAR(A1," ",B1)','=CONCAT(A1," ",B1)'],
        explicacao: '=A1&" "&B1 une "João" + " " + "Silva" = "João Silva".'
      }
    },
    {
      titulo: 'Função DATA',
      descricao: 'Trabalhe com datas no Excel',
      nivel: 'basico', trilha: 'geral', ordem: 24,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'Para extrair apenas o mês de uma data na célula A1, qual fórmula usar?',
        alternativas: ['=DATA(A1)', '=MÊS(A1)', '=EXTRAIR(A1,"mês")', '=PARTE(A1,4,2)'],
        correta: 1,
        explicacao: '=MÊS(A1) retorna o número do mês (1 a 12) de uma data.'
      }
    },
    {
      titulo: 'Validação de dados',
      descricao: 'Controle o que pode ser digitado numa célula',
      nivel: 'basico', trilha: 'geral', ordem: 25,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'A validação de dados serve para:',
        alternativas: ['Corrigir erros de digitação automaticamente', 'Restringir os valores aceitos em uma célula', 'Formatar células automaticamente', 'Proteger a planilha com senha'],
        correta: 1,
        explicacao: 'A validação de dados restringe os valores aceitos — por exemplo, só números entre 1 e 100, ou itens de uma lista.'
      }
    },
    {
      titulo: 'Nomeando intervalos',
      descricao: 'Dê nomes a intervalos para facilitar fórmulas',
      nivel: 'basico', trilha: 'geral', ordem: 26,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'Se você nomear o intervalo B1:B12 como "Vendas", como usaria esse nome numa fórmula?',
        alternativas: ['=SOMA([Vendas])', '=SOMA(Vendas)', '=SOMA("Vendas")', '=SOMA(#Vendas)'],
        correta: 1,
        explicacao: '=SOMA(Vendas) — intervalos nomeados são usados diretamente pelo nome, sem aspas ou colchetes.'
      }
    },
    {
      titulo: 'Formatação condicional básica',
      descricao: 'Destaque células automaticamente por regras',
      nivel: 'basico', trilha: 'geral', ordem: 27,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'A formatação condicional permite:',
        alternativas: ['Formatar células manualmente mais rápido', 'Aplicar formatação automaticamente baseada no valor da célula', 'Copiar formatação de uma célula para outra', 'Proteger formatação de alterações'],
        correta: 1,
        explicacao: 'A formatação condicional muda cor, fonte ou borda automaticamente — exemplo: células com valor < 0 ficam vermelhas.'
      }
    },
    {
      titulo: 'Função ARRED',
      descricao: 'Arredonde números com precisão',
      nivel: 'basico', trilha: 'geral', ordem: 28,
      tipo: 'excel_simulado', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Na célula B1, arredonde o valor de A1 para 2 casas decimais.',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'3.14159',tipo:'number'},
          {ref:'B1',col:2,row:1,valor:'',editavel:true}
        ],
        aceitas: ['=ARRED(A1,2)','=ROUND(A1,2)'],
        explicacao: '=ARRED(A1,2) arredonda 3.14159 para 2 casas decimais = 3.14.'
      }
    },
    {
      titulo: 'Múltiplas planilhas',
      descricao: 'Trabalhe com dados em planilhas diferentes',
      nivel: 'basico', trilha: 'geral', ordem: 29,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'Para referenciar a célula A1 da planilha "Janeiro" em outra planilha, qual é a sintaxe correta?',
        alternativas: ['=Janeiro:A1', '=Janeiro!A1', '=[Janeiro]A1', '=Janeiro/A1'],
        correta: 1,
        explicacao: 'A sintaxe é NomeDaPlanilha!CélulaReferenciada. Exemplo: =Janeiro!A1.'
      }
    },
    {
      titulo: 'Função HOJE e AGORA',
      descricao: 'Insira datas e horas dinâmicas',
      nivel: 'basico', trilha: 'geral', ordem: 30,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'Qual é a diferença entre =HOJE() e =AGORA()?',
        alternativas: ['Não há diferença', 'HOJE() retorna data e hora, AGORA() só data', 'HOJE() retorna só a data, AGORA() retorna data e hora', 'AGORA() é mais preciso que HOJE()'],
        correta: 2,
        explicacao: '=HOJE() retorna apenas a data atual. =AGORA() retorna a data e hora atual.'
      }
    },
    {
      titulo: 'Tabela do Excel',
      descricao: 'Transforme um intervalo em tabela estruturada',
      nivel: 'basico', trilha: 'geral', ordem: 31,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'Qual a vantagem de formatar um intervalo como Tabela do Excel (Ctrl+T)?',
        alternativas: ['Apenas muda as cores', 'Fórmulas e filtros se expandem automaticamente com novos dados', 'Protege os dados de edição', 'Conecta com o banco de dados automaticamente'],
        correta: 1,
        explicacao: 'Tabelas estruturadas expandem automaticamente fórmulas, filtros e formatação quando novos dados são adicionados.'
      }
    },
    {
      titulo: 'Remover duplicatas',
      descricao: 'Elimine valores repetidos de uma lista',
      nivel: 'basico', trilha: 'geral', ordem: 32,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'Onde fica a opção Remover Duplicatas no Excel?',
        alternativas: ['Página Inicial > Edição', 'Dados > Ferramentas de Dados > Remover Duplicatas', 'Revisão > Verificar', 'Fórmulas > Auditoria'],
        correta: 1,
        explicacao: 'Dados > Ferramentas de Dados > Remover Duplicatas elimina linhas repetidas, mantendo apenas a primeira ocorrência.'
      }
    },

    // ════════════════════════════════════════════
    // TRILHA GERAL — INTERMEDIÁRIO (33-48)
    // ════════════════════════════════════════════
    {
      titulo: 'PROCV avançado',
      nivel: 'intermediario', trilha: 'geral', ordem: 33,
      tipo: 'excel_simulado', xpRecompensa: 25,
      descricao: 'Use PROCV para buscar preços em tabelas',
      conteudo: {
        instrucao: 'Na célula E2, use PROCV para buscar o preço do produto digitado em D2 na tabela A2:B5.',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'Produto',tipo:'label',bold:true},{ref:'B1',col:2,row:1,valor:'Preço',tipo:'label',bold:true},
          {ref:'A2',col:1,row:2,valor:'Caneta',tipo:'label'},{ref:'B2',col:2,row:2,valor:'2.50',tipo:'number'},
          {ref:'A3',col:1,row:3,valor:'Caderno',tipo:'label'},{ref:'B3',col:2,row:3,valor:'15.00',tipo:'number'},
          {ref:'A4',col:1,row:4,valor:'Régua',tipo:'label'},{ref:'B4',col:2,row:4,valor:'3.00',tipo:'number'},
          {ref:'A5',col:1,row:5,valor:'Borracha',tipo:'label'},{ref:'B5',col:2,row:5,valor:'1.50',tipo:'number'},
          {ref:'D2',col:4,row:2,valor:'Caderno',tipo:'label'},
          {ref:'E2',col:5,row:2,valor:'',editavel:true}
        ],
        aceitas: ['=PROCV(D2,A2:B5,2,0)','=VLOOKUP(D2,A2:B5,2,0)','=PROCV(D2,A1:B5,2,0)'],
        explicacao: '=PROCV(D2,A2:B5,2,0) busca "Caderno" e retorna o valor da 2ª coluna = 15.00.'
      }
    },
    {
      titulo: 'Tabela Dinâmica',
      nivel: 'intermediario', trilha: 'geral', ordem: 34,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      descricao: 'Resuma grandes volumes de dados automaticamente',
      conteudo: {
        pergunta: 'Uma Tabela Dinâmica serve principalmente para:',
        alternativas: ['Formatar dados em formato de tabela', 'Resumir, analisar e explorar grandes volumes de dados', 'Criar gráficos dinâmicos automaticamente', 'Conectar com banco de dados externo'],
        correta: 1,
        explicacao: 'A Tabela Dinâmica agrupa, totaliza e analisa dados de forma interativa sem alterar os dados originais.'
      }
    },
    {
      titulo: 'Fórmula matricial',
      nivel: 'intermediario', trilha: 'geral', ordem: 35,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      descricao: 'Use fórmulas que processam múltiplos valores',
      conteudo: {
        pergunta: 'Como inserir uma fórmula matricial no Excel tradicional?',
        alternativas: ['Pressionar Enter normalmente', 'Pressionar Ctrl+Shift+Enter', 'Pressionar Alt+Enter', 'Clicar em Fórmulas > Matricial'],
        correta: 1,
        explicacao: 'Fórmulas matriciais são inseridas com Ctrl+Shift+Enter e aparecem entre chaves {}.'
      }
    },
    {
      titulo: 'ÍNDICE e CORRESP',
      nivel: 'intermediario', trilha: 'geral', ordem: 36,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      descricao: 'Uma combinação mais poderosa que PROCV',
      conteudo: {
        pergunta: 'Qual a vantagem de ÍNDICE+CORRESP sobre PROCV?',
        alternativas: ['É mais fácil de usar', 'Pode buscar à esquerda e não depende da posição da coluna', 'Funciona apenas com números', 'É mais rápido em planilhas pequenas'],
        correta: 1,
        explicacao: 'ÍNDICE+CORRESP pode buscar em qualquer direção e não quebra quando colunas são inseridas.'
      }
    },
    {
      titulo: 'Função SEERRO',
      nivel: 'intermediario', trilha: 'geral', ordem: 37,
      tipo: 'excel_simulado', xpRecompensa: 25,
      descricao: 'Trate erros em fórmulas elegantemente',
      conteudo: {
        instrucao: 'Na célula C1, use SEERRO para mostrar "Não encontrado" se o PROCV em B1 retornar erro.',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'Produto X',tipo:'label'},
          {ref:'B1',col:2,row:1,valor:'#N/D',tipo:'label'},
          {ref:'C1',col:3,row:1,valor:'',editavel:true}
        ],
        aceitas: ['=SEERRO(B1,"Não encontrado")','=IFERROR(B1,"Não encontrado")'],
        explicacao: '=SEERRO(fórmula, valor_se_erro) exibe o segundo argumento se a fórmula retornar qualquer erro.'
      }
    },
    {
      titulo: 'Gráfico dinâmico',
      nivel: 'intermediario', trilha: 'geral', ordem: 38,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      descricao: 'Crie gráficos vinculados a tabelas dinâmicas',
      conteudo: {
        pergunta: 'Um Gráfico Dinâmico se diferencia de um gráfico comum porque:',
        alternativas: ['Tem mais tipos de gráfico disponíveis', 'Se atualiza automaticamente quando a Tabela Dinâmica muda', 'Pode ser exportado em mais formatos', 'É mais colorido'],
        correta: 1,
        explicacao: 'O Gráfico Dinâmico está vinculado à Tabela Dinâmica — qualquer filtro ou mudança reflete automaticamente no gráfico.'
      }
    },
    {
      titulo: 'Formatação condicional avançada',
      nivel: 'intermediario', trilha: 'geral', ordem: 39,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      descricao: 'Use fórmulas para criar regras de formatação complexas',
      conteudo: {
        pergunta: 'Para formatar uma linha inteira com base no valor de apenas uma coluna, você deve:',
        alternativas: ['Selecionar apenas a coluna e aplicar regra', 'Selecionar a linha inteira e usar fórmula com $ na coluna de referência', 'Não é possível formatar linhas inteiras', 'Usar uma macro VBA'],
        correta: 1,
        explicacao: 'Selecione toda a linha e use uma fórmula como =$C1="Aprovado" — o $ trava a coluna C para avaliar toda a linha.'
      }
    },
    {
      titulo: 'Função TEXTO',
      nivel: 'intermediario', trilha: 'geral', ordem: 40,
      tipo: 'excel_simulado', xpRecompensa: 25,
      descricao: 'Formate números e datas como texto personalizado',
      conteudo: {
        instrucao: 'Na célula B1, formate o número de A1 como moeda brasileira usando a função TEXTO.',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'1500.75',tipo:'number'},
          {ref:'B1',col:2,row:1,valor:'',editavel:true}
        ],
        aceitas: ['=TEXTO(A1,"R$ #.##0,00")','=TEXT(A1,"R$ #.##0,00")'],
        explicacao: '=TEXTO(A1,"R$ #.##0,00") formata 1500.75 como "R$ 1.500,75".'
      }
    },
    {
      titulo: 'Power Query introdução',
      nivel: 'intermediario', trilha: 'geral', ordem: 41,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      descricao: 'Importe e transforme dados externos',
      conteudo: {
        pergunta: 'O Power Query serve para:',
        alternativas: ['Criar gráficos avançados', 'Importar, transformar e carregar dados de diversas fontes', 'Escrever macros em linguagem M', 'Conectar planilhas em rede'],
        correta: 1,
        explicacao: 'O Power Query importa dados de CSV, banco de dados, web e outros, permitindo limpeza e transformação antes de carregar.'
      }
    },
    {
      titulo: 'Funções de texto',
      nivel: 'intermediario', trilha: 'geral', ordem: 42,
      tipo: 'excel_simulado', xpRecompensa: 25,
      descricao: 'Manipule strings com ESQUERDA, DIREITA e EXT.TEXTO',
      conteudo: {
        instrucao: 'Na célula B1, extraia apenas os 3 primeiros caracteres do texto em A1.',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'BRASIL2024',tipo:'label'},
          {ref:'B1',col:2,row:1,valor:'',editavel:true}
        ],
        aceitas: ['=ESQUERDA(A1,3)','=LEFT(A1,3)'],
        explicacao: '=ESQUERDA(A1,3) extrai os 3 primeiros caracteres de "BRASIL2024" = "BRA".'
      }
    },
    {
      titulo: 'Proteção de planilha',
      nivel: 'intermediario', trilha: 'geral', ordem: 43,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      descricao: 'Proteja células e planilhas com senha',
      conteudo: {
        pergunta: 'Para permitir que o usuário edite apenas algumas células numa planilha protegida, você deve:',
        alternativas: ['Proteger todas as células e liberar depois', 'Desbloquear as células editáveis ANTES de ativar a proteção', 'Usar VBA para controlar o acesso', 'Não é possível ter proteção parcial'],
        correta: 1,
        explicacao: 'Desbloqueie as células editáveis antes de proteger. Por padrão todas são "bloqueadas" mas isso só tem efeito com a proteção ativa.'
      }
    },
    {
      titulo: 'Função DESLOC',
      nivel: 'intermediario', trilha: 'geral', ordem: 44,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      descricao: 'Crie referências dinâmicas com DESLOC',
      conteudo: {
        pergunta: 'A função DESLOC(A1,2,3) retorna o valor da célula:',
        alternativas: ['A1', 'C3', 'D3', 'A3'],
        correta: 2,
        explicacao: 'DESLOC parte de A1, move 2 linhas para baixo (linha 3) e 3 colunas para a direita (coluna D) = célula D3.'
      }
    },
    {
      titulo: 'Consolidar dados',
      nivel: 'intermediario', trilha: 'geral', ordem: 45,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      descricao: 'Combine dados de múltiplas planilhas',
      conteudo: {
        pergunta: 'Para somar automaticamente o mesmo intervalo em 12 planilhas de meses, a sintaxe de referência 3D é:',
        alternativas: ['=SOMA(Jan:Dez!A1)', '=SOMA(Jan:Dez!A1:A10)', '=SOMA([Jan:Dez]A1)', '=SOMA(Jan+Dez!A1)'],
        correta: 1,
        explicacao: '=SOMA(Jan:Dez!A1:A10) soma o intervalo A1:A10 de todas as planilhas entre "Jan" e "Dez".'
      }
    },
    {
      titulo: 'Sparklines',
      nivel: 'intermediario', trilha: 'geral', ordem: 46,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      descricao: 'Crie mini gráficos dentro de células',
      conteudo: {
        pergunta: 'Sparklines no Excel são:',
        alternativas: ['Gráficos pequenos que cabem dentro de uma célula', 'Animações em gráficos', 'Linhas de tendência em gráficos normais', 'Miniaturas de gráficos para impressão'],
        correta: 0,
        explicacao: 'Sparklines são minigráficos que cabem dentro de uma célula, mostrando tendências de forma compacta.'
      }
    },
    {
      titulo: 'Função SE aninhado',
      nivel: 'intermediario', trilha: 'geral', ordem: 47,
      tipo: 'excel_simulado', xpRecompensa: 25,
      descricao: 'Use múltiplos SE para lógica complexa',
      conteudo: {
        instrucao: 'Na célula C1, classifique a nota de B1: "Ótimo" se >=9, "Bom" se >=7, "Regular" se >=5, senão "Insuficiente".',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'Aluno',tipo:'label'},{ref:'B1',col:2,row:1,valor:'7.5',tipo:'number'},
          {ref:'C1',col:3,row:1,valor:'',editavel:true}
        ],
        aceitas: ['=SE(B1>=9,"Ótimo",SE(B1>=7,"Bom",SE(B1>=5,"Regular","Insuficiente")))','=IF(B1>=9,"Ótimo",IF(B1>=7,"Bom",IF(B1>=5,"Regular","Insuficiente")))'],
        explicacao: 'SEs aninhados avaliam condições em sequência. 7.5 >= 9? Não. >= 7? Sim → "Bom".'
      }
    },
    {
      titulo: 'Auditoria de fórmulas',
      nivel: 'intermediario', trilha: 'geral', ordem: 48,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      descricao: 'Rastreie dependências e precedentes de fórmulas',
      conteudo: {
        pergunta: 'A ferramenta "Rastrear Precedentes" no Excel serve para:',
        alternativas: ['Mostrar quais células alimentam a fórmula atual', 'Mostrar quais células dependem da célula atual', 'Verificar erros de digitação', 'Comparar versões da planilha'],
        correta: 0,
        explicacao: 'Rastrear Precedentes mostra com setas quais células contribuem para o resultado da célula selecionada.'
      }
    },

    // ══════════════════════════════════════════
    // TRILHA GERAL — AVANÇADO (49-64)
    // ══════════════════════════════════════════
    {
      titulo: 'Macros com gravador',
      nivel: 'avancado', trilha: 'geral', ordem: 49,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      descricao: 'Grave e execute macros para automatizar tarefas',
      conteudo: {
        pergunta: 'Para gravar uma macro no Excel, você deve ir em:',
        alternativas: ['Inserir > Macro', 'Desenvolvedor > Gravar Macro', 'Exibir > Macros > Gravar', 'Arquivo > Opções > Macro'],
        correta: 1,
        explicacao: 'A guia Desenvolvedor contém o botão Gravar Macro. Também pode usar Exibir > Macros.'
      }
    },
    {
      titulo: 'VBA básico',
      nivel: 'avancado', trilha: 'geral', ordem: 50,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      descricao: 'Escreva seu primeiro código VBA',
      conteudo: {
        pergunta: 'No VBA, qual código exibe uma caixa de mensagem com o texto "Olá"?',
        alternativas: ['Print "Olá"', 'MsgBox "Olá"', 'Display("Olá")', 'Alert "Olá"'],
        correta: 1,
        explicacao: 'MsgBox "Olá" exibe uma caixa de diálogo com o texto especificado.'
      }
    },
    {
      titulo: 'Power Pivot',
      nivel: 'avancado', trilha: 'geral', ordem: 51,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      descricao: 'Analise milhões de linhas com Power Pivot',
      conteudo: {
        pergunta: 'Qual a principal vantagem do Power Pivot sobre as Tabelas Dinâmicas normais?',
        alternativas: ['Interface mais bonita', 'Processa milhões de linhas e permite relacionar múltiplas tabelas', 'Funciona sem o Excel', 'Gera relatórios em PDF automaticamente'],
        correta: 1,
        explicacao: 'O Power Pivot usa o mecanismo xVelocity para processar volumes enormes de dados e criar relacionamentos entre tabelas.'
      }
    },
    {
      titulo: 'Fórmulas DAX básicas',
      nivel: 'avancado', trilha: 'geral', ordem: 52,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      descricao: 'Use DAX para criar medidas no Power Pivot',
      conteudo: {
        pergunta: 'No Power Pivot, para criar uma medida de total de vendas, você usaria:',
        alternativas: ['=SOMA(Vendas[Valor])', 'Total := SUM(Vendas[Valor])', '=SUM([Valor])', 'MEASURE Vendas[Total] = SUM(Vendas[Valor])'],
        correta: 1,
        explicacao: 'No DAX, medidas são criadas com a sintaxe: NomeMedida := expressão_DAX.'
      }
    },
    {
      titulo: 'Funções PROCX e XMATCH',
      nivel: 'avancado', trilha: 'geral', ordem: 53,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      descricao: 'As substitutas modernas do PROCV',
      conteudo: {
        pergunta: 'O PROCX tem vantagem sobre o PROCV porque:',
        alternativas: ['É mais rápido em todas as situações', 'Busca em qualquer direção e retorna múltiplas colunas', 'Funciona em versões antigas do Excel', 'Tem sintaxe mais simples'],
        correta: 1,
        explicacao: 'PROCX busca em qualquer direção, retorna arrays e tem tratamento de erro integrado.'
      }
    },
    {
      titulo: 'Solver',
      nivel: 'avancado', trilha: 'geral', ordem: 54,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      descricao: 'Otimize problemas complexos com o Solver',
      conteudo: {
        pergunta: 'O Solver do Excel serve para:',
        alternativas: ['Resolver equações matemáticas simples', 'Encontrar o valor ótimo de uma célula alterando variáveis com restrições', 'Corrigir erros em fórmulas', 'Conectar com planilhas externas'],
        correta: 1,
        explicacao: 'O Solver encontra o máximo, mínimo ou valor específico de uma célula objetivo, sujeito a restrições.'
      }
    },
    {
      titulo: 'Funções de array dinâmico',
      nivel: 'avancado', trilha: 'geral', ordem: 55,
      tipo: 'excel_simulado', xpRecompensa: 30,
      descricao: 'Use ÚNICO, CLASSIFICAR e FILTRAR',
      conteudo: {
        instrucao: 'Na célula C1, use a função ÚNICO para listar os valores únicos do intervalo A1:A6.',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'SP',tipo:'label'},{ref:'A2',col:1,row:2,valor:'RJ',tipo:'label'},
          {ref:'A3',col:1,row:3,valor:'SP',tipo:'label'},{ref:'A4',col:1,row:4,valor:'MG',tipo:'label'},
          {ref:'A5',col:1,row:5,valor:'RJ',tipo:'label'},{ref:'A6',col:1,row:6,valor:'SP',tipo:'label'},
          {ref:'C1',col:3,row:1,valor:'',editavel:true}
        ],
        aceitas: ['=ÚNICO(A1:A6)','=UNIQUE(A1:A6)'],
        explicacao: '=ÚNICO(A1:A6) retorna SP, RJ e MG — os valores sem repetição.'
      }
    },
    {
      titulo: 'Análise de cenários',
      nivel: 'avancado', trilha: 'geral', ordem: 56,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      descricao: 'Compare diferentes situações com Gerenciador de Cenários',
      conteudo: {
        pergunta: 'O Gerenciador de Cenários serve para:',
        alternativas: ['Salvar diferentes versões de uma planilha', 'Comparar múltiplos conjuntos de valores de entrada e seus resultados', 'Simular erros na planilha', 'Criar relatórios automáticos'],
        correta: 1,
        explicacao: 'O Gerenciador de Cenários salva conjuntos de valores (otimista, pessimista, realista) e permite comparar os resultados.'
      }
    },
    {
      titulo: 'Tabela de dados',
      nivel: 'avancado', trilha: 'geral', ordem: 57,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      descricao: 'Analise sensibilidade com tabelas de dados',
      conteudo: {
        pergunta: 'Uma tabela de dados de duas variáveis permite:',
        alternativas: ['Filtrar dados por dois critérios', 'Ver como dois inputs diferentes afetam um resultado', 'Criar dois gráficos simultaneamente', 'Importar dados de duas fontes'],
        correta: 1,
        explicacao: 'A tabela de dados calcula como diferentes combinações de dois valores de entrada afetam uma fórmula de resultado.'
      }
    },
    {
      titulo: 'Funções financeiras',
      nivel: 'avancado', trilha: 'geral', ordem: 58,
      tipo: 'excel_simulado', xpRecompensa: 30,
      descricao: 'Calcule VPL, TIR e parcelas de empréstimos',
      conteudo: {
        instrucao: 'Na célula B5, calcule a parcela mensal. Taxa em B1 (0.01), períodos em B2 (12), valor em B3 (10000). Use PGTO.',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'Taxa mensal',tipo:'label'},{ref:'B1',col:2,row:1,valor:'0.01',tipo:'number'},
          {ref:'A2',col:1,row:2,valor:'Períodos',tipo:'label'},{ref:'B2',col:2,row:2,valor:'12',tipo:'number'},
          {ref:'A3',col:1,row:3,valor:'Valor',tipo:'label'},{ref:'B3',col:2,row:3,valor:'10000',tipo:'number'},
          {ref:'A5',col:1,row:5,valor:'Parcela',tipo:'label',bold:true},
          {ref:'B5',col:2,row:5,valor:'',editavel:true}
        ],
        aceitas: ['=PGTO(B1,B2,B3)','=PMT(B1,B2,B3)','=-PGTO(B1,B2,-B3)'],
        explicacao: '=PGTO(taxa,nper,vp) calcula a parcela. Com 1% ao mês, 12 meses e R$10.000 ≈ R$888,49.'
      }
    },
    {
      titulo: 'VBA com loops',
      nivel: 'avancado', trilha: 'geral', ordem: 59,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      descricao: 'Automatize tarefas repetitivas com For...Next',
      conteudo: {
        pergunta: 'Qual código VBA preenche as células A1 até A10 com os números 1 a 10?',
        alternativas: ['For i = 1 To 10: Cells(i, 1) = i: Next i', 'For i = 1 To 10: Range("A" & i) = i: Next', 'Ambas as alternativas estão corretas', 'Nenhuma das alternativas'],
        correta: 2,
        explicacao: 'Ambas funcionam: Cells(linha, coluna) e Range("A" & i) são formas equivalentes em VBA.'
      }
    },
    {
      titulo: 'Conexão com banco de dados',
      nivel: 'avancado', trilha: 'geral', ordem: 60,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      descricao: 'Importe dados de SQL Server e Access',
      conteudo: {
        pergunta: 'Para conectar o Excel a um banco de dados SQL Server, você usa:',
        alternativas: ['Inserir > Tabela > SQL', 'Dados > Obter Dados > Do Banco de Dados', 'Arquivo > Importar > SQL', 'Desenvolvedor > Conexões'],
        correta: 1,
        explicacao: 'Dados > Obter Dados > Do Banco de Dados permite conectar com SQL Server, Access, Oracle e outros via Power Query.'
      }
    },
    {
      titulo: 'Dashboard profissional',
      nivel: 'avancado', trilha: 'geral', ordem: 61,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      descricao: 'Construa dashboards interativos com segmentações',
      conteudo: {
        pergunta: 'Segmentações de dados (Slicers) em um dashboard servem para:',
        alternativas: ['Dividir a tela em painéis', 'Filtrar Tabelas Dinâmicas e gráficos interativamente com um clique', 'Separar dados em abas diferentes', 'Criar menus suspensos'],
        correta: 1,
        explicacao: 'Slicers são botões visuais que filtram Tabelas Dinâmicas e gráficos conectados com um clique.'
      }
    },
    {
      titulo: 'Funções de informação',
      nivel: 'avancado', trilha: 'geral', ordem: 62,
      tipo: 'excel_simulado', xpRecompensa: 30,
      descricao: 'Use ÉCÉL.VAZIA, ÉNÚM, ÉTEXTO para validar dados',
      conteudo: {
        instrucao: 'Na célula B1, verifique se A1 contém um número usando a função ÉNÚM.',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'42',tipo:'number'},
          {ref:'B1',col:2,row:1,valor:'',editavel:true}
        ],
        aceitas: ['=ÉNÚM(A1)','=ISNUMBER(A1)'],
        explicacao: '=ÉNÚM(A1) retorna VERDADEIRO se A1 contém um número, FALSO caso contrário.'
      }
    },
    {
      titulo: 'Macro com InputBox',
      nivel: 'avancado', trilha: 'geral', ordem: 63,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      descricao: 'Interaja com o usuário via InputBox no VBA',
      conteudo: {
        pergunta: 'No VBA, qual código solicita um nome ao usuário e armazena na variável "nome"?',
        alternativas: ['nome = MsgBox("Digite seu nome")', 'nome = InputBox("Digite seu nome")', 'nome = Input("Digite seu nome")', 'InputBox("Digite seu nome", nome)'],
        correta: 1,
        explicacao: 'InputBox() exibe uma caixa de diálogo onde o usuário digita um valor, retornado e armazenado na variável.'
      }
    },
    {
      titulo: 'Otimização com Atingir Meta',
      nivel: 'avancado', trilha: 'geral', ordem: 64,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      descricao: 'Descubra o input necessário para um resultado desejado',
      conteudo: {
        pergunta: 'O recurso "Atingir Meta" do Excel serve para:',
        alternativas: ['Definir metas de vendas automaticamente', 'Encontrar o valor de entrada que produz um resultado específico', 'Comparar resultados com metas pré-definidas', 'Criar gráficos de acompanhamento de metas'],
        correta: 1,
        explicacao: 'Atingir Meta (Dados > Teste de Hipóteses) descobre qual valor de entrada é necessário para a fórmula atingir o resultado desejado.'
      }
    },

    // ══════════════════════════════════════════════
    // TRILHA GERAL — ESPECIALISTA (65-80)
    // ══════════════════════════════════════════════
    {
      titulo: 'VBA Orientado a Objetos',
      nivel: 'especialista', trilha: 'geral', ordem: 65,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      descricao: 'Use Classes e objetos no VBA',
      conteudo: {
        pergunta: 'No VBA, para criar uma classe personalizada, você deve inserir:',
        alternativas: ['Um módulo padrão', 'Um módulo de classe', 'Um UserForm', 'Um módulo ThisWorkbook'],
        correta: 1,
        explicacao: 'Módulos de classe (Class Module) permitem criar objetos personalizados com propriedades e métodos no VBA.'
      }
    },
    {
      titulo: 'Power Query M avançado',
      nivel: 'especialista', trilha: 'geral', ordem: 66,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      descricao: 'Escreva código M para transformações complexas',
      conteudo: {
        pergunta: 'No Power Query, a linguagem usada internamente é:',
        alternativas: ['DAX', 'M (Power Query Formula Language)', 'SQL', 'Python'],
        correta: 1,
        explicacao: 'O Power Query usa a linguagem M internamente. Cada passo aplicado gera código M que pode ser editado.'
      }
    },
    {
      titulo: 'DAX avançado — CALCULATE',
      nivel: 'especialista', trilha: 'geral', ordem: 67,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      descricao: 'Domine a função mais poderosa do DAX',
      conteudo: {
        pergunta: 'No DAX, CALCULATE(SUM(Vendas[Valor]), Vendas[Região]="SP") retorna:',
        alternativas: ['A soma de todas as vendas', 'A soma das vendas apenas da região SP', 'A contagem de vendas de SP', 'Um erro'],
        correta: 1,
        explicacao: 'CALCULATE modifica o contexto de filtro — aqui soma Vendas[Valor] apenas onde Região = "SP".'
      }
    },
    {
      titulo: 'Modelagem de dados',
      nivel: 'especialista', trilha: 'geral', ordem: 68,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      descricao: 'Crie relacionamentos entre tabelas no Power Pivot',
      conteudo: {
        pergunta: 'No modelo estrela (Star Schema), a tabela fato:',
        alternativas: ['Contém descrições e atributos', 'Contém métricas numéricas e chaves estrangeiras das dimensões', 'É sempre a maior tabela em colunas', 'Fica no centro apenas por organização visual'],
        correta: 1,
        explicacao: 'A tabela fato contém as métricas (valores, quantidades) e as chaves que se relacionam com as tabelas dimensão.'
      }
    },
    {
      titulo: 'Integração Excel + Python',
      nivel: 'especialista', trilha: 'geral', ordem: 69,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      descricao: 'Execute scripts Python dentro do Excel',
      conteudo: {
        pergunta: 'O Python no Excel (Microsoft 365) permite:',
        alternativas: ['Substituir completamente o VBA', 'Executar código Python em células para análise avançada de dados', 'Importar apenas arquivos .py', 'Criar macros com sintaxe Python'],
        correta: 1,
        explicacao: 'O Python no Excel permite usar pandas, matplotlib e sklearn diretamente em células, retornando resultados para a planilha.'
      }
    },
    {
      titulo: 'Fórmulas LET e LAMBDA',
      nivel: 'especialista', trilha: 'geral', ordem: 70,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      descricao: 'Crie funções personalizadas sem VBA',
      conteudo: {
        pergunta: 'A função LAMBDA no Excel 365 permite:',
        alternativas: ['Acelerar cálculos pesados', 'Criar funções personalizadas reutilizáveis sem VBA', 'Importar funções de bibliotecas externas', 'Executar fórmulas em paralelo'],
        correta: 1,
        explicacao: 'LAMBDA cria funções personalizadas que podem ser nomeadas e reutilizadas, eliminando a necessidade de VBA para lógica customizada.'
      }
    },
    {
      titulo: 'Erros comuns no Excel',
      nivel: 'especialista', trilha: 'geral', ordem: 71,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      descricao: 'Encontre e corrija erros complexos em planilhas',
      conteudo: {
        pergunta: 'O erro #REF! no Excel indica:',
        alternativas: ['Um valor não encontrado', 'Uma referência inválida — célula deletada ou fora do intervalo', 'Divisão por zero', 'Tipo de dado incorreto'],
        correta: 1,
        explicacao: '#REF! ocorre quando uma referência aponta para uma célula que foi deletada ou está fora dos limites da planilha.'
      }
    },
    {
      titulo: 'Office Scripts',
      nivel: 'especialista', trilha: 'geral', ordem: 72,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      descricao: 'Use Office Scripts para automatizar no Excel Online',
      conteudo: {
        pergunta: 'Office Scripts diferem de macros VBA porque:',
        alternativas: ['São mais lentos', 'Funcionam no Excel Online e podem ser integrados com Power Automate', 'Usam a mesma linguagem do VBA', 'Só funcionam no Windows'],
        correta: 1,
        explicacao: 'Office Scripts usam TypeScript, funcionam no Excel Online e se integram com Power Automate para automações na nuvem.'
      }
    },
    {
      titulo: 'Segurança e criptografia',
      nivel: 'especialista', trilha: 'geral', ordem: 73,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      descricao: 'Proteja dados sensíveis em planilhas',
      conteudo: {
        pergunta: 'Para criptografar um arquivo Excel com senha, você usa:',
        alternativas: ['Revisão > Proteger Pasta de Trabalho', 'Arquivo > Informações > Proteger Pasta de Trabalho > Criptografar com Senha', 'Desenvolvedor > Segurança', 'Arquivo > Salvar Como > Opções'],
        correta: 1,
        explicacao: 'Arquivo > Informações > Proteger Pasta de Trabalho > Criptografar com Senha usa criptografia AES-256.'
      }
    },
    {
      titulo: 'APIs externas no VBA',
      nivel: 'especialista', trilha: 'geral', ordem: 74,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      descricao: 'Consuma APIs REST diretamente do Excel',
      conteudo: {
        pergunta: 'Para fazer uma requisição HTTP GET em VBA, você usa:',
        alternativas: ['CreateObject("MSXML2.XMLHTTP")', 'Application.WebRequest()', 'HTTP.Get()', 'Workbook.FetchURL()'],
        correta: 0,
        explicacao: 'MSXML2.XMLHTTP é o objeto COM usado em VBA para fazer requisições HTTP e consumir APIs REST.'
      }
    },
    {
      titulo: 'Performance em planilhas grandes',
      nivel: 'especialista', trilha: 'geral', ordem: 75,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      descricao: 'Otimize planilhas com milhões de registros',
      conteudo: {
        pergunta: 'Qual prática NÃO ajuda a melhorar a performance de uma planilha lenta?',
        alternativas: ['Desativar cálculo automático durante atualizações em massa', 'Substituir fórmulas por valores onde possível', 'Usar mais fórmulas INDIRETO e DESLOC', 'Evitar referências a planilhas inteiras como A:A'],
        correta: 2,
        explicacao: 'INDIRETO e DESLOC são voláteis — recalculam toda vez que qualquer célula muda, tornando planilhas mais lentas.'
      }
    },
    {
      titulo: 'UserForms no VBA',
      nivel: 'especialista', trilha: 'geral', ordem: 76,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      descricao: 'Crie formulários personalizados com VBA',
      conteudo: {
        pergunta: 'Para exibir um UserForm chamado "frm_Cadastro" via VBA, o código é:',
        alternativas: ['frm_Cadastro.Open', 'frm_Cadastro.Show', 'Load frm_Cadastro', 'frm_Cadastro.Display'],
        correta: 1,
        explicacao: 'NomeDoForm.Show exibe o formulário. Use .Show vbModal (padrão) ou .Show vbModeless para não bloquear a planilha.'
      }
    },
    {
      titulo: 'Integração com Power BI',
      nivel: 'especialista', trilha: 'geral', ordem: 77,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      descricao: 'Publique dados do Excel no Power BI',
      conteudo: {
        pergunta: 'A melhor forma de usar dados do Excel como fonte no Power BI é:',
        alternativas: ['Copiar e colar manualmente', 'Conectar via Power Query usando o arquivo .xlsx como fonte', 'Exportar como CSV antes de importar', 'Usar a função EXPORTAR do Excel'],
        correta: 1,
        explicacao: 'Conectar diretamente ao arquivo .xlsx cria uma conexão que atualiza automaticamente quando o arquivo Excel muda.'
      }
    },
    {
      titulo: 'Certificação MOS Expert',
      nivel: 'especialista', trilha: 'geral', ordem: 78,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      descricao: 'Prepare-se para a certificação MOS Expert',
      conteudo: {
        pergunta: 'A certificação Microsoft Office Specialist (MOS) Expert em Excel valida:',
        alternativas: ['Conhecimento básico de planilhas', 'Domínio avançado com funções complexas, macros e análise de dados', 'Apenas conhecimento em VBA', 'Habilidades em Power BI'],
        correta: 1,
        explicacao: 'A MOS Expert valida habilidades avançadas: funções complexas, tabelas dinâmicas, macros, Power Query e análise de dados.'
      }
    },
    {
      titulo: 'Dashboard — Boas práticas',
      nivel: 'especialista', trilha: 'geral', ordem: 79,
      tipo: 'multipla_escolha', xpRecompensa: 50,
      descricao: 'Construa um dashboard executivo do zero',
      conteudo: {
        pergunta: 'Num dashboard executivo profissional, qual elemento NÃO é recomendado?',
        alternativas: ['KPIs com indicadores visuais de desempenho', 'Gráficos com excesso de cores e efeitos 3D', 'Segmentações para filtros interativos', 'Tabelas resumidas com dados principais'],
        correta: 1,
        explicacao: 'Excesso de cores e efeitos 3D poluem o dashboard. Boas práticas: paleta reduzida, gráficos 2D limpos e hierarquia visual clara.'
      }
    },
    {
      titulo: 'Mestre Excel — Desafio final',
      nivel: 'especialista', trilha: 'geral', ordem: 80,
      tipo: 'excel_simulado', xpRecompensa: 100,
      descricao: 'O desafio máximo para o verdadeiro especialista',
      conteudo: {
        instrucao: 'Na célula D2, use PROCX para buscar o salário de C2 na tabela A2:B5, retornando "Não encontrado" se não existir.',
        celulas: [
          {ref:'A1',col:1,row:1,valor:'Funcionário',tipo:'label',bold:true},{ref:'B1',col:2,row:1,valor:'Salário',tipo:'label',bold:true},
          {ref:'A2',col:1,row:2,valor:'Ana',tipo:'label'},{ref:'B2',col:2,row:2,valor:'5000',tipo:'number'},
          {ref:'A3',col:1,row:3,valor:'Bruno',tipo:'label'},{ref:'B3',col:2,row:3,valor:'7000',tipo:'number'},
          {ref:'A4',col:1,row:4,valor:'Carla',tipo:'label'},{ref:'B4',col:2,row:4,valor:'4500',tipo:'number'},
          {ref:'A5',col:1,row:5,valor:'Diego',tipo:'label'},{ref:'B5',col:2,row:5,valor:'8000',tipo:'number'},
          {ref:'C2',col:3,row:2,valor:'Carla',tipo:'label'},
          {ref:'D2',col:4,row:2,valor:'',editavel:true}
        ],
        aceitas: ['=PROCX(C2,A2:A5,B2:B5,"Não encontrado")','=XLOOKUP(C2,A2:A5,B2:B5,"Não encontrado")'],
        explicacao: '=PROCX(valor_procurado, array_procura, array_retorno, se_não_encontrado) — mais poderoso que PROCV.'
      }
    },

    // ══════════════════════════════════════
    // TRILHAS PROFISSIONAIS (81-150)
    // — Analista (81-90), RH (91-100), Logística (101-110),
    //   Financeiro (111-120), Gestão (121-130),
    //   Vendas (131-140), Contabilidade (141-150)
    // ══════════════════════════════════════
    // [As 70 lições das trilhas profissionais são idênticas
    //  ao seed original — omitidas aqui por brevidade,
    //  mas devem ser inseridas conforme documento anterior]

    // ════════════════════════════════════════════════════════
    // NOVAS LIÇÕES — INTERAÇÕES VISUAIS (151-170)
    // 5 TIPOS × 4 QUESTÕES = 20 LIÇÕES
    // ════════════════════════════════════════════════════════

    // ─── TIPO: FORMATAÇÃO CONDICIONAL (151-154) ───────────────
    {
      titulo: 'FC: Destaque vendas abaixo da meta',
      descricao: 'Configure formatação condicional para realçar valores críticos',
      nivel: 'basico', trilha: 'geral', ordem: 151,
      tipo: 'fc_interativo', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Configure a formatação condicional para destacar em VERMELHO os vendedores com vendas MENORES que R$20.000. Selecione a condição, o valor e a cor, depois clique em Aplicar.',
        dica: 'Selecione: "Menor que" → valor 20000 → cor Vermelho',
        dados: [
          {nome:'Roberto Alves',  valor:32000},
          {nome:'Sandra Lima',    valor:17500},
          {nome:'Tatiane Cruz',   valor:28900},
          {nome:'Ulisses Porto',  valor:14200},
          {nome:'Viviane Melo',   valor:41300},
          {nome:'Wagner Costa',   valor:19800}
        ],
        resposta: {condicao:'menor', valor:20000},
        explicacao: 'Formatação Condicional "Menor que 20000" destaca automaticamente Sandra (17.500), Ulisses (14.200) e Wagner (19.800) — os 3 abaixo da meta.'
      }
    },
    {
      titulo: 'FC: Notas abaixo de 6 em vermelho',
      descricao: 'Use formatação condicional para identificar reprovações',
      nivel: 'basico', trilha: 'geral', ordem: 152,
      tipo: 'fc_interativo', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Configure a formatação condicional para destacar em AMARELO as notas MENORES que 6. Isso indica alunos em risco de reprovação.',
        dica: 'Selecione: "Menor que" → valor 6 → cor Amarelo',
        dados: [
          {nome:'Ana Costa',     valor:8.5},
          {nome:'Bruno Dias',    valor:5.2},
          {nome:'Carla Mendes',  valor:7.0},
          {nome:'Diego Santos',  valor:4.8},
          {nome:'Eva Lima',      valor:9.1},
          {nome:'Fábio Neves',   valor:3.5}
        ],
        resposta: {condicao:'menor', valor:6},
        explicacao: 'FC "Menor que 6" destaca Bruno (5.2), Diego (4.8) e Fábio (3.5) — alunos com risco de reprovação que precisam de atenção especial.'
      }
    },
    {
      titulo: 'FC: Estoque crítico em vermelho',
      descricao: 'Alerte automaticamente quando o estoque estiver baixo',
      nivel: 'intermediario', trilha: 'geral', ordem: 153,
      tipo: 'fc_interativo', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Configure formatação condicional para destacar em VERMELHO os produtos com estoque MENOR que 10 unidades — esses precisam ser repostos urgentemente.',
        dica: 'Selecione: "Menor que" → valor 10 → cor Vermelho',
        dados: [
          {nome:'Caneta Azul',    valor:3},
          {nome:'Caderno A4',     valor:45},
          {nome:'Borracha',       valor:7},
          {nome:'Lápis HB',       valor:28},
          {nome:'Régua 30cm',     valor:2},
          {nome:'Apontador',      valor:15}
        ],
        resposta: {condicao:'menor', valor:10},
        explicacao: 'FC "Menor que 10" destaca Caneta Azul (3), Borracha (7) e Régua (2) — esses precisam de reposição urgente!'
      }
    },
    {
      titulo: 'FC: Metas superadas em verde',
      descricao: 'Celebre os resultados acima da meta com cor verde',
      nivel: 'intermediario', trilha: 'geral', ordem: 154,
      tipo: 'fc_interativo', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Configure formatação condicional para destacar em VERDE os valores MAIORES que 100 (representando 100% de atingimento de meta).',
        dica: 'Selecione: "Maior que" → valor 100 → cor Verde',
        dados: [
          {nome:'Região Norte',   valor:115},
          {nome:'Região Sul',     valor:87},
          {nome:'Região Leste',   valor:103},
          {nome:'Região Oeste',   valor:92},
          {nome:'Região Centro',  valor:128},
          {nome:'Região Capital', valor:98}
        ],
        resposta: {condicao:'maior', valor:100},
        explicacao: 'FC "Maior que 100" destaca Norte (115%), Leste (103%) e Centro (128%) — regiões que bateram a meta e merecem reconhecimento!'
      }
    },

    // ─── TIPO: CRIAR GRÁFICO (155-158) ────────────────────────
    {
      titulo: 'Gráfico: Vendas por trimestre',
      descricao: 'Selecione o gráfico ideal para comparar categorias',
      nivel: 'basico', trilha: 'geral', ordem: 155,
      tipo: 'grafico', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Os dados mostram vendas por trimestre. Selecione o tipo de gráfico mais adequado para COMPARAR valores entre categorias e clique em Inserir Gráfico.',
        dica: 'Para comparar valores entre categorias (trimestres), o gráfico de Colunas é o mais indicado!',
        dados: ['Q1','Q2','Q3','Q4'],
        valores: [45000,62000,58000,78000],
        respostaCorreta: 'colunas',
        opcoes: [
          {id:'colunas', icon:'📊', label:'Colunas'},
          {id:'linha',   icon:'📈', label:'Linha'},
          {id:'pizza',   icon:'🥧', label:'Pizza'},
          {id:'barra',   icon:'📉', label:'Barras'}
        ],
        explicacao: 'O gráfico de Colunas é ideal para comparar valores entre categorias distintas. Linha é melhor para tendências contínuas; pizza para proporções.'
      }
    },
    {
      titulo: 'Gráfico: Evolução de receita anual',
      descricao: 'Escolha o gráfico certo para mostrar tendências',
      nivel: 'basico', trilha: 'geral', ordem: 156,
      tipo: 'grafico', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Os dados mostram a receita mensal ao longo de 6 meses. Selecione o tipo de gráfico mais adequado para visualizar a TENDÊNCIA de crescimento.',
        dica: 'Para mostrar tendência e evolução ao longo do tempo, o gráfico de Linha é o mais indicado!',
        dados: ['Jan','Fev','Mar','Abr','Mai','Jun'],
        valores: [28000,31000,29500,35000,38000,42000],
        respostaCorreta: 'linha',
        opcoes: [
          {id:'colunas', icon:'📊', label:'Colunas'},
          {id:'linha',   icon:'📈', label:'Linha'},
          {id:'pizza',   icon:'🥧', label:'Pizza'},
          {id:'barra',   icon:'📉', label:'Barras'}
        ],
        explicacao: 'O gráfico de Linha conecta pontos cronológicos, tornando visível a tendência de crescimento mês a mês.'
      }
    },
    {
      titulo: 'Gráfico: Participação de mercado',
      descricao: 'Visualize proporções com o gráfico correto',
      nivel: 'intermediario', trilha: 'geral', ordem: 157,
      tipo: 'grafico', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Os dados mostram a participação de cada produto nas vendas totais (%). Selecione o tipo de gráfico ideal para mostrar PROPORÇÕES de um todo.',
        dica: 'Para mostrar como partes se relacionam com o todo (%), o gráfico de Pizza é o mais indicado!',
        dados: ['Produto A','Produto B','Produto C','Produto D'],
        valores: [35,28,22,15],
        respostaCorreta: 'pizza',
        opcoes: [
          {id:'colunas', icon:'📊', label:'Colunas'},
          {id:'linha',   icon:'📈', label:'Linha'},
          {id:'pizza',   icon:'🥧', label:'Pizza'},
          {id:'barra',   icon:'📉', label:'Barras'}
        ],
        explicacao: 'O gráfico de Pizza exibe a proporção de cada parte em relação ao total — perfeito para participação de mercado e composição percentual.'
      }
    },
    {
      titulo: 'Gráfico: Ranking de vendedores',
      descricao: 'Compare valores horizontalmente com barras',
      nivel: 'intermediario', trilha: 'geral', ordem: 158,
      tipo: 'grafico', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Os dados mostram o total de vendas de 4 vendedores com nomes longos. Selecione o gráfico que exibe melhor nomes longos em comparação horizontal.',
        dica: 'Para comparar categorias com nomes longos horizontalmente, o gráfico de Barras (horizontal) é o mais adequado!',
        dados: ['Carlos Alberto','Fernanda Oliveira','Ricardo Mendonça','Patrícia Sousa'],
        valores: [87500,103200,64800,91000],
        respostaCorreta: 'barra',
        opcoes: [
          {id:'colunas', icon:'📊', label:'Colunas'},
          {id:'linha',   icon:'📈', label:'Linha'},
          {id:'pizza',   icon:'🥧', label:'Pizza'},
          {id:'barra',   icon:'📉', label:'Barras'}
        ],
        explicacao: 'O gráfico de Barras (horizontal) acomoda rótulos longos e facilita a comparação de rankings — ideal para listas de nomes ou categorias extensas.'
      }
    },

    // ─── TIPO: FORMATAR CÉLULAS (159-162) ─────────────────────
    {
      titulo: 'Formatação: Cabeçalho profissional',
      descricao: 'Aplique negrito, fundo verde e texto branco no cabeçalho',
      nivel: 'fundamentos', trilha: 'geral', ordem: 159,
      tipo: 'formatacao_celula', xpRecompensa: 15,
      conteudo: {
        instrucao: 'Aplique a formatação profissional no cabeçalho da planilha: (1) Negrito, (2) Fundo Verde, (3) Texto Branco. Depois formate a coluna de valores como Moeda (R$).',
        dica: 'Use os botões da barra de formatação na ordem: Negrito → Fundo Verde → Texto Branco → Moeda',
        tarefas: [
          {id:'negrito',    label:'N Negrito',      acao:'negrito'},
          {id:'fundoverde', label:'🟩 Fundo Verde',  acao:'fundo'},
          {id:'textobranc', label:'⬜ Texto Branco', acao:'texto'},
          {id:'moeda',      label:'💰 Moeda (R$)',   acao:'moeda'}
        ],
        explicacao: 'Formatação profissional: cabeçalhos em negrito com fundo colorido melhoram a leitura. Formato moeda deixa os números mais claros e padronizados.'
      }
    },
    {
      titulo: 'Formatação: Relatório de notas',
      descricao: 'Formate um boletim escolar com negrito e porcentagem',
      nivel: 'fundamentos', trilha: 'geral', ordem: 160,
      tipo: 'formatacao_celula', xpRecompensa: 15,
      conteudo: {
        instrucao: 'Formate o relatório de notas: aplique (1) Negrito no cabeçalho, (2) Fundo Verde, (3) Texto Branco e formate a coluna de aproveitamento como (4) Porcentagem.',
        dica: 'Negrito primeiro, depois fundo e texto, finalmente o formato numérico!',
        tarefas: [
          {id:'negrito',    label:'N Negrito',        acao:'negrito'},
          {id:'fundoverde', label:'🟩 Fundo Verde',    acao:'fundo'},
          {id:'textobranc', label:'⬜ Texto Branco',   acao:'texto'},
          {id:'porcentagem',label:'% Porcentagem',     acao:'porcentagem'}
        ],
        explicacao: 'Formatação adequada transforma dados brutos em informação visual clara — o leitor identifica imediatamente o que é cabeçalho e o que são dados.'
      }
    },
    {
      titulo: 'Formatação: Dashboard financeiro',
      descricao: 'Destaque valores negativos e formate como moeda',
      nivel: 'basico', trilha: 'geral', ordem: 161,
      tipo: 'formatacao_celula', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Prepare o relatório financeiro: (1) Negrito no cabeçalho, (2) Fundo Verde, (3) Texto Branco e formate os valores monetários como (4) Moeda (R$).',
        dica: 'Em relatórios financeiros o formato moeda é essencial para clareza e profissionalismo!',
        tarefas: [
          {id:'negrito',    label:'N Negrito',      acao:'negrito'},
          {id:'fundoverde', label:'🟩 Fundo Verde',  acao:'fundo'},
          {id:'textobranc', label:'⬜ Texto Branco', acao:'texto'},
          {id:'moeda',      label:'💰 Moeda (R$)',   acao:'moeda'}
        ],
        explicacao: 'Relatórios financeiros exigem: cabeçalho visual claro + valores sempre formatados como moeda. Isso elimina ambiguidades e transmite profissionalismo.'
      }
    },
    {
      titulo: 'Formatação: Tabela de desempenho',
      descricao: 'Formate uma tabela de KPIs com negrito e porcentagem',
      nivel: 'basico', trilha: 'geral', ordem: 162,
      tipo: 'formatacao_celula', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Formate a tabela de KPIs: aplique (1) Negrito, (2) Fundo Verde e (3) Texto Branco no cabeçalho. Depois formate os indicadores como (4) Porcentagem.',
        dica: 'KPIs em porcentagem são mais fáceis de comparar com metas — sempre formate assim!',
        tarefas: [
          {id:'negrito',    label:'N Negrito',        acao:'negrito'},
          {id:'fundoverde', label:'🟩 Fundo Verde',    acao:'fundo'},
          {id:'textobranc', label:'⬜ Texto Branco',   acao:'texto'},
          {id:'porcentagem',label:'% Porcentagem',     acao:'porcentagem'}
        ],
        explicacao: 'Tabelas de KPI bem formatadas comunicam resultados instantaneamente — cabeçalho destacado + valores em porcentagem é o padrão em dashboards executivos.'
      }
    },

    // ─── TIPO: ORDENAR E FILTRAR (163-166) ────────────────────
    {
      titulo: 'Ordenar: Ranking de produtos',
      descricao: 'Ordene do maior para o menor e filtre por departamento',
      nivel: 'basico', trilha: 'geral', ordem: 163,
      tipo: 'ordenar_filtrar', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Clique na coluna "Vendas" para ordenar os produtos do MAIOR para o MENOR. Depois filtre para mostrar apenas os produtos de "Eletrônicos".',
        dica: 'Clique no cabeçalho "Vendas ↕" para ordenar. Depois use o filtro de Departamento!',
        produtos: [
          {nome:'Notebook Pro',       depto:'Eletrônicos', vendas:89500},
          {nome:'Cadeira Gamer',      depto:'Móveis',      vendas:34200},
          {nome:'Smartphone X',       depto:'Eletrônicos', vendas:127800},
          {nome:'Mesa de Escritório', depto:'Móveis',      vendas:22100},
          {nome:'Tablet Ultra',       depto:'Eletrônicos', vendas:56300},
          {nome:'Fone Bluetooth',     depto:'Eletrônicos', vendas:18700}
        ],
        filtros: ['Todos','Eletrônicos','Móveis'],
        filtroCorreto: 'Eletrônicos',
        tarefas: ['ordenado','filtrado'],
        explicacao: 'Ordenar + Filtrar é a combinação mais usada no Excel para análises rápidas: classifique para ver o ranking, filtre para focar no segmento de interesse.'
      }
    },
    {
      titulo: 'Ordenar: Top funcionários por salário',
      descricao: 'Classifique funcionários do maior para o menor salário',
      nivel: 'basico', trilha: 'geral', ordem: 164,
      tipo: 'ordenar_filtrar', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Clique na coluna "Salário" para ordenar os funcionários do MAIOR para o MENOR. Depois filtre para mostrar apenas o departamento "TI".',
        dica: 'Clique no cabeçalho "Salário ↕" para ordenar. Depois filtre por "TI"!',
        produtos: [
          {nome:'Carlos Lima',    depto:'TI',      vendas:12000},
          {nome:'Ana Souza',      depto:'RH',      vendas:7500},
          {nome:'Ricardo Neves',  depto:'TI',      vendas:9800},
          {nome:'Fernanda Dias',  depto:'Vendas',  vendas:8200},
          {nome:'Marcos Porto',   depto:'TI',      vendas:15000},
          {nome:'Juliana Costa',  depto:'RH',      vendas:6900}
        ],
        filtros: ['Todos','TI','RH','Vendas'],
        filtroCorreto: 'TI',
        tarefas: ['ordenado','filtrado'],
        explicacao: 'Ordenar salários revela a faixa salarial do time. Filtrar por departamento permite análise focada — técnica essencial em gestão de RH com Excel.'
      }
    },
    {
      titulo: 'Ordenar: Melhores vendas regionais',
      descricao: 'Encontre as regiões com melhor desempenho',
      nivel: 'intermediario', trilha: 'geral', ordem: 165,
      tipo: 'ordenar_filtrar', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Ordene as regiões por "Vendas" do MAIOR para o MENOR para identificar o top performer. Depois filtre para ver apenas as regiões "Sul".',
        dica: 'Ordene pela coluna Vendas (maior→menor). Depois filtre pelo campo Macro-região!',
        produtos: [
          {nome:'São Paulo Interior', depto:'Sudeste', vendas:285000},
          {nome:'Porto Alegre',       depto:'Sul',     vendas:178000},
          {nome:'Rio de Janeiro',     depto:'Sudeste', vendas:231000},
          {nome:'Curitiba',           depto:'Sul',     vendas:192000},
          {nome:'Belo Horizonte',     depto:'Sudeste', vendas:167000},
          {nome:'Florianópolis',      depto:'Sul',     vendas:143000}
        ],
        filtros: ['Todos','Sudeste','Sul'],
        filtroCorreto: 'Sul',
        tarefas: ['ordenado','filtrado'],
        explicacao: 'Ordenar por vendas + filtrar por região permite análise regional focada — ver o ranking dentro de cada macro-região para decisões de alocação de recursos.'
      }
    },
    {
      titulo: 'Ordenar: Projetos por prazo',
      descricao: 'Priorize projetos com maior valor e filtre por status',
      nivel: 'intermediario', trilha: 'geral', ordem: 166,
      tipo: 'ordenar_filtrar', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Ordene os projetos por "Valor" do MAIOR para o MENOR. Depois filtre para mostrar apenas os projetos "Em Andamento".',
        dica: 'Ordene pela coluna Valor (maior→menor). Depois filtre pelo Status!',
        produtos: [
          {nome:'CRM Sistema',     depto:'Em Andamento', vendas:450000},
          {nome:'App Mobile',      depto:'Concluído',    vendas:280000},
          {nome:'Website Redesign',depto:'Em Andamento', vendas:120000},
          {nome:'BI Dashboard',    depto:'Cancelado',    vendas:95000},
          {nome:'ERP Migração',    depto:'Em Andamento', vendas:780000},
          {nome:'API Integração',  depto:'Concluído',    vendas:165000}
        ],
        filtros: ['Todos','Em Andamento','Concluído','Cancelado'],
        filtroCorreto: 'Em Andamento',
        tarefas: ['ordenado','filtrado'],
        explicacao: 'Ordenar por valor + filtrar por status "Em Andamento" mostra os projetos ativos priorizados por impacto financeiro — visão essencial para gestão de portfólio.'
      }
    },

    // ─── TIPO: VALIDAÇÃO DE DADOS (167-170) ───────────────────
    {
      titulo: 'Validação: Status de tarefas',
      descricao: 'Crie lista suspensa para controlar status de projetos',
      nivel: 'basico', trilha: 'geral', ordem: 167,
      tipo: 'validacao_dados', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Configure a validação de dados para a coluna "Status": adicione os itens "Em Andamento", "Concluído" e "Cancelado" para criar uma lista suspensa.',
        dica: 'Adicione exatamente 3 itens: "Em Andamento", "Concluído" e "Cancelado"',
        itensCertos: ['Em Andamento','Concluído','Cancelado'],
        projetos: ['Website Redesign','App Mobile','CRM Sistema','Relatório Anual','Dashboard BI'],
        colunaLabel: 'Status',
        explicacao: 'Validação de dados com lista garante consistência — apenas valores válidos podem ser inseridos, evitando erros de digitação que quebram filtros e relatórios.'
      }
    },
    {
      titulo: 'Validação: Nível de prioridade',
      descricao: 'Padronize prioridades com uma lista suspensa',
      nivel: 'basico', trilha: 'geral', ordem: 168,
      tipo: 'validacao_dados', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Crie uma lista suspensa para a coluna "Prioridade" com os itens: "Alta", "Média" e "Baixa".',
        dica: 'Adicione: "Alta", "Média" e "Baixa" — exatamente essa sequência!',
        itensCertos: ['Alta','Média','Baixa'],
        projetos: ['Reunião com cliente','Relatório mensal','Revisão de contrato','Treinamento equipe','Atualização sistema'],
        colunaLabel: 'Prioridade',
        explicacao: 'Padronizar prioridades com validação evita variações como "alta prioridade", "ALTA", "urgente" — mantendo dados limpos e filtráveis.'
      }
    },
    {
      titulo: 'Validação: Departamentos da empresa',
      descricao: 'Controle os departamentos aceitos num formulário',
      nivel: 'intermediario', trilha: 'geral', ordem: 169,
      tipo: 'validacao_dados', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Crie uma lista suspensa para "Departamento" com as opções: "Comercial", "Financeiro" e "Operações".',
        dica: 'Adicione os 3 departamentos: "Comercial", "Financeiro" e "Operações"',
        itensCertos: ['Comercial','Financeiro','Operações'],
        projetos: ['João Silva','Maria Costa','Pedro Santos','Ana Lima','Carlos Souza'],
        colunaLabel: 'Departamento',
        explicacao: 'Validação de departamentos é essencial em formulários de RH e controles internos — evita que registros fiquem com nomes diferentes para o mesmo setor.'
      }
    },
    {
      titulo: 'Validação: Resultado da negociação',
      descricao: 'Padronize resultados de vendas com lista controlada',
      nivel: 'intermediario', trilha: 'geral', ordem: 170,
      tipo: 'validacao_dados', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Crie uma lista suspensa para a coluna "Resultado" com as opções: "Ganho", "Perdido" e "Em negociação".',
        dica: 'Adicione: "Ganho", "Perdido" e "Em negociação" — padroniza o CRM!',
        itensCertos: ['Ganho','Perdido','Em negociação'],
        projetos: ['Proposta Empresa A','Proposta Empresa B','Proposta Empresa C','Proposta Empresa D','Proposta Empresa E'],
        colunaLabel: 'Resultado',
        explicacao: 'CRMs em Excel dependem de validação rigorosa para funcionar — resultados padronizados permitem CONT.SE, tabelas dinâmicas e relatórios de conversão precisos.'
      }
    }

  ]; // fim licoes[]

  // ═══════════════════════════════════════════════════════
  // INSERIR TODAS AS LIÇÕES
  // ═══════════════════════════════════════════════════════
  console.log(`⏳ Iniciando seed de ${licoes.length} lições...`);

  let inseridas = 0;
  for (const licao of licoes) {
    await (prisma as any).licao.create({ data: licao });
    inseridas++;
    if (inseridas % 10 === 0) {
      console.log(`  ✅ ${inseridas}/${licoes.length} lições inseridas...`);
    }
  }

  console.log(`\n🎉 Seed completo! ${inseridas} lições criadas com sucesso.`);
  console.log('\n📊 Distribuição:');
  console.log('  Trilha Geral:      80 lições (fundamentos→especialista)');
  console.log('  Trilhas Pro:       70 lições (7 trilhas × 10 cada)');
  console.log('  Interações Visuais: 20 lições (5 tipos × 4 cada)');
  console.log('  TOTAL:            170 lições\n');
  console.log('🎨 Tipos de interação visual:');
  console.log('  fc_interativo    → 4 lições (151-154)');
  console.log('  grafico          → 4 lições (155-158)');
  console.log('  formatacao_celula→ 4 lições (159-162)');
  console.log('  ordenar_filtrar  → 4 lições (163-166)');
  console.log('  validacao_dados  → 4 lições (167-170)');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
