import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Pelada,
  Game,
  Player,
  GamePlayer,
  Match,
  Goal,
  CreatePeladaFormData,
  CreateGameFormData,
  PlayerRegistrationFormData,
} from '@/types';

// ===== PELADAS =====

/**
 * Cria uma nova pelada
 */
export async function createPelada(
  data: CreatePeladaFormData,
  adminId: string
): Promise<string> {
  try {
    const peladaData = {
      ...data,
      adminId,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'peladas'), peladaData);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar pelada:', error);
    throw new Error('Erro ao criar pelada');
  }
}

/**
 * Busca peladas do admin
 */
export async function getPeladasByAdmin(adminId: string): Promise<Pelada[]> {
  try {
    const q = query(
      collection(db, 'peladas'),
      where('adminId', '==', adminId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Pelada[];
  } catch (error) {
    console.error('Erro ao buscar peladas:', error);
    throw new Error('Erro ao buscar peladas');
  }
}

/**
 * Busca pelada por ID
 */
export async function getPeladaById(peladaId: string): Promise<Pelada | null> {
  try {
    const docRef = doc(db, 'peladas', peladaId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Pelada;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar pelada:', error);
    return null;
  }
}

/**
 * Busca pelada por título
 */
export async function getPeladaByTitle(title: string): Promise<Pelada | null> {
  try {
    const q = query(
      collection(db, 'peladas'),
      where('title', '==', title),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Pelada;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar pelada por título:', error);
    return null;
  }
}

// ===== JOGADORES =====

/**
 * Registra um novo jogador em uma pelada
 */
export async function registerPlayer(
  data: PlayerRegistrationFormData
): Promise<string> {
  try {
    // Buscar pelada pelo nome
    const pelada = await getPeladaByTitle(data.peladaName);
    if (!pelada) {
      throw new Error('Pelada não encontrada');
    }

    // Verificar se jogador já está registrado
    const existingPlayer = await getPlayerByEmailAndPelada(data.email, pelada.id);
    if (existingPlayer) {
      throw new Error('Jogador já está registrado nesta pelada');
    }

    const playerData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      skillLevel: 3, // Padrão inicial, admin pode alterar
      status: 'pending',
      peladaId: pelada.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'players'), playerData);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao registrar jogador:', error);
    throw error;
  }
}

/**
 * Busca jogador por email e pelada
 */
export async function getPlayerByEmailAndPelada(
  email: string,
  peladaId: string
): Promise<Player | null> {
  try {
    const q = query(
      collection(db, 'players'),
      where('email', '==', email),
      where('peladaId', '==', peladaId),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Player;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar jogador:', error);
    return null;
  }
}

/**
 * Busca jogadores de uma pelada
 */
export async function getPlayersByPelada(peladaId: string): Promise<Player[]> {
  try {
    const q = query(
      collection(db, 'players'),
      where('peladaId', '==', peladaId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Player[];
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error);
    throw new Error('Erro ao buscar jogadores');
  }
}

/**
 * Aprova/rejeita um jogador
 */
export async function updatePlayerStatus(
  playerId: string,
  status: 'approved' | 'rejected'
): Promise<void> {
  try {
    const docRef = doc(db, 'players', playerId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao atualizar status do jogador:', error);
    throw new Error('Erro ao atualizar status do jogador');
  }
}

/**
 * Atualiza nível de habilidade do jogador
 */
export async function updatePlayerSkill(
  playerId: string,
  skillLevel: number
): Promise<void> {
  try {
    const docRef = doc(db, 'players', playerId);
    await updateDoc(docRef, {
      skillLevel,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao atualizar habilidade do jogador:', error);
    throw new Error('Erro ao atualizar habilidade do jogador');
  }
}

// ===== JOGOS =====

/**
 * Cria um novo jogo
 */
export async function createGame(
  data: CreateGameFormData,
  adminId: string
): Promise<string> {
  try {
    const gameData = {
      ...data,
      adminId,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'games'), gameData);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar jogo:', error);
    throw new Error('Erro ao criar jogo');
  }
}

/**
 * Busca jogos de uma pelada
 */
export async function getGamesByPelada(peladaId: string): Promise<Game[]> {
  try {
    const q = query(
      collection(db, 'games'),
      where('peladaId', '==', peladaId),
      orderBy('gameDate', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      gameDate: doc.data().gameDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Game[];
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    throw new Error('Erro ao buscar jogos');
  }
}

/**
 * Busca jogo por ID
 */
export async function getGameById(gameId: string): Promise<Game | null> {
  try {
    const docRef = doc(db, 'games', gameId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        gameDate: data.gameDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Game;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar jogo:', error);
    return null;
  }
}

// ===== GAME PLAYERS =====

/**
 * Adiciona jogador ao jogo (check-in)
 */
export async function addPlayerToGame(
  gameId: string,
  playerId: string
): Promise<string> {
  try {
    // Verificar se jogador já está no jogo
    const existingGamePlayer = await getGamePlayerByIds(gameId, playerId);
    if (existingGamePlayer) {
      throw new Error('Jogador já está registrado neste jogo');
    }

    const gamePlayerData = {
      gameId,
      playerId,
      checkedInAt: serverTimestamp(),
      wins: 0,
      isPresent: true,
      checkedInOnDay: false,
    };

    const docRef = await addDoc(collection(db, 'game_players'), gamePlayerData);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar jogador ao jogo:', error);
    throw error;
  }
}

/**
 * Busca game player por IDs
 */
export async function getGamePlayerByIds(
  gameId: string,
  playerId: string
): Promise<GamePlayer | null> {
  try {
    const q = query(
      collection(db, 'game_players'),
      where('gameId', '==', gameId),
      where('playerId', '==', playerId),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        checkedInAt: data.checkedInAt?.toDate() || new Date(),
        checkedInOnDayAt: data.checkedInOnDayAt?.toDate(),
      } as GamePlayer;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar game player:', error);
    return null;
  }
}

/**
 * Busca jogadores de um jogo
 */
export async function getGamePlayers(gameId: string): Promise<GamePlayer[]> {
  try {
    const q = query(
      collection(db, 'game_players'),
      where('gameId', '==', gameId),
      orderBy('checkedInAt', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      checkedInAt: doc.data().checkedInAt?.toDate() || new Date(),
      checkedInOnDayAt: doc.data().checkedInOnDayAt?.toDate(),
    })) as GamePlayer[];
  } catch (error) {
    console.error('Erro ao buscar jogadores do jogo:', error);
    throw new Error('Erro ao buscar jogadores do jogo');
  }
}

/**
 * Check-in do jogador no dia do jogo
 */
export async function checkInPlayerOnDay(gamePlayerId: string): Promise<void> {
  try {
    const docRef = doc(db, 'game_players', gamePlayerId);
    await updateDoc(docRef, {
      checkedInOnDay: true,
      checkedInOnDayAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao fazer check-in:', error);
    throw new Error('Erro ao fazer check-in');
  }
}

/**
 * Remove jogador do jogo
 */
export async function removePlayerFromGame(gamePlayerId: string): Promise<void> {
  try {
    const docRef = doc(db, 'game_players', gamePlayerId);
    await updateDoc(docRef, {
      isPresent: false,
    });
  } catch (error) {
    console.error('Erro ao remover jogador:', error);
    throw new Error('Erro ao remover jogador');
  }
}

// ===== PARTIDAS =====

/**
 * Cria uma nova partida
 */
export async function createMatch(
  gameId: string,
  teamAPlayers: string[],
  teamBPlayers: string[]
): Promise<string> {
  try {
    const matchData = {
      gameId,
      teamAPlayers,
      teamBPlayers,
      playedAt: serverTimestamp(),
      matchDurationSeconds: 0,
      isPaused: false,
    };

    const docRef = await addDoc(collection(db, 'matches'), matchData);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar partida:', error);
    throw new Error('Erro ao criar partida');
  }
}

/**
 * Atualiza resultado da partida
 */
export async function updateMatchResult(
  matchId: string,
  winner: 'team_a' | 'team_b' | 'draw'
): Promise<void> {
  try {
    const batch = writeBatch(db);

    // Atualizar partida
    const matchRef = doc(db, 'matches', matchId);
    batch.update(matchRef, {
      winner,
      endTime: serverTimestamp(),
    });

    // Buscar dados da partida para atualizar pontuação dos jogadores
    const matchDoc = await getDoc(matchRef);
    if (matchDoc.exists()) {
      const matchData = matchDoc.data();
      
      // Determinar jogadores vencedores
      let winnerPlayers: string[] = [];
      if (winner === 'team_a') {
        winnerPlayers = matchData.teamAPlayers;
      } else if (winner === 'team_b') {
        winnerPlayers = matchData.teamBPlayers;
      }

      // Incrementar vitórias dos jogadores vencedores
      for (const playerId of winnerPlayers) {
        const gamePlayerQuery = query(
          collection(db, 'game_players'),
          where('gameId', '==', matchData.gameId),
          where('playerId', '==', playerId),
          limit(1)
        );
        
        const gamePlayerSnapshot = await getDocs(gamePlayerQuery);
        if (!gamePlayerSnapshot.empty) {
          const gamePlayerRef = gamePlayerSnapshot.docs[0].ref;
          batch.update(gamePlayerRef, {
            wins: increment(1),
          });
        }
      }
    }

    await batch.commit();
  } catch (error) {
    console.error('Erro ao atualizar resultado:', error);
    throw new Error('Erro ao atualizar resultado');
  }
}

/**
 * Busca partidas de um jogo
 */
export async function getMatchesByGame(gameId: string): Promise<Match[]> {
  try {
    const q = query(
      collection(db, 'matches'),
      where('gameId', '==', gameId),
      orderBy('playedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      playedAt: doc.data().playedAt?.toDate() || new Date(),
      startTime: doc.data().startTime?.toDate(),
      endTime: doc.data().endTime?.toDate(),
      pausedAt: doc.data().pausedAt?.toDate(),
    })) as Match[];
  } catch (error) {
    console.error('Erro ao buscar partidas:', error);
    throw new Error('Erro ao buscar partidas');
  }
}

// ===== GOLS =====

/**
 * Adiciona um gol
 */
export async function addGoal(
  matchId: string,
  playerId: string,
  team: 'team_a' | 'team_b',
  minute: number
): Promise<string> {
  try {
    const goalData = {
      matchId,
      playerId,
      team,
      minute,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'goals'), goalData);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar gol:', error);
    throw new Error('Erro ao adicionar gol');
  }
}

/**
 * Busca gols de uma partida
 */
export async function getGoalsByMatch(matchId: string): Promise<Goal[]> {
  try {
    const q = query(
      collection(db, 'goals'),
      where('matchId', '==', matchId),
      orderBy('minute', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Goal[];
  } catch (error) {
    console.error('Erro ao buscar gols:', error);
    throw new Error('Erro ao buscar gols');
  }
}