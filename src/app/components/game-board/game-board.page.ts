import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../../models/player.model';
import { GameBoardService } from '../../services/game-board.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.page.html',
  styleUrls: ['./game-board.page.scss'],
})
export class GameBoardPage implements OnInit {
  userPlayer$: Observable<Player | null>;
  computerPlayer$: Observable<Player | null>;

  constructor(private gameBoardService: GameBoardService) {
    this.userPlayer$ = this.gameBoardService.userPlayer$;
    this.computerPlayer$ = this.gameBoardService.computerPlayerObservable;
  }

  ngOnInit() {
    this.gameBoardService.loadPlayer('playerId');  // Substitua 'playerId' pelo ID do jogador real
    this.gameBoardService.generateComputerPlayer();
  }
}
