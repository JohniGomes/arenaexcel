# 📧 Configuração SMTP - Arena Excel

## 📋 Opções de Serviço de E-mail

### 🥇 Opção 1: SendGrid (Recomendado)

**Por quê?**
- ✅ 100 e-mails gratuitos por dia
- ✅ API simples e confiável
- ✅ Ótima entregabilidade
- ✅ Dashboard com estatísticas

**Setup:**
1. Criar conta: [sendgrid.com/free](https://sendgrid.com/free/)
2. Verificar e-mail
3. Criar API Key:
   - Settings → API Keys → Create API Key
   - Nome: `Arena Excel Production`
   - Permissões: **Mail Send** (Full Access)
   - Copiar a API Key (aparece uma vez só!)
4. Adicionar no `.env`:
   ```bash
   SMTP_HOST="smtp.sendgrid.net"
   SMTP_PORT="587"
   SMTP_USER="apikey"
   SMTP_PASS="SG.sua-api-key-aqui"
   SMTP_FROM="Arena Excel <noreply@arenaexcel.com>"
   ```

---

### 🥈 Opção 2: Gmail (Desenvolvimento)

**Por quê?**
- ✅ Fácil de configurar
- ✅ Grátis
- ⚠️ Limite: 500 e-mails/dia
- ⚠️ Pode cair em spam

**Setup:**
1. Ativar autenticação de dois fatores na conta Google
2. Criar App Password:
   - Acessar: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Selecionar app: **Mail**
   - Selecionar dispositivo: **Other (Custom name)** → `Arena Excel`
   - Gerar → Copiar a senha de 16 caracteres
3. Adicionar no `.env`:
   ```bash
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="seu-email@gmail.com"
   SMTP_PASS="senha-de-app-16-caracteres"
   SMTP_FROM="Arena Excel <seu-email@gmail.com>"
   ```

---

### 🥉 Opção 3: Resend (Moderna)

**Por quê?**
- ✅ 100 e-mails gratuitos por dia
- ✅ Interface moderna
- ✅ Ótima entregabilidade
- ✅ Suporte a React Email

**Setup:**
1. Criar conta: [resend.com/signup](https://resend.com/signup)
2. Verificar domínio (ou usar domínio compartilhado para teste)
3. Criar API Key:
   - API Keys → Create API Key
   - Nome: `Arena Excel`
   - Permissões: **Sending access**
4. Adicionar no `.env`:
   ```bash
   SMTP_HOST="smtp.resend.com"
   SMTP_PORT="587"
   SMTP_USER="resend"
   SMTP_PASS="re_sua-api-key-aqui"
   SMTP_FROM="Arena Excel <noreply@seu-dominio.com>"
   ```

---

### 🏢 Opção 4: AWS SES (Produção)

**Por quê?**
- ✅ 62.000 e-mails gratuitos por mês (via EC2)
- ✅ Altamente escalável
- ✅ Ótima entregabilidade
- ⚠️ Setup mais complexo

**Setup:**
1. Criar conta AWS
2. Ativar SES: [console.aws.amazon.com/ses](https://console.aws.amazon.com/ses)
3. Verificar domínio
4. Criar credenciais SMTP:
   - SMTP Settings → Create My SMTP Credentials
   - Copiar **SMTP Username** e **SMTP Password**
5. Adicionar no `.env`:
   ```bash
   SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
   SMTP_PORT="587"
   SMTP_USER="sua-smtp-username"
   SMTP_PASS="sua-smtp-password"
   SMTP_FROM="Arena Excel <noreply@seu-dominio.com>"
   ```

---

## 🧪 Testar Envio de E-mail

### Teste Manual via API

```bash
# 1. Solicitar reset de senha
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"seu-email@gmail.com"}'

# 2. Verificar logs do backend
# Deve aparecer: "✅ E-mail de reset enviado para: seu-email@gmail.com"

# 3. Verificar caixa de entrada
# Assunto: "🔐 Redefinição de Senha - Arena Excel"
```

### Logs de Debug

Se SMTP não estiver configurado:
```
⚠️  SMTP não configurado. E-mails serão apenas logados (não enviados).
Configure SMTP_HOST, SMTP_USER, SMTP_PASS no .env para enviar e-mails.
📧 [SIMULADO] E-mail de reset para: usuario@exemplo.com
Token: abc123def456...
URL: https://arenaexcel.excelcomjohni.com.br/reset-password?token=abc123def456
```

Se SMTP configurado corretamente:
```
✅ EmailService configurado: smtp.sendgrid.net:587
✅ E-mail de reset enviado para: usuario@exemplo.com
```

---

## 🎨 Personalização do E-mail

O template HTML está em:
```
/home/ubuntu/arena_excel/nodejs_space/src/services/email.service.ts
```

**Template atual:**
- 🐯 Logo Arena Excel
- 📧 Mensagem clara
- 🔘 Botão "Redefinir Senha"
- ⏰ Aviso de expiração (1 hora)
- 🎨 Design responsivo

**Para personalizar:**
1. Edite o `htmlContent` no método `sendPasswordResetEmail`
2. Adicione imagens hospedadas online
3. Ajuste cores e estilos inline

---

## 🔒 Segurança

### ✅ Boas Práticas Implementadas:
- ✅ Token de reset aleatório (64 caracteres hex)
- ✅ Expiração de 1 hora
- ✅ Token usado uma vez e depois invalidado
- ✅ E-mail HTML com link clicável
- ✅ Mensagem genérica (evita enumeration)

### ⚠️ Configurações Importantes:
- **Nunca** commite credenciais SMTP no Git
- Use **variáveis de ambiente** (.env)
- Em produção, use domínio verificado
- Configure **SPF/DKIM/DMARC** no DNS

---

## 🆘 Solução de Problemas

### E-mail cai em spam
**Causas:**
- Domínio não verificado
- Falta de SPF/DKIM
- IP sem reputação

**Soluções:**
- Use SendGrid ou AWS SES
- Verifique domínio no provedor
- Configure registros DNS
- Evite palavras suspeitas ("grátis", "ganhe")

### Erro: "Invalid login"
**Causas:**
- Credenciais incorretas
- App Password não gerado (Gmail)
- API Key inválida

**Soluções:**
- Gmail: Use App Password, não senha normal
- SendGrid: Verifique permissões da API Key
- Resend: Regenere a API Key

### E-mail não chega
**Debug:**
1. Verificar logs do backend
2. Verificar pasta de spam
3. Verificar limites diários
4. Testar com outro provedor

---

## 📊 Monitoramento

### Logs do Backend
```bash
cd /home/ubuntu/arena_excel/nodejs_space
yarn run start:dev

# Buscar por:
# ✅ E-mail de reset enviado
# ❌ Erro ao enviar e-mail
# ⚠️  SMTP não configurado
```

### Dashboard do Provedor
- **SendGrid:** [app.sendgrid.com/stats](https://app.sendgrid.com/stats)
- **AWS SES:** [console.aws.amazon.com/ses](https://console.aws.amazon.com/ses)
- **Resend:** [resend.com/emails](https://resend.com/emails)

---

## ✅ Checklist

- [ ] Provedor de e-mail escolhido
- [ ] Conta criada e verificada
- [ ] API Key ou credenciais SMTP obtidas
- [ ] Variáveis SMTP_* adicionadas no .env
- [ ] Backend reiniciado
- [ ] Teste de envio realizado
- [ ] E-mail recebido com sucesso
- [ ] Template HTML verificado
- [ ] Link de reset funcional

---

🎉 **Sistema de e-mail pronto!**
