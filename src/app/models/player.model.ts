import { Card } from './card.model';

export class Player {
  constructor(
    public uid: string,
    public wins: number,
    public cards: Card[]
  ) {}
}
