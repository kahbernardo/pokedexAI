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
  timeout: 45000, // Aumentado para 45 segundos
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor para retry em caso de timeout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.log('⏰ Timeout detectado, tentando novamente...');
      // Retry uma vez em caso de timeout com delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);

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

  // Função para buscar Pokémon por região
  getPokemonByRegion: async (regionName: string) => {
    console.log(`🌍 Buscando Pokémon da região: ${regionName}`);
    
    try {
      // Primeiro, buscar a região
      const regionsResponse = await api.get('/region');
      const region = regionsResponse.data.results.find((r: any) => 
        r.name.toLowerCase() === regionName.toLowerCase()
      );
      
      if (!region) {
        throw new Error(`Região ${regionName} não encontrada`);
      }
      
      // Buscar detalhes da região
      const regionDetails = await api.get(region.url);
      
      // Buscar localidades da região
      const locationPromises = regionDetails.data.locations.map(async (location: any) => {
        try {
          const locationDetails = await api.get(location.url);
          return locationDetails.data;
        } catch (error) {
          console.log(`⚠️ Erro ao carregar localidade: ${location.name}`);
          return null;
        }
      });
      
      const locations = (await Promise.all(locationPromises)).filter(Boolean);
      
      // Buscar áreas de localidade
      const areaPromises = locations.flatMap((location: any) => 
        location.areas.map(async (area: any) => {
          try {
            const areaDetails = await api.get(area.url);
            return areaDetails.data;
          } catch (error) {
            console.log(`⚠️ Erro ao carregar área: ${area.name}`);
            return null;
          }
        })
      );
      
      const areas = (await Promise.all(areaPromises)).filter(Boolean);
      
      // Extrair Pokémon das áreas
      const pokemonSet = new Set<number>();
      areas.forEach((area: any) => {
        area.pokemon_encounters.forEach((encounter: any) => {
          const pokemonId = encounter.pokemon.url.split('/').slice(-2)[0];
          pokemonSet.add(parseInt(pokemonId));
        });
      });
      
      const pokemonIds = Array.from(pokemonSet).sort((a, b) => a - b);
      
      console.log(`✅ Encontrados ${pokemonIds.length} Pokémon únicos na região ${regionName}`);
      return pokemonIds;
      
    } catch (error) {
      console.error(`❌ Erro ao buscar Pokémon da região ${regionName}:`, error);
      throw error;
    }
  },

  // Função para buscar regiões disponíveis
  getRegions: async () => {
    console.log('🌍 Buscando regiões disponíveis');
    const response = await api.get('/region');
    console.log(`✅ Regiões carregadas: ${response.data.results.length} regiões encontradas`);
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

  // Função otimizada para buscar Pokémon por range de forma eficiente
  getPokemonByRange: async (start: number, end: number, cache?: any): Promise<Pokemon[]> => {
    console.log(`🚀 Buscando Pokémon por range: ${start}-${end}`);
    console.log(`📊 Parâmetros: start=${start}, end=${end}, cache=${cache ? 'disponível' : 'não disponível'}`);
    
    // Verificar cache primeiro
    if (cache) {
      const cachedRange = cache.getCachedRange(start, end);
      if (cachedRange) {
        console.log(`⚡ Range ${start}-${end} encontrado no cache: ${cachedRange.length} Pokémon`);
        return cachedRange;
      }
    }
    
    try {
      // Estratégia melhorada: Usar Promise.allSettled para lidar com erros individuais
      console.log('📦 Buscando Pokémon em paralelo...');
      console.log(`🎯 Total de Pokémon a buscar: ${end - start + 1}`);
      
      // Limitar o número de requisições simultâneas para evitar sobrecarga
      const batchSize = 10;
      const pokemonList: Pokemon[] = [];
      
      for (let i = start; i <= end; i += batchSize) {
        const batchEnd = Math.min(i + batchSize - 1, end);
        console.log(`📦 Processando batch: ${i}-${batchEnd}`);
        const batchPromises = [];
        
        for (let j = i; j <= batchEnd; j++) {
          batchPromises.push(
            api.get(`/pokemon/${j}`)
              .then(response => {
                console.log(`✅ Pokémon ${j} carregado: ${response.data.name}`);
                return response.data;
              })
              .catch(error => {
                console.log(`⚠️ Pokémon ${j} não encontrado: ${error.message}`);
                return null;
              })
          );
        }
        
        const batchResults = await Promise.allSettled(batchPromises);
        const batchPokemon = batchResults
          .filter((result): result is PromiseFulfilledResult<Pokemon> => 
            result.status === 'fulfilled' && result.value !== null
          )
          .map(result => result.value);
        
        pokemonList.push(...batchPokemon);
        console.log(`📊 Batch ${i}-${batchEnd} concluído: ${batchPokemon.length} Pokémon`);
        
        // Pequena pausa entre batches para não sobrecarregar a API
        if (batchEnd < end) {
          console.log(`⏳ Pausa de 100ms entre batches...`);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Salvar no cache
      if (cache) {
        cache.setCachedRange(start, end, pokemonList);
      }
      
      console.log(`✅ Range carregado: ${pokemonList.length}/${end - start + 1} Pokémon`);
      console.log(`📝 Primeiros 3 Pokémon:`, pokemonList.slice(0, 3).map(p => `${p.id}: ${p.name}`));
      return pokemonList;
      
    } catch (error) {
      console.error('❌ Erro ao carregar range de Pokémon:', error);
      throw error;
    }
  },

  // Função para buscar Pokémon por jogo específico (otimizada para carregar 20 em 20)
  getPokemonByGame: async (gameId: string, limit: number = 20): Promise<Pokemon[]> => {
    console.log(`🎮 Buscando Pokémon do jogo: ${gameId} (limite: ${limit})`);
    
    // Mapeamento específico de cada jogo
    const gamePokemonRanges: { [key: string]: { start: number; end: number; } } = {
      'red-green': { start: 1, end: 151 },
      'blue': { start: 1, end: 151 },
      'yellow': { start: 1, end: 151 },
      'gold-silver': { start: 1, end: 251 },
      'crystal': { start: 1, end: 251 },
      'ruby-sapphire': { start: 1, end: 386 },
      'emerald': { start: 1, end: 386 },
      'firered-leafgreen': { start: 1, end: 151 }, // Corrigido: apenas 151 Pokémon originais
      'diamond-pearl': { start: 1, end: 493 },
      'platinum': { start: 1, end: 493 },
      'heartgold-soulsilver': { start: 1, end: 493 },
      'black-white': { start: 494, end: 649 },
      'black2-white2': { start: 1, end: 649 },
      'x-y': { start: 1, end: 721 },
      'omega-ruby-alpha-sapphire': { start: 1, end: 721 },
      'sun-moon': { start: 1, end: 802 },
      'ultra-sun-ultra-moon': { start: 1, end: 807 },
      'sword-shield': { start: 1, end: 898 },
      'brilliant-diamond-shining-pearl': { start: 1, end: 493 },
      'legends-arceus': { start: 1, end: 242 },
      'scarlet-violet': { start: 1, end: 1008 }
    };
    
    console.log(`🔍 Jogos disponíveis:`, Object.keys(gamePokemonRanges));
    console.log(`🎯 GameId recebido: "${gameId}"`);
    
    const range = gamePokemonRanges[gameId];
    if (!range) {
      console.error(`❌ Jogo "${gameId}" não encontrado no mapeamento`);
      console.error(`📋 Jogos disponíveis:`, Object.keys(gamePokemonRanges));
      throw new Error(`Jogo ${gameId} não encontrado`);
    }
    
    console.log(`📊 Jogo ${gameId}: Pokémon ${range.start}-${range.end} (Total: ${range.end - range.start + 1})`);
    
    try {
      // Carregar apenas os primeiros 'limit' Pokémon para renderização rápida
      const endIndex = Math.min(range.start + limit - 1, range.end);
      console.log(`⚡ Carregando apenas ${limit} Pokémon (${range.start}-${endIndex}) para renderização rápida`);
      
      const results = await pokemonApi.getPokemonByRange(range.start, endIndex);
      
      console.log(`✅ Jogo ${gameId} carregado: ${results.length} Pokémon encontrados`);
      console.log(`📝 Primeiros 5 Pokémon:`, results.slice(0, 5).map(p => `${p.id}: ${p.name}`));
      return results;
    } catch (error) {
      console.error(`❌ Erro ao carregar jogo ${gameId}:`, error);
      throw error;
    }
  },

  // Função para carregar mais Pokémon de um jogo específico (para infinite scroll)
  getMorePokemonByGame: async (gameId: string, offset: number, limit: number = 20): Promise<Pokemon[]> => {
    console.log(`📦 Carregando mais Pokémon do jogo: ${gameId} (offset: ${offset}, limite: ${limit})`);
    
    const gamePokemonRanges: { [key: string]: { start: number; end: number; } } = {
      'red-green': { start: 1, end: 151 },
      'blue': { start: 1, end: 151 },
      'yellow': { start: 1, end: 151 },
      'gold-silver': { start: 1, end: 251 },
      'crystal': { start: 1, end: 251 },
      'ruby-sapphire': { start: 1, end: 386 },
      'emerald': { start: 1, end: 386 },
      'firered-leafgreen': { start: 1, end: 151 },
      'diamond-pearl': { start: 1, end: 493 },
      'platinum': { start: 1, end: 493 },
      'heartgold-soulsilver': { start: 1, end: 493 },
      'black-white': { start: 494, end: 649 },
      'black2-white2': { start: 1, end: 649 },
      'x-y': { start: 1, end: 721 },
      'omega-ruby-alpha-sapphire': { start: 1, end: 721 },
      'sun-moon': { start: 1, end: 802 },
      'ultra-sun-ultra-moon': { start: 1, end: 807 },
      'sword-shield': { start: 1, end: 898 },
      'brilliant-diamond-shining-pearl': { start: 1, end: 493 },
      'legends-arceus': { start: 1, end: 242 },
      'scarlet-violet': { start: 1, end: 1008 }
    };
    
    const range = gamePokemonRanges[gameId];
    if (!range) {
      throw new Error(`Jogo ${gameId} não encontrado`);
    }
    
    const startIndex = range.start + offset;
    const endIndex = Math.min(startIndex + limit - 1, range.end);
    
    if (startIndex > range.end) {
      console.log(`🏁 Não há mais Pokémon para carregar do jogo ${gameId}`);
      return [];
    }
    
    console.log(`📦 Carregando Pokémon ${startIndex}-${endIndex} do jogo ${gameId}`);
    return await pokemonApi.getPokemonByRange(startIndex, endIndex);
  },

  // Função para buscar Pokémon por geração (mais eficiente)
  getPokemonByGeneration: async (generationId: number): Promise<Pokemon[]> => {
    console.log(`🎮 Buscando Pokémon da geração: ${generationId}`);
    
    try {
      // Buscar a geração primeiro
      const generationResponse = await api.get(`/generation/${generationId}`);
      const generation = generationResponse.data;
      
      // Extrair IDs dos Pokémon da geração
      const pokemonIds = generation.pokemon_species.map((species: any) => {
        const url = species.url;
        const id = url.split('/').slice(-2)[0];
        return parseInt(id);
      });
      
      console.log(`📊 Geração ${generationId} tem ${pokemonIds.length} Pokémon`);
      
      // Buscar apenas os Pokémon específicos da geração
      const pokemonPromises = pokemonIds.map(async (id: number) => {
        try {
          return await pokemonApi.getPokemon(id);
        } catch (error) {
          console.log(`⚠️ Erro ao carregar Pokémon ${id}: ${error}`);
          return null;
        }
      });
      
      const results = await Promise.allSettled(pokemonPromises);
      const pokemonList = results
        .filter((result): result is PromiseFulfilledResult<Pokemon> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);
      
      console.log(`✅ Geração ${generationId} carregada: ${pokemonList.length} Pokémon`);
      return pokemonList;
      
    } catch (error) {
      console.error('❌ Erro ao carregar geração:', error);
      throw error;
    }
  },
};

export default api; 