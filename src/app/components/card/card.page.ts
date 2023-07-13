import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../models/card.model';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { AuthService } from '../../services/auth.service';
import { PlayerService } from '../../services/player.service';
import { PokemonSelectionService } from '../../services/pokemon-selection.service';
import { GameBoardService } from '../../services/game-board.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  @Input() pokemons: Card[] = [];
  @Output() pokemonsEmitter = new EventEmitter<Card[]>();

  constructor(
    private cardPokemonService: CardPokemonService,
    private playerService: PlayerService,
    private pokemonSelectionService: PokemonSelectionService,
    private authService: AuthService,
    private gameBoardService: GameBoardService
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe(async user => {
      if (user && user.uid) {
        console.log('CardPage Component Initialized with playerId:', user.uid);
        await this.loadPlayerPokemon(user.uid);

        // Load the player into the game
        await this.gameBoardService.loadPlayer(user.uid);
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

        // Emitting the pokemons data to parent Dashboard component
        this.pokemonsEmitter.emit(pokemons);

        // Update pokemons in this component
        this.pokemons = pokemons;
      } catch (error) {
        console.error('Error loading player pokemons:', error);
      }
    } else {
        console.log('No playerId provided to CardPage');
    }
  }

  selectCard(card: Card) {
    this.pokemonSelectionService.selectPokemon(card);
    console.log('Pokemon Card Selected:', card);
  }

  removeCard(card: Card) {
    this.pokemonSelectionService.removePokemon(card);
    console.log('Pokemon Card Removed:', card);
  }
}
