import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Adicione este import
import { Player } from '../../models/player.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {
  private playerSubject = new BehaviorSubject<Player | undefined>(undefined);
  player$ = this.playerSubject.asObservable();

  // Aqui estamos adicionando 'user$'
  user$ = this.authService.user$;

  constructor(
    private playerService: PlayerService, 
    private authService: AuthService, 
    private router: Router // Injete o Router
  ) {}

  async ngOnInit() {
    this.authService.getUser().subscribe(async user => {
      if (user) {
        try {
          const playerResult = await this.playerService.getPlayer(user.uid);
          if (playerResult) {
            console.log("Player data: ", playerResult);
            this.playerSubject.next(playerResult);
          } else {
            console.log("Player data not loaded");
            alert('Failed to load player data'); // Adicione uma mensagem de alerta ao usuário
          }
        } catch (error) {
          console.error("Error while fetching player data: ", error);
          alert('An error occurred while fetching player data'); // Adicione uma mensagem de alerta ao usuário
        }
      } else {
        console.log('User not authenticated');
        this.router.navigate(['/login']); // Redirecione para a página de login
      }
    });
  }
}
