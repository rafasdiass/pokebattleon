import { User } from './user.model';
import { Card } from './card.model';

export class ComputerPlayer extends User {
  cards: Card[];
  wins: number;
  name: string = 'Gary';

  constructor() {
    super('computer', 'computer@game.com', 'Computer Player');
    this.cards = [];
    this.wins = 0;
    
  }

  maximizeStatStrategy(): string {
    const card = this.cards[0];
    const stats = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'];
    let maxStat = stats[0];
    for (const stat of stats) {
      if (card[stat] > card[maxStat]) {
        maxStat = stat;
      }
    }
    return maxStat;
  }

  addCard(card: Card): void {
    this.cards.push(card);
  }

  playCard(): Card | undefined {
    return this.cards.shift();
  }

  win(): void {
    this.wins++;
  }
}
