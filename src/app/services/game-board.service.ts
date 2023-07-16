import { Injectable } from '@angular/core';
import { Card, CardAttribute } from '../models/card.model';
import { Player } from '../models/player.model';
import { ComputerPlayer } from '../models/computer-player.model';
import { PlayerService } from './player.service';
import { ComputerPlayerService } from './computer-player.service';
import { DeckService } from './deck.service';
import { BattleService } from './battle.service';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  player?: Player;
  computer?: ComputerPlayer;
  pile: Card[] = [];
  attributesInOrder: CardAttribute[] = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'];

  constructor(
    private playerService: PlayerService,
    private computerPlayerService: ComputerPlayerService,
    private deckService: DeckService,
    private battleService: BattleService
  ) {}

  async initGame(): Promise<void> {
    const player = await this.playerService.getPlayer(this.playerService.getCurrentUserId());
    if (!player) {
      return;
    }

    this.player = player;
    await this.computerPlayerService.init();
    this.computer = this.computerPlayerService.getComputerPlayer();
    
    const deck = await this.deckService.createDeck(10);
    this.deckService.addCardsToPile(deck);
  }

  playTurn(attributeToCompare: CardAttribute): void {
    if (!this.player || !this.computer) {
      throw new Error('O jogador ou o computador não estão definidos');
    }

    const playerCard = this.player.playCard();
    const computerCard = this.computer.playCard();

    if (playerCard && computerCard) {
      const battleResult = this.battleService.battle(attributeToCompare, playerCard, computerCard);
      this.handleBattleResult(battleResult, playerCard, computerCard, attributeToCompare);
    }
  }

  private handleBattleResult(battleResult: 'player' | 'computer' | 'draw', playerCard: Card, computerCard: Card, selectedAttribute: CardAttribute): void {
    switch (battleResult) {
      case 'player':
        // Jogador vence o turno
        console.log('Jogador vence o turno!');
        break;
      case 'computer':
        // Computador vence o turno
        console.log('Computador vence o turno!');
        break;
      case 'draw':
        // É um empate, então adicionaremos as cartas ao monte e selecionaremos um novo atributo para comparação
        this.pile.push(playerCard, computerCard);
        this.playTurn(this.nextAttribute(selectedAttribute));
        break;
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
