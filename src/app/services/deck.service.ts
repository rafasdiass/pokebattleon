import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';
import { CardPokemonService } from './card-pokemon.service';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  private deck: Card[] = [];

  constructor(private cardPokemonService: CardPokemonService) {}

  async createDeck(numberOfCards: number): Promise<Card[]> {
    if (this.deck.length >= numberOfCards) {
      console.log(`Deck já possui ${this.deck.length} cartas.`);
      return this.deck;
    }
  
    // Adiciona novas cartas
    while (this.deck.length < numberOfCards) {
      const randomPokemons = await this.cardPokemonService.getRandomPokemon(1);
      this.deck.push(randomPokemons[0]);
    }
    this.shuffleDeck();
    return this.deck; // return the complete deck
  }
  
  // função para adicionar uma carta ganha ao deck
  addCardToDeck(newCard: Card): void {
    this.deck.push(newCard);
  }
  shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  drawCard(): Card | null {
    return this.deck.length > 0 ? this.deck.shift()! : null;
  }

  drawCards(numCards: number): Card[] {
    const cards: Card[] = [];
    for (let i = 0; i < numCards; i++) {
      const card = this.drawCard();
      if (card) {
        cards.push(card);
      }
    }
    return cards;
  }

  addCardToPile(card: Card): void {
    this.deck.push(card);
  }

  addCardsToPile(cards: Card[]): void {
    this.deck.push(...cards);
  }

  getDeck(): Card[] {
    return this.deck;
  }

  resetDeck(): void {
    this.deck = [];
  }
}
