import { Injectable } from '@angular/core';
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "firebase/firestore"; 
import { Player } from '../models/player.model';
import { Card } from '../models/card.model';
@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private firestore = getFirestore();

  // Get a player by ID
  // Get a player by ID
async getPlayer(playerId: string): Promise<Player | undefined> {
  const docRef = doc(this.firestore, 'players', playerId);
  const docSnap = await getDoc(docRef);
    
  console.log('Fetched player document: ', docSnap); // Add this line

  return docSnap.exists() ? docSnap.data() as Player : undefined;
}


  // Update a player's number of wins
  async updatePlayerWins(playerId: string, wins: number): Promise<void> {
    const docRef = doc(this.firestore, 'players', playerId);
    await updateDoc(docRef, { wins: wins });
  }
  async addPokemonToPlayer(playerId: string, pokemon: Card): Promise<void> {
    const playerRef = doc(this.firestore, 'players', playerId);
    
    // Get the current data
    const playerSnap = await getDoc(playerRef);
    
    if (!playerSnap.exists()) {
      throw new Error('Player does not exist');
    }
    
    const playerData = playerSnap.data() as Player;
    
    // Add the new Pokemon to the player's cards
    playerData.cards = [...(playerData.cards || []), pokemon.toFirestore()];
  
    // Update the player document with the new data
    await setDoc(playerRef, playerData);
  }
}
