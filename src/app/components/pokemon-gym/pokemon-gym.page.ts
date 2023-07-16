import { Component, OnInit } from '@angular/core';
import { Card, CardAttribute } from '../../models/card.model';
import { AuthService } from '../../services/auth.service';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { Router } from '@angular/router';
import { GameBoardService } from 'src/app/services/game-board.service';
import { PlayerService } from 'src/app/services/player.service';
import { ComputerCardService } from 'src/app/services/computer-card.service';

@Component({
  selector: 'app-pokemon-gym',
  templateUrl: './pokemon-gym.page.html',
  styleUrls: ['./pokemon-gym.page.scss'],
})
export class PokemonGymPage implements OnInit {
  isLoggedIn: boolean = true;
  pokemons: Card[] = [];
  computerPokemons: Card[] = [];
  isGameStarted: boolean = false;
  currentCardIndex: number = 0;
  currentComputerCardIndex: number = 0; // índice da carta atual do computador

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
  }

  // Função para ir para a carta anterior
  previousCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
    }
  }

  // Função para ir para a próxima carta
  nextCard() {
    if (this.currentCardIndex < this.pokemons.length - 1) {
      this.currentCardIndex++;
    }
  }

  confirmBattleAbandonment() {
    this.router.navigate(['/dashboard']);
  }

  onAttributeSelect(event: any) {
    const selectedAttribute: CardAttribute = event.target.value as CardAttribute;
    this.gameBoardService.playTurn(selectedAttribute);

    // após o turno do jogador, o computador deve jogar seu turno
    this.nextComputerCard();
  }

  // Função para o computador ir para a próxima carta
  nextComputerCard() {
    if (this.currentComputerCardIndex < this.computerPokemons.length - 1) {
      this.currentComputerCardIndex++;
    } else {
      // Se o computador já exibiu todas as suas cartas, pode-se reiniciar o índice ou implementar alguma outra lógica.
      this.currentComputerCardIndex = 0;
    }
  }
}
