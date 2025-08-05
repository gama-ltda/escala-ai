// Tipos de usuário e roles
export type UserRole = 'master_admin' | 'admin' | 'player';

export type PlayerStatus = 'pending' | 'approved' | 'rejected';

export type GameStatus = 'active' | 'finished' | 'cancelled';

export type MatchWinner = 'team_a' | 'team_b' | 'draw';

export type TeamType = 'team_a' | 'team_b';

// Interface para usuário autenticado
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para perfil de usuário
export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para pelada
export interface Pelada {
  id: string;
  title: string;
  description?: string;
  address?: string;
  adminId: string;
  playersPerTeam: number;
  maxPlayers: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para jogador
export interface Player {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  skillLevel: number; // 1-5
  status: PlayerStatus;
  peladaId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para jogo
export interface Game {
  id: string;
  title: string;
  gameDate: Date;
  startTime: string;
  endTime: string;
  observations?: string;
  status: GameStatus;
  adminId: string;
  peladaId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para jogadores no jogo
export interface GamePlayer {
  id: string;
  gameId: string;
  playerId: string;
  checkedInAt: Date;
  wins: number;
  isPresent: boolean;
  checkedInOnDay: boolean;
  checkedInOnDayAt?: Date;
  player?: Player; // Populated field
}

// Interface para partida
export interface Match {
  id: string;
  gameId: string;
  teamAPlayers: string[]; // Array de IDs dos jogadores
  teamBPlayers: string[]; // Array de IDs dos jogadores
  winner?: MatchWinner;
  playedAt: Date;
  startTime?: Date;
  endTime?: Date;
  matchDurationSeconds?: number;
  isPaused: boolean;
  pausedAt?: Date;
}

// Interface para gol
export interface Goal {
  id: string;
  matchId: string;
  playerId: string;
  team: TeamType;
  minute: number;
  createdAt: Date;
}

// Tipos para formulários
export interface CreatePeladaForm {
  title: string;
  description?: string;
  address?: string;
  playersPerTeam: number;
  maxPlayers: number;
}

export interface CreateGameForm {
  title: string;
  gameDate: Date;
  startTime: string;
  endTime: string;
  observations?: string;
  peladaId: string;
}

export interface PlayerRegistrationForm {
  name: string;
  email: string;
  phone?: string;
  peladaName: string; // Nome da pelada para encontrar
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  role: 'admin' | 'player';
}

// Tipos para estado da aplicação
export interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: RegisterForm) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

export interface GameState {
  currentGame: Game | null;
  players: GamePlayer[];
  matches: Match[];
  loading: boolean;
  setCurrentGame: (game: Game | null) => void;
  addPlayer: (player: GamePlayer) => void;
  removePlayer: (playerId: string) => void;
  updatePlayerPresence: (playerId: string, isPresent: boolean) => void;
  addMatch: (match: Match) => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => void;
}

// Tipos para algoritmo de formação de times
export interface TeamFormationInput {
  players: GamePlayer[];
  playersPerTeam: number;
}

export interface TeamFormationResult {
  teams: {
    teamA: GamePlayer[];
    teamB: GamePlayer[];
  }[];
  waitingQueue: GamePlayer[];
}

// Tipos para estatísticas
export interface PlayerStats {
  playerId: string;
  playerName: string;
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  goals: number;
}

export interface GameStats {
  gameId: string;
  totalMatches: number;
  totalPlayers: number;
  playerStats: PlayerStats[];
  duration: number; // em minutos
}