import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  isLoggedIn: boolean = true;
  pokemons: Card[] = [];
  currentCardIndex: number = 0;
  playerCard: Card | undefined;
  computerCard: Card | undefined;
  winner: string;
  playerWins: number;
  computerWins: number;

  // constructor(private gameService: GameService) {
  //   this.winner = '';
  //   this.playerWins = 0;
  //   this.computerWins = 0;
  //   console.log('GameBoardComponent constructor called');
  // }
  constructor(
    private authService: AuthService,
    private cardPokemonService: CardPokemonService
  ) {
    this.winner = '';
    this.playerWins = 0;
    this.computerWins = 0;
    console.log('GameBoardComponent constructor called');
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.cardPokemonService.getCard(user.uid).then(pokemons => {
          this.pokemons = pokemons;
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
}
