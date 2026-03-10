import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.licao.deleteMany();

  const licoes = [

    // ════════════════════════════════════════
    // TRILHA GERAL — FUNDAMENTOS (lições 1-16)
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
          {ref:'A1',valor:'Produto A',editavel:false},{ref:'B1',valor:'100',editavel:false},
          {ref:'A2',valor:'Produto B',editavel:false},{ref:'B2',valor:'200',editavel:false},
          {ref:'A3',valor:'Produto C',editavel:false},{ref:'B3',valor:'300',editavel:false},
          {ref:'A4',valor:'TOTAL',editavel:false},
          {ref:'B4',valor:'',editavel:true,esperado:'=SOMA(B1:B3)',alternativas_aceitas:['=SOMA(B1:B3)','=SUM(B1:B3)','=B1+B2+B3','=soma(b1:b3)']}
        ],
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
          {ref:'A1',valor:'Aluno 1',editavel:false},{ref:'B1',valor:'7',editavel:false},
          {ref:'A2',valor:'Aluno 2',editavel:false},{ref:'B2',valor:'8',editavel:false},
          {ref:'A3',valor:'Aluno 3',editavel:false},{ref:'B3',valor:'6',editavel:false},
          {ref:'A4',valor:'Aluno 4',editavel:false},{ref:'B4',valor:'9',editavel:false},
          {ref:'A5',valor:'Aluno 5',editavel:false},{ref:'B5',valor:'10',editavel:false},
          {ref:'A6',valor:'MÉDIA',editavel:false},
          {ref:'B6',valor:'',editavel:true,esperado:'=MÉDIA(B1:B5)',alternativas_aceitas:['=MÉDIA(B1:B5)','=MEDIA(B1:B5)','=AVERAGE(B1:B5)','=média(b1:b5)']}
        ],
        explicacao: '=MÉDIA(B1:B5) calcula a média aritmética: (7+8+6+9+10)/5 = 8.'
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
        explicacao: 'Colar Especial > Valores (Ctrl+Shift+V) cola apenas o resultado da fórmula, sem a fórmula em si.'
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
          {ref:'A1',valor:'Item 1',editavel:false},{ref:'B1',valor:'10',editavel:false},
          {ref:'A2',valor:'Item 2',editavel:false},{ref:'B2',valor:'',editavel:false},
          {ref:'A3',valor:'Item 3',editavel:false},{ref:'B3',valor:'30',editavel:false},
          {ref:'A4',valor:'Item 4',editavel:false},{ref:'B4',valor:'N/A',editavel:false},
          {ref:'A5',valor:'Item 5',editavel:false},{ref:'B5',valor:'50',editavel:false},
          {ref:'A6',valor:'Item 6',editavel:false},{ref:'B6',valor:'60',editavel:false},
          {ref:'A7',valor:'CONTAGEM',editavel:false},
          {ref:'B7',valor:'',editavel:true,esperado:'=CONT.NÚM(B1:B6)',alternativas_aceitas:['=CONT.NÚM(B1:B6)','=CONT.NUM(B1:B6)','=COUNT(B1:B6)']}
        ],
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
    // TRILHA GERAL — BÁSICO (lições 17-32)
    // ════════════════════════════════════════
    {
      titulo: 'Função SE',
      descricao: 'Tome decisões automáticas com a função SE',
      nivel: 'basico', trilha: 'geral', ordem: 17,
      tipo: 'excel_simulado', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Na célula C1, use a função SE para mostrar "Aprovado" se B1 >= 7, ou "Reprovado" se for menor.',
        celulas: [
          {ref:'A1',valor:'João',editavel:false},{ref:'B1',valor:'8',editavel:false},
          {ref:'C1',valor:'',editavel:true,esperado:'=SE(B1>=7,"Aprovado","Reprovado")',alternativas_aceitas:['=SE(B1>=7,"Aprovado","Reprovado")','=IF(B1>=7,"Aprovado","Reprovado")','=se(b1>=7,"Aprovado","Reprovado")']}
        ],
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
          {ref:'A1',valor:'SP',editavel:false},{ref:'A2',valor:'RJ',editavel:false},
          {ref:'A3',valor:'SP',editavel:false},{ref:'A4',valor:'MG',editavel:false},
          {ref:'A5',valor:'SP',editavel:false},{ref:'A6',valor:'RJ',editavel:false},
          {ref:'A7',valor:'Total SP',editavel:false},
          {ref:'B7',valor:'',editavel:true,esperado:'=CONT.SE(A1:A6,"SP")',alternativas_aceitas:['=CONT.SE(A1:A6,"SP")','=COUNTIF(A1:A6,"SP")','=CONT.SE(A1:A6,\"SP\")']}
        ],
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
          {ref:'A1',valor:'SP',editavel:false},{ref:'B1',valor:'Empresa A',editavel:false},{ref:'C1',valor:'5000',editavel:false},
          {ref:'A2',valor:'RJ',editavel:false},{ref:'B2',valor:'Empresa B',editavel:false},{ref:'C2',valor:'3000',editavel:false},
          {ref:'A3',valor:'SP',editavel:false},{ref:'B3',valor:'Empresa C',editavel:false},{ref:'C3',valor:'7000',editavel:false},
          {ref:'A4',valor:'MG',editavel:false},{ref:'B4',valor:'Empresa D',editavel:false},{ref:'C4',valor:'2000',editavel:false},
          {ref:'A5',valor:'SP',editavel:false},{ref:'B5',valor:'Empresa E',editavel:false},{ref:'C5',valor:'4000',editavel:false},
          {ref:'A6',valor:'RJ',editavel:false},{ref:'B6',valor:'Empresa F',editavel:false},{ref:'C6',valor:'6000',editavel:false},
          {ref:'A7',valor:'Total SP',editavel:false},
          {ref:'C7',valor:'',editavel:true,esperado:'=SOMASE(A1:A6,"SP",C1:C6)',alternativas_aceitas:['=SOMASE(A1:A6,"SP",C1:C6)','=SUMIF(A1:A6,"SP",C1:C6)']}
        ],
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
          {ref:'A1',valor:'João',editavel:false},{ref:'B1',valor:'Silva',editavel:false},
          {ref:'C1',valor:'',editavel:true,esperado:'=A1&" "&B1',alternativas_aceitas:['=A1&" "&B1','=CONCATENAR(A1," ",B1)','=CONCAT(A1," ",B1)','=TEXTJOIN(" ",TRUE,A1,B1)']}
        ],
        explicacao: '=A1&" "&B1 une "João" + " " + "Silva" = "João Silva". O & é o operador de concatenação.'
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
        explicacao: '=MÊS(A1) retorna o número do mês (1 a 12) de uma data. Também existem =DIA() e =ANO().'
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
          {ref:'A1',valor:'3.14159',editavel:false},
          {ref:'B1',valor:'',editavel:true,esperado:'=ARRED(A1,2)',alternativas_aceitas:['=ARRED(A1,2)','=ROUND(A1,2)','=arred(a1,2)']}
        ],
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
        explicacao: 'A sintaxe é NomeDaPlanilha!CélulaReferenciada. Exemplo: =Janeiro!A1 busca A1 da planilha Janeiro.'
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
        explicacao: '=HOJE() retorna apenas a data atual. =AGORA() retorna a data e hora atual. Ambas se atualizam ao recalcular.'
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
    // TRILHA GERAL — INTERMEDIÁRIO (lições 33-48)
    // ════════════════════════════════════════════
    {
      titulo: 'PROCV avançado',
      descricao: 'Use PROCV com correspondência aproximada e exata',
      nivel: 'intermediario', trilha: 'geral', ordem: 33,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula E2, use PROCV para buscar o preço do produto digitado em D2 na tabela A1:B5.',
        celulas: [
          {ref:'A1',valor:'Produto',editavel:false},{ref:'B1',valor:'Preço',editavel:false},
          {ref:'A2',valor:'Caneta',editavel:false},{ref:'B2',valor:'2.50',editavel:false},
          {ref:'A3',valor:'Caderno',editavel:false},{ref:'B3',valor:'15.00',editavel:false},
          {ref:'A4',valor:'Régua',editavel:false},{ref:'B4',valor:'3.00',editavel:false},
          {ref:'A5',valor:'Borracha',editavel:false},{ref:'B5',valor:'1.50',editavel:false},
          {ref:'D2',valor:'Caderno',editavel:false},
          {ref:'E2',valor:'',editavel:true,esperado:'=PROCV(D2,A2:B5,2,0)',alternativas_aceitas:['=PROCV(D2,A2:B5,2,0)','=VLOOKUP(D2,A2:B5,2,0)','=PROCV(D2,A1:B5,2,0)']}
        ],
        explicacao: '=PROCV(D2,A2:B5,2,0) busca "Caderno" na primeira coluna de A2:B5 e retorna o valor da 2ª coluna = 15.00.'
      }
    },
    {
      titulo: 'Tabela Dinâmica',
      descricao: 'Resuma grandes volumes de dados automaticamente',
      nivel: 'intermediario', trilha: 'geral', ordem: 34,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Uma Tabela Dinâmica serve principalmente para:',
        alternativas: ['Formatar dados em formato de tabela', 'Resumir, analisar e explorar grandes volumes de dados', 'Criar gráficos dinâmicos automaticamente', 'Conectar com banco de dados externo'],
        correta: 1,
        explicacao: 'A Tabela Dinâmica agrupa, totaliza e analisa dados de forma interativa sem alterar os dados originais.'
      }
    },
    {
      titulo: 'Fórmula matricial',
      descricao: 'Use fórmulas que processam múltiplos valores',
      nivel: 'intermediario', trilha: 'geral', ordem: 35,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Como inserir uma fórmula matricial no Excel tradicional?',
        alternativas: ['Pressionar Enter normalmente', 'Pressionar Ctrl+Shift+Enter', 'Pressionar Alt+Enter', 'Clicar em Fórmulas > Matricial'],
        correta: 1,
        explicacao: 'Fórmulas matriciais são inseridas com Ctrl+Shift+Enter e aparecem entre chaves {}. No Excel 365, muitas são automáticas.'
      }
    },
    {
      titulo: 'ÍNDICE e CORRESP',
      descricao: 'Uma combinação mais poderosa que PROCV',
      nivel: 'intermediario', trilha: 'geral', ordem: 36,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Qual a vantagem de ÍNDICE+CORRESP sobre PROCV?',
        alternativas: ['É mais fácil de usar', 'Pode buscar à esquerda e não depende da posição da coluna', 'Funciona apenas com números', 'É mais rápido em planilhas pequenas'],
        correta: 1,
        explicacao: 'ÍNDICE+CORRESP pode buscar em qualquer direção (inclusive à esquerda) e não quebra quando colunas são inseridas.'
      }
    },
    {
      titulo: 'Função SEERRO',
      descricao: 'Trate erros em fórmulas elegantemente',
      nivel: 'intermediario', trilha: 'geral', ordem: 37,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula C1, use SEERRO para mostrar "Não encontrado" se o PROCV em B1 retornar erro.',
        celulas: [
          {ref:'A1',valor:'Produto X',editavel:false},{ref:'B1',valor:'=PROCV(A1,D1:E3,2,0)',editavel:false},
          {ref:'D1',valor:'Caneta',editavel:false},{ref:'E1',valor:'2.50',editavel:false},
          {ref:'D2',valor:'Caderno',editavel:false},{ref:'E2',valor:'15.00',editavel:false},
          {ref:'C1',valor:'',editavel:true,esperado:'=SEERRO(B1,"Não encontrado")',alternativas_aceitas:['=SEERRO(B1,"Não encontrado")','=IFERROR(B1,"Não encontrado")','=SEERRO(PROCV(A1,D1:E3,2,0),"Não encontrado")']}
        ],
        explicacao: '=SEERRO(fórmula, valor_se_erro) exibe o segundo argumento se a fórmula retornar qualquer erro.'
      }
    },
    {
      titulo: 'Gráfico dinâmico',
      descricao: 'Crie gráficos vinculados a tabelas dinâmicas',
      nivel: 'intermediario', trilha: 'geral', ordem: 38,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Um Gráfico Dinâmico se diferencia de um gráfico comum porque:',
        alternativas: ['Tem mais tipos de gráfico disponíveis', 'Se atualiza automaticamente quando a Tabela Dinâmica muda', 'Pode ser exportado em mais formatos', 'É mais colorido'],
        correta: 1,
        explicacao: 'O Gráfico Dinâmico está vinculado à Tabela Dinâmica — qualquer filtro ou mudança na tabela reflete automaticamente no gráfico.'
      }
    },
    {
      titulo: 'Formatação condicional avançada',
      descricao: 'Use fórmulas para criar regras de formatação complexas',
      nivel: 'intermediario', trilha: 'geral', ordem: 39,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Para formatar uma linha inteira com base no valor de apenas uma coluna, você deve:',
        alternativas: ['Selecionar apenas a coluna e aplicar regra', 'Selecionar a linha inteira e usar fórmula com $ na coluna de referência', 'Não é possível formatar linhas inteiras', 'Usar uma macro VBA'],
        correta: 1,
        explicacao: 'Selecione toda a linha e use uma fórmula como =$C1="Aprovado" — o $ trava a coluna C para avaliar toda a linha.'
      }
    },
    {
      titulo: 'Função TEXTO',
      descricao: 'Formate números e datas como texto personalizado',
      nivel: 'intermediario', trilha: 'geral', ordem: 40,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula B1, formate o número de A1 como moeda brasileira usando a função TEXTO.',
        celulas: [
          {ref:'A1',valor:'1500.75',editavel:false},
          {ref:'B1',valor:'',editavel:true,esperado:'=TEXTO(A1,"R$ #.##0,00")',alternativas_aceitas:['=TEXTO(A1,"R$ #.##0,00")','=TEXT(A1,"R$ #.##0,00")','=TEXTO(A1,"R$ #,##0.00")']}
        ],
        explicacao: '=TEXTO(A1,"R$ #.##0,00") formata 1500.75 como "R$ 1.500,75". Útil para concatenar números com texto.'
      }
    },
    {
      titulo: 'Power Query introdução',
      descricao: 'Importe e transforme dados externos',
      nivel: 'intermediario', trilha: 'geral', ordem: 41,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'O Power Query serve para:',
        alternativas: ['Criar gráficos avançados', 'Importar, transformar e carregar dados de diversas fontes', 'Escrever macros em linguagem M', 'Conectar planilhas em rede'],
        correta: 1,
        explicacao: 'O Power Query (Obter e Transformar) importa dados de CSV, banco de dados, web e outros, permitindo limpeza e transformação antes de carregar.'
      }
    },
    {
      titulo: 'Funções de texto',
      descricao: 'Manipule strings com ESQUERDA, DIREITA e EXT.TEXTO',
      nivel: 'intermediario', trilha: 'geral', ordem: 42,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula B1, extraia apenas os 3 primeiros caracteres do texto em A1.',
        celulas: [
          {ref:'A1',valor:'BRASIL2024',editavel:false},
          {ref:'B1',valor:'',editavel:true,esperado:'=ESQUERDA(A1,3)',alternativas_aceitas:['=ESQUERDA(A1,3)','=LEFT(A1,3)','=esquerda(a1,3)']}
        ],
        explicacao: '=ESQUERDA(A1,3) extrai os 3 primeiros caracteres de "BRASIL2024" = "BRA".'
      }
    },
    {
      titulo: 'Proteção de planilha',
      descricao: 'Proteja células e planilhas com senha',
      nivel: 'intermediario', trilha: 'geral', ordem: 43,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Para permitir que o usuário edite apenas algumas células numa planilha protegida, você deve:',
        alternativas: ['Proteger todas as células e liberar depois', 'Desbloquear as células editáveis ANTES de ativar a proteção', 'Usar VBA para controlar o acesso', 'Não é possível ter proteção parcial'],
        correta: 1,
        explicacao: 'Por padrão, todas as células são "bloqueadas" mas isso só tem efeito quando a proteção é ativada. Desbloqueie as editáveis antes de proteger.'
      }
    },
    {
      titulo: 'Função DESLOC',
      descricao: 'Crie referências dinâmicas com DESLOC',
      nivel: 'intermediario', trilha: 'geral', ordem: 44,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'A função DESLOC(A1,2,3) retorna o valor da célula:',
        alternativas: ['A1', 'C3', 'D3', 'A3'],
        correta: 2,
        explicacao: 'DESLOC parte de A1, move 2 linhas para baixo (linha 3) e 3 colunas para a direita (coluna D) = célula D3.'
      }
    },
    {
      titulo: 'Consolidar dados',
      descricao: 'Combine dados de múltiplas planilhas',
      nivel: 'intermediario', trilha: 'geral', ordem: 45,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Para somar automaticamente o mesmo intervalo em 12 planilhas de meses, a sintaxe de referência 3D é:',
        alternativas: ['=SOMA(Jan:Dez!A1)', '=SOMA(Jan:Dez!A1:A10)', '=SOMA([Jan:Dez]A1)', '=SOMA(Jan+Dez!A1)'],
        correta: 1,
        explicacao: '=SOMA(Jan:Dez!A1:A10) soma o intervalo A1:A10 de todas as planilhas entre "Jan" e "Dez".'
      }
    },
    {
      titulo: 'Spark lines',
      descricao: 'Crie mini gráficos dentro de células',
      nivel: 'intermediario', trilha: 'geral', ordem: 46,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Sparklines no Excel são:',
        alternativas: ['Gráficos pequenos que cabem dentro de uma célula', 'Animações em gráficos', 'Linhas de tendência em gráficos normais', 'Miniaturas de gráficos para impressão'],
        correta: 0,
        explicacao: 'Sparklines são minigráficos que cabem dentro de uma célula, mostrando tendências de forma compacta e visual.'
      }
    },
    {
      titulo: 'Função SE aninhado',
      descricao: 'Use múltiplos SE para lógica complexa',
      nivel: 'intermediario', trilha: 'geral', ordem: 47,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula C1, classifique a nota de B1: "Ótimo" se >=9, "Bom" se >=7, "Regular" se >=5, senão "Insuficiente".',
        celulas: [
          {ref:'A1',valor:'Aluno',editavel:false},{ref:'B1',valor:'7.5',editavel:false},
          {ref:'C1',valor:'',editavel:true,esperado:'=SE(B1>=9,"Ótimo",SE(B1>=7,"Bom",SE(B1>=5,"Regular","Insuficiente")))',alternativas_aceitas:['=SE(B1>=9,"Ótimo",SE(B1>=7,"Bom",SE(B1>=5,"Regular","Insuficiente")))','=IF(B1>=9,"Ótimo",IF(B1>=7,"Bom",IF(B1>=5,"Regular","Insuficiente")))']}
        ],
        explicacao: 'SEs aninhados avaliam condições em sequência. 7.5 >= 9? Não. >= 7? Sim → "Bom".'
      }
    },
    {
      titulo: 'Auditoria de fórmulas',
      descricao: 'Rastreie dependências e precedentes de fórmulas',
      nivel: 'intermediario', trilha: 'geral', ordem: 48,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'A ferramenta "Rastrear Precedentes" no Excel serve para:',
        alternativas: ['Mostrar quais células alimentam a fórmula atual', 'Mostrar quais células dependem da célula atual', 'Verificar erros de digitação', 'Comparar versões da planilha'],
        correta: 0,
        explicacao: 'Rastrear Precedentes mostra com setas quais células contribuem para o resultado da célula selecionada.'
      }
    },

    // ══════════════════════════════════════════
    // TRILHA GERAL — AVANÇADO (lições 49-64)
    // ══════════════════════════════════════════
    {
      titulo: 'Macros com gravador',
      descricao: 'Grave e execute macros para automatizar tarefas',
      nivel: 'avancado', trilha: 'geral', ordem: 49,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Para gravar uma macro no Excel, você deve ir em:',
        alternativas: ['Inserir > Macro', 'Desenvolvedor > Gravar Macro', 'Exibir > Macros > Gravar', 'Arquivo > Opções > Macro'],
        correta: 1,
        explicacao: 'A guia Desenvolvedor (que precisa ser ativada nas opções) contém o botão Gravar Macro. Também pode usar Exibir > Macros.'
      }
    },
    {
      titulo: 'VBA básico',
      descricao: 'Escreva seu primeiro código VBA',
      nivel: 'avancado', trilha: 'geral', ordem: 50,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'No VBA, qual código exibe uma caixa de mensagem com o texto "Olá"?',
        alternativas: ['Print "Olá"', 'MsgBox "Olá"', 'Display("Olá")', 'Alert "Olá"'],
        correta: 1,
        explicacao: 'MsgBox "Olá" exibe uma caixa de diálogo com o texto especificado. É o equivalente ao alert() do JavaScript.'
      }
    },
    {
      titulo: 'Power Pivot',
      descricao: 'Analise milhões de linhas com Power Pivot',
      nivel: 'avancado', trilha: 'geral', ordem: 51,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Qual a principal vantagem do Power Pivot sobre as Tabelas Dinâmicas normais?',
        alternativas: ['Interface mais bonita', 'Processa milhões de linhas e permite relacionar múltiplas tabelas', 'Funciona sem o Excel', 'Gera relatórios em PDF automaticamente'],
        correta: 1,
        explicacao: 'O Power Pivot usa o mecanismo xVelocity para processar volumes enormes de dados e criar relacionamentos entre tabelas.'
      }
    },
    {
      titulo: 'Fórmulas DAX básicas',
      descricao: 'Use DAX para criar medidas no Power Pivot',
      nivel: 'avancado', trilha: 'geral', ordem: 52,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'No Power Pivot, para criar uma medida de total de vendas, você usaria:',
        alternativas: ['=SOMA(Vendas[Valor])', 'Total := SUM(Vendas[Valor])', '=SUM([Valor])', 'MEASURE Vendas[Total] = SUM(Vendas[Valor])'],
        correta: 1,
        explicacao: 'No DAX, medidas são criadas com a sintaxe: NomeMedida := expressão_DAX. O := é o operador de definição de medida.'
      }
    },
    {
      titulo: 'Funções PROCX e XMATCH',
      descricao: 'As substitutas modernas do PROCV',
      nivel: 'avancado', trilha: 'geral', ordem: 53,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'O PROCX tem vantagem sobre o PROCV porque:',
        alternativas: ['É mais rápido em todas as situações', 'Busca em qualquer direção e retorna múltiplas colunas', 'Funciona em versões antigas do Excel', 'Tem sintaxe mais simples'],
        correta: 1,
        explicacao: 'PROCX busca em qualquer direção, retorna arrays, tem tratamento de erro integrado e não depende da posição da coluna.'
      }
    },
    {
      titulo: 'Solver',
      descricao: 'Otimize problemas complexos com o Solver',
      nivel: 'avancado', trilha: 'geral', ordem: 54,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'O Solver do Excel serve para:',
        alternativas: ['Resolver equações matemáticas simples', 'Encontrar o valor ótimo de uma célula alterando variáveis com restrições', 'Corrigir erros em fórmulas', 'Conectar com planilhas externas'],
        correta: 1,
        explicacao: 'O Solver é uma ferramenta de otimização — encontra o máximo, mínimo ou valor específico de uma célula objetivo, sujeito a restrições.'
      }
    },
    {
      titulo: 'Funções de array dinâmico',
      descricao: 'Use ÚNICO, CLASSIFICAR e FILTRAR',
      nivel: 'avancado', trilha: 'geral', ordem: 55,
      tipo: 'excel_simulado', xpRecompensa: 30,
      conteudo: {
        instrucao: 'Na célula C1, use a função ÚNICO para listar os valores únicos do intervalo A1:A6.',
        celulas: [
          {ref:'A1',valor:'SP',editavel:false},{ref:'A2',valor:'RJ',editavel:false},
          {ref:'A3',valor:'SP',editavel:false},{ref:'A4',valor:'MG',editavel:false},
          {ref:'A5',valor:'RJ',editavel:false},{ref:'A6',valor:'SP',editavel:false},
          {ref:'C1',valor:'',editavel:true,esperado:'=ÚNICO(A1:A6)',alternativas_aceitas:['=ÚNICO(A1:A6)','=UNIQUE(A1:A6)','=único(a1:a6)']}
        ],
        explicacao: '=ÚNICO(A1:A6) retorna SP, RJ e MG — os valores sem repetição, derramando pelas células abaixo automaticamente.'
      }
    },
    {
      titulo: 'Análise de cenários',
      descricao: 'Compare diferentes situações com Gerenciador de Cenários',
      nivel: 'avancado', trilha: 'geral', ordem: 56,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'O Gerenciador de Cenários serve para:',
        alternativas: ['Salvar diferentes versões de uma planilha', 'Comparar múltiplos conjuntos de valores de entrada e seus resultados', 'Simular erros na planilha', 'Criar relatórios automáticos'],
        correta: 1,
        explicacao: 'O Gerenciador de Cenários salva conjuntos de valores de entrada (otimista, pessimista, realista) e permite comparar os resultados.'
      }
    },
    {
      titulo: 'Tabela de dados',
      descricao: 'Analise sensibilidade com tabelas de dados',
      nivel: 'avancado', trilha: 'geral', ordem: 57,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Uma tabela de dados de duas variáveis permite:',
        alternativas: ['Filtrar dados por dois critérios', 'Ver como dois inputs diferentes afetam um resultado', 'Criar dois gráficos simultaneamente', 'Importar dados de duas fontes'],
        correta: 1,
        explicacao: 'A tabela de dados calcula automaticamente como diferentes combinações de dois valores de entrada afetam uma fórmula de resultado.'
      }
    },
    {
      titulo: 'Funções financeiras',
      descricao: 'Calcule VPL, TIR e parcelas de empréstimos',
      nivel: 'avancado', trilha: 'geral', ordem: 58,
      tipo: 'excel_simulado', xpRecompensa: 30,
      conteudo: {
        instrucao: 'Na célula B5, calcule a parcela mensal de um empréstimo: taxa em B1, períodos em B2, valor presente em B3. Use a função PGTO.',
        celulas: [
          {ref:'A1',valor:'Taxa mensal',editavel:false},{ref:'B1',valor:'0.01',editavel:false},
          {ref:'A2',valor:'Períodos',editavel:false},{ref:'B2',valor:'12',editavel:false},
          {ref:'A3',valor:'Valor',editavel:false},{ref:'B3',valor:'10000',editavel:false},
          {ref:'A5',valor:'Parcela',editavel:false},
          {ref:'B5',valor:'',editavel:true,esperado:'=PGTO(B1,B2,B3)',alternativas_aceitas:['=PGTO(B1,B2,B3)','=PMT(B1,B2,B3)','=-PGTO(B1,B2,-B3)']}
        ],
        explicacao: '=PGTO(taxa,nper,vp) calcula a parcela. Com 1% ao mês, 12 meses e R$10.000, a parcela é aproximadamente R$888,49.'
      }
    },
    {
      titulo: 'VBA com loops',
      descricao: 'Automatize tarefas repetitivas com For...Next',
      nivel: 'avancado', trilha: 'geral', ordem: 59,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Qual código VBA preenche as células A1 até A10 com os números 1 a 10?',
        alternativas: [
          'For i = 1 To 10: Cells(i, 1) = i: Next i',
          'For i = 1 To 10: Range("A" & i) = i: Next',
          'Ambas as alternativas estão corretas',
          'Nenhuma das alternativas'
        ],
        correta: 2,
        explicacao: 'Ambas funcionam: Cells(linha, coluna) e Range("A" & i) são formas equivalentes de referenciar células em VBA.'
      }
    },
    {
      titulo: 'Conexão com banco de dados',
      descricao: 'Importe dados de SQL Server e Access',
      nivel: 'avancado', trilha: 'geral', ordem: 60,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Para conectar o Excel a um banco de dados SQL Server, você usa:',
        alternativas: ['Inserir > Tabela > SQL', 'Dados > Obter Dados > Do Banco de Dados', 'Arquivo > Importar > SQL', 'Desenvolvedor > Conexões'],
        correta: 1,
        explicacao: 'Dados > Obter Dados > Do Banco de Dados permite conectar com SQL Server, Access, Oracle e outros via Power Query.'
      }
    },
    {
      titulo: 'Dashboard profissional',
      descricao: 'Construa dashboards interativos com segmentações',
      nivel: 'avancado', trilha: 'geral', ordem: 61,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Segmentações de dados (Slicers) em um dashboard servem para:',
        alternativas: ['Dividir a tela em painéis', 'Filtrar Tabelas Dinâmicas e gráficos interativamente com um clique', 'Separar dados em abas diferentes', 'Criar menus suspensos'],
        correta: 1,
        explicacao: 'Slicers são botões visuais que filtram Tabelas Dinâmicas e gráficos conectados com um clique, tornando dashboards interativos.'
      }
    },
    {
      titulo: 'Funções de informação',
      descricao: 'Use ÉCÉL.VAZIA, ÉNÚM, ÉTEXTO para validar dados',
      nivel: 'avancado', trilha: 'geral', ordem: 62,
      tipo: 'excel_simulado', xpRecompensa: 30,
      conteudo: {
        instrucao: 'Na célula B1, verifique se A1 contém um número usando a função ÉNÚM.',
        celulas: [
          {ref:'A1',valor:'42',editavel:false},
          {ref:'B1',valor:'',editavel:true,esperado:'=ÉNÚM(A1)',alternativas_aceitas:['=ÉNÚM(A1)','=ISNUMBER(A1)','=ÉNUM(A1)']}
        ],
        explicacao: '=ÉNÚM(A1) retorna VERDADEIRO se A1 contém um número, FALSO caso contrário. Útil para validação de dados.'
      }
    },
    {
      titulo: 'Macro com InputBox',
      descricao: 'Interaja com o usuário via InputBox no VBA',
      nivel: 'avancado', trilha: 'geral', ordem: 63,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'No VBA, qual código solicita um nome ao usuário e armazena na variável "nome"?',
        alternativas: ['nome = MsgBox("Digite seu nome")', 'nome = InputBox("Digite seu nome")', 'nome = Input("Digite seu nome")', 'InputBox("Digite seu nome", nome)'],
        correta: 1,
        explicacao: 'InputBox() exibe uma caixa de diálogo onde o usuário digita um valor, que é retornado e armazenado na variável.'
      }
    },
    {
      titulo: 'Otimização com Atingir Meta',
      descricao: 'Descubra o input necessário para um resultado desejado',
      nivel: 'avancado', trilha: 'geral', ordem: 64,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'O recurso "Atingir Meta" do Excel serve para:',
        alternativas: ['Definir metas de vendas automaticamente', 'Encontrar o valor de entrada que produz um resultado específico', 'Comparar resultados com metas pré-definidas', 'Criar gráficos de acompanhamento de metas'],
        correta: 1,
        explicacao: 'Atingir Meta (Dados > Teste de Hipóteses) descobre qual valor de entrada é necessário para que uma fórmula atinja o resultado desejado.'
      }
    },

    // ══════════════════════════════════════════════
    // TRILHA GERAL — ESPECIALISTA (lições 65-80)
    // ══════════════════════════════════════════════
    {
      titulo: 'VBA Orientado a Objetos',
      descricao: 'Use Classes e objetos no VBA',
      nivel: 'especialista', trilha: 'geral', ordem: 65,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      conteudo: {
        pergunta: 'No VBA, para criar uma classe personalizada, você deve inserir:',
        alternativas: ['Um módulo padrão', 'Um módulo de classe', 'Um UserForm', 'Um módulo ThisWorkbook'],
        correta: 1,
        explicacao: 'Módulos de classe (Class Module) permitem criar objetos personalizados com propriedades e métodos no VBA.'
      }
    },
    {
      titulo: 'Power Query M avançado',
      descricao: 'Escreva código M para transformações complexas',
      nivel: 'especialista', trilha: 'geral', ordem: 66,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      conteudo: {
        pergunta: 'No Power Query, a linguagem usada internamente é:',
        alternativas: ['DAX', 'M (Power Query Formula Language)', 'SQL', 'Python'],
        correta: 1,
        explicacao: 'O Power Query usa a linguagem M internamente. Cada passo aplicado gera código M que pode ser editado manualmente.'
      }
    },
    {
      titulo: 'DAX avançado — CALCULATE',
      descricao: 'Domine a função mais poderosa do DAX',
      nivel: 'especialista', trilha: 'geral', ordem: 67,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      conteudo: {
        pergunta: 'No DAX, CALCULATE(SUM(Vendas[Valor]), Vendas[Região]="SP") retorna:',
        alternativas: ['A soma de todas as vendas', 'A soma das vendas apenas da região SP', 'A contagem de vendas de SP', 'Um erro'],
        correta: 1,
        explicacao: 'CALCULATE modifica o contexto de filtro — aqui soma Vendas[Valor] apenas onde Região = "SP".'
      }
    },
    {
      titulo: 'Modelagem de dados',
      descricao: 'Crie relacionamentos entre tabelas no Power Pivot',
      nivel: 'especialista', trilha: 'geral', ordem: 68,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      conteudo: {
        pergunta: 'No modelo estrela (Star Schema), a tabela fato:',
        alternativas: ['Contém descrições e atributos', 'Contém métricas numéricas e chaves estrangeiras das dimensões', 'É sempre a maior tabela em colunas', 'Fica no centro apenas por organização visual'],
        correta: 1,
        explicacao: 'A tabela fato contém as métricas (valores, quantidades) e as chaves que se relacionam com as tabelas dimensão (data, produto, cliente).'
      }
    },
    {
      titulo: 'Integração Excel + Python',
      descricao: 'Execute scripts Python dentro do Excel',
      nivel: 'especialista', trilha: 'geral', ordem: 69,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      conteudo: {
        pergunta: 'O Python no Excel (Microsoft 365) permite:',
        alternativas: ['Substituir completamente o VBA', 'Executar código Python em células para análise avançada de dados', 'Importar apenas arquivos .py', 'Criar macros com sintaxe Python'],
        correta: 1,
        explicacao: 'O Python no Excel (2024+) permite usar bibliotecas como pandas, matplotlib e sklearn diretamente em células, retornando resultados para a planilha.'
      }
    },
    {
      titulo: 'Fórmulas LET e LAMBDA',
      descricao: 'Crie funções personalizadas sem VBA',
      nivel: 'especialista', trilha: 'geral', ordem: 70,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      conteudo: {
        pergunta: 'A função LAMBDA no Excel 365 permite:',
        alternativas: ['Acelerar cálculos pesados', 'Criar funções personalizadas reutilizáveis sem VBA', 'Importar funções de bibliotecas externas', 'Executar fórmulas em paralelo'],
        correta: 1,
        explicacao: 'LAMBDA cria funções personalizadas que podem ser nomeadas e reutilizadas na planilha, eliminando a necessidade de VBA para lógica customizada.'
      }
    },
    {
      titulo: 'Auditoria avançada',
      descricao: 'Encontre e corrija erros complexos em planilhas',
      nivel: 'especialista', trilha: 'geral', ordem: 71,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      conteudo: {
        pergunta: 'O erro #REF! no Excel indica:',
        alternativas: ['Um valor não encontrado', 'Uma referência inválida — célula deletada ou fora do intervalo', 'Divisão por zero', 'Tipo de dado incorreto'],
        correta: 1,
        explicacao: '#REF! ocorre quando uma referência aponta para uma célula que foi deletada ou está fora dos limites da planilha.'
      }
    },
    {
      titulo: 'Automação com Office Scripts',
      descricao: 'Use Office Scripts para automatizar no Excel Online',
      nivel: 'especialista', trilha: 'geral', ordem: 72,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      conteudo: {
        pergunta: 'Office Scripts diferem de macros VBA porque:',
        alternativas: ['São mais lentos', 'Funcionam no Excel Online e podem ser integrados com Power Automate', 'Usam a mesma linguagem do VBA', 'Só funcionam no Windows'],
        correta: 1,
        explicacao: 'Office Scripts usam TypeScript, funcionam no Excel Online e Web, e se integram com Power Automate para automações na nuvem.'
      }
    },
    {
      titulo: 'Segurança e criptografia',
      descricao: 'Proteja dados sensíveis em planilhas',
      nivel: 'especialista', trilha: 'geral', ordem: 73,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      conteudo: {
        pergunta: 'Para criptografar um arquivo Excel com senha, você usa:',
        alternativas: ['Revisão > Proteger Pasta de Trabalho', 'Arquivo > Informações > Proteger Pasta de Trabalho > Criptografar com Senha', 'Desenvolvedor > Segurança', 'Arquivo > Salvar Como > Opções'],
        correta: 1,
        explicacao: 'Arquivo > Informações > Proteger Pasta de Trabalho > Criptografar com Senha usa criptografia AES-256 para proteger o arquivo.'
      }
    },
    {
      titulo: 'APIs externas no VBA',
      descricao: 'Consuma APIs REST diretamente do Excel',
      nivel: 'especialista', trilha: 'geral', ordem: 74,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      conteudo: {
        pergunta: 'Para fazer uma requisição HTTP GET em VBA, você usa:',
        alternativas: ['CreateObject("MSXML2.XMLHTTP")', 'Application.WebRequest()', 'HTTP.Get()', 'Workbook.FetchURL()'],
        correta: 0,
        explicacao: 'MSXML2.XMLHTTP (ou ServerXMLHTTP) é o objeto COM usado em VBA para fazer requisições HTTP e consumir APIs REST.'
      }
    },
    {
      titulo: 'Performance em planilhas grandes',
      descricao: 'Otimize planilhas com milhões de registros',
      nivel: 'especialista', trilha: 'geral', ordem: 75,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      conteudo: {
        pergunta: 'Qual prática NÃO ajuda a melhorar a performance de uma planilha lenta?',
        alternativas: ['Desativar cálculo automático durante atualizações em massa', 'Substituir fórmulas por valores onde possível', 'Usar mais fórmulas INDIRETO e DESLOC', 'Evitar referências a planilhas inteiras como A:A'],
        correta: 2,
        explicacao: 'INDIRETO e DESLOC são voláteis — recalculam toda vez que qualquer célula muda, tornando planilhas mais lentas.'
      }
    },
    {
      titulo: 'UserForms no VBA',
      descricao: 'Crie formulários personalizados com VBA',
      nivel: 'especialista', trilha: 'geral', ordem: 76,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      conteudo: {
        pergunta: 'Para exibir um UserForm chamado "frm_Cadastro" via VBA, o código é:',
        alternativas: ['frm_Cadastro.Open', 'frm_Cadastro.Show', 'Load frm_Cadastro', 'frm_Cadastro.Display'],
        correta: 1,
        explicacao: 'NomeDoForm.Show exibe o formulário. Você pode usar .Show vbModal (padrão) ou .Show vbModeless para não bloquear a planilha.'
      }
    },
    {
      titulo: 'Integração com Power BI',
      descricao: 'Publique dados do Excel no Power BI',
      nivel: 'especialista', trilha: 'geral', ordem: 77,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      conteudo: {
        pergunta: 'A melhor forma de usar dados do Excel como fonte no Power BI é:',
        alternativas: ['Copiar e colar manualmente', 'Conectar via Power Query usando o arquivo .xlsx como fonte', 'Exportar como CSV antes de importar', 'Usar a função EXPORTAR do Excel'],
        correta: 1,
        explicacao: 'Conectar diretamente ao arquivo .xlsx via Power Query cria uma conexão que atualiza automaticamente quando o arquivo Excel muda.'
      }
    },
    {
      titulo: 'Certificação Microsoft Excel',
      descricao: 'Prepare-se para a certificação MOS Expert',
      nivel: 'especialista', trilha: 'geral', ordem: 78,
      tipo: 'multipla_escolha', xpRecompensa: 40,
      conteudo: {
        pergunta: 'A certificação Microsoft Office Specialist (MOS) Expert em Excel valida:',
        alternativas: ['Conhecimento básico de planilhas', 'Domínio avançado com funções complexas, macros e análise de dados', 'Apenas conhecimento em VBA', 'Habilidades em Power BI'],
        correta: 1,
        explicacao: 'A MOS Expert valida habilidades avançadas: funções complexas, tabelas dinâmicas avançadas, macros, Power Query e análise de dados.'
      }
    },
    {
      titulo: 'Projeto final — Dashboard completo',
      descricao: 'Construa um dashboard executivo do zero',
      nivel: 'especialista', trilha: 'geral', ordem: 79,
      tipo: 'multipla_escolha', xpRecompensa: 50,
      conteudo: {
        pergunta: 'Num dashboard executivo profissional, qual elemento NÃO é recomendado?',
        alternativas: ['KPIs com indicadores visuais de desempenho', 'Gráficos com excesso de cores e efeitos 3D', 'Segmentações para filtros interativos', 'Tabelas resumidas com dados principais'],
        correta: 1,
        explicacao: 'Excesso de cores e efeitos 3D poluem o dashboard. Boas práticas: paleta reduzida, gráficos 2D limpos e hierarquia visual clara.'
      }
    },
    {
      titulo: 'Mestre Excel — Desafio final',
      descricao: 'O desafio máximo para o verdadeiro especialista',
      nivel: 'especialista', trilha: 'geral', ordem: 80,
      tipo: 'excel_simulado', xpRecompensa: 100,
      conteudo: {
        instrucao: 'Na célula D2, use PROCX para buscar o salário do funcionário em C2 na tabela A1:B5, retornando "Não encontrado" se não existir.',
        celulas: [
          {ref:'A1',valor:'Funcionário',editavel:false},{ref:'B1',valor:'Salário',editavel:false},
          {ref:'A2',valor:'Ana',editavel:false},{ref:'B2',valor:'5000',editavel:false},
          {ref:'A3',valor:'Bruno',editavel:false},{ref:'B3',valor:'7000',editavel:false},
          {ref:'A4',valor:'Carla',editavel:false},{ref:'B4',valor:'4500',editavel:false},
          {ref:'A5',valor:'Diego',editavel:false},{ref:'B5',valor:'8000',editavel:false},
          {ref:'C2',valor:'Carla',editavel:false},
          {ref:'D2',valor:'',editavel:true,esperado:'=PROCX(C2,A2:A5,B2:B5,"Não encontrado")',alternativas_aceitas:['=PROCX(C2,A2:A5,B2:B5,"Não encontrado")','=XLOOKUP(C2,A2:A5,B2:B5,"Não encontrado")']}
        ],
        explicacao: '=PROCX(valor_procurado, array_procura, array_retorno, se_não_encontrado) — mais simples e poderoso que PROCV.'
      }
    },

    // ══════════════════════════════════
    // TRILHA ANALISTA DE DADOS (81-90)
    // ══════════════════════════════════
    {
      titulo: 'Importando dados CSV',
      descricao: 'Importe e trate dados CSV com Power Query',
      nivel: 'intermediario', trilha: 'analista', ordem: 81,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Ao importar um CSV no Power Query, qual passo é essencial para garantir tipos corretos?',
        alternativas: ['Salvar como .xlsx imediatamente', 'Usar "Detectar Tipo de Dados" ou definir tipos manualmente', 'Ordenar os dados por data', 'Remover todas as colunas de texto'],
        correta: 1,
        explicacao: 'Definir os tipos de dados corretos (texto, número, data) no Power Query evita erros nas análises posteriores.'
      }
    },
    {
      titulo: 'SOMASES com múltiplos critérios',
      descricao: 'Some com mais de uma condição',
      nivel: 'intermediario', trilha: 'analista', ordem: 82,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula F2, some os valores de C1:C6 onde A1:A6="SP" E B1:B6="Online".',
        celulas: [
          {ref:'A1',valor:'SP',editavel:false},{ref:'B1',valor:'Online',editavel:false},{ref:'C1',valor:'1000',editavel:false},
          {ref:'A2',valor:'RJ',editavel:false},{ref:'B2',valor:'Online',editavel:false},{ref:'C2',valor:'800',editavel:false},
          {ref:'A3',valor:'SP',editavel:false},{ref:'B3',valor:'Loja',editavel:false},{ref:'C3',valor:'1200',editavel:false},
          {ref:'A4',valor:'SP',editavel:false},{ref:'B4',valor:'Online',editavel:false},{ref:'C4',valor:'950',editavel:false},
          {ref:'A5',valor:'MG',editavel:false},{ref:'B5',valor:'Online',editavel:false},{ref:'C5',valor:'600',editavel:false},
          {ref:'A6',valor:'SP',editavel:false},{ref:'B6',valor:'Online',editavel:false},{ref:'C6',valor:'1100',editavel:false},
          {ref:'E2',valor:'SP Online',editavel:false},
          {ref:'F2',valor:'',editavel:true,esperado:'=SOMASES(C1:C6,A1:A6,"SP",B1:B6,"Online")',alternativas_aceitas:['=SOMASES(C1:C6,A1:A6,"SP",B1:B6,"Online")','=SUMIFS(C1:C6,A1:A6,"SP",B1:B6,"Online")']}
        ],
        explicacao: 'SOMASES soma C onde A="SP" E B="Online": 1000+950+1100 = 3050.'
      }
    },
    {
      titulo: 'Tabela dinâmica para análise',
      descricao: 'Analise vendas por região e produto',
      nivel: 'intermediario', trilha: 'analista', ordem: 83,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Para mostrar % do total por linha numa Tabela Dinâmica, você usa:',
        alternativas: ['Criar coluna calculada manualmente', 'Configurar "Mostrar Valores Como" > % do Total da Linha', 'Dividir cada valor pelo total com fórmula', 'Inserir campo calculado com fórmula'],
        correta: 1,
        explicacao: 'Clique com botão direito no campo de valor > Mostrar Valores Como > % do Total da Linha. O Excel calcula automaticamente.'
      }
    },
    {
      titulo: 'Gráfico de dispersão',
      descricao: 'Identifique correlações entre variáveis',
      nivel: 'intermediario', trilha: 'analista', ordem: 84,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Um gráfico de dispersão (scatter plot) é ideal para:',
        alternativas: ['Comparar categorias', 'Identificar a correlação entre duas variáveis numéricas', 'Mostrar evolução no tempo', 'Exibir proporções de um todo'],
        correta: 1,
        explicacao: 'O gráfico de dispersão plota pares de valores numéricos, revelando correlações positivas, negativas ou ausência de correlação.'
      }
    },
    {
      titulo: 'Linha de tendência',
      descricao: 'Adicione previsões ao seu gráfico',
      nivel: 'intermediario', trilha: 'analista', ordem: 85,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Para adicionar uma linha de tendência linear a um gráfico, você:',
        alternativas: ['Cria uma nova série de dados manualmente', 'Clica no gráfico > Elementos do Gráfico > Linha de Tendência', 'Usa a fórmula =TENDÊNCIA()', 'Insere uma forma de linha manualmente'],
        correta: 1,
        explicacao: 'Clicando no gráfico e em Elementos do Gráfico (o ícone +), você adiciona linha de tendência com opção de exibir a equação e R².'
      }
    },
    {
      titulo: 'Análise de Pareto',
      descricao: 'Aplique o princípio 80/20 nos seus dados',
      nivel: 'avancado', trilha: 'analista', ordem: 86,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'O princípio de Pareto (80/20) no contexto de análise de dados significa:',
        alternativas: ['80% dos dados estão errados', '80% dos resultados vêm de 20% das causas', 'Você deve analisar 80% dos dados disponíveis', '20% do tempo gera 80% do trabalho analítico'],
        correta: 1,
        explicacao: 'O princípio de Pareto indica que ~80% dos efeitos vêm de ~20% das causas — ex: 20% dos produtos geram 80% das vendas.'
      }
    },
    {
      titulo: 'Regressão linear no Excel',
      descricao: 'Use o Excel para análise de regressão',
      nivel: 'avancado', trilha: 'analista', ordem: 87,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Para executar uma análise de regressão completa no Excel, você usa:',
        alternativas: ['Inserir > Estatística > Regressão', 'Dados > Análise de Dados > Regressão (suplemento Análise de Dados)', 'Fórmulas > Estatística > REGRESS', 'Power Query > Transformar > Regressão'],
        correta: 1,
        explicacao: 'O suplemento Análise de Dados (Dados > Análise de Dados) oferece regressão completa com coeficientes, R², intervalos de confiança e resíduos.'
      }
    },
    {
      titulo: 'Limpeza de dados',
      descricao: 'Trate dados sujos com Power Query',
      nivel: 'avancado', trilha: 'analista', ordem: 88,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Para remover espaços extras no início e fim de textos em uma coluna no Power Query:',
        alternativas: ['Usar ARRUMAR() em cada célula', 'Transformar > Formatar > Cortar', 'Localizar e Substituir espaços', 'Não é possível no Power Query'],
        correta: 1,
        explicacao: 'No Power Query, Transformar > Formatar > Cortar remove espaços iniciais e finais de toda a coluna de uma vez.'
      }
    },
    {
      titulo: 'KPIs e métricas',
      descricao: 'Calcule e visualize indicadores de performance',
      nivel: 'avancado', trilha: 'analista', ordem: 89,
      tipo: 'excel_simulado', xpRecompensa: 30,
      conteudo: {
        instrucao: 'Na célula C1, calcule o crescimento percentual de B1 em relação a A1.',
        celulas: [
          {ref:'A1',valor:'8000',editavel:false},{ref:'B1',valor:'10000',editavel:false},
          {ref:'C1',valor:'',editavel:true,esperado:'=(B1-A1)/A1',alternativas_aceitas:['=(B1-A1)/A1','=(B1/A1)-1','=(B1-A1)/A1*100']}
        ],
        explicacao: '=(B1-A1)/A1 = (10000-8000)/8000 = 0,25 = 25% de crescimento. Formate a célula como Porcentagem para exibir 25%.'
      }
    },
    {
      titulo: 'Projeto Analista — Dashboard de vendas',
      descricao: 'Monte um dashboard completo de análise de vendas',
      nivel: 'avancado', trilha: 'analista', ordem: 90,
      tipo: 'multipla_escolha', xpRecompensa: 50,
      conteudo: {
        pergunta: 'Num dashboard de vendas profissional, qual combinação de elementos é mais eficaz?',
        alternativas: [
          'Tabela com todos os dados brutos',
          'KPIs no topo + gráfico de tendência + ranking de produtos + mapa de calor regional',
          'Apenas gráficos de pizza coloridos',
          'Tabela dinâmica sem formatação especial'
        ],
        correta: 1,
        explicacao: 'Um dashboard eficaz combina: KPIs visíveis (números-chave), tendência temporal, ranking e distribuição geográfica — tudo com design limpo.'
      }
    },

    // ══════════════════════════
    // TRILHA RH (91-100)
    // ══════════════════════════
    {
      titulo: 'Controle de ponto',
      descricao: 'Calcule horas trabalhadas e extras',
      nivel: 'basico', trilha: 'rh', ordem: 91,
      tipo: 'excel_simulado', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Na célula C1, calcule as horas trabalhadas subtraindo a entrada (A1) da saída (B1).',
        celulas: [
          {ref:'A1',valor:'08:00',editavel:false},{ref:'B1',valor:'17:30',editavel:false},
          {ref:'C1',valor:'',editavel:true,esperado:'=B1-A1',alternativas_aceitas:['=B1-A1','=(B1-A1)*24']}
        ],
        explicacao: '=B1-A1 calcula a diferença de tempo: 17:30 - 08:00 = 09:30 (9 horas e 30 minutos). Formate como [h]:mm.'
      }
    },
    {
      titulo: 'Cálculo de salário',
      descricao: 'Calcule salário bruto com horas extras',
      nivel: 'basico', trilha: 'rh', ordem: 92,
      tipo: 'excel_simulado', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Na célula D1, calcule o salário bruto: salário base (A1) + horas extras (B1) × valor hora extra (C1).',
        celulas: [
          {ref:'A1',valor:'3000',editavel:false},{ref:'B1',valor:'10',editavel:false},{ref:'C1',valor:'25',editavel:false},
          {ref:'D1',valor:'',editavel:true,esperado:'=A1+B1*C1',alternativas_aceitas:['=A1+B1*C1','=A1+(B1*C1)']}
        ],
        explicacao: '=A1+B1*C1 = 3000 + (10 × 25) = 3000 + 250 = R$3.250,00 de salário bruto.'
      }
    },
    {
      titulo: 'CONT.SE para headcount',
      descricao: 'Conte funcionários por departamento',
      nivel: 'basico', trilha: 'rh', ordem: 93,
      tipo: 'excel_simulado', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Na célula D2, conte quantos funcionários estão no departamento "TI" (coluna B).',
        celulas: [
          {ref:'A1',valor:'Nome',editavel:false},{ref:'B1',valor:'Depto',editavel:false},
          {ref:'A2',valor:'Ana',editavel:false},{ref:'B2',valor:'TI',editavel:false},
          {ref:'A3',valor:'Bruno',editavel:false},{ref:'B3',valor:'RH',editavel:false},
          {ref:'A4',valor:'Carla',editavel:false},{ref:'B4',valor:'TI',editavel:false},
          {ref:'A5',valor:'Diego',editavel:false},{ref:'B5',valor:'Vendas',editavel:false},
          {ref:'A6',valor:'Eva',editavel:false},{ref:'B6',valor:'TI',editavel:false},
          {ref:'C2',valor:'TI',editavel:false},
          {ref:'D2',valor:'',editavel:true,esperado:'=CONT.SE(B2:B6,"TI")',alternativas_aceitas:['=CONT.SE(B2:B6,"TI")','=COUNTIF(B2:B6,"TI")','=CONT.SE(B1:B6,"TI")']}
        ],
        explicacao: '=CONT.SE(B2:B6,"TI") conta 3 funcionários no departamento TI (Ana, Carla e Eva).'
      }
    },
    {
      titulo: 'Cálculo de férias',
      descricao: 'Calcule o período de férias de cada funcionário',
      nivel: 'intermediario', trilha: 'rh', ordem: 94,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Para calcular quantos dias um funcionário já trabalhou desde a data de admissão, qual fórmula usar?',
        alternativas: ['=HOJE()-A1', '=DIASDA(A1,HOJE())', '=DATEDIF(A1,HOJE(),"d")', '=A1-HOJE()'],
        correta: 0,
        explicacao: '=HOJE()-A1 retorna a diferença em dias entre a data de admissão (A1) e hoje. Formate como número para ver os dias.'
      }
    },
    {
      titulo: 'Avaliação de desempenho',
      descricao: 'Classifique funcionários por nota de performance',
      nivel: 'intermediario', trilha: 'rh', ordem: 95,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula C2, classifique a nota de B2: "Excepcional">=90, "Bom">=70, "Regular">=50, senão "Insatisfatório".',
        celulas: [
          {ref:'A2',valor:'Ana Silva',editavel:false},{ref:'B2',valor:'85',editavel:false},
          {ref:'C2',valor:'',editavel:true,esperado:'=SE(B2>=90,"Excepcional",SE(B2>=70,"Bom",SE(B2>=50,"Regular","Insatisfatório")))',alternativas_aceitas:['=SE(B2>=90,"Excepcional",SE(B2>=70,"Bom",SE(B2>=50,"Regular","Insatisfatório")))','=IF(B2>=90,"Excepcional",IF(B2>=70,"Bom",IF(B2>=50,"Regular","Insatisfatório")))']}
        ],
        explicacao: '85 >= 90? Não. >= 70? Sim → "Bom". Ana Silva recebe classificação "Bom".'
      }
    },
    {
      titulo: 'Folha de pagamento',
      descricao: 'Monte uma folha de pagamento com descontos',
      nivel: 'intermediario', trilha: 'rh', ordem: 96,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Para calcular o INSS de um salário de R$3.000 com alíquota de 9%, a fórmula é:',
        alternativas: ['=A1/9', '=A1*9', '=A1*0,09', '=A1*9/100'],
        correta: 2,
        explicacao: '=A1*0,09 — para converter porcentagem em decimal, divide por 100. R$3.000 × 0,09 = R$270,00 de INSS.'
      }
    },
    {
      titulo: 'Índice de turnover',
      descricao: 'Calcule o turnover de colaboradores',
      nivel: 'avancado', trilha: 'rh', ordem: 97,
      tipo: 'excel_simulado', xpRecompensa: 30,
      conteudo: {
        instrucao: 'Na célula D1, calcule o turnover: (admissões B1 + demissões C1) / 2, dividido pelo headcount inicial A1, em %.',
        celulas: [
          {ref:'A1',valor:'100',editavel:false},{ref:'B1',valor:'8',editavel:false},{ref:'C1',valor:'6',editavel:false},
          {ref:'D1',valor:'',editavel:true,esperado:'=((B1+C1)/2)/A1',alternativas_aceitas:['=((B1+C1)/2)/A1','=(B1+C1)/2/A1']}
        ],
        explicacao: '((8+6)/2)/100 = 7/100 = 0,07 = 7% de turnover. Formate D1 como Porcentagem.'
      }
    },
    {
      titulo: 'Mapa de competências',
      descricao: 'Visualize competências com formatação condicional',
      nivel: 'avancado', trilha: 'rh', ordem: 98,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Para criar um mapa de calor de competências (vermelho=baixo, verde=alto), você usa:',
        alternativas: ['Colorir manualmente cada célula', 'Formatação Condicional > Escala de Cores', 'Inserir > Formas > Retângulos coloridos', 'Gráfico de bolhas'],
        correta: 1,
        explicacao: 'Formatação Condicional > Escala de Cores aplica gradiente de cores automaticamente baseado nos valores — perfeito para mapas de calor.'
      }
    },
    {
      titulo: 'Planejamento de headcount',
      descricao: 'Projete contratações com base em crescimento',
      nivel: 'avancado', trilha: 'rh', ordem: 99,
      tipo: 'excel_simulado', xpRecompensa: 30,
      conteudo: {
        instrucao: 'Na célula B2, calcule o headcount projetado: headcount atual (A1) multiplicado por (1 + taxa de crescimento A2).',
        celulas: [
          {ref:'A1',valor:'200',editavel:false},{ref:'A2',valor:'0.15',editavel:false},
          {ref:'B2',valor:'',editavel:true,esperado:'=A1*(1+A2)',alternativas_aceitas:['=A1*(1+A2)','=A1*1.15']}
        ],
        explicacao: '=A1*(1+A2) = 200×1,15 = 230 funcionários projetados com 15% de crescimento.'
      }
    },
    {
      titulo: 'Projeto RH — Relatório de pessoas',
      descricao: 'Monte um painel completo de gestão de pessoas',
      nivel: 'avancado', trilha: 'rh', ordem: 100,
      tipo: 'multipla_escolha', xpRecompensa: 50,
      conteudo: {
        pergunta: 'Um painel de People Analytics eficiente deve conter:',
        alternativas: [
          'Apenas lista de funcionários',
          'Headcount, turnover, distribuição por departamento, desempenho médio e custo total',
          'Somente gráficos sem números',
          'Dados pessoais detalhados de cada funcionário'
        ],
        correta: 1,
        explicacao: 'People Analytics combina métricas estratégicas: volume, rotatividade, distribuição, performance e custo — dando visão 360° da força de trabalho.'
      }
    },

    // ══════════════════════════════
    // TRILHA LOGÍSTICA (101-110)
    // ══════════════════════════════
    {
      titulo: 'Controle de estoque básico',
      descricao: 'Monte uma planilha de controle de estoque',
      nivel: 'basico', trilha: 'logistica', ordem: 101,
      tipo: 'excel_simulado', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Na célula D2, calcule o estoque atual: estoque inicial (A2) + entradas (B2) - saídas (C2).',
        celulas: [
          {ref:'A1',valor:'Inicial',editavel:false},{ref:'B1',valor:'Entradas',editavel:false},{ref:'C1',valor:'Saídas',editavel:false},{ref:'D1',valor:'Saldo',editavel:false},
          {ref:'A2',valor:'100',editavel:false},{ref:'B2',valor:'50',editavel:false},{ref:'C2',valor:'30',editavel:false},
          {ref:'D2',valor:'',editavel:true,esperado:'=A2+B2-C2',alternativas_aceitas:['=A2+B2-C2']}
        ],
        explicacao: '=A2+B2-C2 = 100+50-30 = 120 unidades em estoque.'
      }
    },
    {
      titulo: 'Ponto de reposição',
      descricao: 'Calcule quando repor o estoque',
      nivel: 'basico', trilha: 'logistica', ordem: 102,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'O ponto de reposição (PR) de um produto é calculado como:',
        alternativas: ['Estoque mínimo / demanda diária', 'Demanda diária × lead time de entrega', 'Custo do produto × quantidade', 'Estoque máximo − estoque mínimo'],
        correta: 1,
        explicacao: 'PR = demanda diária × lead time. Se vende 10 por dia e o fornecedor leva 5 dias, reponha quando restar 50 unidades.'
      }
    },
    {
      titulo: 'SOMASE para movimentação',
      descricao: 'Some entradas por categoria de produto',
      nivel: 'intermediario', trilha: 'logistica', ordem: 103,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula F2, some as quantidades de C1:C6 apenas para o produto "Cadeira" em A1:A6.',
        celulas: [
          {ref:'A1',valor:'Mesa',editavel:false},{ref:'B1',valor:'Entrada',editavel:false},{ref:'C1',valor:'10',editavel:false},
          {ref:'A2',valor:'Cadeira',editavel:false},{ref:'B2',valor:'Entrada',editavel:false},{ref:'C2',valor:'25',editavel:false},
          {ref:'A3',valor:'Cadeira',editavel:false},{ref:'B3',valor:'Saída',editavel:false},{ref:'C3',valor:'8',editavel:false},
          {ref:'A4',valor:'Mesa',editavel:false},{ref:'B4',valor:'Entrada',editavel:false},{ref:'C4',valor:'5',editavel:false},
          {ref:'A5',valor:'Cadeira',editavel:false},{ref:'B5',valor:'Entrada',editavel:false},{ref:'C5',valor:'15',editavel:false},
          {ref:'E2',valor:'Cadeira',editavel:false},
          {ref:'F2',valor:'',editavel:true,esperado:'=SOMASE(A1:A6,"Cadeira",C1:C6)',alternativas_aceitas:['=SOMASE(A1:A6,"Cadeira",C1:C6)','=SUMIF(A1:A6,"Cadeira",C1:C6)']}
        ],
        explicacao: '=SOMASE soma C1:C6 onde A="Cadeira": 25+8+15 = 48 movimentações de cadeira.'
      }
    },
    {
      titulo: 'Giro de estoque',
      descricao: 'Calcule o giro de estoque do seu armazém',
      nivel: 'intermediario', trilha: 'logistica', ordem: 104,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula C1, calcule o giro de estoque: custo das mercadorias vendidas (A1) dividido pelo estoque médio (B1).',
        celulas: [
          {ref:'A1',valor:'120000',editavel:false},{ref:'B1',valor:'30000',editavel:false},
          {ref:'C1',valor:'',editavel:true,esperado:'=A1/B1',alternativas_aceitas:['=A1/B1']}
        ],
        explicacao: '=A1/B1 = 120000/30000 = 4. Giro de 4 significa que o estoque se renovou 4 vezes no período.'
      }
    },
    {
      titulo: 'Rastreamento de entregas',
      descricao: 'Calcule SLA e atrasos de entrega',
      nivel: 'intermediario', trilha: 'logistica', ordem: 105,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula D2, verifique se a entrega está "No prazo" se a data real (C2) <= data prevista (B2), senão "Atrasado".',
        celulas: [
          {ref:'A2',valor:'Pedido 001',editavel:false},{ref:'B2',valor:'10/03/2026',editavel:false},{ref:'C2',valor:'12/03/2026',editavel:false},
          {ref:'D2',valor:'',editavel:true,esperado:'=SE(C2<=B2,"No prazo","Atrasado")',alternativas_aceitas:['=SE(C2<=B2,"No prazo","Atrasado")','=IF(C2<=B2,"No prazo","Atrasado")']}
        ],
        explicacao: '=SE(C2<=B2,"No prazo","Atrasado") — 12/03 > 10/03, então retorna "Atrasado".'
      }
    },
    {
      titulo: 'Custo de frete',
      descricao: 'Calcule custos de frete por faixa de peso',
      nivel: 'intermediario', trilha: 'logistica', ordem: 106,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Para calcular frete com tarifas diferentes por faixa de peso (até 5kg=R$15, até 10kg=R$25, acima=R$40), qual fórmula usar?',
        alternativas: ['=PROCV(peso, tabela_frete, 2)', '=SE(A1<=5,15,SE(A1<=10,25,40))', '=SOMASE(tabela,peso,frete)', '=ÍNDICE(tarifas,CORRESP(peso,pesos,1))'],
        correta: 1,
        explicacao: '=SE(A1<=5,15,SE(A1<=10,25,40)) verifica as faixas em sequência, retornando o frete correto para cada peso.'
      }
    },
    {
      titulo: 'Dashboard de logística',
      descricao: 'Monitore KPIs de entrega em tempo real',
      nivel: 'avancado', trilha: 'logistica', ordem: 107,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Os KPIs mais importantes num dashboard de logística são:',
        alternativas: [
          'Apenas custo total',
          'On-Time Delivery (OTD), Fill Rate, giro de estoque e custo por entrega',
          'Número de fornecedores cadastrados',
          'Volume de emails trocados com fornecedores'
        ],
        correta: 1,
        explicacao: 'OTD mede pontualidade, Fill Rate mede disponibilidade, giro mede eficiência do estoque e custo por entrega mede rentabilidade.'
      }
    },
    {
      titulo: 'Previsão de demanda',
      descricao: 'Use médias móveis para prever demanda',
      nivel: 'avancado', trilha: 'logistica', ordem: 108,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'A média móvel de 3 períodos para prever o mês 4 usa:',
        alternativas: ['Apenas o mês 3', 'A média dos meses 1, 2 e 3', 'A média de todos os meses anteriores', 'O maior valor dos 3 meses'],
        correta: 1,
        explicacao: 'Média móvel de 3 períodos: (mês1+mês2+mês3)/3. A cada novo período, a janela avança descartando o mais antigo.'
      }
    },
    {
      titulo: 'Gestão de fornecedores',
      descricao: 'Avalie e classifique fornecedores',
      nivel: 'avancado', trilha: 'logistica', ordem: 109,
      tipo: 'excel_simulado', xpRecompensa: 30,
      conteudo: {
        instrucao: 'Na célula E2, calcule a nota final do fornecedor: qualidade (B2) × 0,4 + prazo (C2) × 0,35 + preço (D2) × 0,25.',
        celulas: [
          {ref:'A2',valor:'Fornecedor A',editavel:false},{ref:'B2',valor:'8',editavel:false},{ref:'C2',valor:'9',editavel:false},{ref:'D2',valor:'7',editavel:false},
          {ref:'E2',valor:'',editavel:true,esperado:'=B2*0.4+C2*0.35+D2*0.25',alternativas_aceitas:['=B2*0.4+C2*0.35+D2*0.25','=B2*0,4+C2*0,35+D2*0,25']}
        ],
        explicacao: '=8×0,4 + 9×0,35 + 7×0,25 = 3,2 + 3,15 + 1,75 = 8,1 — nota ponderada do Fornecedor A.'
      }
    },
    {
      titulo: 'Projeto Logística — Supply Chain',
      descricao: 'Monte um painel completo de supply chain',
      nivel: 'avancado', trilha: 'logistica', ordem: 110,
      tipo: 'multipla_escolha', xpRecompensa: 50,
      conteudo: {
        pergunta: 'Num painel de Supply Chain, o indicador OTIF (On Time In Full) mede:',
        alternativas: [
          'Apenas pontualidade das entregas',
          'Entregas no prazo E com quantidade correta simultaneamente',
          'O custo total da cadeia logística',
          'O tempo de processamento do pedido'
        ],
        correta: 1,
        explicacao: 'OTIF combina On Time (prazo) E In Full (quantidade completa) — é o KPI mais completo de performance de entregas.'
      }
    },

    // ══════════════════════════════
    // TRILHA FINANCEIRO (111-120)
    // ══════════════════════════════
    {
      titulo: 'Fluxo de caixa básico',
      descricao: 'Monte um fluxo de caixa mensal',
      nivel: 'basico', trilha: 'financeiro', ordem: 111,
      tipo: 'excel_simulado', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Na célula C2, calcule o saldo: saldo anterior (A2) + receitas (B2) - despesas (C1... use A2+B2-D2 onde D2 é despesas).',
        celulas: [
          {ref:'A2',valor:'5000',editavel:false},{ref:'B2',valor:'12000',editavel:false},{ref:'D2',valor:'8000',editavel:false},
          {ref:'C2',valor:'',editavel:true,esperado:'=A2+B2-D2',alternativas_aceitas:['=A2+B2-D2']}
        ],
        explicacao: '=A2+B2-D2 = 5000+12000-8000 = R$9.000 de saldo no período.'
      }
    },
    {
      titulo: 'Margem de lucro',
      descricao: 'Calcule margens brutas e líquidas',
      nivel: 'basico', trilha: 'financeiro', ordem: 112,
      tipo: 'excel_simulado', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Na célula C1, calcule a margem de lucro: (receita B1 - custo A1) / receita B1.',
        celulas: [
          {ref:'A1',valor:'7000',editavel:false},{ref:'B1',valor:'10000',editavel:false},
          {ref:'C1',valor:'',editavel:true,esperado:'=(B1-A1)/B1',alternativas_aceitas:['=(B1-A1)/B1','=1-A1/B1']}
        ],
        explicacao: '=(10000-7000)/10000 = 3000/10000 = 0,30 = 30% de margem de lucro. Formate como Porcentagem.'
      }
    },
    {
      titulo: 'VPL — Valor Presente Líquido',
      descricao: 'Calcule o VPL de um projeto de investimento',
      nivel: 'intermediario', trilha: 'financeiro', ordem: 113,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Se o VPL de um projeto é positivo, isso significa que:',
        alternativas: ['O projeto dará prejuízo', 'O projeto cria valor acima da taxa mínima de retorno', 'O projeto tem risco zero', 'A TIR é negativa'],
        correta: 1,
        explicacao: 'VPL > 0 indica que o projeto retorna mais do que a taxa de desconto usada, criando valor para o investidor.'
      }
    },
    {
      titulo: 'TIR — Taxa Interna de Retorno',
      descricao: 'Calcule a TIR de um fluxo de caixa',
      nivel: 'intermediario', trilha: 'financeiro', ordem: 114,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Para calcular a TIR de fluxos em A1:A6 (sendo A1 o investimento inicial negativo), a fórmula é:',
        alternativas: ['=VPL(A1:A6)', '=TIR(A1:A6)', '=TAXA(A1:A6)', '=RETORNO(A1:A6)'],
        correta: 1,
        explicacao: '=TIR(A1:A6) calcula a taxa interna de retorno do fluxo. O primeiro valor deve ser negativo (investimento inicial).'
      }
    },
    {
      titulo: 'Análise de Break Even',
      descricao: 'Calcule o ponto de equilíbrio',
      nivel: 'intermediario', trilha: 'financeiro', ordem: 115,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula D1, calcule o ponto de equilíbrio em unidades: custos fixos (A1) / (preço unitário B1 - custo variável C1).',
        celulas: [
          {ref:'A1',valor:'50000',editavel:false},{ref:'B1',valor:'150',editavel:false},{ref:'C1',valor:'80',editavel:false},
          {ref:'D1',valor:'',editavel:true,esperado:'=A1/(B1-C1)',alternativas_aceitas:['=A1/(B1-C1)']}
        ],
        explicacao: '=50000/(150-80) = 50000/70 ≈ 714 unidades — é o mínimo para cobrir todos os custos.'
      }
    },
    {
      titulo: 'Depreciação',
      descricao: 'Calcule depreciação linear de ativos',
      nivel: 'intermediario', trilha: 'financeiro', ordem: 116,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula D1, calcule a depreciação anual linear: (valor inicial A1 - valor residual B1) / vida útil C1.',
        celulas: [
          {ref:'A1',valor:'100000',editavel:false},{ref:'B1',valor:'10000',editavel:false},{ref:'C1',valor:'5',editavel:false},
          {ref:'D1',valor:'',editavel:true,esperado:'=(A1-B1)/C1',alternativas_aceitas:['=(A1-B1)/C1','=DPD(A1,B1,C1)']}
        ],
        explicacao: '=(100000-10000)/5 = 90000/5 = R$18.000 de depreciação anual pelo método linear.'
      }
    },
    {
      titulo: 'Orçamento vs Realizado',
      descricao: 'Compare orçado com realizado e calcule variações',
      nivel: 'avancado', trilha: 'financeiro', ordem: 117,
      tipo: 'excel_simulado', xpRecompensa: 30,
      conteudo: {
        instrucao: 'Na célula D2, calcule a variação percentual: (realizado C2 - orçado B2) / orçado B2.',
        celulas: [
          {ref:'A2',valor:'Receita',editavel:false},{ref:'B2',valor:'100000',editavel:false},{ref:'C2',valor:'112000',editavel:false},
          {ref:'D2',valor:'',editavel:true,esperado:'=(C2-B2)/B2',alternativas_aceitas:['=(C2-B2)/B2']}
        ],
        explicacao: '=(112000-100000)/100000 = 0,12 = 12% acima do orçado. Formate como Porcentagem.'
      }
    },
    {
      titulo: 'Função PGTO e amortização',
      descricao: 'Monte uma tabela de amortização completa',
      nivel: 'avancado', trilha: 'financeiro', ordem: 118,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Para calcular apenas os juros de uma parcela específica, sem calcular toda a tabela, use:',
        alternativas: ['=PGTO(taxa,nper,vp)', '=IPGTO(taxa,período,nper,vp)', '=PPGTO(taxa,período,nper,vp)', '=JUROS(taxa,período,vp)'],
        correta: 1,
        explicacao: '=IPGTO calcula a parte dos juros de uma parcela específica. =PPGTO calcula a amortização do principal. Juntos = PGTO.'
      }
    },
    {
      titulo: 'Indicadores financeiros',
      descricao: 'Calcule ROI, ROE e outros indicadores',
      nivel: 'avancado', trilha: 'financeiro', ordem: 119,
      tipo: 'excel_simulado', xpRecompensa: 30,
      conteudo: {
        instrucao: 'Na célula C1, calcule o ROI: (ganho B1 - investimento A1) / investimento A1.',
        celulas: [
          {ref:'A1',valor:'50000',editavel:false},{ref:'B1',valor:'65000',editavel:false},
          {ref:'C1',valor:'',editavel:true,esperado:'=(B1-A1)/A1',alternativas_aceitas:['=(B1-A1)/A1','=B1/A1-1']}
        ],
        explicacao: '=(65000-50000)/50000 = 15000/50000 = 0,30 = 30% de ROI. Excelente retorno sobre investimento!'
      }
    },
    {
      titulo: 'Projeto Financeiro — DRE',
      descricao: 'Monte uma DRE (Demonstração do Resultado)',
      nivel: 'avancado', trilha: 'financeiro', ordem: 120,
      tipo: 'multipla_escolha', xpRecompensa: 50,
      conteudo: {
        pergunta: 'A ordem correta de uma DRE simplificada é:',
        alternativas: [
          'Lucro Líquido → Receita Bruta → EBITDA',
          'Receita Bruta → Deduções → Receita Líquida → CMV → Lucro Bruto → Despesas → EBITDA → Lucro Líquido',
          'EBITDA → Receita → Impostos → Lucro',
          'Custos → Receitas → Resultado'
        ],
        correta: 1,
        explicacao: 'A DRE segue: Receita Bruta (-deduções) = Rec. Líquida (-CMV) = Lucro Bruto (-despesas) = EBITDA (-depreciação/juros/IR) = Lucro Líquido.'
      }
    },

    // ══════════════════════════════
    // TRILHA GESTÃO/ADM (121-130)
    // ══════════════════════════════
    {
      titulo: 'Cronograma de projeto',
      descricao: 'Monte um Gantt Chart no Excel',
      nivel: 'basico', trilha: 'gestao', ordem: 121,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'Para criar um gráfico de Gantt básico no Excel sem add-ins, você usa:',
        alternativas: ['Inserir > Gantt', 'Gráfico de Barras Empilhadas com barras invisíveis para o início', 'Gráfico de Linha do Tempo', 'Tabela Dinâmica com datas'],
        correta: 1,
        explicacao: 'O Gantt é simulado com barras empilhadas: a primeira série (início) fica transparente e a segunda (duração) forma a barra visível.'
      }
    },
    {
      titulo: 'Controle de tarefas',
      descricao: 'Gerencie tarefas com status e responsáveis',
      nivel: 'basico', trilha: 'gestao', ordem: 122,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'Para criar uma lista suspensa de status (A Fazer, Em Andamento, Concluído) numa célula, use:',
        alternativas: ['Inserir > Lista', 'Dados > Validação de Dados > Lista', 'Página Inicial > Formatação > Lista', 'Fórmulas > Definir Nome'],
        correta: 1,
        explicacao: 'Dados > Validação de Dados > Lista permite criar um menu suspenso com opções predefinidas — ideal para campos de status.'
      }
    },
    {
      titulo: 'Indicadores de meta',
      descricao: 'Compare resultados com metas estabelecidas',
      nivel: 'intermediario', trilha: 'gestao', ordem: 123,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula D2, calcule o atingimento de meta: resultado (C2) / meta (B2), em percentual.',
        celulas: [
          {ref:'A2',valor:'Vendas',editavel:false},{ref:'B2',valor:'100000',editavel:false},{ref:'C2',valor:'87000',editavel:false},
          {ref:'D2',valor:'',editavel:true,esperado:'=C2/B2',alternativas_aceitas:['=C2/B2','=C2/B2*100']}
        ],
        explicacao: '=C2/B2 = 87000/100000 = 0,87 = 87% de atingimento da meta. Formate como Porcentagem.'
      }
    },
    {
      titulo: 'Relatório automático',
      descricao: 'Crie relatórios que se atualizam com novos dados',
      nivel: 'intermediario', trilha: 'gestao', ordem: 124,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Para que um relatório se atualize automaticamente quando novos dados são adicionados, você deve:',
        alternativas: ['Recriar o relatório manualmente todo mês', 'Usar Tabelas estruturadas (Ctrl+T) como fonte de dados', 'Copiar e colar os novos dados no relatório', 'Salvar como .xlsm'],
        correta: 1,
        explicacao: 'Tabelas estruturadas expandem automaticamente — fórmulas, tabelas dinâmicas e gráficos baseados nelas se atualizam com novos registros.'
      }
    },
    {
      titulo: 'OKRs no Excel',
      descricao: 'Gerencie Objetivos e Resultados-Chave',
      nivel: 'intermediario', trilha: 'gestao', ordem: 125,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Na metodologia OKR, os Key Results (KRs) devem ser:',
        alternativas: ['Subjetivos e qualitativos', 'Mensuráveis, com número e prazo definidos', 'Definidos apenas pelo CEO', 'Metas impossíveis de atingir'],
        correta: 1,
        explicacao: 'KRs são mensuráveis: "Aumentar NPS de 45 para 70 até junho" — não "melhorar a satisfação do cliente".'
      }
    },
    {
      titulo: 'Análise SWOT',
      descricao: 'Estruture uma análise SWOT no Excel',
      nivel: 'intermediario', trilha: 'gestao', ordem: 126,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Na análise SWOT, as Ameaças (Threats) são:',
        alternativas: ['Fatores internos negativos', 'Fatores externos negativos que podem prejudicar a organização', 'Fraquezas internas não resolvidas', 'Riscos criados pela própria empresa'],
        correta: 1,
        explicacao: 'Ameaças são fatores EXTERNOS negativos: concorrência, mudanças regulatórias, crise econômica. As Fraquezas são internas.'
      }
    },
    {
      titulo: 'Dashboard gerencial',
      descricao: 'Monte um painel de gestão com KPIs estratégicos',
      nivel: 'avancado', trilha: 'gestao', ordem: 127,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Um dashboard gerencial eficaz deve apresentar os dados:',
        alternativas: [
          'Com o máximo de detalhes possível em cada tela',
          'De forma hierárquica: visão geral no topo, detalhes no drill-down',
          'Apenas em formato de tabela para precisão',
          'Sem filtros para evitar confusão'
        ],
        correta: 1,
        explicacao: 'Boa prática de dashboard: sumário executivo no topo (KPIs), com possibilidade de drill-down para detalhes — do geral ao específico.'
      }
    },
    {
      titulo: 'Controle de custos',
      descricao: 'Monitore e controle custos por centro de custo',
      nivel: 'avancado', trilha: 'gestao', ordem: 128,
      tipo: 'excel_simulado', xpRecompensa: 30,
      conteudo: {
        instrucao: 'Na célula D2, calcule quanto falta do orçamento: orçado (B2) - realizado (C2). Se negativo, estourou o orçamento.',
        celulas: [
          {ref:'A2',valor:'Marketing',editavel:false},{ref:'B2',valor:'30000',editavel:false},{ref:'C2',valor:'34500',editavel:false},
          {ref:'D2',valor:'',editavel:true,esperado:'=B2-C2',alternativas_aceitas:['=B2-C2']}
        ],
        explicacao: '=B2-C2 = 30000-34500 = -4500. O valor negativo indica estouro de R$4.500 no orçamento de Marketing.'
      }
    },
    {
      titulo: 'Gestão de riscos',
      descricao: 'Crie uma matriz de riscos no Excel',
      nivel: 'avancado', trilha: 'gestao', ordem: 129,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Numa matriz de riscos, o nível de risco é calculado como:',
        alternativas: ['Impacto + Probabilidade', 'Impacto × Probabilidade', 'Impacto − Probabilidade', 'Impacto / Probabilidade'],
        correta: 1,
        explicacao: 'Risco = Impacto × Probabilidade. Um risco de alto impacto (5) e baixa probabilidade (1) tem nível 5 — igual a médio impacto (3) × média probabilidade (3/2... não, 5≠9). A multiplicação pesa ambos os fatores.'
      }
    },
    {
      titulo: 'Projeto Gestão — BSC',
      descricao: 'Monte um Balanced Scorecard no Excel',
      nivel: 'avancado', trilha: 'gestao', ordem: 130,
      tipo: 'multipla_escolha', xpRecompensa: 50,
      conteudo: {
        pergunta: 'As 4 perspectivas do Balanced Scorecard são:',
        alternativas: [
          'Vendas, Marketing, Operações e TI',
          'Financeira, Clientes, Processos Internos e Aprendizado & Crescimento',
          'Curto, Médio, Longo prazo e Inovação',
          'Receita, Custo, Lucro e Investimento'
        ],
        correta: 1,
        explicacao: 'O BSC de Kaplan & Norton equilibra 4 perspectivas: Financeira (resultados), Clientes (satisfação), Processos (eficiência) e Aprendizado (capacidade futura).'
      }
    },

    // ══════════════════════════════════
    // TRILHA VENDAS/COMERCIAL (131-140)
    // ══════════════════════════════════
    {
      titulo: 'Funil de vendas',
      descricao: 'Monte e analise seu funil de vendas',
      nivel: 'basico', trilha: 'vendas', ordem: 131,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'A taxa de conversão do funil de vendas é calculada como:',
        alternativas: ['Leads × Clientes', 'Clientes / Leads × 100', 'Receita / Leads', 'Leads − Clientes'],
        correta: 1,
        explicacao: 'Taxa de conversão = (Clientes ÷ Leads) × 100. Se você teve 200 leads e fechou 20 vendas: 20/200 × 100 = 10%.'
      }
    },
    {
      titulo: 'Comissão de vendas',
      descricao: 'Calcule comissões por faixa de atingimento',
      nivel: 'basico', trilha: 'vendas', ordem: 132,
      tipo: 'excel_simulado', xpRecompensa: 20,
      conteudo: {
        instrucao: 'Na célula C2, calcule a comissão: se atingimento (B2) >= 100%, comissão é 5% das vendas (A2); se >= 80%, 3%; senão 1%.',
        celulas: [
          {ref:'A2',valor:'50000',editavel:false},{ref:'B2',valor:'105',editavel:false},
          {ref:'C2',valor:'',editavel:true,esperado:'=SE(B2>=100,A2*0.05,SE(B2>=80,A2*0.03,A2*0.01))',alternativas_aceitas:['=SE(B2>=100,A2*0.05,SE(B2>=80,A2*0.03,A2*0.01))','=IF(B2>=100,A2*0.05,IF(B2>=80,A2*0.03,A2*0.01))']}
        ],
        explicacao: '105% >= 100% → comissão de 5%: R$50.000 × 0,05 = R$2.500.'
      }
    },
    {
      titulo: 'Ranking de vendedores',
      descricao: 'Classifique vendedores por performance',
      nivel: 'intermediario', trilha: 'vendas', ordem: 133,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula C2, use a função ORDEM para rankear o vendedor pelo total em B2 dentro do intervalo B2:B6.',
        celulas: [
          {ref:'A2',valor:'Ana',editavel:false},{ref:'B2',valor:'85000',editavel:false},
          {ref:'A3',valor:'Bruno',editavel:false},{ref:'B3',valor:'92000',editavel:false},
          {ref:'A4',valor:'Carla',editavel:false},{ref:'B4',valor:'78000',editavel:false},
          {ref:'A5',valor:'Diego',editavel:false},{ref:'B5',valor:'105000',editavel:false},
          {ref:'A6',valor:'Eva',editavel:false},{ref:'B6',valor:'91000',editavel:false},
          {ref:'C2',valor:'',editavel:true,esperado:'=ORDEM(B2,$B$2:$B$6,0)',alternativas_aceitas:['=ORDEM(B2,$B$2:$B$6,0)','=RANK(B2,$B$2:$B$6,0)','=ORDEM(B2,B2:B6,0)']}
        ],
        explicacao: '=ORDEM(B2,$B$2:$B$6,0) retorna 3 — Ana (85.000) é a 3ª maior vendedora da equipe.'
      }
    },
    {
      titulo: 'Projeção de vendas',
      descricao: 'Projete receita com base em crescimento histórico',
      nivel: 'intermediario', trilha: 'vendas', ordem: 134,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Para projetar vendas do próximo mês usando a função PREVISÃO do Excel, você precisa de:',
        alternativas: ['Apenas a média dos últimos meses', 'Valores históricos de vendas e seus períodos correspondentes', 'Apenas o último mês', 'Metas definidas pela diretoria'],
        correta: 1,
        explicacao: '=PREVISÃO(x, y_conhecidos, x_conhecidos) usa regressão linear com os dados históricos para projetar o próximo valor.'
      }
    },
    {
      titulo: 'CRM em Excel',
      descricao: 'Gerencie clientes e oportunidades',
      nivel: 'intermediario', trilha: 'vendas', ordem: 135,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Para calcular o valor esperado do pipeline de vendas, você multiplica:',
        alternativas: ['Valor da oportunidade × número de clientes', 'Valor da oportunidade × probabilidade de fechamento', 'Meta de vendas × taxa de conversão', 'Número de leads × ticket médio'],
        correta: 1,
        explicacao: 'Valor esperado = Valor × Probabilidade. Oportunidade de R$100k com 60% de chance vale R$60k no pipeline ponderado.'
      }
    },
    {
      titulo: 'Ticket médio e LTV',
      descricao: 'Calcule ticket médio e valor do cliente',
      nivel: 'intermediario', trilha: 'vendas', ordem: 136,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula D1, calcule o LTV (Lifetime Value): ticket médio (A1) × frequência mensal (B1) × meses de retenção (C1).',
        celulas: [
          {ref:'A1',valor:'250',editavel:false},{ref:'B1',valor:'2',editavel:false},{ref:'C1',valor:'18',editavel:false},
          {ref:'D1',valor:'',editavel:true,esperado:'=A1*B1*C1',alternativas_aceitas:['=A1*B1*C1']}
        ],
        explicacao: '=250×2×18 = R$9.000 de LTV — quanto cada cliente gera em média durante o relacionamento.'
      }
    },
    {
      titulo: 'Análise de cohort',
      descricao: 'Analise retenção de clientes por coorte',
      nivel: 'avancado', trilha: 'vendas', ordem: 137,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Uma análise de cohort de retenção de clientes serve para:',
        alternativas: ['Segmentar clientes por ticket médio', 'Rastrear o comportamento de grupos de clientes adquiridos no mesmo período ao longo do tempo', 'Prever vendas do próximo trimestre', 'Calcular o CAC médio por canal'],
        correta: 1,
        explicacao: 'Cohort tracking mostra como clientes adquiridos em janeiro vs. março se comportam mês a mês — revelando padrões de retenção e churn.'
      }
    },
    {
      titulo: 'Precificação estratégica',
      descricao: 'Calcule preços com markup e margem',
      nivel: 'avancado', trilha: 'vendas', ordem: 138,
      tipo: 'excel_simulado', xpRecompensa: 30,
      conteudo: {
        instrucao: 'Na célula C1, calcule o preço de venda com markup de 40% sobre o custo (A1). Fórmula: custo / (1 - margem desejada).',
        celulas: [
          {ref:'A1',valor:'70',editavel:false},{ref:'B1',valor:'0.40',editavel:false},
          {ref:'C1',valor:'',editavel:true,esperado:'=A1/(1-B1)',alternativas_aceitas:['=A1/(1-B1)','=A1/(1-0.4)','=A1/0.6']}
        ],
        explicacao: '=70/(1-0,40) = 70/0,60 = R$116,67. Com margem de 40%, o preço de venda deve ser R$116,67.'
      }
    },
    {
      titulo: 'Sazonalidade de vendas',
      descricao: 'Identifique padrões sazonais nos dados',
      nivel: 'avancado', trilha: 'vendas', ordem: 139,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Para identificar sazonalidade em dados mensais de vendas, a melhor visualização é:',
        alternativas: ['Gráfico de pizza', 'Gráfico de linha com múltiplos anos sobrepostos', 'Tabela de valores brutos', 'Gráfico de dispersão'],
        correta: 1,
        explicacao: 'Sobrepor múltiplos anos num gráfico de linha revela imediatamente padrões que se repetem — picos em dezembro, quedas em janeiro, etc.'
      }
    },
    {
      titulo: 'Projeto Vendas — Forecast',
      descricao: 'Monte um modelo de previsão de vendas',
      nivel: 'avancado', trilha: 'vendas', ordem: 140,
      tipo: 'multipla_escolha', xpRecompensa: 50,
      conteudo: {
        pergunta: 'Um modelo de forecast de vendas confiável deve incluir:',
        alternativas: [
          'Apenas a meta definida pela diretoria',
          'Histórico, sazonalidade, pipeline ponderado e premissas de crescimento documentadas',
          'Só a projeção do último mês multiplicada por 12',
          'Média simples dos últimos 3 meses'
        ],
        correta: 1,
        explicacao: 'Um bom forecast combina dados históricos + ajuste sazonal + pipeline atual ponderado + premissas explícitas — permitindo revisão e melhoria contínua.'
      }
    },

    // ══════════════════════════════════
    // TRILHA CONTABILIDADE (141-150)
    // ══════════════════════════════════
    {
      titulo: 'Lançamentos contábeis',
      descricao: 'Registre débitos e créditos no Excel',
      nivel: 'basico', trilha: 'contabilidade', ordem: 141,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'Na contabilidade, o princípio da partida dobrada significa:',
        alternativas: ['Todo lançamento é registrado duas vezes', 'Para todo débito há um crédito de igual valor', 'Os lançamentos são feitos em pares de meses', 'Débito e crédito sempre somam zero separadamente'],
        correta: 1,
        explicacao: 'Partida dobrada: todo lançamento tem débito(s) e crédito(s) de mesmo valor. Ativo aumenta no débito; Passivo/PL aumenta no crédito.'
      }
    },
    {
      titulo: 'Balancete de verificação',
      descricao: 'Monte um balancete no Excel',
      nivel: 'basico', trilha: 'contabilidade', ordem: 142,
      tipo: 'multipla_escolha', xpRecompensa: 20,
      conteudo: {
        pergunta: 'Num balancete equilibrado, a soma dos saldos devedores deve:',
        alternativas: ['Ser maior que os credores', 'Ser igual à soma dos saldos credores', 'Ser zero', 'Ser menor que os credores'],
        correta: 1,
        explicacao: 'Pelo princípio da partida dobrada, ΣDébitos = ΣCréditos. Se o balancete não fechar, há erro de lançamento.'
      }
    },
    {
      titulo: 'Cálculo de impostos',
      descricao: 'Calcule ICMS, PIS e COFINS',
      nivel: 'intermediario', trilha: 'contabilidade', ordem: 143,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula D1, calcule o PIS (0,65%) sobre o faturamento (A1) e COFINS (3%) sobre o faturamento (A1), somados.',
        celulas: [
          {ref:'A1',valor:'100000',editavel:false},{ref:'B1',valor:'0.0065',editavel:false},{ref:'C1',valor:'0.03',editavel:false},
          {ref:'D1',valor:'',editavel:true,esperado:'=A1*B1+A1*C1',alternativas_aceitas:['=A1*B1+A1*C1','=A1*(B1+C1)','=A1*0.0065+A1*0.03']}
        ],
        explicacao: '=100000×0,0065 + 100000×0,03 = 650+3000 = R$3.650 de PIS+COFINS (regime cumulativo).'
      }
    },
    {
      titulo: 'Conciliação bancária',
      descricao: 'Concilie extratos bancários com registros internos',
      nivel: 'intermediario', trilha: 'contabilidade', ordem: 144,
      tipo: 'multipla_escolha', xpRecompensa: 25,
      conteudo: {
        pergunta: 'Na conciliação bancária, itens "em trânsito" são:',
        alternativas: ['Erros do banco', 'Lançamentos registrados na empresa mas ainda não no extrato bancário', 'Taxas bancárias não previstas', 'Depósitos de terceiros'],
        correta: 1,
        explicacao: 'Itens em trânsito são cheques emitidos ou depósitos realizados que ainda não foram compensados pelo banco — diferença temporária legítima.'
      }
    },
    {
      titulo: 'Depreciação acumulada',
      descricao: 'Controle ativos e depreciação acumulada',
      nivel: 'intermediario', trilha: 'contabilidade', ordem: 145,
      tipo: 'excel_simulado', xpRecompensa: 25,
      conteudo: {
        instrucao: 'Na célula D1, calcule o valor contábil líquido: valor original (A1) menos depreciação acumulada (B1) menos provisão para perdas (C1).',
        celulas: [
          {ref:'A1',valor:'80000',editavel:false},{ref:'B1',valor:'32000',editavel:false},{ref:'C1',valor:'5000',editavel:false},
          {ref:'D1',valor:'',editavel:true,esperado:'=A1-B1-C1',alternativas_aceitas:['=A1-B1-C1']}
        ],
        explicacao: '=80000-32000-5000 = R$43.000 de valor contábil líquido do ativo.'
      }
    },
    {
      titulo: 'DRE contábil',
      descricao: 'Monte uma DRE no padrão contábil brasileiro',
      nivel: 'avancado', trilha: 'contabilidade', ordem: 146,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'O EBITDA é calculado como:',
        alternativas: ['Lucro Líquido + Impostos', 'Lucro Operacional + Depreciação + Amortização', 'Receita Líquida − CMV', 'Lucro Bruto − Despesas Financeiras'],
        correta: 1,
        explicacao: 'EBITDA = Earnings Before Interest, Taxes, Depreciation and Amortization = Lucro Operacional + D&A. Mede geração de caixa operacional.'
      }
    },
    {
      titulo: 'Balanço Patrimonial',
      descricao: 'Estruture um BP no Excel',
      nivel: 'avancado', trilha: 'contabilidade', ordem: 147,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'No Balanço Patrimonial, a equação fundamental da contabilidade é:',
        alternativas: ['Ativo = Passivo', 'Ativo = Passivo + Patrimônio Líquido', 'Ativo + Passivo = PL', 'Receitas = Despesas + Lucro'],
        correta: 1,
        explicacao: 'Ativo = Passivo + PL é a equação fundamental. Os recursos da empresa (Ativo) são financiados por terceiros (Passivo) e pelos sócios (PL).'
      }
    },
    {
      titulo: 'Indicadores contábeis',
      descricao: 'Calcule liquidez corrente e endividamento',
      nivel: 'avancado', trilha: 'contabilidade', ordem: 148,
      tipo: 'excel_simulado', xpRecompensa: 30,
      conteudo: {
        instrucao: 'Na célula C1, calcule a Liquidez Corrente: Ativo Circulante (A1) / Passivo Circulante (B1).',
        celulas: [
          {ref:'A1',valor:'250000',editavel:false},{ref:'B1',valor:'150000',editavel:false},
          {ref:'C1',valor:'',editavel:true,esperado:'=A1/B1',alternativas_aceitas:['=A1/B1']}
        ],
        explicacao: '=250000/150000 = 1,67. Liquidez Corrente > 1 indica que a empresa tem mais recursos circulantes do que dívidas de curto prazo.'
      }
    },
    {
      titulo: 'Fechamento contábil',
      descricao: 'Automatize o processo de fechamento mensal',
      nivel: 'avancado', trilha: 'contabilidade', ordem: 149,
      tipo: 'multipla_escolha', xpRecompensa: 30,
      conteudo: {
        pergunta: 'Para automatizar o processo de fechamento contábil mensal no Excel, o mais eficiente é:',
        alternativas: ['Copiar planilhas do mês anterior manualmente', 'Usar Power Query para consolidar dados + macros para relatórios automáticos', 'Digitar todos os lançamentos do zero', 'Usar apenas filtros e tabelas dinâmicas'],
        correta: 1,
        explicacao: 'Power Query consolida dados de múltiplas fontes automaticamente; macros VBA geram relatórios com um clique — juntos automatizam 80% do fechamento.'
      }
    },
    {
      titulo: 'Projeto Contabilidade — Relatórios gerenciais',
      descricao: 'Monte um pacote completo de relatórios contábeis',
      nivel: 'avancado', trilha: 'contabilidade', ordem: 150,
      tipo: 'multipla_escolha', xpRecompensa: 50,
      conteudo: {
        pergunta: 'O pacote mínimo de relatórios contábeis gerenciais inclui:',
        alternativas: [
          'Apenas o extrato bancário',
          'DRE, Balanço Patrimonial, Fluxo de Caixa e variação do PL',
          'Somente a DRE mensal',
          'Balancete e conciliação bancária'
        ],
        correta: 1,
        explicacao: 'As 4 demonstrações fundamentais: DRE (resultado), BP (posição patrimonial), DFC (caixa) e DMPL (variação do PL) — exigidas pela Lei das S.A. e boas práticas contábeis.'
      }
    },

  ]; // fim do array licoes

  // Inserir todas as lições
  for (const licao of licoes) {
    await (prisma as any).licao.create({ data: licao });
  }

  console.log(`✅ ${licoes.length} lições criadas com sucesso!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());