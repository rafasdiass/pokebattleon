import { Component, OnInit } from '@angular/core';
import { GameBoardService } from '../../services/game-board.service';
import { ComputerPlayer } from '../../models/computer-player.model';

@Component({
  selector: 'app-computerplayer',
  templateUrl: './computerplayer.page.html',
  styleUrls: ['./computerplayer.page.scss'],
})
export class ComputerPlayerPage implements OnInit {
  computerPlayer$ = this.gameBoardService.computerPlayerObservable;

  constructor(
    private gameBoardService: GameBoardService
  ) {}

  ngOnInit() {}
}
