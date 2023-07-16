import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  constructor() { }

  battle(attribute: keyof Card, playerCard: Card, computerCard: Card): 'player' | 'computer' | 'draw' {
    const playerAttribute = playerCard[attribute];
    const computerAttribute = computerCard[attribute];
  
    if (playerAttribute > computerAttribute) {
      return 'player';
    } else if (playerAttribute < computerAttribute) {
      return 'computer';
    } else {
      return 'draw';
    }
  }

}
