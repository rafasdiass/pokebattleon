import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ComputerPlayer } from '../models/computer-player.model';
import { Card } from '../models/card.model';
import { CardService } from './card.service';

@Injectable({
  providedIn: 'root'
})
export class ComputerPlayerService {
  private _computerPlayer$: BehaviorSubject<ComputerPlayer>;

  constructor(private cardService: CardService) {
    this.reset();
  }

  async init(): Promise<void> {
    try {
      const randomCard = await this.cardService.getRandomPokemon();
      this._computerPlayer$.getValue().addCard(randomCard);
    } catch (error) {
      console.error('Error initializing ComputerPlayer:', error);
    }
  }

  getComputerPlayer(): ComputerPlayer {
    return this._computerPlayer$.getValue();
  }

  getComputerPlayerObservable(): Observable<ComputerPlayer> {
    return this._computerPlayer$.asObservable();
  }

  async drawCard(): Promise<void> {
    try {
      const randomCard = await this.cardService.getRandomPokemon();
      this._computerPlayer$.getValue().addCard(randomCard);
    } catch (error) {
      console.error('Error drawing card for ComputerPlayer:', error);
    }
  }

  win(): void {
    this._computerPlayer$.getValue().win();
  }

  reset(): void {
    const computerPlayer = new ComputerPlayer();
    this._computerPlayer$ = new BehaviorSubject<ComputerPlayer>(computerPlayer);
  }
}
