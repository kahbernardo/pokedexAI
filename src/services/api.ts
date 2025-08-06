import axios from 'axios';
import { 
  Pokemon, 
  PokemonListResponse, 
  PokemonSpecies, 
  Generation, 
  Location, 
  Move 
} from '../types/pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const pokemonApi = {
  getPokemonList: async (limit: number = 20, offset: number = 0): Promise<PokemonListResponse> => {
    console.log(`🔍 Buscando lista de Pokémon: limit=${limit}, offset=${offset}`);
    const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
    console.log(`✅ Lista carregada: ${response.data.results.length} Pokémon encontrados`);
    return response.data;
  },

  getPokemon: async (idOrName: string | number): Promise<Pokemon> => {
    console.log(`🔍 Buscando Pokémon: ${idOrName}`);
    const response = await api.get(`/pokemon/${idOrName}`);
    console.log(`✅ Pokémon carregado: ${response.data.name}`);
    return response.data;
  },

  getPokemonSpecies: async (idOrName: string | number): Promise<PokemonSpecies> => {
    console.log(`🔍 Buscando espécie do Pokémon: ${idOrName}`);
    const response = await api.get(`/pokemon-species/${idOrName}`);
    console.log(`✅ Espécie carregada: ${response.data.name}`);
    return response.data;
  },

  getTypes: async () => {
    console.log('🔍 Buscando tipos de Pokémon');
    const response = await api.get('/type');
    console.log(`✅ Tipos carregados: ${response.data.results.length} tipos encontrados`);
    return response.data;
  },

  getPokemonByType: async (type: string) => {
    console.log(`🔍 Buscando Pokémon por tipo: ${type}`);
    const response = await api.get(`/type/${type}`);
    console.log(`✅ Pokémon por tipo carregados: ${response.data.pokemon.length} encontrados`);
    return response.data;
  },

  getGenerations: async (): Promise<{ results: Generation[] }> => {
    console.log('🔍 Buscando gerações');
    const response = await api.get('/generation');
    console.log(`✅ Gerações carregadas: ${response.data.results.length} gerações encontradas`);
    return response.data;
  },

  getGeneration: async (id: number): Promise<Generation> => {
    console.log(`🔍 Buscando geração: ${id}`);
    const response = await api.get(`/generation/${id}`);
    console.log(`✅ Geração carregada: ${response.data.name}`);
    return response.data;
  },

  getLocations: async (): Promise<{ results: Location[] }> => {
    console.log('🔍 Buscando localidades');
    const response = await api.get('/location');
    console.log(`✅ Localidades carregadas: ${response.data.results.length} localidades encontradas`);
    return response.data;
  },

  getLocation: async (id: number): Promise<Location> => {
    console.log(`🔍 Buscando localidade: ${id}`);
    const response = await api.get(`/location/${id}`);
    console.log(`✅ Localidade carregada: ${response.data.name}`);
    return response.data;
  },

  getLocationArea: async (id: number) => {
    console.log(`🔍 Buscando área da localidade: ${id}`);
    const response = await api.get(`/location-area/${id}`);
    console.log(`✅ Área carregada: ${response.data.name}`);
    return response.data;
  },

  getMoves: async (limit: number = 20, offset: number = 0) => {
    console.log(`🔍 Buscando golpes: limit=${limit}, offset=${offset}`);
    const response = await api.get(`/move?limit=${limit}&offset=${offset}`);
    console.log(`✅ Golpes carregados: ${response.data.results.length} golpes encontrados`);
    return response.data;
  },

  getMove: async (idOrName: string | number): Promise<Move> => {
    console.log(`🔍 Buscando golpe: ${idOrName}`);
    const response = await api.get(`/move/${idOrName}`);
    console.log(`✅ Golpe carregado: ${response.data.name}`);
    return response.data;
  },

  getPokemonByMove: async (move: string) => {
    console.log(`🔍 Buscando Pokémon por golpe: ${move}`);
    const response = await api.get(`/move/${move}`);
    console.log(`✅ Pokémon por golpe carregados: ${response.data.learned_by_pokemon.length} encontrados`);
    return response.data;
  },

  searchPokemonByName: async (name: string): Promise<PokemonListResponse> => {
    console.log(`🔍 Buscando Pokémon por nome: "${name}"`);
    try {
      const response = await api.get('/pokemon?limit=1000');
      const searchTerm = name.toLowerCase().trim();
      
      // Função para calcular score de relevância
      const calculateScore = (pokemonName: string): number => {
        const pokemonNameLower = pokemonName.toLowerCase();
        
        // Match perfeito (maior prioridade)
        if (pokemonNameLower === searchTerm) {
          return 100;
        }
        
        // Começa com o termo de busca
        if (pokemonNameLower.startsWith(searchTerm)) {
          return 90;
        }
        
        // Contém o termo de busca
        if (pokemonNameLower.includes(searchTerm)) {
          return 80;
        }
        
        // Match parcial (menor prioridade)
        const searchWords = searchTerm.split(' ');
        const pokemonWords = pokemonNameLower.split('-');
        
        let partialScore = 0;
        searchWords.forEach(word => {
          pokemonWords.forEach(pokemonWord => {
            if (pokemonWord.includes(word)) {
              partialScore += 10;
            }
          });
        });
        
        return partialScore;
      };
      
      // Filtrar e ordenar por relevância
      const filteredResults = response.data.results
        .filter((pokemon: any) => {
          const score = calculateScore(pokemon.name);
          return score > 0;
        })
        .sort((a: any, b: any) => {
          const scoreA = calculateScore(a.name);
          const scoreB = calculateScore(b.name);
          return scoreB - scoreA; // Ordem decrescente (maior score primeiro)
        })
        .slice(0, 20); // Limitar a 20 resultados mais relevantes
      
      console.log(`✅ Busca por nome concluída: ${filteredResults.length} Pokémon encontrados`);
      console.log(`📊 Resultados ordenados por relevância:`, filteredResults.map((p: any) => p.name));
      
      return {
        ...response.data,
        results: filteredResults,
        count: filteredResults.length,
      };
    } catch (error) {
      console.error('❌ Erro na busca por nome:', error);
      throw error;
    }
  },
};

export default api; 