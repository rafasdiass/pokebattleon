import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../services/auth.service';
import { Player } from '../../models/player.model';
import { ComputerPlayerService } from '../../services/computer-player.service';
import { ComputerPlayer } from '../../models/computer-player.model';
import { Observable, from, EMPTY } from 'rxjs';
import { switchMap, catchError, filter, map } from 'rxjs/operators';
import { Card } from '../../models/card.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-gym',
  templateUrl: './pokemon-gym.page.html',
  styleUrls: ['./pokemon-gym.page.scss'],
})
export class PokemonGymPage implements OnInit {
  player$!: Observable<Player>;
  computerPlayer$!: Observable<ComputerPlayer>;

  constructor(
    private playerService: PlayerService,
    private authService: AuthService,
    private computerPlayerService: ComputerPlayerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.player$ = this.authService.getUser().pipe(
      switchMap((user: any) =>
        from(this.playerService.getPlayer(user.uid)).pipe(
          filter(player => player !== null),
          map(player => player as Player),
          catchError(error => {
            console.error("Error while fetching player data:", error);
            alert('An error occurred while fetching player data');
            return EMPTY;
          })
        )
      )
    );

    this.computerPlayer$ = this.computerPlayerService.getComputerPlayerObservable();
    this.computerPlayerService.init();
  }

  onAttributeSelect(event: any) {
    const attribute = event.target.value;
    // Implement the logic to handle the attribute selection here
  }

  confirmBattleAbandonment() {
    // Aqui você pode exibir um modal ou uma caixa de diálogo para confirmar a saída da batalha
    // Ao confirmar, você pode navegar para o dashboard
    this.router.navigate(['/dashboard']);
  }
}
