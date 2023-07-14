import { Injectable } from '@angular/core';
import { getFirestore, doc, getDoc, query, collection, orderBy, getDocs } from 'firebase/firestore';
import { Ranking } from '../models/ranking.model';

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
        return playerData['wins'];
      }
    }
    return undefined;
  }

  // Obter a classificação de todos os jogadores
  async getRanking(): Promise<Ranking[]> {
    const playersQuery = query(collection(this.db, 'players'), orderBy('wins', 'desc'));
    const querySnapshot = await getDocs(playersQuery);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      if (data) {
        return { id: doc.id, wins: data['wins'] };
      }
      return {} as Ranking;
    }).filter(player => player !== {} as Ranking);
  }
}
