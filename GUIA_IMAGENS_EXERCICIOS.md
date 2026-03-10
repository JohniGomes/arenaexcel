# 🎨 Guia Completo - Imagens nos Exercícios

## 📋 Índice
1. [Configuração Localhost](#configuração-localhost)
2. [Adicionar Imagens](#adicionar-imagens)
3. [Preparar para Produção](#preparar-para-produção)
4. [Deploy Final](#deploy-final)
5. [Troubleshooting](#troubleshooting)

---

## 🏠 Configuração Localhost

### **Passo 1: Configurar Variáveis de Ambiente**

#### Backend (`nodejs_space/.env`):
```bash
DATABASE_URL="postgresql://postgres:192122@localhost:5432/arena_excel_dev"
PORT=3000
```

#### Frontend (`react_native_space/.env`):
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/
```

### **Passo 2: Iniciar Serviços**

```bash
# Terminal 1 - Backend
cd nodejs_space
npm run start:dev

# Terminal 2 - Frontend  
cd react_native_space
npx expo start -c
```

### **Passo 3: Verificar se Funciona**

1. Abra: `http://localhost:8081`
2. Faça login
3. Entre em: **Aprender → Fundamentos → Interface do Excel**
4. Veja se a imagem aparece no Exercício 1

---

## 📸 Adicionar Imagens aos Exercícios

### **Estrutura de Pastas**

```
nodejs_space/
└── public/
    └── exercise-images/
        ├── excel-interface.png        (Exercício 1)
        ├── tipos-dados.png            (Exemplo)
        ├── atalhos-essenciais.png     (Exemplo)
        └── ...
```

### **Passo a Passo**

#### **1. Adicionar a Imagem na Pasta**

```bash
# Coloque sua imagem em:
cp sua-imagem.png nodejs_space/public/exercise-images/
```

**Recomendações:**
- Formato: PNG ou JPG
- Tamanho máximo: 500KB
- Dimensões: 800x600px (ideal)
- Nome: use kebab-case (exemplo: `funcao-soma.png`)

#### **2. Adicionar no Seed (Database)**

**Arquivo:** `nodejs_space/prisma/seed.ts`

**Encontre o exercício** (linha ~220):

```typescript
const exercises: any = {
  // Fundamentos (Level 1)
  1: {
    1: {  // ← Exercício 1
      type: 'multiple_choice',
      question: 'Qual é o nome da barra onde você digita fórmulas?',
      options: ['Barra de Fórmulas', 'Barra de Ferramentas', '...'],
      correctAnswer: 'Barra de Fórmulas',
      explanation: 'A Barra de Fórmulas é onde digitamos...',
      hint: 'Fica logo acima da planilha',
      imageUrl: '/exercise-images/excel-interface.png',  // ← ADICIONE
    },
    2: {  // ← Exercício 2
      type: 'multiple_choice',
      question: 'Qual tipo de dado...',
      // ...
      imageUrl: '/exercise-images/tipos-dados.png',  // ← ADICIONE
    },
  },
}
```

#### **3. Atualizar o Banco de Dados**

```bash
cd nodejs_space
npx ts-node prisma/seed.ts
```

#### **4. Testar**

```bash
# Verificar se a imagem está acessível
curl -I http://localhost:3000/exercise-images/sua-imagem.png
# Deve retornar: HTTP/1.1 200 OK

# Reiniciar o frontend
cd react_native_space
npx expo start -c
```

---

## 🚀 Preparar para Produção

### **Checklist Pré-Deploy**

- [ ] Todas as imagens adicionadas em `public/exercise-images/`
- [ ] Seed atualizado com todos os `imageUrl`
- [ ] Testado em localhost (todas as imagens aparecem)
- [ ] Banco de dados local funcionando

### **O Que NÃO Fazer**

❌ **NÃO altere** `react_native_space/.env` manualmente  
❌ **NÃO hardcode** URLs no código  
❌ **NÃO commit** arquivos `.env` no Git  

---

## 🌐 Deploy Final (Produção)

### **Passo 1: Deploy do Backend**

1. **Na interface da Abacus, clique em "Deploy" → "Deploy Backend"**
2. Aguarde o deploy completar
3. Anote a URL de produção: `https://arenaexcel.excelcomjohni.com.br`

### **Passo 2: Verificar Variáveis (Automático)**

O sistema da Abacus atualiza automaticamente:

```bash
# react_native_space/.env (atualizado automaticamente)
EXPO_PUBLIC_API_URL=https://arenaexcel.excelcomjohni.com.br/
```

### **Passo 3: Testar em Produção**

Abra o preview web e teste:
```
https://arenaexcel.excelcomjohni.com.br/exercise-images/excel-interface.png
```

### **Passo 4: Build do App Mobile**

1. **Clique em "Deploy" → "Build Mobile App"**
2. Escolha:
   - **Android (APK)** - Para instalar diretamente
   - **Android (AAB)** - Para Google Play Store
   - **iOS (TestFlight)** - Para testes no iOS
3. Aguarde o build (10-15 minutos)
4. Baixe e instale

---

## 🔧 Como Funciona (Técnico)

### **Sistema de URLs Dinâmicas**

**Arquivo:** `react_native_space/src/utils/imageUtils.ts`

```typescript
// Detecta automaticamente o ambiente
export function getApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  
  if (envUrl) {
    return envUrl.replace(/\/$/, '');  // Usa .env
  }
  
  return 'https://i.ytimg.com/vi/gc6OzXMN3V8/maxresdefault.jpg';  // Fallback
}

// Constrói URL completa
export function getExerciseImageUrl(imageUrl?: string): string | null {
  if (!imageUrl) return null;
  
  // Se já é URL completa, retorna direto
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Caso contrário, adiciona base URL
  return `${getApiBaseUrl()}${imageUrl}`;
}
```

**Resultado:**

| Ambiente | .env | URL Final |
|----------|------|----------|
| **Localhost** | `http://localhost:3000/` | `http://localhost:3000/exercise-images/foto.png` |
| **Produção** | `https://arenaexcel.excelcomjohni.com.br/` | `https://img.freepik.com/free-vector/young-women-exercising-flat-illustration-set_107791-14287.jpg?semt=ais_user_personalization&w=740&q=80` |

### **Cache Buster (Desenvolvimento)**

Em modo de desenvolvimento (`__DEV__ = true`), as imagens têm timestamp:

```typescript
// Desenvolvimento
http://localhost:3000/exercise-images/foto.png?t=1234567890

// Produção (sem timestamp)
https://i.ytimg.com/vi/sIkYq2S2td8/maxresdefault.jpg
```

Isso força o reload quando você troca a imagem durante desenvolvimento.

---

## 🐛 Troubleshooting

### **Problema: Imagem não aparece no localhost**

**1. Verificar se o backend serve a pasta public:**

```bash
# Testar diretamente
curl -I http://localhost:3000/exercise-images/excel-interface.png

# Deve retornar:
HTTP/1.1 200 OK
Content-Type: image/png
```

**Se retornar 404:**
- Verifique se a pasta existe: `nodejs_space/public/exercise-images/`
- Verifique se o arquivo existe
- Reinicie o backend: `npm run start:dev`

**2. Verificar .env do frontend:**

```bash
cat react_native_space/.env
# Deve mostrar:
EXPO_PUBLIC_API_URL=http://localhost:3000/
```

**3. Limpar cache:**

```bash
cd react_native_space
rm -rf .expo node_modules/.cache
npx expo start -c
```

**4. Verificar console do navegador:**

Abra F12 e veja se há erros. A URL deve ser:
```
✅ http://localhost:3000/exercise-images/...
❌ https://workoutlabs.com/wp-content/themes/printableworkouts/responsive/img/exercise-illustrations-licensing/exercise-illustrations-images-digrams-licensing-purchase.webp
```

### **Problema: Imagem não aparece na produção**

**1. Verificar se o deploy incluiu as imagens:**

```bash
curl -I https://arenaexcel.excelcomjohni.com.br/exercise-images/excel-interface.png
```

**Se retornar 404:**
- As imagens não foram incluídas no deploy
- Verifique se a pasta `public/` está no projeto
- Faça deploy novamente

**2. Verificar .env de produção:**

No build, a variável deve ser:
```bash
EXPO_PUBLIC_API_URL=https://arenaexcel.excelcomjohni.com.br/
```

**3. Regenerar o build do app:**

Se mudou algo, gere um novo APK/AAB.

### **Problema: Imagem antiga ainda aparece**

**Localhost:**
```bash
# Limpar cache
npx expo start -c

# No navegador
Ctrl + Shift + R
```

**Produção:**
- Gere um novo build do app
- O cache buster só funciona em desenvolvimento

### **Problema: Seed não atualiza o banco**

```bash
# Limpar e recriar banco
cd nodejs_space
npx prisma migrate reset --force
npx ts-node prisma/seed.ts
```

---

## 📊 Estrutura de Níveis e Exercícios

```
Nível 1: Fundamentos (10 lições)
├─ Lição 1: Interface do Excel
│  └─ Exercício 1 ✅ TEM IMAGEM
├─ Lição 2: Células e Dados  
│  └─ Exercício 1 (sem imagem)
└─ ...

Nível 2: Básico (10 lições)
├─ Lição 1: Fórmulas Básicas
│  └─ Exercício 1 (sem imagem)
└─ ...

Nível 3: Intermediário (10 lições)
Nível 4: Avançado (10 lições)
Nível 5: Especialista (10 lições)
```

**Para adicionar mais imagens:**

1. Identifique: Nível X, Lição Y, Exercício Z
2. Adicione imagem em: `public/exercise-images/`
3. Edite `seed.ts` no exercício correspondente
4. Rode: `npx ts-node prisma/seed.ts`

---

## ✅ Checklist Final

### **Desenvolvimento (Localhost)**
- [ ] Backend rodando em `http://localhost:3000`
- [ ] Frontend rodando em `http://localhost:8081`
- [ ] `.env` configurado corretamente
- [ ] Imagem aparece no Exercício 1
- [ ] Console não mostra erros

### **Produção**
- [ ] Backend deployado
- [ ] Imagens acessíveis via URL de produção
- [ ] Build do app gerado
- [ ] Testado em dispositivo real
- [ ] Todas as imagens aparecem

---

## 🎯 Resumo Rápido

**Desenvolvimento:**
```bash
1. Adicione imagem em: nodejs_space/public/exercise-images/
2. Edite seed.ts: imageUrl: '/exercise-images/foto.png'
3. Rode: npx ts-node prisma/seed.ts
4. Teste: http://localhost:8081
```

**Produção:**
```bash
1. Deploy Backend na Abacus
2. Build Mobile App na Abacus  
3. Baixe e instale o APK
4. Pronto! 🎉
```

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique o [Troubleshooting](#troubleshooting)
2. Veja os logs do console (F12)
3. Teste a URL da imagem diretamente no navegador
4. Limpe os caches

**Logs úteis:**

```bash
# Backend
cd nodejs_space
npm run start:dev
# Veja se mostra "Serving static files from: /path/to/public"

# Frontend - Console do navegador
# Procure por: "✅ Imagem carregada: ..."
# Ou: "❌ Erro ao carregar imagem: ..."
```

---

**Criado em:** 2026-02-17  
**Versão:** 1.0  
**Projeto:** Arena Excel  
