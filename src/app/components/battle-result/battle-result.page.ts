import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-battle-result',
  templateUrl: './battle-result.page.html',
  styleUrls: ['./battle-result.page.scss'],
})
export class BattleResultPage implements OnInit {
  winner: 'player' | 'computer' | null = null;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  closeResult() {
    this.modalController.dismiss();
  }

  setWinner(winner: 'player' | 'computer' | null) {
    this.winner = winner;
  }
}
