import { Injectable } from '@angular/core';
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "firebase/firestore"; 
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private firestore = getFirestore();

  // Get a player by ID
  async getPlayer(playerId: string): Promise<Player | undefined> {
    const docRef = doc(this.firestore, 'players', playerId);
    const docSnap = await getDoc(docRef);
    
    return docSnap.exists() ? docSnap.data() as Player : undefined;
  }

  // Update a player's number of wins
  async updatePlayerWins(playerId: string, wins: number): Promise<void> {
    const docRef = doc(this.firestore, 'players', playerId);
    await updateDoc(docRef, { wins: wins });
  }
}
