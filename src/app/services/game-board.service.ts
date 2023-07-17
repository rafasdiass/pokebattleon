import { Injectable } from '@angular/core';
import { Card, CardAttribute } from '../models/card.model';
import { Player } from '../models/player.model';
import { ComputerPlayer } from '../models/computer-player.model';
import { PlayerService } from './player.service';
import { ComputerPlayerService } from './computer-player.service';
import { DeckService } from './deck.service';
import { BattleService } from './battle.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  player?: Player;
  computer?: ComputerPlayer;
  pile: Card[] = [];
  attributesInOrder: CardAttribute[] = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'];
  battleResult$: Subject<'player' | 'computer' | 'draw'> = new Subject<'player' | 'computer' | 'draw'>();

  constructor(
    private playerService: PlayerService,
    private computerPlayerService: ComputerPlayerService,
    private deckService: DeckService,
    private battleService: BattleService
  ) {}

  async initGame(): Promise<void> {
    const currentUserId = await this.playerService.getCurrentUserId();
    const player = await this.playerService.getPlayer(currentUserId);
    if (!player) {
      return;
    }
  
    this.player = player;
    await this.computerPlayerService.init();
    this.computer = this.computerPlayerService.getComputerPlayer();
    
    const initialCards = await this.deckService.createDeck(28);
    this.player.cards.push(...initialCards.slice(0, 3));  // give first 3 cards to player
    this.computer.cards.push(...initialCards.slice(3, 6));  // give next 3 cards to computer
    this.deckService.addCardsToPile(initialCards.slice(6));  // add the remaining cards to the pile
  }
  
  playTurn(attributeToCompare: CardAttribute): void {
    if (!this.player || !this.computer) {
      throw new Error('O jogador ou o computador não estão definidos');
    }
  
    const playerCard = this.player.playCard();
    const computerCard = this.computer.playCard();
  
    if (playerCard && computerCard) {
      const battleResult = this.battleService.battle(attributeToCompare, playerCard as Card, computerCard as Card);
      this.handleBattleResult(battleResult, playerCard, computerCard, attributeToCompare);
    }
  }
  

  private handleBattleResult(battleResult: 'player' | 'computer' | 'draw', playerCard: Card, computerCard: Card, selectedAttribute: CardAttribute): void {
    switch (battleResult) {
      case 'player':
        console.log('Jogador vence o turno!');
        this.player?.cards.push(computerCard);  // jogador recebe a carta do computador
        this.removeCardFromPlayer(this.computer, computerCard);  // remove carta do computador
        this.distributePileCards(this.player);
        break;
      case 'computer':
        console.log('Computador vence o turno!');
        this.computer?.cards.push(playerCard);  // computador recebe a carta do jogador
        this.removeCardFromPlayer(this.player, playerCard);  // remove carta do jogador
        this.distributePileCards(this.computer);
        break;
      case 'draw':
        this.pile.push(playerCard, computerCard);
        this.playTurn(this.nextAttribute(selectedAttribute));
        break;
    }
  
    this.battleResult$.next(battleResult);
  }
  
  private removeCardFromPlayer(player: Player | ComputerPlayer | undefined, card: Card) {
    if (player) {
      const index = player.cards.findIndex(c => c === card);
      if (index !== -1) {
        player.cards.splice(index, 1);
      }
    }
  }

  private distributePileCards(player: Player | ComputerPlayer | undefined): void {
    if (player && this.pile.length > 0) {
      player.cards.push(...this.pile);
      this.pile = [];
    }
  }

  nextAttribute(currentAttribute: CardAttribute): CardAttribute {
    const currentIndex = this.attributesInOrder.indexOf(currentAttribute);
    const nextIndex = (currentIndex + 1) % this.attributesInOrder.length;
    return this.attributesInOrder[nextIndex];
  }

  isGameEnd(): boolean {
    if (!this.player || !this.computer) {
      return true;
    }

    return this.player.cards.length === 0 || this.computer.cards.length === 0;
  }

  endGame(): void {
    if (!this.player || !this.computer) {
      throw new Error('O jogador ou o computador não estão definidos');
    }

    if (this.player.cards.length === 0) {
      console.log('O computador vence!');
    } else if (this.computer.cards.length === 0) {
      console.log('O jogador vence!');
    }
  }
}
