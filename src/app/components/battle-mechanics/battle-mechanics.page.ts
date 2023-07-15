import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CardAttribute } from '../../models/card.model';
import { GameBoardService } from '../../services/game-board.service';

@Component({
  selector: 'app-battle-mechanics',
  templateUrl: './battle-mechanics.page.html',
  styleUrls: ['./battle-mechanics.page.scss'],
})
export class BattleMechanicsPage implements OnInit {
  // Possible attributes to compare
  attributes: CardAttribute[] = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'];

  // Selected attribute
  selectedAttribute = new FormControl();

  constructor(
    private gameBoardService: GameBoardService
  ) {}

  ngOnInit() {
    this.selectedAttribute.valueChanges.subscribe(value => {
      if (value) {
        this.gameBoardService.playTurn(value);
      }
    });
  }
}
