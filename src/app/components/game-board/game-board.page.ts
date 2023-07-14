import { Component, Input, OnInit } from '@angular/core';
import { Player } from '../../models/player.model';
import { ComputerPlayer } from '../../models/computer-player.model';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.page.html',
  styleUrls: ['./game-board.page.scss'],
})
export class GameBoardPage implements OnInit {
  @Input() player!: Player;
  @Input() computer!: ComputerPlayer;

  constructor() { }

  ngOnInit() { }
}
