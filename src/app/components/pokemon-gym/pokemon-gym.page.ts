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
import { ModalController } from '@ionic/angular';
import { BattleResultPage } from '../battle-result/battle-result.page';

@Component({
  selector: 'app-pokemon-gym',
  templateUrl: './pokemon-gym.page.html',
  styleUrls: ['./pokemon-gym.page.scss'],
})
export class PokemonGymPage implements OnInit, OnDestroy {
  public isLoggedIn: boolean = true;
  public playerHand: Array<Card> = [];
  public computerHand: Array<Card> = [];
  public playerRepository: Array<Card> = [];
  public computerRepository: Array<Card> = [];
  public isGameStarted: boolean = false;
  public currentCardIndex: number = 0;
  public currentComputerCardIndex: number = 0;
  public turnWinner: 'player' | 'computer' | 'draw' | null = null;
  public turn: 'player' | 'computer' = 'player';
  public timer: number = 20;
  public intervalId: any;

  constructor(
    private modalController: ModalController,
    private authenticationService: AuthService,
    private routerService: Router,
    private cardPokemonService: CardPokemonService,
    private gameBoardService: GameBoardService,
    private playerService: PlayerService,
    private computerPlayerService: ComputerPlayerService,
    public deckService: DeckService,
    private battleService: BattleService
  ) {}

  ngOnInit() {
    this.authenticationService.getUser().subscribe((user) => {
      if (user && user.uid) {
        this.isLoggedIn = true;
        this.loadGameDetails();
      } else {
        console.log('User not authenticated or invalid user object');
        this.isLoggedIn = false;
        this.routerService.navigate(['/']);
      }
    });
  }

  loadGameDetails() {
    this.routerService.navigate(['/loading']);
    this.gameBoardService.initGame().then(async () => {
      const deck = this.deckService.getDeck();
      this.playerHand = await this.playerService.getPlayerCards(); // Load the player cards
      this.computerHand = deck.slice(0, 3);
      this.isGameStarted = true;
      this.startCountdown();
      this.routerService.navigate(['/pokemon-gym']);
    });
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        clearInterval(this.intervalId);
        this.timeIsUp();
      }
    }, 1000);
  }

  timeIsUp() {
    console.log('Time is up!');
  }

  ngOnDestroy() {
    if(this.intervalId) {
      clearInterval(this.intervalId);
    }
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

  async showBattleResult(winner: 'player' | 'computer' | null) {
    const modal = await this.modalController.create({
      component: BattleResultPage,
      componentProps: {
        winner: winner
      }
    });
    await modal.present();
  }

  confirmBattleAbandonment() {
    this.routerService.navigate(['/dashboard']);
  }

  onAttributeSelect(attribute: CardAttribute) {
    if (this.turn === 'player') {
      if (this.isValidAttribute(attribute)) {
        const playerCard = this.playerHand[this.currentCardIndex] as Card;
        const computerCard = this.computerHand[this.currentComputerCardIndex] as Card;
  
        // Se ambas as cartas são definidas
        if (playerCard && computerCard) {
          this.turnWinner = this.battleService.battle(attribute, playerCard, computerCard);
          this.transferCard(this.turnWinner, this.currentCardIndex);
          this.drawCardFromDeck('player');
          this.turn = 'computer';
          if (this.turnWinner !== 'draw') {
            this.showBattleResult(this.turnWinner);
          }
          // Passa a vez para o computador após um delay
          setTimeout(() => {
            this.computerTurn();
          }, 2000);
        } else {
          console.log('Uma ou ambas as cartas são null');
        }
      } else {
        console.log('Atributo inválido');
      }
    }
  }

  
  isValidAttribute(attribute: string): attribute is CardAttribute {
    return this.battleService.battleAttributes.includes(attribute as CardAttribute);
  }

  computerTurn() {
    if (this.turn === 'computer') {
      const computerAttribute = this.computerPlayerService.chooseAttribute();
      const playerCard = this.playerHand[this.currentCardIndex];
      const computerCard = this.computerHand[this.currentComputerCardIndex];
      if (playerCard && computerCard) {
        this.turnWinner = this.battleService.battle(computerAttribute, playerCard, computerCard);
        this.transferCard(this.turnWinner, this.currentComputerCardIndex);
        this.drawCardFromDeck('computer');
        this.turn = 'player';
        if (this.turnWinner !== 'draw') {
          this.showBattleResult(this.turnWinner)
            .catch((error) => {
              console.log(error);
            });
        }
      } else {
        console.log('One or both cards are null');
      }
    }
}


  transferCard(winner: 'player' | 'computer' | 'draw', cardIndex: number) {
    if (winner === 'player') {
      let cardWon = this.computerHand.splice(cardIndex, 1)[0];
      if (cardWon) {
        this.playerHand.push(cardWon);
        this.checkGameOver();
      }
    } else if (winner === 'computer') {
      let cardLost = this.playerHand.splice(cardIndex, 1)[0];
      if (cardLost) {
        this.computerHand.push(cardLost);
        this.checkGameOver();
      }
    } else if (winner === 'draw') {
      // Implementar a lógica para o caso de empate.
      // Talvez ambas as cartas sejam descartadas ou retornem para o fundo dos respectivos baralhos
    }
  }

  drawCardFromDeck(player: 'player' | 'computer') {
    if (this.deckService.getDeck().length > 0) {
      const card = this.deckService.drawCard();
      if (card) {
        if (player === 'player') {
          this.playerHand.push(card);
        } else {
          this.computerHand.push(card);
        }
      }
    }
  }
  

  checkGameOver() {
    if (this.playerHand.length === 0 || this.computerHand.length === 0) {
      this.isGameStarted = false;
      if (this.playerHand.length > this.computerHand.length) {
        console.log('O jogador venceu!');
      } else if (this.playerHand.length < this.computerHand.length) {
        console.log('O computador venceu!');
      } else {
        console.log('Jogo terminou empatado!');
      }
    }
  }
}
