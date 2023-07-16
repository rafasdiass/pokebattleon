import { Injectable } from '@angular/core';
import { Card, CardAttribute } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  battleAttributes: CardAttribute[] = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'];

  constructor() { }

  battle(attribute: keyof Card, playerCard: Card, computerCard: Card): 'player' | 'computer' | 'draw' {
    let playerAttribute = playerCard[attribute];
    let computerAttribute = computerCard[attribute];
  
    if (playerAttribute > computerAttribute) {
      return 'player';
    } else if (playerAttribute < computerAttribute) {
      return 'computer';
    } else {
      // Lidar com o empate selecionando um novo atributo
      for (let attr of this.battleAttributes) {
        if (attr === attribute) continue;
        playerAttribute = playerCard[attr];
        computerAttribute = computerCard[attr];
        if (playerAttribute > computerAttribute) {
          return 'player';
        } else if (playerAttribute < computerAttribute) {
          return 'computer';
        }
      }

      // Se chegou aqui, todas as comparações resultaram em empate
      return 'draw';
    }
  }
}
