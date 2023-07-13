import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  isLoggedIn: boolean = true;
  pokemons: Card[] = [];

  constructor(
    private authService: AuthService,
    private cardPokemonService: CardPokemonService
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.cardPokemonService.getCard(user.uid).then(pokemons => {
          this.pokemons = pokemons;
        });
      }
    });
  }
}
