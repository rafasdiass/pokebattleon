import { Injectable } from '@angular/core';
import { getFirestore, doc, setDoc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
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
    if (!uid) {
      console.error('UID is undefined or null');
      return null;
    }
    
    const playerDoc = doc(this.db, 'users', uid);
    const playerSnapshot = await getDoc(playerDoc);
  
    if (playerSnapshot.exists()) {
      const playerData = playerSnapshot.data();
      const playerCards: Card[] = await this.cardPokemonService.getCard(uid);
  
      if (playerData) {
        const player = new Player(
          uid,
          playerData['displayName'],
          playerCards,
          playerData['wins'] || 0,
          playerData['rank'] || 0
        );
        return player;
      } else {
        console.log(`playerData is undefined for the player: ${uid}`);
        return null;
      }
    } else {
      console.log(`No document found for the player: ${uid}`);
      return null;
    }
  }
  
  async getPlayerCards(): Promise<Card[]> {
    const uid = await this.getCurrentUserId();
    const player = await this.getPlayer(uid);
    
    if (player) {
      return player.cards;
    } else {
      console.log('No player found');
      return [];
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

    const playerData = playerSnapshot.data();
    if (playerData) {
      const playerCards: Card[] = playerData['cards'] || [];
      playerCards.push(pokemon.toFirestore());
      await updateDoc(playerDoc, { cards: arrayUnion(...playerCards) });
    } else {
      throw new Error('Player data is undefined');
    }
  }

  async getCurrentUserId(): Promise<string> {
    return new Promise((resolve, reject) => {
        this.authService.getUser().pipe(take(1)).subscribe(user => {
            if (user && user.uid) {
                resolve(user.uid);
            } else {
                reject('No user ID found');
            }
        });
    });
  }
}
