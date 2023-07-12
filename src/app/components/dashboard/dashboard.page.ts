import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PlayerService } from '../../services/player.service';
import { UserService } from '../../services/user.service';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { PokemonSelectionService } from '../../services/pokemon-selection.service';
import { Card } from '../../models/card.model';
import { User } from '../../models/user.model';
import { Player } from '../../models/player.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  private userSubject = new BehaviorSubject<User | undefined>(undefined);
  user$ = this.userSubject.asObservable();
  
  private playerSubject = new BehaviorSubject<Player | undefined>(undefined);
  player$ = this.playerSubject.asObservable();
  
  private pokemonsSubject = new BehaviorSubject<Card[]>([]);
  pokemons$ = this.pokemonsSubject.asObservable();

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public playerService: PlayerService,
    public cardPokemonService: CardPokemonService,
    public pokemonSelectionService: PokemonSelectionService,
  ) {}
  
  async ngOnInit() {
    this.authService.getUser().subscribe(async user => {
      if (user) {
        console.log("Usuário autenticado: ", user);
        
        try {
          const userResult = await this.userService.getUser(user.uid);
          console.log("Dados do usuário: ", userResult);
          this.userSubject.next(userResult);
        } catch (error) {
          console.error("Erro ao buscar dados do usuário: ", error);
        }
        
        try {
          const playerResult = await this.playerService.getPlayer(user.uid);
          if (playerResult) {
            console.log("Dados do jogador: ", playerResult);
            this.playerSubject.next(playerResult);
          } else {
            console.log("Dados do jogador não carregados");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do jogador: ", error);
        }
        
        try {
          const cards = await this.cardPokemonService.getCard(user.uid);
          if (cards.length > 0) {
            console.log("Cards: ", cards);
            this.pokemonsSubject.next(cards);
          } else {
            console.log("Dados do card não carregados ou vazios");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do card: ", error);
        }
      }
    });
  }

  selectCard(card: Card) {
    this.pokemonSelectionService.selectPokemon(card);
  }

  removeCard(card: Card) {
    this.pokemonSelectionService.removePokemon(card);
  }
}
