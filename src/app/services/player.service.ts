import { Injectable } from '@angular/core';
import { getFirestore, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { User } from '../models/user.model';
import { Player } from '../models/player.model';
import { Card } from '../models/card.model';
import { CardPokemonService } from './card-pokemon.service';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private db = getFirestore();

  constructor(private cardPokemonService: CardPokemonService, private authService: AuthService) {}

  async getPlayer(uid: string): Promise<Player | null> {
    const playerDoc = doc(this.db, 'users', uid);
    const playerSnapshot = await getDoc(playerDoc);

    if (playerSnapshot.exists()) {
      const playerData = playerSnapshot.data();
      const playerCards: Card[] = await this.cardPokemonService.getCard(uid);

      const player = new Player(
        uid,
        playerData['name'],
        playerCards,
        playerData['wins'],
        playerData['rank']
      );

      return player;
    } else {
      console.log(`No document found for the player: ${uid}`);
      return null;
    }
  }

  async updatePlayerWins(uid: string, wins: number): Promise<void> {
    const playerDoc = doc(this.db, 'users', uid);
    await updateDoc(playerDoc, { wins: wins });
  }

  async addPokemonToPlayer(uid: string, pokemon: Card): Promise<void> {
    const playerDoc = doc(this.db, 'users', uid);
    const playerSnapshot = await getDoc(playerDoc);

    if (!playerSnapshot.exists()) {
      throw new Error('Player does not exist');
    }

    const playerData = { ...playerSnapshot.data(), cards: [...(playerSnapshot.data()['cards'] || []), pokemon.toFirestore()] };
    await setDoc(playerDoc, playerData);
  }

  getCurrentUserId(): string {
    let userId: string | null = null;
    this.authService.getUser().pipe(take(1)).subscribe(user => {
      userId = user ? user.uid : null;
    });
    return userId || '';
  }
}
