import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../../models/player.model';
import { RankingService } from '../../services/ranking.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {

  public playerRankings$: Observable<Player[]>;

  constructor(private rankingService: RankingService) { }

  ngOnInit() {
    this.playerRankings$ = this.rankingService.getRanking();
  }
}
