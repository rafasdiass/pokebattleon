import { Card } from './card.model';

export class Player {
  constructor(
    public uid: string,
    public name: string,
    public cards: Card[],
    public wins?: number,
    public rank?: number,
    public online: boolean = false
  ) {}

  playCard(): Card | null {
    return this.cards.pop() || null;
  }
}
