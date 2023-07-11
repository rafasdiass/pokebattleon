import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Card } from '../models/card.model';  
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApipokemonService } from './apipokemon.service';  // Certifique-se de substituir por seu caminho correto
import { RankingService } from './ranking.service';  // Certifique-se de substituir por seu caminho correto

@Injectable({
  providedIn: 'root'
})
export class CardPokemonService {
  constructor(private firestore: AngularFirestore, private apiPokemonService: ApipokemonService, private rankingService: RankingService) { }

  // Obter o card de um jogador específico
  getCard(playerId: string): Observable<Card[]> {
    return this.firestore.collection<Card>('players').doc(playerId).collection<Card>('pokemons').snapshotChanges()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Card;
        const id = a.payload.doc.id;
        return { ...data, id };
      })));
  }

  // Adicionar um Pokémon ao jogador
  async addPokemon(playerId: string) {
    let pokemons = await this.getCard(playerId).toPromise();
    pokemons = pokemons ? pokemons : [];
    if (pokemons.length === 0) {
      // Se o jogador não tiver nenhum Pokémon, atribuir 5 aleatórios
      for (let i = 0; i < 5; i++) {
        const pokemon = await this.apiPokemonService.getRandomPokemon();
        this.firestore.collection('players').doc(playerId).collection('pokemons').add(pokemon);
      }
    } else {
      // Se o jogador ganhou uma partida, atribuir um Pokémon aleatório
      const wins = await this.rankingService.getWins(playerId);
if (wins && wins > pokemons.length) {
  const pokemon = await this.apiPokemonService.getRandomPokemon();
  this.firestore.collection('players').doc(playerId).collection('pokemons').add(pokemon);
}
    }
  }
  selectCard(playerId: string, cardId: string): Promise<void> {
    return this.firestore.collection('players').doc(playerId).update({selectedCard: cardId});
  }
}
