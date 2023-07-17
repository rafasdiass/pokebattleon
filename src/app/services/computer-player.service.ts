import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ComputerPlayer } from '../models/computer-player.model';
import { Card, CardAttribute } from '../models/card.model';
import { ComputerCardService } from './computer-card.service';

@Injectable({
  providedIn: 'root'
})
export class ComputerPlayerService {
  private _computerPlayer$: BehaviorSubject<ComputerPlayer>;
  private attributes: CardAttribute[] = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'];

  constructor(private computerCardService: ComputerCardService) {
    this._computerPlayer$ = new BehaviorSubject<ComputerPlayer>(new ComputerPlayer());
  }

  async init(): Promise<void> {
    try {
      const randomCards = await this.computerCardService.getRandomPokemon();
      randomCards.forEach(card => {
        this._computerPlayer$.getValue().addCard(card);
      });
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
      const randomCards = await this.computerCardService.getRandomPokemon();
      randomCards.forEach(card => {
        this._computerPlayer$.getValue().addCard(card);
      });
    } catch (error) {
      console.error('Error drawing card for ComputerPlayer:', error);
    }
  }

  win(): void {
    this._computerPlayer$.getValue().win();
  }

  reset(): void {
    this._computerPlayer$ = new BehaviorSubject<ComputerPlayer>(new ComputerPlayer());
  }

  chooseAttribute(): CardAttribute {
    const index = Math.floor(Math.random() * this.attributes.length);
    return this.attributes[index];
  }
}
