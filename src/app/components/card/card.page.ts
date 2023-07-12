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
    console.log('CardPage Component Initialized');
    if (!this.pokemon) {
      this.loadPlayerPokemon();
    }
  }

  async loadPlayerPokemon() {
    console.log('Loading Player Pokemon');
    if (this.playerId) {
      let playerData: Player | undefined = await this.playerService.getPlayer(this.playerId);
      
      if (playerData) {
        let player: Player = playerData;
        console.log('Player Data:', player);
        if (player.cards && player.cards.length > 0) {
          this.pokemon = player.cards[0]; // Assume que a primeira carta da lista é a ativa
          console.log('Pokemon Card Selected:', this.pokemon);
        }
      }
    }
  }
}
