import { Component, OnInit, OnDestroy } from '@angular/core';
import { Card, CardAttribute } from '../../models/card.model';
import { AuthService } from '../../services/auth.service';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { Router } from '@angular/router';
import { GameBoardService } from '../../services/game-board.service';
import { PlayerService } from '../../services/player.service';
import { ComputerPlayerService } from '../../services/computer-player.service';
import { Subscription } from 'rxjs';
import { DeckService } from '../../services/deck.service';
import { BattleService } from '../../services/battle.service';

@Component({
  selector: 'app-pokemon-gym',
  templateUrl: './pokemon-gym.page.html',
  styleUrls: ['./pokemon-gym.page.scss'],
})
export class PokemonGymPage implements OnInit, OnDestroy {
  isLoggedIn: boolean = true;
  pokemons: Card[] = [];
  computerPokemons: Card[] = [];
  playerDeck: Card[] = [];
  computerDeck: Card[] = [];
  isGameStarted: boolean = false;
  currentCardIndex: number = 0;
  currentComputerCardIndex: number = 0;
  deck: Card[] = [];
  deckCount: number = 0;
  pokemonCount: number = 0;
  turnWinner: 'player' | 'computer' | 'draw' | null = null;
  turn: 'player' | 'computer' = 'player';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cardPokemonService: CardPokemonService,
    private gameBoardService: GameBoardService,
    private playerService: PlayerService,
    private computerPlayerService: ComputerPlayerService,
    private deckService: DeckService,
    private battleService: BattleService
  ) {}

  ngOnInit() {
    this.router.navigate(['/loading']);
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.gameBoardService.initGame().then(() => {
          this.cardPokemonService.getCard(user.uid).then(pokemons => {
            this.pokemons = pokemons;
            this.pokemonCount = this.pokemons.length;
            this.deck = this.deckService.getDeck();
            this.deckCount = this.deck.length;
            const computerPlayer = this.computerPlayerService.getComputerPlayer();
            this.computerPokemons = computerPlayer.cards;
            this.isGameStarted = true;
            this.router.navigate(['/pokemon-gym']);
          });
        });
      }
    });
  }

  ngOnDestroy() {
    // Nothing to clean up in this current implementation
  }

  previousCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
    }
  }

  nextCard() {
    if (this.currentCardIndex < this.pokemons.length - 1) {
      this.currentCardIndex++;
    }
  }

  confirmBattleAbandonment() {
    this.router.navigate(['/dashboard']);
  }

  onAttributeSelect(attribute: CardAttribute) {
    if (this.turn === 'player') {
      this.turnWinner = this.battleService.battle(attribute, this.pokemons[this.currentCardIndex], this.computerPokemons[this.currentComputerCardIndex]);
      this.transferCard(this.turnWinner);
      this.drawCard('player');
      this.turn = 'computer';
      this.computerTurn();
    }
  }

  computerTurn() {
    if (this.turn === 'computer') {
      const computerAttribute = this.computerPlayerService.chooseAttribute();
      this.turnWinner = this.battleService.battle(computerAttribute, this.pokemons[this.currentCardIndex], this.computerPokemons[this.currentComputerCardIndex]);
      this.transferCard(this.turnWinner);
      this.drawCard('computer');
      this.turn = 'player';
    }
  }

  transferCard(winner: 'player' | 'computer' | 'draw') {
    if (winner === 'player') {
      if (this.computerPokemons.length > 0) {
        let card = this.computerPokemons.splice(this.currentComputerCardIndex, 1)[0];
        if (card) {
          this.playerDeck.push(card);
        }
        this.nextComputerCard();
      }
    } else if (winner === 'computer') {
      if (this.pokemons.length > 0) {
        let card = this.pokemons.splice(this.currentCardIndex, 1)[0];
        if (card) {
          this.computerDeck.push(card);
        }
        this.nextCard();
      }
    }
    // Atualizar a contagem de cartas
    this.pokemonCount = this.pokemons.length;
    this.deckCount = this.playerDeck.length;
  }
  
  drawCard(player: 'player' | 'computer') {
    if (player === 'player' && this.playerDeck.length > 0) {
      let card = this.playerDeck.pop();
      if (card) {
        this.pokemons.push(card);
      }
    } else if (player === 'computer' && this.computerDeck.length > 0) {
      let card = this.computerDeck.pop();
      if (card) {
        this.computerPokemons.push(card);
      }
    }
    // Atualizar a contagem de cartas
    this.pokemonCount = this.pokemons.length;
    this.deckCount = this.playerDeck.length;
  }

  nextComputerCard() {
    if (this.currentComputerCardIndex < this.computerPokemons.length - 1) {
      this.currentComputerCardIndex++;
    } else {
      this.currentComputerCardIndex = 0;
    }
  }
}
