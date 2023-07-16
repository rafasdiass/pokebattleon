import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../models/card.model';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { AuthService } from '../../services/auth.service';
import { PlayerService } from '../../services/player.service';
import { PokemonSelectionService } from '../../services/pokemon-selection.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  @Input() pokemon!: Card;

  constructor(
    private cardPokemonService: CardPokemonService,
    private playerService: PlayerService,
    private pokemonSelectionService: PokemonSelectionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe(async user => {
      if (user && user.uid) {
        console.log('CardPage Component Initialized with playerId:', user.uid);
        await this.loadPlayerPokemon(user.uid);
      } else {
        console.log('User not authenticated or invalid user object');
      }
    });
  }

  async loadPlayerPokemon(playerId: string) {
    console.log('Loading Player Pokemon');
    if (playerId) {
      console.log('Loading data for player:', playerId);
      try {
        const pokemons = await this.cardPokemonService.getCard(playerId);
        console.log('Pokemons Data:', pokemons);

        // We are no longer emitting pokemons here

        // Update pokemon in this component
        this.pokemon = pokemons[0]; // We are only setting the first Pokemon here
      } catch (error) {
        console.error('Error loading player pokemons:', error);
      }
    } else {
        console.log('No playerId provided to CardPage');
    }
  }

  selectCard() {
    this.pokemonSelectionService.selectPokemon(this.pokemon);
    console.log('Pokemon Card Selected:', this.pokemon);
  }

  removeCard() {
    this.pokemonSelectionService.removePokemon(this.pokemon);
    console.log('Pokemon Card Removed:', this.pokemon);
  }
}
