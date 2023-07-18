import { Component, OnInit } from '@angular/core';
import { Card } from '../../models/card.model';
import { DeckService } from '../../services/deck.service';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-deck',
  templateUrl: './deck.page.html',
  styleUrls: ['./deck.page.scss'],
})
export class DeckPage implements OnInit {
  deck: Card[] = [];
  playerHand: Card[] = [];
  computerHand: Card[] = [];
  userId: string | null = null;  // Valor inicial é null

  constructor(private deckService: DeckService, private cardPokemonService: CardPokemonService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;
        this.startGame();
      } else {
        console.log('User not authenticated or invalid user object');
        this.startGame();
      }
    });
  }

  async startGame(): Promise<void> {
    this.deck = await this.deckService.createDeck(28); // Inicia o deck com 28 cartas
    this.dealCards(); // Distribui as cartas iniciais
  }

  dealCards(): void {
    for (let i = 0; i < 3; i++) { // Cada jogador recebe 3 cartas
      this.drawCard('player');
      this.drawCard('computer');
    }
  }

  drawCard(player: 'player' | 'computer'): void {
    const card = this.deckService.drawCard();
    if (card) {
      if (player === 'player') {
        this.playerHand.push(card);
        console.log('Card drawn for player:', card);
      } else {
        this.computerHand.push(card);
        console.log('Card drawn for computer:', card);
      }
    } else {
      console.log('No more cards in the deck');
    }
  }

  // Esta função pode ser chamada quando um turno é concluído e o jogador vencedor é determinado
  winTurn(winner: 'player' | 'computer', loserCard: Card): void {
    if (winner === 'player') {
      this.playerHand.push(loserCard); // O vencedor recebe a carta do perdedor
      this.computerHand = this.computerHand.filter(card => card !== loserCard); // Remove a carta da mão do perdedor
    } else {
      this.computerHand.push(loserCard);
      this.playerHand = this.playerHand.filter(card => card !== loserCard);
    }

    console.log(winner + ' won the turn and received a card:', loserCard);
    console.log('Player hand:', this.playerHand);
    console.log('Computer hand:', this.computerHand);
  }

  resetGame(): void {
    this.deckService.resetDeck();
    this.startGame();
  }
}
