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
        console.log("User authenticated: ", user);  // Log the authenticated user

        const userResult = await this.userService.getUser(user.uid);
        console.log("User data: ", userResult);  // Log user data
        this.userSubject.next(userResult);
        
        const playerResult = await this.playerService.getPlayer(user.uid);
        console.log("Player data: ", playerResult);  // Log player data
        this.playerSubject.next(playerResult);
        
        const cardResult = await this.cardPokemonService.getCard(user.uid);
        console.log("Pokemons: ", cardResult);  // Log pokemons
        this.pokemonsSubject.next(cardResult);
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
