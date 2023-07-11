import { Component, OnInit } from '@angular/core';
import { RankingService } from '../../services/ranking.service';
import { Observable, EMPTY } from 'rxjs';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {
  playerRankings$: Observable<Player[]> = EMPTY;

  constructor(private rankingService: RankingService) {}

  ngOnInit() {
    this.playerRankings$ = this.rankingService.getRanking();
  }
}
