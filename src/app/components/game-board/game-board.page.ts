import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GameBoardService } from '../../services/game-board.service';
import { ComputerPlayerService } from '../../services/computer-player.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from '../../models/player.model';
import { Card, CardAttribute } from '../../models/card.model';
import { ComputerPlayer } from '../../models/computer-player.model';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.page.html',
  styleUrls: ['./game-board.page.scss'],
})
export class GameBoardPage implements OnInit {
  userPlayer$: Observable<Player | null>;
  computerPlayer$: Observable<ComputerPlayer>;
  selectedAttribute: CardAttribute | null = null;

  constructor(
    private authService: AuthService,
    private gameBoardService: GameBoardService,
    private computerPlayerService: ComputerPlayerService
  ) {
    this.userPlayer$ = this.gameBoardService.userPlayer$;
    this.computerPlayer$ = this.gameBoardService.computerPlayerObservable;
  }

  ngOnInit() {
    // Nenhum código é necessário aqui, uma vez que já atribuímos os Observables no construtor
  }

  onAttributeSelected(attribute: CardAttribute) {
    this.selectedAttribute = attribute;
    this.gameBoardService.selectAttribute(attribute);
  }

  getCardAttribute(card: Card, attribute: CardAttribute): number | null {
    if (card && attribute) {
        return card[attribute];
    }
    return null;
  }

  getUserCard(): Observable<Card | null> {
    return this.userPlayer$.pipe(
      map((player: Player | null) => player && player.cards.length > 0 ? player.cards[0] : null)
    );
  }

  getComputerCard(): Observable<Card | null> {
    return this.computerPlayer$.pipe(
      map((computerPlayer: ComputerPlayer | null) => computerPlayer ? computerPlayer.cards[0] : null)
    );
  }
}
