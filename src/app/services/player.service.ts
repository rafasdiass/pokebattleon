import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private firestore: AngularFirestore) { }

  // Obter um jogador pelo ID
  getPlayer(playerId: string) {
    return this.firestore.collection('players').doc<Player>(playerId).valueChanges();
  }

  // Atualizar o número de vitórias de um jogador
  updatePlayerWins(playerId: string, wins: number) {
    return this.firestore.collection('players').doc(playerId).update({ wins: wins });
  }
}
