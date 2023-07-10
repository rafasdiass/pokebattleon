

import { Component, OnInit } from '@angular/core';
import { Card } from '../../models/card.model'; 
import { CardPokemonService } from '../../services/card-pokemon.service'; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  

  constructor(private cardpokemonService: CardPokemonService) { }  // Injeta o serviço

}
