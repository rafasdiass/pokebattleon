import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class RankingService {

  constructor(private firestore: AngularFirestore) {}

  // Obter o número de vitórias de um jogador
  getWins(playerId: string): Promise<number | undefined> {
    return this.firestore.collection('players').doc(playerId).snapshotChanges()
      .pipe(map(action => {
        const data = action.payload.data() as Player;
        return data && data.hasOwnProperty('wins') ? data.wins : undefined;
      })).toPromise();
  }

  // Obter a classificação de todos os jogadores
  getRanking() {
    return this.firestore.collection('players', ref => ref.orderBy('wins', 'desc')).snapshotChanges()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Player;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
  }
}
