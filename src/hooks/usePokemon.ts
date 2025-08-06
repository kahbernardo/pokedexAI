import { useState, useEffect } from 'react';
import { pokemonApi } from '../services/api';
import { Pokemon, PokemonSpecies } from '../types/pokemon';

export const usePokemonList = (limit: number = 20, offset: number = 0) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPokemonList = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await pokemonApi.getPokemonList(limit, offset);
      
      const pokemonData = await Promise.all(
        response.results.slice(0, limit).map(async (pokemon) => {
          const id = pokemon.url.split('/').slice(-2)[0];
          return await pokemonApi.getPokemon(id);
        })
      );
      
      setPokemonList(pokemonData);
      setHasMore(response.next !== null);
    } catch (err) {
      setError('Erro ao carregar lista de Pokémon');
      console.error('Erro ao buscar Pokémon:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonList();
  }, [limit, offset]);

  return { pokemonList, loading, error, hasMore, refetch: fetchPokemonList };
};

export const usePokemon = (idOrName: string | number) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [pokemonData, speciesData] = await Promise.all([
        pokemonApi.getPokemon(idOrName),
        pokemonApi.getPokemonSpecies(idOrName),
      ]);
      
      setPokemon(pokemonData);
      setSpecies(speciesData);
    } catch (err) {
      setError('Erro ao carregar dados do Pokémon');
      console.error('Erro ao buscar Pokémon:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idOrName) {
      fetchPokemon();
    }
  }, [idOrName]);

  return { pokemon, species, loading, error, refetch: fetchPokemon };
};

export const usePokemonSearch = () => {
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');

  const searchPokemon = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setLastSearchQuery('');
      return;
    }

    // Evitar buscas duplicadas
    if (lastSearchQuery === query) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setLastSearchQuery(query);
      
      console.log(`🔍 Iniciando busca por: "${query}"`);
      const response = await pokemonApi.searchPokemonByName(query);
      
      const pokemonData = await Promise.all(
        response.results.slice(0, 20).map(async (pokemon) => {
          const id = pokemon.url.split('/').slice(-2)[0];
          return await pokemonApi.getPokemon(id);
        })
      );
      
      setSearchResults(pokemonData);
      console.log(`✅ Busca concluída: ${pokemonData.length} Pokémon carregados`);
    } catch (err) {
      setError('Erro ao buscar Pokémon');
      console.error('❌ Erro na busca:', err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { searchResults, loading, error, searchPokemon };
};

export const usePokemonByType = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPokemonByType = async (type: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await pokemonApi.getPokemonByType(type);
      
      const pokemonData = await Promise.all(
        response.pokemon.slice(0, 20).map(async (pokemon: any) => {
          const id = pokemon.pokemon.url.split('/').slice(-2)[0];
          return await pokemonApi.getPokemon(id);
        })
      );
      
      setPokemonList(pokemonData);
    } catch (err) {
      setError('Erro ao carregar Pokémon por tipo');
      console.error('Erro ao buscar por tipo:', err);
    } finally {
      setLoading(false);
    }
  };

  return { pokemonList, loading, error, fetchPokemonByType };
}; 