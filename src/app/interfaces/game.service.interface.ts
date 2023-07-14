import { Observable } from 'rxjs';
import { Card } from '../models/card.model';
import { Player } from '../models/player.model';

export interface IGameService {

  initializeGame(player: Player): Promise<Player[]>;
  setPlayerCards(cards: Card[]): void;
  getPlayerCards(): Card[];
  drawCards(): [Card | null, Card | null];
  drawCard(player: Player): Card | null;
  playTurn(player: Player, attribute: string): void;
}