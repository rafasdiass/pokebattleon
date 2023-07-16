import { Component, OnInit, OnDestroy } from '@angular/core';
import { Card, CardAttribute } from '../../models/card.model';
import { AuthService } from '../../services/auth.service';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { Router } from '@angular/router';
import { GameBoardService } from 'src/app/services/game-board.service';
import { PlayerService } from 'src/app/services/player.service';
import { ComputerCardService } from 'src/app/services/computer-card.service';
import { Subscription } from 'rxjs';

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

  private battleResultSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cardPokemonService: CardPokemonService,
    private gameBoardService: GameBoardService,
    private playerService: PlayerService,
    private computerCardService: ComputerCardService,
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.gameBoardService.initGame().then(() => {
          this.cardPokemonService.getCard(user.uid).then(pokemons => {
            this.pokemons = pokemons;
            this.computerCardService.getRandomPokemon(3).then(computerPokemons => {
              this.computerPokemons = computerPokemons;
              this.isGameStarted = true;
            });
          });
        });
      }
    });

    this.battleResultSubscription = this.gameBoardService.battleResult$.subscribe(result => {
      switch (result) {
        case 'player':
          console.log('Jogador vence o turno!');
          break;
        case 'computer':
          console.log('Computador vence o turno!');
          break;
        case 'draw':
          console.log('É um empate!');
          break;
      }
    });
  }

  ngOnDestroy() {
    if (this.battleResultSubscription) {
      this.battleResultSubscription.unsubscribe();
    }
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
    this.gameBoardService.playTurn(attribute);
    this.nextComputerCard();
  }

  nextComputerCard() {
    if (this.currentComputerCardIndex < this.computerPokemons.length - 1) {
      this.currentComputerCardIndex++;
    } else {
      this.currentComputerCardIndex = 0;
    }
  }
}
