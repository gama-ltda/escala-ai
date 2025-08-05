# 🚀 Guia de Deploy - escala-aí

Este guia contém instruções detalhadas para fazer o deploy da aplicação **escala-aí**.

## 📋 Pré-requisitos

- Conta no [Firebase](https://console.firebase.google.com/)
- Conta no [Vercel](https://vercel.com/) (recomendado)
- Node.js 18+ instalado localmente

## 🔥 Configuração do Firebase

### 1. Criar Projeto Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Siga os passos de configuração

### 2. Configurar Authentication

1. No painel do Firebase, vá em **Authentication**
2. Clique em **Começar**
3. Na aba **Sign-in method**, habilite:
   - **Email/senha**
4. Configure domínios autorizados (adicionar domínio de produção)

### 3. Configurar Firestore

1. No painel do Firebase, vá em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Iniciar no modo de teste** (temporário)
4. Selecione uma localização (recomendado: `southamerica-east1`)

### 4. Configurar Regras de Segurança

Copie o conteúdo do arquivo `firestore.rules` e cole nas regras do Firestore:

1. Vá em **Firestore Database > Regras**
2. Substitua o conteúdo pelas regras do projeto
3. Clique em **Publicar**

### 5. Obter Configurações

1. Vá em **Configurações do projeto** (ícone de engrenagem)
2. Na seção **Seus aplicativos**, clique em **</>** (Web)
3. Registre um novo aplicativo com nome "escala-ai"
4. Copie as configurações do Firebase

## 🌐 Deploy na Vercel

### 1. Preparar Repositório

```bash
# Inicializar git (se ainda não foi feito)
git init
git add .
git commit -m "Initial commit"

# Enviar para GitHub/GitLab
git remote add origin <seu-repositorio>
git push -u origin main
```

### 2. Conectar com Vercel

1. Acesse [vercel.com](https://vercel.com/)
2. Faça login com GitHub/GitLab
3. Clique em **New Project**
4. Selecione o repositório do **escala-aí**
5. Configure as variáveis de ambiente (próximo passo)

### 3. Configurar Variáveis de Ambiente

Na Vercel, adicione as seguintes variáveis de ambiente:

```bash
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Application
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
NEXTAUTH_URL=https://your-domain.vercel.app

# Environment
NODE_ENV=production
```

### 4. Deploy

1. Clique em **Deploy**
2. Aguarde o build e deploy
3. Acesse sua aplicação no domínio fornecido

## 🔧 Configurações Pós-Deploy

### 1. Atualizar Domínios Autorizados

No Firebase Authentication:
1. Vá em **Authentication > Settings > Authorized domains**
2. Adicione seu domínio Vercel: `your-app.vercel.app`

### 2. Configurar Domínio Personalizado (Opcional)

Na Vercel:
1. Vá em **Settings > Domains**
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

### 3. Monitoramento

- Configure alertas no Vercel para erros
- Monitore uso do Firebase
- Configure backup do Firestore (recomendado)

## 🛠️ Deploy Alternativo (Netlify)

Se preferir usar Netlify:

### 1. Build Settings

```bash
# Build command
npm run build

# Publish directory
.next

# Environment variables
# (mesmas da Vercel)
```

### 2. Redirects

Criar arquivo `public/_redirects`:

```
/api/* /.netlify/functions/:splat 200
/* /index.html 200
```

## 🔍 Troubleshooting

### Erro: "Firebase not initialized"

- Verifique se todas as variáveis de ambiente estão configuradas
- Confirme se o projeto Firebase está ativo

### Erro: "Permission denied"

- Verifique as regras do Firestore
- Confirme se o usuário está autenticado

### Erro de Build

```bash
# Limpar cache local
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Erro de CORS

- Adicione domínio nas configurações do Firebase
- Verifique `next.config.js`

## 📊 Otimizações de Produção

### 1. Performance

- Images otimizadas com Next.js Image
- Lazy loading implementado
- Bundle analyzer para otimização

### 2. SEO

- Meta tags configuradas
- Sitemap gerado automaticamente
- Open Graph configurado

### 3. Segurança

- Headers de segurança configurados
- Validação server-side
- Rate limiting (implementar se necessário)

## 🔄 Atualizações

Para deploy de atualizações:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

A Vercel fará deploy automático a cada push na branch main.

## 📞 Suporte

Em caso de problemas:

1. Verifique logs na Vercel Dashboard
2. Consulte logs do Firebase Console
3. Verifique este guia novamente
4. Contate o suporte técnico

---

**🎉 Parabéns! Sua aplicação escala-aí está no ar!**