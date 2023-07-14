import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlayerService } from './player.service';
import { ComputerPlayerService } from './computer-player.service';
import { BattleService } from './battle.service';
import { Card } from '../models/card.model';
import { Player } from '../models/player.model';
import { AuthService } from './auth.service';
import { CardPokemonService } from './card-pokemon.service';
@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  private currentPlayer: 'user' | 'computer' = 'user';
  private user: Player | null = null;
  private _userPlayer$ = new BehaviorSubject<Player | null>(null);
  
  get userPlayer$() {
    return this._userPlayer$.asObservable();
  }

  get computerPlayerObservable() {
    return this.computerPlayerService.getComputerPlayerObservable();
  }

  constructor(
    private playerService: PlayerService,
    private computerPlayerService: ComputerPlayerService,
    private battleService: BattleService,
    private authService: AuthService,
    private cardPokemonService: CardPokemonService
  ) { }

  async loadPlayer(playerId: string) {
    try {
      const player = await this.playerService.getPlayer(playerId);
      if (!player) {
        console.error(`Player with ID ${playerId} not found`);
        return;
      }
  
      // Obter as cartas do jogador
      const cards = await this.cardPokemonService.getCard(playerId);
  
      // Adicionar as cartas ao objeto do jogador
      player.cards = cards;
  
      this.user = player;
      this._userPlayer$.next(player);
    } catch (error) {
      console.error("Error while loading player:", error);
      // Tratar o erro de acordo com a sua necessidade
    }
  }

  setGame(computerCards: Card[]) {
    if (this.user && this.user.cards.length > 0) {
      this.computerPlayerService.setCards(computerCards);
      this.currentPlayer = 'user';
    } else {
      throw new Error('User has no cards');
    }
  }

  async selectAttribute(attribute: keyof Card) {
    if (this.currentPlayer === 'user' && this.user && this.computerPlayerService.getCards().length > 0) {
      const userCard = this.user.cards[0];
      const computerCard = this.computerPlayerService.getCards()[0];

      const battleResult = this.battleService.battle(attribute, userCard, computerCard);

      if (battleResult === 'user') {
        if (typeof this.user.wins === 'number') {
          this.user.wins++;
          await this.playerService.updatePlayerWins(this.user.uid, this.user.wins);
        }
        this.computerPlayerService.getCards().shift();
      } else if (battleResult === 'computer') {
        this.computerPlayerService.incrementComputerWins();
        this.currentPlayer = 'computer';
        if (this.user && this.user.cards.length > 0) {
          this.user.cards.shift();
        }
      } else {
        // logic for draw goes here...
      }

      if (this.user && this.user.cards.length === 0 || this.computerPlayerService.getCards().length === 0) {
        if (this.currentPlayer === 'user' && typeof this.user.wins === 'number') {
          this.user.wins++;
          await this.playerService.updatePlayerWins(this.user.uid, this.user.wins);
        } else {
          this.computerPlayerService.incrementComputerWins();
        }
        this.user = null;
        this.computerPlayerService.resetCards();
        this.currentPlayer = 'user';
      }
    } else if (this.currentPlayer === 'computer') {
      this.computerPlayerService.playCard();
      await this.computerPlayerService.drawCard();
    }
  }

  initialize() {
    this.authService.getUser().subscribe(async user => {
      if (user !== null) {
        console.log('User ID: ', user.uid);
      
        if (user) {
          try {
            const playerResult = await this.playerService.getPlayer(user.uid);
            if (playerResult) {
              console.log("Player data: ", playerResult);
              this._userPlayer$.next(playerResult);

              // Load the player into the game
              await this.loadPlayer(user.uid);
            } else {
              // console.log("Player data not loaded");
              // alert('Failed to load player data'); 
            }
          } catch (error) {
            console.error("Error while fetching player data: ", error);
            alert('An error occurred while fetching player data'); 
          }
        }
      }
    });
  }
}
