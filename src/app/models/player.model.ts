import { Card } from './card.model';

export class Player {
  constructor(
    public uid: string,
    public name: string,
    public wins: number,
    public cards: Card[],
    public rank: number
  ) {}
}
