import { Component, OnInit } from '@angular/core';
import { GameBoardService } from '../../services/game-board.service';
import { Player } from '../../models/player.model';
import { ComputerPlayer } from '../../models/computer-player.model';

@Component({
  selector: 'app-pokemon-gym',
  templateUrl: './pokemon-gym.page.html',
  styleUrls: ['./pokemon-gym.page.scss'],
})
export class PokemonGymPage implements OnInit {
  player?: Player;
  computer?: ComputerPlayer;

  constructor(private gameBoardService: GameBoardService) { }

  ngOnInit() {
    this.gameBoardService.initGame().then(() => {
      this.player = this.gameBoardService.player;
      this.computer = this.gameBoardService.computer;
    });
  }

  playTurn() {
    this.gameBoardService.playTurn();
    this.player = this.gameBoardService.player;
    this.computer = this.gameBoardService.computer;
  }

  isGameEnd(): boolean {
    return this.gameBoardService.isGameEnd();
  }

  endGame(): void {
    this.gameBoardService.endGame();
  }
}
