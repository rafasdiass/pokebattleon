import { Injectable } from '@angular/core';
import { PlayerService } from './player.service';
import { ComputerPlayerService } from './computer-player.service';
import { Card } from '../models/card.model';
import { Player } from '../models/player.model';
import { ComputerPlayer } from '../models/computer-player.model';
import { DeckService } from './deck.service';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  player: Player;
  computer: ComputerPlayer;
  pile: Card[] = [];

  constructor(
    private playerService: PlayerService,
    private computerPlayerService: ComputerPlayerService,
    private deckService: DeckService
  ) {
    this.player = new Player('', '', []);
    this.computer = new ComputerPlayer();
    this.initGame();
  }

  async initGame(): Promise<void> {
    this.player = await this.playerService.getPlayer();
    if (!this.player) {
      // Tratar caso o jogador não seja encontrado
      return;
    }

    await this.computerPlayerService.init();
    this.computer = this.computerPlayerService.getComputerPlayer();

    const deck = await this.deckService.createDeck(10);
    this.deckService.addCardsToPile(deck);

    while (!this.isGameEnd()) {
      this.playTurn();
    }

    this.endGame();
  }

  playTurn(): void {
    const playerCard = this.player.playCard();
    const computerCard = this.computer.playCard();

    if (playerCard && computerCard) {
      const playerValue = playerCard['value'];
      const computerValue = computerCard['value'];

      if (playerValue > computerValue) {
        this.deckService.addCardToPile(playerCard);
        this.deckService.addCardToPile(computerCard);
        this.deckService.addCardsToPile(this.pile);
        this.pile = [];
      } else if (playerValue < computerValue) {
        this.deckService.addCardToPile(playerCard);
        this.deckService.addCardToPile(computerCard);
        this.deckService.addCardsToPile(this.pile);
        this.pile = [];
      } else {
        this.pile.push(playerCard, computerCard);
      }
    }
  }

  isGameEnd(): boolean {
    return this.player.cards.length === 0 || this.computer.cards.length === 0;
  }

  endGame(): void {
    if (this.player.cards.length === 0) {
      console.log('Computer wins!');
    } else if (this.computer.cards.length === 0) {
      console.log('Player wins!');
    }
  }
}
