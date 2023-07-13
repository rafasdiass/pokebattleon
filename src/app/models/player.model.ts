import { Card } from './card.model';

export class Player {
  constructor(
    public uid: string,
    public name: string,
    public cards: Card[],
    public wins?: number,   // "wins" é opcional e vem depois dos parâmetros obrigatórios
    public rank?: number    // "rank" é opcional e vem depois dos parâmetros obrigatórios
  ) {}
}
