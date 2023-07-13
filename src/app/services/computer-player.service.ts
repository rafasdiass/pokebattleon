import { Injectable } from '@angular/core';
import { ComputerPlayer } from '../models/computer-player.model';
import { Card } from '../models/card.model';
import { ApipokemonService } from './apipokemon.service';

@Injectable({
  providedIn: 'root'
})
export class ComputerPlayerService {
  private computerPlayer: ComputerPlayer = new ComputerPlayer();

  constructor(private apiPokemonService: ApipokemonService) {}

  async init(): Promise<void> {
    try {
      const randomCard = await this.apiPokemonService.getRandomPokemon();
      this.computerPlayer.addCard(randomCard);
    } catch (error) {
      console.error('Error initializing ComputerPlayer:', error);
    }
  }

  getComputerPlayer(): ComputerPlayer {
    return this.computerPlayer;
  }

  playCard(): Card | undefined {
    // The computer player will use its strategy to choose the attribute to play
    const chosenStat = this.computerPlayer.maximizeStatStrategy();
    console.log('ComputerPlayer chosen stat:', chosenStat);  // Log the chosen stat
    return this.computerPlayer.playCard();
  }

  async drawCard(): Promise<void> {
    try {
      const randomCard = await this.apiPokemonService.getRandomPokemon();
      this.computerPlayer.addCard(randomCard);
    } catch (error) {
      console.error('Error drawing card for ComputerPlayer:', error);
    }
  }

  win(): void {
    this.computerPlayer.win();
  }

  incrementComputerWins(): void {
    this.computerPlayer.wins++;
  }

  reset(): void {
    this.computerPlayer = new ComputerPlayer();
  }
}
