import { Component, Input, OnInit } from '@angular/core';
import { Player } from '../../models/player.model';
import { ComputerPlayer } from '../../models/computer-player.model';
import { Card } from '../../models/card.model';
import { DeckService } from '../../services/deck.service';
import { BattleService } from '../../services/battle.service';
import { PlayerService } from '../../services/player.service';
@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.page.html',
  styleUrls: ['./game-board.page.scss'],
})
export class GameBoardPage implements OnInit {
  @Input() player!: Player;
  @Input() computer!: ComputerPlayer;

  playerHand: Card[] = [];
  computerHand: Card[] = [];

  constructor(
    private deckService: DeckService,
    private battleService: BattleService,
    private playerService: PlayerService // Inject the Player Service
  ) { }

  async ngOnInit() {
    this.playerHand = await this.playerService.getPlayerCards(); // Load the player cards
    await this.startGame();
  }
  
  async startGame(): Promise<void> {
    const deck = await this.deckService.getDeck(); // get the deck of 22 cards

    // Distribute the cards to the computer player
    this.computerHand = deck.slice(0, 3);

    // Start the first turn
    await this.startTurn();
  }

  async checkForNewCards() {
    if(this.playerHand.length === 0 || this.computerHand.length === 0) {
      let cardsLeft = this.deckService.cardsLeft();
  
      if (cardsLeft >= 10) {
        let newCards = this.deckService.drawCards(10);
        this.playerHand.push(...newCards.slice(0, 5));
        this.computerHand.push(...newCards.slice(5, 10));
      } else if (cardsLeft > 0) {
        // If there are fewer than 10 but more than 0 cards left, split them between the players
        let newCards = this.deckService.drawCards(cardsLeft);
        let half = Math.floor(cardsLeft / 2);
        this.playerHand.push(...newCards.slice(0, half));
        this.computerHand.push(...newCards.slice(half));
      }
  
      console.log('playerHand:', this.playerHand); // debug logging
      console.log('computerHand:', this.computerHand); // debug logging
    }
  }
  

  // Esta função será chamada quando um turno for concluído e o jogador vencedor for determinado
  async winTurn(winner: 'player' | 'computer', loserCard: Card): Promise<void> {
    if (winner === 'player') {
      this.computerHand = this.computerHand.filter(card => card !== loserCard); // Remove a carta da mão do perdedor
    } else {
      this.playerHand = this.playerHand.filter(card => card !== loserCard);
    }

    console.log(winner + ' won the turn and received a card:', loserCard);
    console.log('Player hand:', this.playerHand);
    console.log('Computer hand:', this.computerHand);

    // Check for new cards
    await this.checkForNewCards();

    // Se o jogo não acabou, inicia um novo turno
    if (this.playerHand.length > 0 && this.computerHand.length > 0) {
      await this.startTurn();
    }
  }

  async startTurn(): Promise<void> {
    // Aqui você pode adicionar a lógica para iniciar um turno
    // Por exemplo, você pode escolher uma carta para o jogador e para o computador, e então usar o BattleService para determinar o vencedor
  }
}
