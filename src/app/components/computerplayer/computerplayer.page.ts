import { Component, OnInit } from '@angular/core';
import { ComputerPlayerService } from '../../services/computer-player.service';
import { ComputerPlayer } from '../../models/computer-player.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-computerplayer',
  templateUrl: './computerplayer.page.html',
  styleUrls: ['./computerplayer.page.scss'],
})
export class ComputerPlayerPage implements OnInit {
  computerPlayer$: Observable<ComputerPlayer> = new Observable<ComputerPlayer>();

  constructor(private computerPlayerService: ComputerPlayerService) {}

  async ngOnInit() {
    this.computerPlayer$ = this.computerPlayerService.getComputerPlayerObservable();
    await this.computerPlayerService.init();
  }
}
