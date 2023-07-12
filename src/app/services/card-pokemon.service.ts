import { Injectable } from '@angular/core';
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc, getDocs } from 'firebase/firestore';
import { Card } from '../models/card.model';  
import { ApipokemonService } from './apipokemon.service';  
import { RankingService } from './ranking.service';  

@Injectable({
  providedIn: 'root'
})
export class CardPokemonService {
  private db = getFirestore();

  constructor(private apiPokemonService: ApipokemonService, private rankingService: RankingService) { }

  async getCard(playerId: string): Promise<Card[]> {
    const cardSnap = await getDocs(collection(this.db, 'players', playerId, 'pokemons'));
    const cardData = cardSnap.docs.map(doc => {
      const data = doc.data();
      return new Card(
        Number(data['id']) || 0,
        data['name'] || '',
        data['imageUrl'] || '',
        Number(data['hp']) || 0,
        Number(data['attack']) || 0,
        Number(data['defense']) || 0,
        Number(data['specialAttack']) || 0,
        Number(data['specialDefense']) || 0,
        Number(data['speed']) || 0
      );
    });

    console.log('Card Data:', cardData); // Log fetched Card Data
    return cardData;
  }

  async getPokemonsFromCard(userId: string): Promise<any[]> {
    const cardSnap = await getDocs(collection(this.db, 'users', userId, 'pokemons'));
    return cardSnap.docs.map(doc => doc.data());
  }

  async updateUserCard(userId: string, cardData: any): Promise<void> {
    const userDoc = collection(this.db, 'users', userId, 'pokemons');

    for (const pokemon of cardData.pokemons) {
      await setDoc(doc(userDoc), pokemon);
    }
  }

  async addPokemon(userId: string): Promise<void> {
    let pokemons: any[] = await this.getPokemonsFromCard(userId);
    console.log('Existing Pokemons:', pokemons);

    if (pokemons && pokemons.length < 3) {
      let randomPokemon = await this.apiPokemonService.getRandomPokemon();
      console.log('Random Pokemon Data:', randomPokemon);

      // Convert the Card object to a basic JavaScript object
      let randomPokemonData = randomPokemon.toFirestore();

      pokemons.push(randomPokemonData);

      let cardData = {
        pokemons
      };

      await this.updateUserCard(userId, cardData);
      console.log('Pokemons successfully added to the user card.');
    }
  }

  selectCard(playerId: string, cardId: string): Promise<void> {
    console.log('Selecting card for player:', playerId, cardId); // Log selected card
    return updateDoc(doc(this.db, 'players', playerId), {selectedCard: cardId});
  }
}
