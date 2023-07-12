import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PlayerService } from '../../services/player.service';
import { UserService } from '../../services/user.service';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { PokemonSelectionService } from '../../services/pokemon-selection.service';
import { Card } from '../../models/card.model';
import { User } from '../../models/user.model';
import { Player } from '../../models/player.model';
import { BehaviorSubject, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  // BehaviorSubjects que permitem armazenar e observar os dados do usuário, do jogador e dos pokemons
  private userSubject = new BehaviorSubject<User | undefined>(undefined);
  user$ = this.userSubject.asObservable();
  
  private playerSubject = new BehaviorSubject<Player | undefined>(undefined);
  player$ = this.playerSubject.asObservable();
  
  private pokemonsSubject = new BehaviorSubject<Card[]>([]);
  pokemons$ = this.pokemonsSubject.asObservable();

  // Injeção dos serviços necessários no construtor
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public playerService: PlayerService,
    public cardPokemonService: CardPokemonService,
    public pokemonSelectionService: PokemonSelectionService,
  ) {}
  
  // Função que roda quando a página é carregada
  async ngOnInit() {
    this.authService.getUser().subscribe(async user => {
      if (user) {
        // Loga o usuário autenticado
        console.log("Usuário autenticado: ", user);

        // Obtém os dados do usuário através do serviço UserService e atualiza o userSubject
        const userResult = await this.userService.getUser(user.uid);
        console.log("Dados do usuário: ", userResult);
        this.userSubject.next(userResult);
        
        // Obtém os dados do jogador através do serviço PlayerService e atualiza o playerSubject se os dados forem carregados corretamente
        const playerResult = await this.playerService.getPlayer(user.uid);
        if (playerResult) {
          console.log("Dados do jogador: ", playerResult);
          this.playerSubject.next(playerResult);
        } else {
          console.log("Dados do jogador não carregados");
        }
        
        // Obtém os cards do usuário através do serviço CardPokemonService e atualiza o pokemonsSubject se os dados forem carregados corretamente
        const cardResult = await this.cardPokemonService.getCard(user.uid);
        if (cardResult && cardResult.length > 0) {
          console.log("Pokemons: ", cardResult);
          this.pokemonsSubject.next(cardResult);
        } else {
          console.log("Dados do card não carregados ou vazios");
        }
      }
    });
  }

  // Função para selecionar um card
  selectCard(card: Card) {
    this.pokemonSelectionService.selectPokemon(card);
  }

  // Função para remover um card
  removeCard(card: Card) {
    this.pokemonSelectionService.removePokemon(card);
  }
}
