import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../services/auth.service';
import { Player } from '../../models/player.model';
import { ComputerPlayerService } from '../../services/computer-player.service';
import { ComputerPlayer } from '../../models/computer-player.model';
import { Observable, from, EMPTY, of } from 'rxjs';
import { switchMap, catchError, filter, map } from 'rxjs/operators';
import { Card } from '../../models/card.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CardPokemonService } from '../../services/card-pokemon.service';
import { GameBoardService } from '../../services/game-board.service';

@Component({
  selector: 'app-pokemon-gym',
  templateUrl: './pokemon-gym.page.html',
  styleUrls: ['./pokemon-gym.page.scss'],
})
export class PokemonGymPage implements OnInit {
  player!: Player;
  computerPlayer$!: Observable<ComputerPlayer>;
  pokemons: Card[] = [];

  constructor(
    private playerService: PlayerService,
    private authService: AuthService,
    private computerPlayerService: ComputerPlayerService,
    private router: Router,
    private cardPokemonService: CardPokemonService,
    private gameBoardService: GameBoardService
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.cardPokemonService.getCard(user.uid).then(pokemons => {
          this.pokemons = pokemons;
        });

        this.playerService.getPlayer(user.uid).then(player => {
          if (player) {
            this.player = player;
            this.gameBoardService.setPlayerInGame(player).then(() => {
              console.log('Player is set in the game');
            });
          } else {
            console.error("Error while fetching player data: Player is null");
            alert('An error occurred while fetching player data');
          }
        }).catch(error => {
          console.error("Error while fetching player data:", error);
          alert('An error occurred while fetching player data');
        });
      }
    });

    this.computerPlayer$ = this.computerPlayerService.getComputerPlayerObservable();
    this.computerPlayerService.init();
  }

  onAttributeSelect(event: any) {
    this.gameBoardService.onAttributeSelect(event);
  }

  confirmBattleAbandonment() {
    // Aqui você pode exibir um modal ou uma caixa de diálogo para confirmar a saída da batalha
    // Ao confirmar, você pode navegar para o dashboard
    this.router.navigate(['/dashboard']);
  }
}
