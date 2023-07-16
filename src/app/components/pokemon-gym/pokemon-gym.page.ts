import { Component, OnInit } from '@angular/core';
import { Card } from '../../models/card.model';
import { AuthService } from '../../services/auth.service';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-gym',
  templateUrl: './pokemon-gym.page.html',
  styleUrls: ['./pokemon-gym.page.scss'],
})
export class PokemonGymPage implements OnInit {
  isLoggedIn: boolean = true;
  pokemons: Card[] = [];
  isGameStarted: boolean = true;
  currentCardIndex: number = 0; // Adicionado para navegar entre as cartas

  constructor(
    private authService: AuthService,
    private router: Router,
    private cardPokemonService: CardPokemonService,
  ) {}

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

  confirmBattleAbandonment() {
    // Aqui você pode exibir um modal ou uma caixa de diálogo para confirmar a saída da batalha
    // Ao confirmar, você pode navegar para o dashboard
    this.router.navigate(['/dashboard']);
  }
}
