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
  isGameStarted: boolean = false;
  currentCardIndex: number = 0;
  currentComputerCardIndex: number = 0;
  deck: Card[] = [];
  deckCount: number = 0;
  turnWinner: 'player' | 'computer' | 'draw' | null = null;
  turn?: 'player' | 'computer';

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
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.gameBoardService.initGame().then(() => {
          this.cardPokemonService.getCard(user.uid).then(pokemons => {
            this.pokemons = pokemons;
            this.deck = this.deckService.getDeck();
            this.deckCount = this.deck.length;
            const computerPlayer = this.computerPlayerService.getComputerPlayer();
            this.computerPokemons = computerPlayer.cards;
            this.isGameStarted = true;
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
    this.turnWinner = this.battleService.battle(attribute, this.pokemons[this.currentCardIndex], this.computerPokemons[this.currentComputerCardIndex]);
    this.currentCardIndex = (this.currentCardIndex + 1) % this.pokemons.length;

    // After the player makes a move, it's the computer's turn
    this.computerTurn();
  }

  computerTurn() {
    // The computer chooses an attribute
    const computerAttribute = this.computerPlayerService.chooseAttribute();
    this.turnWinner = this.battleService.battle(computerAttribute, this.pokemons[this.currentCardIndex], this.computerPokemons[this.currentComputerCardIndex]);
    
    this.currentComputerCardIndex = (this.currentComputerCardIndex + 1) % this.computerPokemons.length;
  }

  nextComputerCard() {
    if (this.currentComputerCardIndex < this.computerPokemons.length - 1) {
      this.currentComputerCardIndex++;
    } else {
      this.currentComputerCardIndex = 0;
    }
  }
}
