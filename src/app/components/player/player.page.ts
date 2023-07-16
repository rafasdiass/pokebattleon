import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Player } from '../../models/player.model';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {
  private playerSubject = new BehaviorSubject<Player | null>(null);
  player$ = this.playerSubject.asObservable();
  currentCardIndex: number = 0;

  constructor(
    private playerService: PlayerService, 
    private authService: AuthService, 
    private router: Router
  ) {}
  
  ngOnInit() {
    this.authService.getUser().pipe(take(1)).subscribe((user: any) => {
      if (user && user.uid) {
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

  nextPokemon() {
    const currentPlayer = this.playerSubject.getValue();
    if(currentPlayer && this.currentCardIndex < currentPlayer.cards.length - 1) {
      this.currentCardIndex++;
    }
  }

  previousPokemon() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
    }
  }
}
