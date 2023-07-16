import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-computer-player-card',
  templateUrl: './computer-player-card.page.html',
  styleUrls: ['./computer-player-card.page.scss'],
})
export class ComputerPlayerCardPage implements OnInit {
  @Input() pokemon!: Card;  // alterado para 'pokemon'

  constructor() { }

  ngOnInit() {
  }
}
