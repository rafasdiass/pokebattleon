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

  constructor(private apiPokemonService: ApipokemonService, private rankingService: RankingService) {}

  async getRandomPokemon(count: number = 1): Promise<Card[]> {
    const pokemons: Card[] = [];

    for (let i = 0; i < count; i++) {
      const pokemon = await this.apiPokemonService.getRandomPokemon();
      pokemons.push(pokemon);
    }

    return pokemons;
  }
  async getCard(playerId: string): Promise<Card[]> {
    const cardCollection = collection(this.db, 'players', playerId, 'pokemons');
    const cardIds = await getDocs(cardCollection);
  
    const cardData: Card[] = [];
  
    for (const cardId of cardIds.docs) {
      const pokemonCollection = collection(cardCollection, cardId.id, 'pokemon');
      const pokemonDocs = await getDocs(pokemonCollection);
  
      pokemonDocs.docs.forEach((doc) => {
        const pokemonData = doc.data();
        cardData.push(new Card(
          Number(pokemonData['id']) || 0,
          pokemonData['name'] || '',
          pokemonData['imageUrl'] || '',
          Number(pokemonData['hp']) || 0,
          Number(pokemonData['attack']) || 0,
          Number(pokemonData['defense']) || 0,
          Number(pokemonData['specialAttack']) || 0,
          Number(pokemonData['specialDefense']) || 0,
          Number(pokemonData['speed']) || 0
        ));
      });
    }
  
    return cardData;
  }
  

  async getPokemonsFromCard(userId: string): Promise<any[]> {
    const cardSnap = await getDocs(collection(this.db, 'users', userId, 'pokemons'));
    const pokemons = cardSnap.docs.map((doc) => doc.data());

    // Adicione este log para verificar os dados retornados
    console.log('Pokemons from card:', pokemons);

    return pokemons;
}


  async updateUserCard(userId: string, cardData: any): Promise<void> {
    const userDoc = collection(this.db, 'users', userId, 'pokemons');
  
    if (Array.isArray(cardData.pokemons)) {
      for (const pokemon of cardData.pokemons) {
        await setDoc(doc(userDoc), pokemon);
      }
    } else {
      console.error('cardData.pokemons is not an array:', cardData.pokemons);
    }
  }

  async addPokemon(userId: string): Promise<void> {
    let pokemons: any[] = await this.getPokemonsFromCard(userId);
    console.log('Existing Pokemons:', pokemons);

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

  selectCard(playerId: string, cardId: string): Promise<void> {
    console.log('Selecting card for player:', playerId, cardId); // Log selected card
    return updateDoc(doc(this.db, 'players', playerId), { selectedCard: cardId });
  }
}
