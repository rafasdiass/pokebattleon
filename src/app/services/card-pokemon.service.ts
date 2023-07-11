import { Injectable } from '@angular/core';
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc, getDocs } from 'firebase/firestore';
import { Card } from '../models/card.model';  
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApipokemonService } from './apipokemon.service';  // Certifique-se de substituir por seu caminho correto
import { RankingService } from './ranking.service';  // Certifique-se de substituir por seu caminho correto

@Injectable({
  providedIn: 'root'
})
export class CardPokemonService {
  private db = getFirestore();

  constructor(private apiPokemonService: ApipokemonService, private rankingService: RankingService) { }

  // Obter o card de um jogador específico
  async getCard(playerId: string): Promise<Card[]> {
    const cardSnap = await getDocs(collection(this.db, 'players', playerId, 'pokemons'));
    return cardSnap.docs.map(doc => {
      return { ...doc.data(), id: doc.id } as Card;
    });
  }

  // Adicionar um Pokémon ao jogador
  async addPokemon(playerId: string) {
    let pokemons = await this.getCard(playerId);
    pokemons = pokemons ? pokemons : [];
    if (pokemons.length === 0) {
      // Se o jogador não tiver nenhum Pokémon, atribuir 5 aleatórios
      for (let i = 0; i < 5; i++) {
        const pokemon = await this.apiPokemonService.getRandomPokemon();
        await setDoc(doc(this.db, 'players', playerId, 'pokemons'), pokemon);
      }
    } else {
      // Se o jogador ganhou uma partida, atribuir um Pokémon aleatório
      const wins = await this.rankingService.getWins(playerId);
      if (wins && wins > pokemons.length) {
        const pokemon = await this.apiPokemonService.getRandomPokemon();
        await setDoc(doc(this.db, 'players', playerId, 'pokemons'), pokemon);
      }
    }
  }
  
  selectCard(playerId: string, cardId: string): Promise<void> {
    return updateDoc(doc(this.db, 'players', playerId), {selectedCard: cardId});
  }
}
