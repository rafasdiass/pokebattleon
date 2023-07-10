import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../models/card.model';
import { Player } from '../../models/player.model';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  @Input() playerId!: string;
  @Input() pokemon!: Card;

  constructor(
    private cardPokemonService: CardPokemonService,
    private playerService: PlayerService
  ) { }

  ngOnInit() {
    if (!this.pokemon) {
      this.loadPlayerPokemon();
    }
  }

  async loadPlayerPokemon() {
    if (this.playerId) {
      let playerData: Player | undefined = await this.playerService.getPlayer(this.playerId).toPromise();
      
      if (playerData) {
        let player: Player = playerData;
        if (player.cards && player.cards.length > 0) {
          this.pokemon = player.cards[0]; // Assume que a primeira carta da lista é a ativa
        }
      }
    }
  }
}
