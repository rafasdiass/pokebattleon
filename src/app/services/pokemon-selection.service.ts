import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonSelectionService {
  private selectedPokemonsSubject: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);
  selectedPokemons$: Observable<Card[]> = this.selectedPokemonsSubject.asObservable();

  selectPokemon(pokemon: Card): void {
    const currentPokemons = this.selectedPokemonsSubject.getValue();
    this.selectedPokemonsSubject.next([...currentPokemons, pokemon]);
  }

  removePokemon(pokemon: Card): void {
    const currentPokemons = this.selectedPokemonsSubject.getValue();
    this.selectedPokemonsSubject.next(currentPokemons.filter(p => p.id !== pokemon.id));
  }

  clearSelection(): void {
    this.selectedPokemonsSubject.next([]);
  }
}
