import { Component, OnInit } from '@angular/core';
import { Card } from '../../models/card.model';
import { Player } from '../../models/player.model';
import { GameBoardService } from '../../services/game-board.service';
import { ApipokemonService } from '../../services/apipokemon.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.css']
})
export class CardPage implements OnInit {
  player: Player | null = null;
  computerCard: Card | null = null;

  constructor(
    private gameBoardService: GameBoardService,
    private apipokemonService: ApipokemonService,
    private playerService: PlayerService
  ) { }

  ngOnInit() {
    this.loadGame();
  }

  async loadGame() {
    try {
      // Load user and their cards
      await this.gameBoardService.loadPlayer('playerId'); // substitute 'playerId' with the actual player id
      this.player = this.gameBoardService.getUser();

      // Get a random card for the computer
      const pokemon = await this.apipokemonService.getRandomPokemon();
      this.computerCard = new Card(
        pokemon.id,
        pokemon.name,
        pokemon.sprites.front_default,
        pokemon.stats[0].base_stat,
        pokemon.stats[1].base_stat,
        pokemon.stats[2].base_stat,
        pokemon.stats[3].base_stat,
        pokemon.stats[4].base_stat,
        pokemon.stats[5].base_stat
      );

      // Setup the game
      this.gameBoardService.setGame(this.computerCard);
    } catch (err) {
      console.error('Failed to load game: ', err);
    }
  }

  selectAttribute(attribute: keyof Card) {
    try {
      this.gameBoardService.selectAttribute(attribute);
      this.player = this.gameBoardService.getUser();
    } catch (err) {
      console.error('Failed to select attribute: ', err);
    }
  }
}
