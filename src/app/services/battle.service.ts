import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class BattleService {

  constructor() { }

  // The battle method will get the attribute to compare, user card and computer card as parameters
  // The method will return the result of the battle: 'user', 'computer', or 'draw'
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
