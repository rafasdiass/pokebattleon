import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PlayerService } from '../../services/player.service';
import { UserService } from '../../services/user.service';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { PokemonSelectionService } from '../../services/pokemon-selection.service';
import { Card } from '../../models/card.model';
import { User } from '../../models/user.model';
import { Player } from '../../models/player.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  user$: Observable<User | undefined> = of();
  player$: Observable<Player | undefined> = of();
  pokemons$: Observable<Card[]> = of([]);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private playerService: PlayerService,
    private cardPokemonService: CardPokemonService,
    private pokemonSelectionService: PokemonSelectionService,
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.user$ = this.userService.getUser(user.uid);
        this.player$ = this.playerService.getPlayer(user.uid);
        this.pokemons$ = this.cardPokemonService.getCard(user.uid);
      }
    });
  }

  selectCard(card: Card) {
    this.pokemonSelectionService.selectPokemon(card);
  }

  removeCard(card: Card) {
    this.pokemonSelectionService.removePokemon(card);
  }

}
