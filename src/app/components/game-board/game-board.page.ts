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
      let newCards = this.deckService.drawCards(5);
      if (newCards.length < 5) {
        newCards = this.deckService.drawCards(Math.floor(newCards.length / 2));
      }
      this.playerHand.push(...newCards.slice(0, newCards.length / 2));
      this.computerHand.push(...newCards.slice(newCards.length / 2, newCards.length));
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
