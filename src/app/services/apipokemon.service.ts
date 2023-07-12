import { Injectable } from '@angular/core';
import axios from 'axios';
import { Card } from '../models/card.model';
import { PokemonDetails } from '../models/pokemondetails.model';

@Injectable({
  providedIn: 'root'
})
export class ApipokemonService {
  private API_URL = 'https://pokeapi.co/api/v2/';

  constructor() { }

  async getRandomPokemon(): Promise<Card> {
    try {
      const totalPokemonsResponse = await axios.get(`${this.API_URL}pokemon?limit=1000`);
      const totalPokemons = totalPokemonsResponse.data.results;
      
      const randomIndex = Math.floor(Math.random() * totalPokemons.length);
      const randomPokemonName = totalPokemons[randomIndex].name;

      console.log('Random Pokemon Name:', randomPokemonName);  // Log generated random Pokemon name

      const pokemonResponse = await axios.get<PokemonDetails>(`${this.API_URL}pokemon/${randomPokemonName}`);
      
      console.log('Random Pokemon Data:', pokemonResponse.data);  // Log data of the random Pokemon

      return Card.fromPokemonDetails(pokemonResponse.data);

    } catch (error) {
      console.error('Error fetching random Pokemon:', error);
      throw error;
    }
  }

  async getPokemonById(id: number): Promise<Card> {
    try {
      const response = await axios.get<PokemonDetails>(`${this.API_URL}pokemon/${id}`);

      console.log('Pokemon Data for ID ' + id + ':', response.data);  // Log data of the fetched Pokemon

      return Card.fromPokemonDetails(response.data);
    } catch (error) {
      console.error('Error fetching Pokemon by ID:', error);
      throw error;
    }
  }
}
