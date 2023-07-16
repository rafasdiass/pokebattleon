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
  computer: ComputerPlayer;
  pile: Card[] = [];

  constructor(
    private playerService: PlayerService,
    private computerPlayerService: ComputerPlayerService,
    private deckService: DeckService,
    private battleService: BattleService
  ) {
    this.computer = new ComputerPlayer();

    this.initGame().then(() => {
      console.log('Game is initialized.');
    });
  }

  async setPlayerInGame(player: Player): Promise<void> {
    this.player = player;
  }

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
    if (!this.player) {
      throw new Error('Player is not defined');
    }

    const playerCard = this.player.playCard();
    const computerCard = this.computer.playCard();

    if (playerCard && computerCard) {
      const battleResult = this.battleService.battle(attributeToCompare, playerCard, computerCard);

      if (battleResult === 'player') {
        this.deckService.addCardToPile(playerCard);
        this.deckService.addCardToPile(computerCard);
        this.deckService.addCardsToPile(this.pile);
        this.pile = [];
      } else if (battleResult === 'computer') {
        this.deckService.addCardToPile(playerCard);
        this.deckService.addCardToPile(computerCard);
        this.deckService.addCardsToPile(this.pile);
        this.pile = [];
      } else {
        this.pile.push(playerCard, computerCard);
      }
    }
  }

  onAttributeSelect(event: any) {
    const attributeToCompare = event.target.value as CardAttribute;

    if (!attributeToCompare) {
      throw new Error('Attribute is not selected');
    }

    this.playTurn(attributeToCompare);
  }

  isGameEnd(): boolean {
    if (!this.player) {
      return true;
    }

    return this.player.cards.length === 0 || this.computer.cards.length === 0;
  }

  endGame(): void {
    if (!this.player || this.player.cards.length === 0) {
      console.log('Computer wins!');
    } else if (this.computer.cards.length === 0) {
      console.log('Player wins!');
    }
  }
}
