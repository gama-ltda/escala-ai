Quero que você atue como um desenvolvedor sênior e gere TODO o código (ou exemplos prontos para colar) para o MVP para Futebol Amador chamado escala-aí. O código deve ser limpo, modular, escalável, responsivo e com boas práticas modernas.

A ideia é automatizar o que hoje é feito manualmente via WhatsApp: lista de presença, ordem de chegada, formação de times e controle dos jogos.

---

✅ Stack obrigatória:
- Next.js (App Router) com TypeScript
- Material UI
- Zustand (gerenciamento de estado)
- Zod (validação de dados)
- Firebase Auth (login/cadastro)
- Firestore (banco de dados)

---

✅ Fluxo:
Admin cadastra → cria pelada + role admin
Jogador cadastra → role player + registro em players (pending)
Admin aprova jogador via dashboard
Jogador acessa dashboard e vê jogos onde foi aprovado


---

✅ Regras de qualidade:
- Arquitetura escalável e modular
- Código limpo com separação clara de responsabilidades
- Boas práticas: Single Responsibility, DRY, Separation of Concerns
- Tipagem forte com TypeScript
- Uso de Zustand para gerenciamento global de estado (auth, automações, tema)
- Validação com Zod em todos os formulários e entradas
- Material UI como base visual
- Responsividade total (mobile/tablet/desktop)
- Código comentado e explicativo onde necessário

---

✅ Estrutura de dados:
- Estrutura existente de um app no supabase com a mesma funcionalidade (corrija onde necessario):
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.game_players (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL,
  player_id uuid NOT NULL,
  checked_in_at timestamp with time zone NOT NULL DEFAULT now(),
  wins integer NOT NULL DEFAULT 0,
  is_present boolean NOT NULL DEFAULT true,
  checked_in_on_day boolean NOT NULL DEFAULT false,
  checked_in_on_day_at timestamp with time zone,
  CONSTRAINT game_players_pkey PRIMARY KEY (id),
  CONSTRAINT game_players_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id),
  CONSTRAINT game_players_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id)
);
CREATE TABLE public.games (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Pelada'::text UNIQUE,
  game_date date NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  observations text,
  status text NOT NULL DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'finished'::text, 'cancelled'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  admin_id uuid,
  pelada_id uuid,
  CONSTRAINT games_pkey PRIMARY KEY (id),
  CONSTRAINT games_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id),
  CONSTRAINT games_pelada_id_fkey FOREIGN KEY (pelada_id) REFERENCES public.peladas(id)
);
CREATE TABLE public.goals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL,
  player_id uuid NOT NULL,
  team character varying NOT NULL CHECK (team::text = ANY (ARRAY['team_a'::character varying, 'team_b'::character varying]::text[])),
  minute integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT goals_pkey PRIMARY KEY (id),
  CONSTRAINT goals_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id)
);
CREATE TABLE public.matches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL,
  team_a_players ARRAY NOT NULL,
  team_b_players ARRAY NOT NULL,
  winner text CHECK (winner = ANY (ARRAY['team_a'::text, 'team_b'::text, 'draw'::text])),
  played_at timestamp with time zone NOT NULL DEFAULT now(),
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  match_duration_seconds integer DEFAULT 0,
  is_paused boolean DEFAULT false,
  paused_at timestamp with time zone,
  CONSTRAINT matches_pkey PRIMARY KEY (id),
  CONSTRAINT matches_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id)
);
CREATE TABLE public.peladas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Nova Pelada'::text,
  description text,
  address text,
  admin_id uuid,
  players_per_team integer NOT NULL DEFAULT 5,
  max_players integer NOT NULL DEFAULT 25,
  status text NOT NULL DEFAULT 'active'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT peladas_pkey PRIMARY KEY (id),
  CONSTRAINT peladas_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES auth.users(id)
);
CREATE TABLE public.players (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  skill_level integer NOT NULL CHECK (skill_level >= 1 AND skill_level <= 5),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  email text,
  phone text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  password_hash text,
  pelada_id uuid,
  CONSTRAINT players_pkey PRIMARY KEY (id),
  CONSTRAINT players_pelada_id_fkey FOREIGN KEY (pelada_id) REFERENCES public.peladas(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  email text UNIQUE,
  phone text,
  role USER-DEFINED NOT NULL DEFAULT 'player'::user_role,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

---

✅ Tarefas (entregue código ou exemplos prontos para colar para cada):

### 1️⃣ Setup inicial
- Projeto Next.js com TypeScript
- Instalação e setup do Material UI
- Setup de Zustand e Zod
- Setup do Firebase (Auth + Firestore)
- Proposta de estrutura de pastas escalável

---

### 2️⃣ Firebase
- Inicialização em /lib/firebase.ts
- Configuração do Auth com TypeScript
- Firestore com segurança mínima
- Firestore Rules sugeridas
- Crie as roles necessarias de master_admin (gerenciar todo o banco), admin (cria nova pelada, gerencia jogadores etc), players

---

### 3️⃣ State Management (Zustand)
- Store global com:
  - Estado do usuário (auth)
- Boas práticas para organização de stores

---

### 5️⃣ Autenticação
- Páginas de Login/Cadastro com Material UI
- Formulários com validação usando Zod
- Integração completa com Firebase Auth
- Middleware ou hook para rotas protegidas

---

### 🔟 Landing Page (Home)
- Página pública, minimalista e impactante
- Responsiva, leve, bonita e integrada com o tema claro/escuro
- Código modular com componentes reutilizáveis
- Siga textos e estruturas abaixo (adpatando para usar Material UI):
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Trophy, Users, Calendar, Clock, Share, Zap, Target, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-soccer.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Hero Section */}
      <div 
        className="relative h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-glow/70"></div>
        <div className="relative text-center text-white z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
            ⚽ escala-aí
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Organize sua pelada com inteligência.<br />
            Times equilibrados, controle automático e muito mais!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button variant="field" size="lg" className="text-lg px-8 py-4">
                <Trophy className="h-5 w-5" />
                Área do Organizador
              </Button>
            </Link>
            <Link to="/auth?tab=player">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Users className="h-5 w-5" />
                Sou Jogador
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Chega de WhatsApp bagunçado!
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Automatize a organização da sua pelada com tecnologia de ponta
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Registro Inteligente</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Jogadores se cadastram diretamente na pelada. Sistema de aprovação
                e controle automático de presença no local.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Times Equilibrados</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Algoritmo inteligente monta times baseado na habilidade e ordem de chegada.
                Sem mais discussão sobre quem vai para qual time!
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Controle Automático</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Time perdedor vai para o fim da fila. Pontuação individual por vitória.
                Dinâmica de quadra 100% automatizada.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Controle de Tempo</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Defina horário de início e fim. O sistema se encarrega de encerrar 
                automaticamente e gerar relatórios completos.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Sem Complicação</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Interface simples e intuitiva. Funciona em qualquer dispositivo.
                Seus amigos não precisam baixar nenhum app.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Estatísticas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Acompanhe quem são os maiores vencedores, histórico de confrontos
                e estatísticas detalhadas de cada pelada.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Como Funciona?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Organize</h3>
              <p className="text-muted-foreground">
                Crie o jogo definindo data, horário, número de jogadores por time e limite máximo
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Registre</h3>
              <p className="text-muted-foreground">
                Jogadores se cadastram informando o nome da pelada, criando conta e aguardando aprovação
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Jogue</h3>
              <p className="text-muted-foreground">
                Times são montados automaticamente. Controle os resultados e deixe o sistema cuidar do resto
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="shadow-xl border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para revolucionar sua pelada?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Comece agora mesmo e veja como é fácil organizar jogos de futebol com o escala-aí
            </p>
            <Link to="/auth">
              <Button variant="field" size="lg" className="text-lg px-8 py-4">
                <Trophy className="h-5 w-5" />
                Começar Agora - Grátis
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-lg mb-2">⚽ escala-aí</p>
          <p className="opacity-80">
            Organize, jogue e conquiste. Sua pelada nunca mais será a mesma.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

---

### 🔁 Organização do Projeto
- Estrutura de pastas:
  - /app
  - /components
  - /hooks
  - /lib
  - /services
  - /stores
  - /types
  - /styles
- Padrões de nomenclatura
- Organização clara para facilitar manutenção e crescimento

---

### 🚀 Deploy
- Sugestão de deploy (ex: Vercel)
- Configuração de variáveis de ambiente
- Práticas para guardar secrets

---

✅ Para cada tarefa:
- Me entregue o código completo ou o maior exemplo possível
- Use TypeScript
- Siga boas práticas modernas
- Explique brevemente cada parte
- Aguarde minha aprovação antes de seguir para a próxima tarefa

---

✅ Importante:
- Design responsivo e intuitivo
- Código limpo e modular
- Pensado para escalar e facilitar onboarding de outros devs

---

Comece pela tarefa 1. Me mostre o resultado e confirme se quero continuar antes de passar para a tarefa 2.

----

Observacoes do produto:
 Visão Geral:
	•	Um administrador organiza a pelada via dashboard.
	•	Ele cadastra data, horário inicial e final, número de jogadores por time e limite máximo de jogadores.
	•	Durante a partida, o sistema mantém times equilibrados e controla a fila de espera.
	•	Cada jogador acumula pontuação individual com base nas partidas que participou e venceu.

 Dashboard:
	•	Login de administrador.
	•	Criação de nova pelada com:
	•	Data do jogo
	•	Horário inicial e final
	•	Número de jogadores por time (ex: 5x5)
	•	Limite máximo de jogadores (ex: 25)
	•	Campo opcional de observações (ex: clima, local, etc.)
	•	Visualização e gerenciamento da sessão em tempo real:
	•	Remover jogadores
	•	Registrar resultados
	•	Encerrar manualmente o jogo (antes ou depois do horário final)

Dashboard:
Cadastro de jogadores com:
	•	Nome, email e telefone

Check-in e Remoções
	•	Jogadores são ordenados conforme a ordem real de chegada
	•	O admin pode remover jogadores que desistiram ou foram embora
	•	A ordem e os times são automaticamente reatualizados

Há uma diferença entre: confirmar que estarei presente no jogo de determinado dia e no dia do jogo (somente no dia), confirmar que chegou no local e está pronto para jogar
Em nenhum local do frontend deve ter a visualização do nível do jogador, essa informação é cadastrada e visualizadas somente pelo admin

 Montagem Automática dos Times
	•	Times são formados com base:
	•	Na ordem de chegada
	•	E no nível de habilidade (tentando equilibrar a soma dos níveis)
	•	Exemplo: 10 jogadores → 2 times de 5 equilibrados
	•	Se mais de 10 jogadores:
	•	Novos times são formados e organizados em fila de espera
	•	Jogadores excedentes aguardam sua vez de jogar

🔁 Dinâmica de Quadra
	•	Após cada partida, o admin registra o resultado:
	•	Time A venceu
	•	Time B venceu
	•	Empate → admin escolhe qual sai
	•	Time perdedor vai para o fim da fila
	•	Time vencedor continua
	•	Fila é atualizada automaticamente

🧮 Pontuação Individual dos Jogadores
	•	Cada jogador acumula 1 ponto individual por vitória
	•	O ponto é contabilizado por jogador, não por time fixo, pois as formações podem mudar a cada rodada
	•	Pontuação aparece no dashboard ao final do jogo

⛔ Encerramento automático
	•	O jogo é automaticamente encerrado quando o horário final é atingido
	•	O link de presença fica desativado
	•	Relatório final com:
	•	Lista de jogadores
	•	Jogos disputados
	•	Vitórias por jogador
	•	Total de vitórias, derrotas e empates
	•	Histórico de confrontos

⸻

🧪 Algoritmo de Montagem dos Times

Entrada:
	•	Lista de jogadores presentes
	•	Ordem de chegada
	•	Habilidade (1 a 5)
	•	Número de jogadores por time

Saída:
	•	Formações equilibradas com base nas somas de habilidade
	•	Fila dinâmica
	•	Atualização dos times conforme resultado de cada partida
