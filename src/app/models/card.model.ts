

export class Card {
    public id: string;              // ID do Pokémon
    public name: string;            // Nome do Pokémon
    public imageUrl: string;        // URL da imagem do Pokémon
    public hp: number;              // Pontos de vida do Pokémon
    public attack: number;          // Ataque do Pokémon
    public defense: number;         // Defesa do Pokémon
    public specialAttack: number;   // Ataque especial do Pokémon
    public specialDefense: number;  // Defesa especial do Pokémon
    public speed: number;           // Velocidade do Pokémon
  
    constructor(
      id: string,
      name: string,
      imageUrl: string,
      hp: number,
      attack: number,
      defense: number,
      specialAttack: number,
      specialDefense: number,
      speed: number
    ) {
      this.id = id;
      this.name = name;
      this.imageUrl = imageUrl;
      this.hp = hp;
      this.attack = attack;
      this.defense = defense;
      this.specialAttack = specialAttack;
      this.specialDefense = specialDefense;
      this.speed = speed;
    }
  }
  