import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';
import { Player } from '../models/player.model';
import { ComputerPlayer } from '../models/computer-player.model';
import { PlayerService } from './player.service';
import { ComputerPlayerService } from './computer-player.service';
import { CardPokemonService } from './card-pokemon.service';

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
    private cardPokemonService: CardPokemonService
  ) {
    this.initGame();
  }

  async initGame(): Promise<void> {
    // Initialize player and computer with their first cards
    this.player = await this.playerService.init();
    this.computer = await this.computerPlayerService.init();

    // Play first turn
    this.playTurn();
  }

  playTurn(): void {
    const playerCard = this.player.cards[0];
    const computerCard = this.computer.cards[0];

    if (playerCard.value > computerCard.value) {
      // Player wins, add cards to their pile
      this.playerService.addCardsToPlayer([playerCard, computerCard]);
    } else if (playerCard.value < computerCard.value) {
      // Computer wins, add cards to their pile
      this.computerPlayerService.addCardsToComputer([playerCard, computerCard]);
    } else {
      // Draw, add cards to draw pile
      this.pile.push(playerCard, computerCard);
    }
  }

  endGame(): void {
    if (this.player.cards.length === 0) {
      console.log('Computer wins!');
    } else if (this.computer.cards.length === 0) {
      console.log('Player wins!');
    }
  }
}
