import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  constructor() { }

  battle(attribute: keyof Card, userCard: Card, computerCard: Card): 'user' | 'computer' | 'draw' {
    const userAttribute = userCard[attribute];
    const computerAttribute = computerCard[attribute];

    if (userAttribute > computerAttribute) {
      return 'user';
    } else if (userAttribute < computerAttribute) {
      return 'computer';
    } else {
      return 'draw';
    }
  }
}
