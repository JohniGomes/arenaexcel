# 🔐 Configuração Google SSO - Arena Excel

## 📋 Pré-requisitos

Você já criou a estrutura no Google Cloud Console. Agora precisa configurar as variáveis de ambiente.

---

## 🔧 Etapa 1: Obter Credenciais do Google Cloud

### 1.1 Acesse o Google Cloud Console
1. Vá para [console.cloud.google.com](https://console.cloud.google.com/)
2. Selecione seu projeto

### 1.2 Configure a Tela de Consentimento OAuth
1. Vá em **APIs e Serviços** → **Tela de consentimento OAuth**
2. Tipo de usuário: **Externo**
3. Preencha:
   - Nome do app: `Arena Excel`
   - E-mail de suporte: seu e-mail
   - Domínio autorizado: `arenaexcel.excelcomjohni.com.br`
4. Escopos:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
5. Salvar

### 1.3 Criar Credenciais OAuth 2.0
1. Vá em **APIs e Serviços** → **Credenciais**
2. Clique em **+ CRIAR CREDENCIAIS** → **ID do cliente OAuth 2.0**
3. Tipo de aplicativo: **Aplicativo da Web**
4. Nome: `Arena Excel - Web Client`
5. **Origens JavaScript autorizadas:**
   ```
   http://localhost:3000
   http://localhost:8081
   https://arenaexcel.excelcomjohni.com.br
   ```
6. **URIs de redirecionamento autorizados:**
   ```
   http://localhost:3000/api/auth/google/callback
   https://arenaexcel.excelcomjohni.com.br/api/auth/google/callback
   ```
7. Clique em **CRIAR**
8. **COPIE o Client ID e Client Secret** (você precisará deles!)

---

## 🔧 Etapa 2: Configurar Variáveis de Ambiente

### 2.1 Backend (nodejs_space/.env)

Adicione as seguintes variáveis no arquivo `/home/ubuntu/arena_excel/nodejs_space/.env`:

```bash
# Google OAuth 2.0
GOOGLE_CLIENT_ID="seu-client-id-aqui.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret-aqui"

# SMTP (opcional - para envio de e-mails de reset de senha)
# Exemplo com Gmail:
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-de-app"  # Use App Password, não a senha normal
SMTP_FROM="Arena Excel <noreply@arenaexcel.com>"

# Ou use SendGrid:
# SMTP_HOST="smtp.sendgrid.net"
# SMTP_PORT="587"
# SMTP_USER="apikey"
# SMTP_PASS="sua-api-key-sendgrid"
# SMTP_FROM="Arena Excel <noreply@arenaexcel.com>"
```

### 2.2 Frontend (react_native_space/.env)

As variáveis do frontend são gerenciadas automaticamente pelo sistema.

---

## 🧪 Etapa 3: Testar Localmente

### 3.1 Reiniciar Backend
```bash
cd /home/ubuntu/arena_excel/nodejs_space
yarn run build
yarn run start:dev
```

### 3.2 Testar Endpoints

**Teste 1: Iniciar OAuth**
```bash
curl "http://localhost:3000/api/auth/google?redirect_uri=http://localhost:8081/auth/callback"
```
Deve retornar um redirect 302 para Google.

**Teste 2: Verificar Swagger**
Acesse: http://localhost:3000/api-docs
Verifique se os endpoints aparecem:
- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

---

## 📱 Etapa 4: Configurar Frontend (Próxima Sessão)

O frontend será configurado para:
1. Adicionar botão "Entrar com Google"
2. Criar tela de callback OAuth
3. Implementar fluxo de recuperação de senha

---

## 🔒 Segurança

### ✅ Implementado:
- ✅ State parameter assinado com HMAC-SHA256
- ✅ Verificação de e-mail verificado pelo Google
- ✅ Token de reset expira em 1 hora
- ✅ Passwords hasheados com bcrypt
- ✅ JWT com expiração de 30 dias

### ⚠️ Importante:
- **NUNCA** commite o `.env` com credenciais reais
- Use **App Passwords** do Gmail (não senha normal)
- Configure **SendGrid** ou **AWS SES** para produção

---

## 🆘 Solução de Problemas

### Erro: "redirect_uri_mismatch"
**Causa:** URI de redirecionamento não autorizado no Google Cloud
**Solução:** Adicione exatamente `https://seu-dominio.com/api/auth/google/callback`

### Erro: "Google OAuth não configurado"
**Causa:** Variáveis GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não configuradas
**Solução:** Verifique o `.env` e reinicie o backend

### E-mail não enviado
**Causa:** SMTP não configurado ou credenciais inválidas
**Solução:** 
1. Gmail: Ative "Acesso a apps menos seguros" OU use App Password
2. SendGrid: Crie conta gratuita (100 e-mails/dia)
3. Verifique logs do backend: `yarn run start:dev`

---

## 📊 Endpoints Disponíveis

### Autenticação Tradicional
- `POST /api/signup` - Cadastro com e-mail/senha
- `POST /api/auth/login` - Login com e-mail/senha
- `POST /api/auth/forgot-password` - Solicitar reset de senha
- `POST /api/auth/reset-password` - Redefinir senha com token

### Google SSO
- `GET /api/auth/google?redirect_uri=<url>` - Iniciar OAuth flow
- `GET /api/auth/google/callback?code=<code>&state=<state>` - Callback do Google

### Comportamento:
- ✅ Se e-mail já existe → Faz login
- ✅ Se e-mail não existe → Cria conta automaticamente
- ✅ Conta Google não pode resetar senha (não tem senha)
- ✅ Conta normal pode vincular Google depois

---

## ✅ Checklist Final

- [ ] Google Cloud Console configurado
- [ ] Client ID e Secret obtidos
- [ ] Variáveis GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env
- [ ] URIs de redirecionamento cadastrados no Google
- [ ] Backend reiniciado
- [ ] Endpoints testados no Swagger
- [ ] (Opcional) SMTP configurado
- [ ] Frontend implementado (próxima etapa)

---

🎉 **Backend pronto para Google SSO!**
