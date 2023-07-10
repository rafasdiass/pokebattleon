import { Injectable } from '@angular/core';
import { PlayerService } from './player.service';
import { Card } from '../models/card.model';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  private currentPlayer: 'user' | 'computer' = 'user';
  private user: Player | null = null;
  private computerCard: Card | null = null;

  constructor(private playerService: PlayerService) { }

  // Carregar o jogador e seus Pokémons
  async loadPlayer(playerId: string) {
    const player = await this.playerService.getPlayer(playerId).toPromise();
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }
    this.user = player;
  }

  // Configuração inicial do jogo
  setGame(computerCard: Card) {
    if (this.user && this.user.cards.length > 0) {
      this.computerCard = computerCard;
      this.currentPlayer = 'user';
    } else {
      throw new Error('User has no cards');
    }
  }

  // Selecionar um atributo do card para a batalha
  async selectAttribute(attribute: keyof Card) {
    if (this.currentPlayer === 'user' && this.user && this.computerCard) {
      const userCard = this.user.cards[0];
      const userAttribute = userCard[attribute];
      const computerAttribute = this.computerCard[attribute];

      // Comparar atributos e decidir o vencedor
      if (userAttribute > computerAttribute) {
        this.user.wins++;
        await this.playerService.updatePlayerWins(this.user.uid, this.user.wins);
      } else {
        // Computador vence o turno
        this.currentPlayer = 'computer';
      }

      // Remover o cartão usado da mão do usuário
      this.user.cards.shift();

      // Verificar se o usuário ainda tem cartões
      if (this.user.cards.length === 0) {
        // Fim do jogo, computar vitória para o outro jogador
        if (this.currentPlayer === 'user') {
          this.user.wins++;
          await this.playerService.updatePlayerWins(this.user.uid, this.user.wins);
        }
        // Resetar o jogo ou encerrar a sessão
        this.user = null;
        this.computerCard = null;
        this.currentPlayer = 'user';
      }
    }
  }
}
