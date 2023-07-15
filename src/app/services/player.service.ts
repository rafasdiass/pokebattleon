import { Injectable } from '@angular/core';
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Player } from '../models/player.model';
import { Card } from '../models/card.model';
import { CardPokemonService } from './card-pokemon.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private firestore = getFirestore();
  private auth = getAuth();

  constructor(private cardPokemonService: CardPokemonService) {}

  async getPlayer(uid: string): Promise<Player | undefined> {
    const docRef = doc(this.firestore, 'players', uid);
    const docSnap = await getDoc(docRef);

    console.log('Fetched player document: ', docSnap);

    if(docSnap.exists()){
      const playerData = docSnap.data() as Player;
      // Get the player's cards
      playerData.cards = await this.cardPokemonService.getCard(uid);
      return playerData;
    } else {
      return undefined;
    }
  }

  async updatePlayerWins(uid: string, wins: number): Promise<void> {
    const docRef = doc(this.firestore, 'players', uid);
    await updateDoc(docRef, { wins: wins });
  }

  async addPokemonToPlayer(uid: string, pokemon: Card): Promise<void> {
    const playerRef = doc(this.firestore, 'players', uid);
    const playerSnap = await getDoc(playerRef);

    if (!playerSnap.exists()) {
      throw new Error('Player does not exist');
    }

    const playerData = playerSnap.data() as Player;
    playerData.cards = [...(playerData.cards || []), pokemon.toFirestore()];
    await setDoc(playerRef, playerData);
  }

  getCurrentUserId(): string {
    const user = this.auth.currentUser;
    return user ? user.uid : '';
  }
}
