export interface PokemonDetails {
    id: number;
    name: string;
    sprites: {
      front_default: string;
      [otherSprites: string]: string;
    };
    stats: {
      stat: {
        name: string;
      };
      base_stat: number;
    }[];
  }
  interface PokemonResponse {
    count: number;
    next: string;
    previous: string;
    results: Array<{ name: string; url: string }>;
  }
  