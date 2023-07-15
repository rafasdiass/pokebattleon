import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Player } from '../../models/player.model';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';  // Import 'take' here
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {
  private playerSubject = new BehaviorSubject<Player | null>(null);
  player$ = this.playerSubject.asObservable();

  constructor(
    private playerService: PlayerService, 
    private authService: AuthService, 
    private router: Router
  ) {}
  
  ngOnInit() {
    this.authService.getUser().pipe(take(1)).subscribe((user: any) => { // Assuming 'user' is of any type. You might need to replace 'any' with the correct type.
      if (user && user.uid) {  // Check if user and user.uid exist
        this.playerService.getPlayer(user.uid).then(player => {
          if (player) {
            console.log("Player data:", player);
            this.playerSubject.next(player);
          } else {
            console.log("Player data not loaded");
            alert('Failed to load player data');
          }
        }).catch(error => {
          console.error("Error while fetching player data:", error);
          alert('An error occurred while fetching player data');
        });
      } else {
        // User is not logged in, do nothing
      }
    });
  }

  onPokemonsChanged(updatedPokemons: Card[]) {
    // Assuming that 'player' is the player data variable in your Player component class.
    const currentPlayer = this.playerSubject.getValue();
    if(currentPlayer) {
      currentPlayer.cards = updatedPokemons;
      this.playerSubject.next(currentPlayer);
    }
  }
}
