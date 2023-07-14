import { Component, OnInit } from '@angular/core';
import { RankingService } from '../../services/ranking.service';
import { Observable, EMPTY, from } from 'rxjs';
import { Ranking } from '../../models/ranking.model';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {
  playerRankings$: Observable<Ranking[]> = EMPTY;

  constructor(private rankingService: RankingService) {}

  ngOnInit() {
    this.playerRankings$ = from(this.rankingService.getRanking());
  }
}
