# ⚽ escala-aí

Organize sua pelada com inteligência. Times equilibrados, controle automático e muito mais!

## 🚀 Tecnologias

- **Next.js 14** (App Router) com TypeScript
- **Material UI** para componentes e design system
- **Zustand** para gerenciamento de estado global
- **Zod** para validação de dados
- **Firebase Auth** para autenticação
- **Firestore** para banco de dados
- **React Hook Form** para formulários otimizados

## 📁 Estrutura do Projeto

```
escala-ai/
├── app/                    # Next.js App Router
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Dashboard admin/player
│   ├── api/               # API routes
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Landing page
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── ui/                # Componentes base reutilizáveis
│   ├── forms/             # Componentes de formulários
│   └── layout/            # Componentes de layout
├── hooks/                 # Custom hooks
├── lib/                   # Utilitários e configurações
│   ├── firebase.ts        # Configuração Firebase
│   ├── theme.ts           # Tema Material UI
│   └── validations.ts     # Schemas Zod
├── services/              # Serviços de API
├── stores/                # Stores Zustand
├── types/                 # Definições TypeScript
└── styles/                # Estilos adicionais
```

## 🛠️ Setup do Projeto

### 1. Instalação das Dependências

```bash
npm install
```

### 2. Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Authentication (Email/Password)
3. Crie um banco Firestore
4. Copie as configurações do projeto

### 3. Variáveis de Ambiente

```bash
cp .env.example .env.local
```

Preencha as variáveis no arquivo `.env.local` com suas configurações do Firebase.

### 4. Executar o Projeto

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start

# Verificação de tipos
npm run type-check
```

## 🎯 Funcionalidades

### Para Administradores
- ✅ Criar e gerenciar peladas
- ✅ Aprovar/rejeitar jogadores
- ✅ Criar jogos com data/horário
- ✅ Controlar presença dos jogadores
- ✅ Formar times automaticamente
- ✅ Registrar resultados das partidas
- ✅ Visualizar estatísticas

### Para Jogadores
- ✅ Cadastro em peladas
- ✅ Confirmação de presença
- ✅ Check-in no local do jogo
- ✅ Visualização de times e partidas
- ✅ Histórico pessoal

## 🔐 Estrutura de Autenticação

### Roles do Sistema
- **master_admin**: Controle total do sistema
- **admin**: Criação e gerenciamento de peladas
- **player**: Participação em jogos

### Fluxo de Cadastro
1. Admin se cadastra → recebe role `admin`
2. Admin cria pelada
3. Jogador se cadastra → status `pending`
4. Admin aprova jogador → status `approved`
5. Jogador pode participar dos jogos

## 📊 Banco de Dados (Firestore)

### Coleções Principais
- `profiles` - Perfis de usuários
- `peladas` - Peladas criadas
- `games` - Jogos agendados
- `players` - Jogadores das peladas
- `game_players` - Relação jogador-jogo
- `matches` - Partidas realizadas
- `goals` - Gols marcados

## 🎨 Design System

O projeto utiliza Material UI com tema personalizado:
- **Cores primárias**: Verde futebol (#2E7D32)
- **Cores secundárias**: Laranja vibrante (#FF6F00)
- **Tipografia**: Inter (clean e moderna)
- **Responsividade**: Mobile-first
- **Tema**: Claro/escuro (implementação futura)

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm i -g vercel
vercel
```

### Configuração de Produção
1. Configure as variáveis de ambiente na plataforma
2. Configure o domínio no Firebase Auth
3. Ajuste as regras do Firestore para produção

## 📝 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de linting
- `npm run type-check` - Verificação de tipos TypeScript

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**⚽ escala-aí** - Organize, jogue e conquiste. Sua pelada nunca mais será a mesma.