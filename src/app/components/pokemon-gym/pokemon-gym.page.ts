import { Component, OnInit, OnDestroy } from '@angular/core';
import { Card, CardAttribute } from '../../models/card.model';
import { AuthService } from '../../services/auth.service';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { Router } from '@angular/router';
import { GameBoardService } from '../../services/game-board.service';
import { PlayerService } from '../../services/player.service';
import { ComputerPlayerService } from '../../services/computer-player.service';
import { DeckService } from '../../services/deck.service';
import { BattleService } from '../../services/battle.service';

@Component({
  selector: 'app-pokemon-gym',
  templateUrl: './pokemon-gym.page.html',
  styleUrls: ['./pokemon-gym.page.scss'],
})
export class PokemonGymPage implements OnInit, OnDestroy {
  isLoggedIn: boolean = true;
  playerHand: Card[] = [];
  computerHand: Card[] = [];
  playerRepository: Card[] = [];
  computerRepository: Card[] = [];
  isGameStarted: boolean = false;
  currentCardIndex: number = 0;
  currentComputerCardIndex: number = 0;
  turnWinner: 'player' | 'computer' | 'draw' | null = null;
  turn: 'player' | 'computer' = 'player';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cardPokemonService: CardPokemonService,
    private gameBoardService: GameBoardService,
    private playerService: PlayerService,
    private computerPlayerService: ComputerPlayerService,
    public deckService: DeckService, // made this public
    private battleService: BattleService
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user && user.uid) {
        this.router.navigate(['/loading']);
        this.gameBoardService.initGame().then(() => {
          this.deckService.createDeck(28).then(deck => {
            this.playerHand = deck.slice(0, 3);
            this.computerHand = deck.slice(3, 6);
            this.isGameStarted = true;
            this.router.navigate(['/pokemon-gym']);
          });
        });
      } else {
        console.log('User not authenticated or invalid user object');
        this.router.navigate(['/']);
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
    if (this.currentCardIndex < this.playerHand.length - 1) {
      this.currentCardIndex++;
    }
  }

  confirmBattleAbandonment() {
    this.router.navigate(['/dashboard']);
  }

  onAttributeSelect(attribute: CardAttribute) {
    if (this.turn === 'player') {
      this.turnWinner = this.battleService.battle(attribute, this.playerHand[this.currentCardIndex], this.computerHand[this.currentComputerCardIndex]);
      this.transferCard(this.turnWinner);
      this.drawCardFromDeck('player');
      this.turn = 'computer';
      setTimeout(() => {
        this.computerTurn();
      }, 2000); // aqui definimos um atraso de 2 segundos para o turno do computador
    }
  }

  computerTurn() {
    if (this.turn === 'computer') {
      const computerAttribute = this.computerPlayerService.chooseAttribute();
      this.turnWinner = this.battleService.battle(computerAttribute, this.playerHand[this.currentCardIndex], this.computerHand[this.currentComputerCardIndex]);
      this.transferCard(this.turnWinner);
      this.drawCardFromDeck('computer');
      this.turn = 'player';
    }
  }

  transferCard(winner: 'player' | 'computer' | 'draw') {
    if (winner === 'player') {
      let card = this.computerHand.shift();
      if (card) {
        this.playerRepository.push(card);
      }
      this.checkGameOver();
    } else if (winner === 'computer') {
      let card = this.playerHand.shift();
      if (card) {
        this.computerRepository.push(card);
      }
      this.checkGameOver();
    }
  }

  drawCardFromDeck(player: 'player' | 'computer') {
    let card = this.deckService.drawCard();
    if (card) {
      if (player === 'player') {
        this.playerHand.push(card);
      } else {
        this.computerHand.push(card);
      }
    } else {
      // Se o deck estiver vazio, o jogo termina.
      this.endGame();
    }
  }

  checkGameOver() {
    if (this.playerRepository.length === 28) {
      this.endGame('player');
    } else if (this.computerRepository.length === 28) {
      this.endGame('computer');
    }
  }

  endGame(winner: 'player' | 'computer' | null = null) {
    // Implemente a lógica para terminar o jogo aqui.
    // Você pode mostrar uma mensagem para o usuário e redirecioná-lo para a tela inicial.
    // Também você pode usar o parâmetro `winner` para informar quem venceu o jogo.
  }
}
