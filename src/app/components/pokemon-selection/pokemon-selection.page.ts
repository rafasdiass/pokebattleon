import { Component, OnInit } from '@angular/core';
import { Observable, of, from } from 'rxjs';
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
  user: User | undefined;

  constructor(private cardPokemonService: CardPokemonService, public userService: UserService) { }

  async ngOnInit() {
    const userId = 'userId'; // Substitua por como você obtém o userId
    this.user = await this.userService.getUser(userId);
    
    if (this.user) {
      // Convertendo a Promise para Observable com "from"
      this.pokemons$ = from(this.cardPokemonService.getCard(this.user.uid));
    }
  }

  async selectCard(card: Card) {
    // Define a carta selecionada
    this.selectedCard = card;
    console.log("Card selecionado:", card);

    // Atualizar a seleção no Firestore
    if (this.user) {
      await this.cardPokemonService.selectCard(this.user.uid, card.id);
      console.log("Card selecionado salvo no Firestore");
    }
  }
}
