import { Observable } from 'rxjs';
import { Player } from '../models/player.model';

export interface IUserService {
  getPlayer(id: string): Promise<Player>;
  setPlayer(player: Player): void; // Adicionar esta linha
}
