
import { Injectable } from '@angular/core';
import { getFirestore, doc, getDoc, query, collection, orderBy, getDocs } from 'firebase/firestore';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private db = getFirestore();

  constructor() {}

  // Obter o número de vitórias de um jogador
  async getWins(playerId: string): Promise<number | undefined> {
    const playerDoc = await getDoc(doc(this.db, 'players', playerId));
    if (playerDoc.exists()) {
      const playerData = playerDoc.data();
      if (playerData) {
        return (playerData as Player).wins;
      }
    }
    return undefined;
  }

  // Obter a classificação de todos os jogadores
  async getRanking(): Promise<Player[]> {
    const playersQuery = query(collection(this.db, 'players'), orderBy('wins', 'desc'));
    const querySnapshot = await getDocs(playersQuery);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      if (data) {
        return { id: doc.id, ...(data as Player) };
      }
      return {} as Player;
    }).filter(player => player !== {} as Player);
  }
}