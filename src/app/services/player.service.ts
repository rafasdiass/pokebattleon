import { Injectable } from '@angular/core';
import { getFirestore, doc, setDoc,  getDoc, arrayUnion } from 'firebase/firestore';
import { User } from '../models/user.model';
import { Player } from '../models/player.model';
import { Card } from '../models/card.model';
import { CardPokemonService } from './card-pokemon.service';
import { AuthService } from './auth.service';
import { MessagingService } from './serviceonline/messaging.service';
import { take } from 'rxjs/operators';
import { query, where, getDocs, collection, updateDoc } from 'firebase/firestore';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private db = getFirestore();
  private player1: Player | null = null;
  private player2: Player | null = null;
  player2Selected = new Subject<Player>();

  constructor(private cardPokemonService: CardPokemonService, private authService: AuthService, private messagingService: MessagingService) {
    this.initPlayers();
  }

  private async initPlayers() {
    const playerId1 = await this.getCurrentUserId();
    if (!playerId1) {
      console.error('Player ID 1 is undefined or null');
      return;
    }

    const player = await this.getPlayer(playerId1);
    if (!player) {
      console.error('Player 1 is undefined or null');
      return;
    }

    this.setPlayer(player, 1);

    if (this.player1) {
        const callback = (message: any) => {
            console.log("Received a new message: ", message);
        };
        this.messagingService.listenForNewMessages(this.player1, null, callback);
    } else {
        console.error('Failed to initialize player 1');
    }
  }

  async onPlayer2Selected(playerId: string) {
    const player = await this.getPlayer(playerId);
    if (!player) {
      console.error('Player 2 is undefined or null');
      return;
    }
    this.setPlayer(player, 2);
    console.log(`Player 2 has been set with the ID: ${playerId}`);
    if (this.player1 && this.player2) {
        const callback = (message: any) => {
            console.log("Received a new message: ", message);
        };
        this.messagingService.listenForNewMessages(this.player1, this.player2, callback);
    }
  }

  async getPlayerNameById(uid: string): Promise<string> {
    const player = await this.getPlayer(uid);
    
    if (player) {
      return player.name;
    } else {
      console.error('No player found with the uid:', uid);
      return uid;
    }
  }

  setPlayer(player: Player, playerNumber: number) {
    if (playerNumber === 1) {
      this.player1 = player;
    } else if (playerNumber === 2) {
      this.player2 = player;
      this.player2Selected.next(player);
    }
  }

  getPlayer1(): Player | null {
    return this.player1;
  }

  getPlayer2(): Player | null {
    return this.player2;
  }

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

  async getOnlinePlayers(): Promise<Player[]> {
    const q = query(collection(this.db, 'users'), where('online', '==', true));
    const querySnapshot = await getDocs(q);
    const players: Player[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if(data) {
        players.push(new Player(
          doc.id,
          data['displayName'],
          data['cards'] || [],
          data['wins'] || 0,
          data['rank'] || 0,
          data['online'] || false
        ));
      }
    });
    return players;
  }

  async updatePlayerOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    const userDoc = doc(this.db, 'users', userId);
    const data = { online: isOnline, last_active: new Date() };
    return updateDoc(userDoc, data);
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
