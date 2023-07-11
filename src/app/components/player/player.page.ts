import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../services/auth.service';
import { Player } from '../../models/player.model';
import { Observable, of, from } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {
  player$: Observable<Player | undefined> = of();

  constructor(private playerService: PlayerService, private authService: AuthService) { }

  ngOnInit() {
    // I'm assuming the auth user id is the same as the player id
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.player$ = from(this.playerService.getPlayer(user.uid));
      }
    });
  }
}
