import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlayerService } from './player.service';
import { ComputerPlayerService } from './computer-player.service';
import { Card } from '../models/card.model';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  private currentPlayer: 'user' | 'computer' = 'user';
  private user: Player | null = null;
  private computerPlayer$ = new BehaviorSubject(this.computerPlayerService.getComputerPlayer());

  private _userPlayer$ = new BehaviorSubject<Player | null>(null);
  
  get userPlayer$() {
    return this._userPlayer$.asObservable();
  }

  get computerPlayerObservable() {
    return this.computerPlayer$.asObservable();
  }

  constructor(
    private playerService: PlayerService,
    private computerPlayerService: ComputerPlayerService
  ) { }

  async loadPlayer(playerId: string) {
    const player = await this.playerService.getPlayer(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }
    this.user = player;
    this._userPlayer$.next(player);
  }

  setGame(computerCards: Card[]) {
    if (this.user && this.user.cards.length > 0) {
      this.computerPlayerService.getComputerPlayer().cards = computerCards;
      this.currentPlayer = 'user';
      this.computerPlayer$.next(this.computerPlayerService.getComputerPlayer());
    } else {
      throw new Error('User has no cards');
    }
  }

  generateComputerPlayer() {
    this.computerPlayerService.init();
    this.computerPlayer$.next(this.computerPlayerService.getComputerPlayer());
  }

  async selectAttribute(attribute: keyof Card) {
    if (this.currentPlayer === 'user' && this.user && this.computerPlayerService.getComputerPlayer().cards.length > 0) {
      const userCard = this.user.cards[0];
      const userAttribute = userCard[attribute];
      const computerCard = this.computerPlayerService.getComputerPlayer().cards[0];
      const computerAttribute = computerCard[attribute];

      if (userAttribute > computerAttribute) {
        if (typeof this.user.wins === 'number') {
          this.user.wins++;
          await this.playerService.updatePlayerWins(this.user.uid, this.user.wins);
        }
        this.computerPlayerService.getComputerPlayer().cards.shift();
      } else {
        this.computerPlayerService.getComputerPlayer().wins++;
        this.currentPlayer = 'computer';
        if (this.user && this.user.cards.length > 0) {
          this.user.cards.shift();
        }
      }

      if (this.user && this.user.cards.length === 0 || this.computerPlayerService.getComputerPlayer().cards.length === 0) {
        if (this.currentPlayer === 'user' && typeof this.user.wins === 'number') {
          this.user.wins++;
          await this.playerService.updatePlayerWins(this.user.uid, this.user.wins);
        } else {
          this.computerPlayerService.getComputerPlayer().wins++;
        }
        this.user = null;
        this.computerPlayerService.getComputerPlayer().cards = [];
        this.currentPlayer = 'user';
      }
    } else if (this.currentPlayer === 'computer') {
      // Aqui você pode adicionar a lógica para a jogada do computador
    }
  }
}
