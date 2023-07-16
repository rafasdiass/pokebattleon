import { Component, OnInit } from '@angular/core';
import { AttributeIcon } from '../../models/card.model';
import { GameBoardService } from '../../services/game-board.service';

@Component({
  selector: 'app-battle-mechanics',
  templateUrl: './battle-mechanics.page.html',
  styleUrls: ['./battle-mechanics.page.scss'],
})
export class BattleMechanicsPage implements OnInit {
  attributes: AttributeIcon[] = [
    { name: 'hp', icon: 'heart' },
    { name: 'attack', icon: 'arrow-forward' },
    { name: 'defense', icon: 'shield' },
    { name: 'specialAttack', icon: 'flash' },
    { name: 'specialDefense', icon: 'shield' },
    { name: 'speed', icon: 'speedometer' }
  ];

  constructor(public gameBoardService: GameBoardService) {} // Make gameBoardService public

  ngOnInit() {
    if (!this.gameBoardService.player) {
      console.log('Player is not defined');
      return;
    }

    // Here, you can put any other logic you need to run when the component is initialized.
  }

  selectAttribute(attribute: AttributeIcon) {
    this.gameBoardService.playTurn(attribute.name);
  }
}
