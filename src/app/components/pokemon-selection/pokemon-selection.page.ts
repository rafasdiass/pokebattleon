import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Card } from '../../models/card.model';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-pokemon-selection',
  templateUrl: './pokemon-selection.page.html',
  styleUrls: ['./pokemon-selection.page.scss'],
})
export class PokemonSelectionPage implements OnInit {

  pokemons$: Observable<Card[]> = of([]);
  selectedCard: Card | null = null;
  user: User | null = null;

  constructor(private cardPokemonService: CardPokemonService, private userService: UserService) { }

  ngOnInit() {
    this.userService.getUser('userId').subscribe(user => {
      if (user) {
        this.user = user;
        this.pokemons$ = this.cardPokemonService.getCard(user.uid);
      }
    });
  }

  selectCard(card: Card) {
    // Define a carta selecionada
    this.selectedCard = card;
    console.log("Card selecionado:", card);

    // Atualizar a seleção no Firestore
    if (this.user) {
      this.cardPokemonService.selectCard(this.user.uid, card.id).then(() => {
        console.log("Card selecionado salvo no Firestore");
      });
    }
  }
}
