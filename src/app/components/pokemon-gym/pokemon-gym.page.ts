import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../services/auth.service';
import { Player } from '../../models/player.model';
import { Observable, from, EMPTY, of } from 'rxjs';
import { Card } from '../../models/card.model';
import { Router } from '@angular/router';
import { CardPokemonService } from '../../services/card-pokemon.service';

@Component({
  selector: 'app-pokemon-gym',
  templateUrl: './pokemon-gym.page.html',
  styleUrls: ['./pokemon-gym.page.scss'],
})
export class PokemonGymPage implements OnInit {
  isLoggedIn: boolean = true;
  pokemons: Card[] = [];
  isGameStarted: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cardPokemonService: CardPokemonService,
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

  confirmBattleAbandonment() {
    // Aqui você pode exibir um modal ou uma caixa de diálogo para confirmar a saída da batalha
    // Ao confirmar, você pode navegar para o dashboard
    this.router.navigate(['/dashboard']);
  }
}
