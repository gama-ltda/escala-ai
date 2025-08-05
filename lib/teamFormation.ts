import { GamePlayer, TeamFormationResult, Player } from '@/types';

/**
 * Algoritmo para formar times equilibrados
 * Baseado em habilidade e ordem de chegada
 */
export function generateTeams(
  players: GamePlayer[],
  playersPerTeam: number
): TeamFormationResult {
  // Filtrar apenas jogadores presentes e que fizeram check-in
  const availablePlayers = players.filter(p => p.isPresent && p.checkedInOnDay);
  
  if (availablePlayers.length < playersPerTeam * 2) {
    return {
      teams: [],
      waitingQueue: availablePlayers,
    };
  }

  // Ordenar por ordem de chegada (checkedInAt)
  const sortedPlayers = [...availablePlayers].sort((a, b) => 
    new Date(a.checkedInAt).getTime() - new Date(b.checkedInAt).getTime()
  );

  const teams: { teamA: GamePlayer[]; teamB: GamePlayer[] }[] = [];
  const totalPlayersPerMatch = playersPerTeam * 2;
  let currentIndex = 0;

  // Formar times enquanto houver jogadores suficientes
  while (currentIndex + totalPlayersPerMatch <= sortedPlayers.length) {
    const matchPlayers = sortedPlayers.slice(currentIndex, currentIndex + totalPlayersPerMatch);
    
    // Formar times equilibrados para esta partida
    const { teamA, teamB } = formBalancedTeams(matchPlayers, playersPerTeam);
    
    teams.push({ teamA, teamB });
    currentIndex += totalPlayersPerMatch;
  }

  // Jogadores restantes ficam na fila de espera
  const waitingQueue = sortedPlayers.slice(currentIndex);

  return {
    teams,
    waitingQueue,
  };
}

/**
 * Forma dois times equilibrados com base na habilidade
 */
function formBalancedTeams(
  players: GamePlayer[],
  playersPerTeam: number
): { teamA: GamePlayer[]; teamB: GamePlayer[] } {
  // Se não temos informação de habilidade, dividir alternadamente
  if (!players.some(p => p.player?.skillLevel)) {
    return formAlternatingTeams(players, playersPerTeam);
  }

  // Ordenar por habilidade (descendente)
  const sortedBySkill = [...players].sort((a, b) => {
    const skillA = a.player?.skillLevel || 3;
    const skillB = b.player?.skillLevel || 3;
    return skillB - skillA;
  });

  // Algoritmo de draft: alternar escolhas começando pelo melhor jogador
  const teamA: GamePlayer[] = [];
  const teamB: GamePlayer[] = [];

  for (let i = 0; i < sortedBySkill.length; i++) {
    // Calcular soma atual de habilidades de cada time
    const teamASkill = teamA.reduce((sum, p) => sum + (p.player?.skillLevel || 3), 0);
    const teamBSkill = teamB.reduce((sum, p) => sum + (p.player?.skillLevel || 3), 0);

    // Adicionar ao time com menor soma de habilidades
    // Se empate, alternar
    const shouldAddToTeamA = teamASkill < teamBSkill || 
                            (teamASkill === teamBSkill && i % 2 === 0);

    if (shouldAddToTeamA && teamA.length < playersPerTeam) {
      teamA.push(sortedBySkill[i]);
    } else if (teamB.length < playersPerTeam) {
      teamB.push(sortedBySkill[i]);
    } else {
      teamA.push(sortedBySkill[i]);
    }
  }

  return { teamA, teamB };
}

/**
 * Forma times alternando jogadores (fallback quando não há dados de habilidade)
 */
function formAlternatingTeams(
  players: GamePlayer[],
  playersPerTeam: number
): { teamA: GamePlayer[]; teamB: GamePlayer[] } {
  const teamA: GamePlayer[] = [];
  const teamB: GamePlayer[] = [];

  for (let i = 0; i < players.length; i++) {
    if (i % 2 === 0) {
      teamA.push(players[i]);
    } else {
      teamB.push(players[i]);
    }
  }

  return { teamA, teamB };
}

/**
 * Calcula estatísticas de um time
 */
export function calculateTeamStats(team: GamePlayer[]) {
  const totalSkill = team.reduce((sum, player) => sum + (player.player?.skillLevel || 3), 0);
  const averageSkill = team.length > 0 ? totalSkill / team.length : 0;
  const totalWins = team.reduce((sum, player) => sum + player.wins, 0);

  return {
    totalPlayers: team.length,
    totalSkill,
    averageSkill: Math.round(averageSkill * 10) / 10,
    totalWins,
  };
}

/**
 * Reorganiza fila após resultado de partida
 * Time perdedor vai para o fim da fila
 */
export function reorganizeQueue(
  currentTeams: { teamA: GamePlayer[]; teamB: GamePlayer[] }[],
  waitingQueue: GamePlayer[],
  matchIndex: number,
  winner: 'team_a' | 'team_b' | 'draw',
  adminChoice?: 'team_a' | 'team_b' // Em caso de empate, admin escolhe quem sai
): {
  newTeams: { teamA: GamePlayer[]; teamB: GamePlayer[] }[];
  newWaitingQueue: GamePlayer[];
} {
  if (!currentTeams[matchIndex]) {
    return { newTeams: currentTeams, newWaitingQueue: waitingQueue };
  }

  const match = currentTeams[matchIndex];
  let losingTeam: GamePlayer[];
  let winningTeam: GamePlayer[];

  // Determinar time perdedor
  if (winner === 'team_a') {
    winningTeam = match.teamA;
    losingTeam = match.teamB;
  } else if (winner === 'team_b') {
    winningTeam = match.teamB;
    losingTeam = match.teamA;
  } else {
    // Empate - admin escolhe quem sai
    if (adminChoice === 'team_a') {
      losingTeam = match.teamA;
      winningTeam = match.teamB;
    } else {
      losingTeam = match.teamB;
      winningTeam = match.teamA;
    }
  }

  // Criar nova fila: time perdedor vai para o fim
  const newWaitingQueue = [...waitingQueue, ...losingTeam];
  
  // Formar novo time com jogadores da fila se houver suficientes
  const newTeams = [...currentTeams];
  
  if (newWaitingQueue.length >= winningTeam.length) {
    // Pegar próximos jogadores da fila
    const nextPlayers = newWaitingQueue.slice(0, winningTeam.length);
    const remainingQueue = newWaitingQueue.slice(winningTeam.length);
    
    // Formar times equilibrados
    const allPlayersForMatch = [...winningTeam, ...nextPlayers];
    const { teamA, teamB } = formBalancedTeams(allPlayersForMatch, winningTeam.length);
    
    newTeams[matchIndex] = { teamA, teamB };
    
    return {
      newTeams,
      newWaitingQueue: remainingQueue,
    };
  }

  // Se não há jogadores suficientes na fila, manter time vencedor
  return {
    newTeams: currentTeams,
    newWaitingQueue,
  };
}

/**
 * Valida se a formação de times é válida
 */
export function validateTeamFormation(
  teams: { teamA: GamePlayer[]; teamB: GamePlayer[] }[],
  playersPerTeam: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (let i = 0; i < teams.length; i++) {
    const { teamA, teamB } = teams[i];
    
    if (teamA.length !== playersPerTeam) {
      errors.push(`Time A da partida ${i + 1} tem ${teamA.length} jogadores, esperado ${playersPerTeam}`);
    }
    
    if (teamB.length !== playersPerTeam) {
      errors.push(`Time B da partida ${i + 1} tem ${teamB.length} jogadores, esperado ${playersPerTeam}`);
    }

    // Verificar se não há jogadores duplicados
    const allPlayerIds = [...teamA, ...teamB].map(p => p.id);
    const uniquePlayerIds = new Set(allPlayerIds);
    
    if (allPlayerIds.length !== uniquePlayerIds.size) {
      errors.push(`Partida ${i + 1} tem jogadores duplicados`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}