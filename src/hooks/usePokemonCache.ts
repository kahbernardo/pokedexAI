import { useState, useCallback } from 'react';
import { Pokemon } from '../types/pokemon';

interface PokemonCache {
  [key: string]: Pokemon;
}

interface RangeCache {
  [key: string]: Pokemon[];
}

export const usePokemonCache = () => {
  const [pokemonCache, setPokemonCache] = useState<PokemonCache>({});
  const [rangeCache, setRangeCache] = useState<RangeCache>({});

  const getCachedPokemon = useCallback((id: number): Pokemon | null => {
    return pokemonCache[id.toString()] || null;
  }, [pokemonCache]);

  const setCachedPokemon = useCallback((pokemon: Pokemon) => {
    setPokemonCache(prev => ({
      ...prev,
      [pokemon.id.toString()]: pokemon
    }));
  }, []);

  const getCachedRange = useCallback((start: number, end: number): Pokemon[] | null => {
    const key = `${start}-${end}`;
    return rangeCache[key] || null;
  }, [rangeCache]);

  const setCachedRange = useCallback((start: number, end: number, pokemonList: Pokemon[]) => {
    const key = `${start}-${end}`;
    setRangeCache(prev => ({
      ...prev,
      [key]: pokemonList
    }));
  }, []);

  const clearCache = useCallback(() => {
    setPokemonCache({});
    setRangeCache({});
  }, []);

  const getCacheStats = useCallback(() => {
    return {
      pokemonCount: Object.keys(pokemonCache).length,
      rangeCount: Object.keys(rangeCache).length,
      totalPokemon: Object.values(pokemonCache).length,
      totalRanges: Object.values(rangeCache).reduce((acc, range) => acc + range.length, 0)
    };
  }, [pokemonCache, rangeCache]);

  return {
    getCachedPokemon,
    setCachedPokemon,
    getCachedRange,
    setCachedRange,
    clearCache,
    getCacheStats
  };
};
