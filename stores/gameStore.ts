import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  Game, 
  GamePlayer, 
  Match, 
  Pelada, 
  Player,
  GameState,
  TeamFormationResult 
} from '@/types';
import {
  getGameById,
  getGamePlayers,
  getMatchesByGame,
  addPlayerToGame,
  removePlayerFromGame,
  checkInPlayerOnDay,
  createMatch,
  updateMatchResult,
} from '@/services/firestore';
import { generateTeams } from '@/lib/teamFormation';

interface GameStore extends GameState {
  // Estado adicional
  selectedPelada: Pelada | null;
  availablePlayers: Player[];
  presentPlayers: GamePlayer[];
  teamFormation: TeamFormationResult | null;
  
  // Ações
  setCurrentGame: (game: Game | null) => void;
  setSelectedPelada: (pelada: Pelada | null) => void;
  loadGame: (gameId: string) => Promise<void>;
  loadGamePlayers: (gameId: string) => Promise<void>;
  loadMatches: (gameId: string) => Promise<void>;
  addPlayer: (gameId: string, playerId: string) => Promise<void>;
  removePlayer: (gamePlayerId: string) => Promise<void>;
  checkInPlayer: (gamePlayerId: string) => Promise<void>;
  updatePlayerPresence: (playerId: string, isPresent: boolean) => void;
  generateTeamFormation: () => void;
  createNewMatch: (teamAPlayers: string[], teamBPlayers: string[]) => Promise<string>;
  finishMatch: (matchId: string, winner: 'team_a' | 'team_b' | 'draw') => Promise<void>;
  addMatch: (match: Match) => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    // Estado inicial
    currentGame: null,
    selectedPelada: null,
    players: [],
    availablePlayers: [],
    presentPlayers: [],
    matches: [],
    teamFormation: null,
    loading: false,

    // Definir jogo atual
    setCurrentGame: (game: Game | null) => {
      set({ currentGame: game });
      if (!game) {
        set({ players: [], matches: [], teamFormation: null });
      }
    },

    // Definir pelada selecionada
    setSelectedPelada: (pelada: Pelada | null) => {
      set({ selectedPelada: pelada });
    },

    // Carregar dados do jogo
    loadGame: async (gameId: string) => {
      try {
        set({ loading: true });
        const game = await getGameById(gameId);
        if (game) {
          set({ currentGame: game });
          // Carregar dados relacionados
          await Promise.all([
            get().loadGamePlayers(gameId),
            get().loadMatches(gameId),
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar jogo:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    // Carregar jogadores do jogo
    loadGamePlayers: async (gameId: string) => {
      try {
        const gamePlayers = await getGamePlayers(gameId);
        const presentPlayers = gamePlayers.filter(gp => gp.isPresent && gp.checkedInOnDay);
        
        set({ 
          players: gamePlayers,
          presentPlayers,
        });

        // Gerar formação de times se houver jogadores presentes
        if (presentPlayers.length > 0) {
          get().generateTeamFormation();
        }
      } catch (error) {
        console.error('Erro ao carregar jogadores:', error);
        throw error;
      }
    },

    // Carregar partidas do jogo
    loadMatches: async (gameId: string) => {
      try {
        const matches = await getMatchesByGame(gameId);
        set({ matches });
      } catch (error) {
        console.error('Erro ao carregar partidas:', error);
        throw error;
      }
    },

    // Adicionar jogador ao jogo
    addPlayer: async (gameId: string, playerId: string) => {
      try {
        set({ loading: true });
        const gamePlayerId = await addPlayerToGame(gameId, playerId);
        
        // Recarregar lista de jogadores
        await get().loadGamePlayers(gameId);
      } catch (error) {
        console.error('Erro ao adicionar jogador:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    // Remover jogador do jogo
    removePlayer: async (gamePlayerId: string) => {
      try {
        set({ loading: true });
        await removePlayerFromGame(gamePlayerId);
        
        // Atualizar estado local
        const currentPlayers = get().players;
        const updatedPlayers = currentPlayers.map(player => 
          player.id === gamePlayerId 
            ? { ...player, isPresent: false }
            : player
        );
        
        const presentPlayers = updatedPlayers.filter(gp => gp.isPresent && gp.checkedInOnDay);
        
        set({ 
          players: updatedPlayers,
          presentPlayers,
        });

        // Regenerar formação de times
        get().generateTeamFormation();
      } catch (error) {
        console.error('Erro ao remover jogador:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    // Check-in do jogador no dia
    checkInPlayer: async (gamePlayerId: string) => {
      try {
        set({ loading: true });
        await checkInPlayerOnDay(gamePlayerId);
        
        // Atualizar estado local
        const currentPlayers = get().players;
        const updatedPlayers = currentPlayers.map(player => 
          player.id === gamePlayerId 
            ? { 
                ...player, 
                checkedInOnDay: true, 
                checkedInOnDayAt: new Date() 
              }
            : player
        );
        
        const presentPlayers = updatedPlayers.filter(gp => gp.isPresent && gp.checkedInOnDay);
        
        set({ 
          players: updatedPlayers,
          presentPlayers,
        });

        // Regenerar formação de times
        get().generateTeamFormation();
      } catch (error) {
        console.error('Erro ao fazer check-in:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    // Atualizar presença do jogador (estado local)
    updatePlayerPresence: (playerId: string, isPresent: boolean) => {
      const currentPlayers = get().players;
      const updatedPlayers = currentPlayers.map(player => 
        player.playerId === playerId 
          ? { ...player, isPresent }
          : player
      );
      
      const presentPlayers = updatedPlayers.filter(gp => gp.isPresent && gp.checkedInOnDay);
      
      set({ 
        players: updatedPlayers,
        presentPlayers,
      });

      // Regenerar formação de times
      get().generateTeamFormation();
    },

    // Gerar formação de times
    generateTeamFormation: () => {
      const { currentGame, presentPlayers } = get();
      
      if (!currentGame || presentPlayers.length === 0) {
        set({ teamFormation: null });
        return;
      }

      try {
        const teamFormation = generateTeams(presentPlayers, currentGame.playersPerTeam || 5);
        set({ teamFormation });
      } catch (error) {
        console.error('Erro ao gerar formação de times:', error);
        set({ teamFormation: null });
      }
    },

    // Criar nova partida
    createNewMatch: async (teamAPlayers: string[], teamBPlayers: string[]) => {
      const { currentGame } = get();
      if (!currentGame) throw new Error('Nenhum jogo selecionado');

      try {
        set({ loading: true });
        const matchId = await createMatch(currentGame.id, teamAPlayers, teamBPlayers);
        
        // Recarregar partidas
        await get().loadMatches(currentGame.id);
        
        return matchId;
      } catch (error) {
        console.error('Erro ao criar partida:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    // Finalizar partida
    finishMatch: async (matchId: string, winner: 'team_a' | 'team_b' | 'draw') => {
      const { currentGame } = get();
      if (!currentGame) throw new Error('Nenhum jogo selecionado');

      try {
        set({ loading: true });
        await updateMatchResult(matchId, winner);
        
        // Recarregar dados
        await Promise.all([
          get().loadMatches(currentGame.id),
          get().loadGamePlayers(currentGame.id),
        ]);
      } catch (error) {
        console.error('Erro ao finalizar partida:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    // Adicionar partida ao estado
    addMatch: (match: Match) => {
      const currentMatches = get().matches;
      set({ matches: [match, ...currentMatches] });
    },

    // Atualizar partida no estado
    updateMatch: (matchId: string, updates: Partial<Match>) => {
      const currentMatches = get().matches;
      const updatedMatches = currentMatches.map(match => 
        match.id === matchId 
          ? { ...match, ...updates }
          : match
      );
      set({ matches: updatedMatches });
    },

    // Definir estado de loading
    setLoading: (loading: boolean) => {
      set({ loading });
    },

    // Resetar estado
    reset: () => {
      set({
        currentGame: null,
        selectedPelada: null,
        players: [],
        availablePlayers: [],
        presentPlayers: [],
        matches: [],
        teamFormation: null,
        loading: false,
      });
    },
  }))
);

// Hooks especializados
export const useCurrentGame = () => {
  const { currentGame, loading } = useGameStore();
  return { currentGame, loading };
};

export const useGamePlayers = () => {
  const { players, presentPlayers, loading } = useGameStore();
  return { players, presentPlayers, loading };
};

export const useTeamFormation = () => {
  const { teamFormation, generateTeamFormation } = useGameStore();
  return { teamFormation, generateTeamFormation };
};

export const useGameActions = () => {
  const {
    loadGame,
    addPlayer,
    removePlayer,
    checkInPlayer,
    createNewMatch,
    finishMatch,
    reset,
  } = useGameStore();
  
  return {
    loadGame,
    addPlayer,
    removePlayer,
    checkInPlayer,
    createNewMatch,
    finishMatch,
    reset,
  };
};