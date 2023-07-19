import { Component, OnInit } from '@angular/core';
import { Card } from '../../models/card.model';
import { DeckService } from '../../services/deck.service';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { AuthService } from '../../services/auth.service';
import { BattleService } from '../../services/battle.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.page.html',
  styleUrls: ['./deck.page.scss'],
})
export class DeckPage implements OnInit {
  deck: Card[] = [];
  playerHand: Card[] = [];
  computerHand: Card[] = [];
  userId: string | null = null;

  constructor(
    private deckService: DeckService, 
    private cardPokemonService: CardPokemonService, 
    private authService: AuthService, 
    private battleService: BattleService, 
    private router: Router) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;
        this.startGame();
      } else {
        console.log('User not authenticated or invalid user object');
        this.router.navigate(['/']);
      }
    });
  }

  async startGame(): Promise<void> {
    await this.deckService.createDeck();
    this.deck = this.deckService.getDeck();
    // Deal 3 cards to each player.
    this.dealCards();
  }

dealCards(): void {
    for (let i = 0; i < 3; i++) {
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

  winTurn(playerAttribute: keyof Card, computerAttribute: keyof Card): void {
    if (this.playerHand.length > 0 && this.computerHand.length > 0) {
      const winner = this.battleService.battle(playerAttribute, this.playerHand[0], this.computerHand[0]);
      if (winner === 'player') {
        this.playerHand.push(this.computerHand.shift()!); // The winner receives the loser's card
      } else if (winner === 'computer') {
        this.computerHand.push(this.playerHand.shift()!);
      }
      console.log(winner + ' won the turn');
      console.log('Player hand:', this.playerHand);
      console.log('Computer hand:', this.computerHand);
    }

    if (this.playerHand.length === 0 || this.computerHand.length === 0) {
      this.replenishHand();
    }
  }

  replenishHand(): void {
    let cardsToDeal = 5;
    while (this.deck.length < cardsToDeal && cardsToDeal > 1) {
      cardsToDeal /= 2;
    }

    if (this.deck.length >= cardsToDeal) {
      for (let i = 0; i < cardsToDeal; i++) {
        this.drawCard('player');
        this.drawCard('computer');
      }
    } else if (this.playerHand.length !== this.computerHand.length) {
      const winner = this.playerHand.length > this.computerHand.length ? 'player' : 'computer';
      console.log(winner + ' wins the game because they have more cards');
    } else {
      console.log('The game is a draw');
    }
  }

  resetGame(): void {
    this.deckService.resetDeck();
    this.startGame();
  }
}
