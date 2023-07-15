import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-computer-player-card',
  templateUrl: './computer-player-card.page.html',
  styleUrls: ['./computer-player-card.page.scss'],
})
export class ComputerPlayerCardPage implements OnInit {
  @Input() pokemons!: Card[];  // aqui é 'pokemons' em vez de 'pokemon'

  constructor() { }

  ngOnInit() {
  }

}
