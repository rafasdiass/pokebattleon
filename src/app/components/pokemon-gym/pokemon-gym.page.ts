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
    this.gameBoardService.initGame().then(() => {
      const deck = this.deckService.getDeck();
      this.playerHand = deck.slice(0, 3);
      this.computerHand = deck.slice(3, 6);
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
      if (this.isValidAttribute(attribute)) { // Verifica se o atributo é válido
        this.turnWinner = this.battleService.battle(
          attribute,
          this.playerHand[this.currentCardIndex],
          this.computerHand[this.currentComputerCardIndex]
        );
        this.transferCard(this.turnWinner);
        this.drawCardFromDeck('player');
        this.turn = 'computer';
        if (this.turnWinner !== 'draw') {
          this.showBattleResult(this.turnWinner);
        }
        setTimeout(() => {
          this.computerTurn();
        }, 2000);
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
  
      this.turnWinner = this.battleService.battle(computerAttribute, playerCard, computerCard);
  
      this.transferCard(this.turnWinner);
      this.drawCardFromDeck('computer');
      this.turn = 'player';
  
      if (this.turnWinner !== 'draw') {
        this.showBattleResult(this.turnWinner)
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }
  
  

  transferCard(winner: 'player' | 'computer' | 'draw') {
    if (winner === 'player') {
      let card = this.computerHand.shift();
      if (card) {
        this.playerRepository.push(card);
        this.checkGameOver();
      }
    } else if (winner === 'computer') {
      let card = this.playerHand.shift();
      if (card) {
        this.computerRepository.push(card);
        this.checkGameOver();
      }
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

  async endGame(winner: 'player' | 'computer' | null = null) {
    await this.showBattleResult(winner);
    // Implement the logic to end the game here.
    // You can show a message
  }
  // enterPokemonGym() {
    // Implement your logic here, e.g. start a new game
  //   this.loadGameDetails();
  // }
}
