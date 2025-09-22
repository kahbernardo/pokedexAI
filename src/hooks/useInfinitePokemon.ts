import { useState, useEffect, useCallback } from 'react';
import { pokemonApi } from '../services/api';
import { Pokemon } from '../types/pokemon';

interface UseInfinitePokemonOptions {
  initialLimit?: number;
  loadMoreLimit?: number;
  cache?: any;
}

export const useInfinitePokemon = (options: UseInfinitePokemonOptions = {}) => {
  const { initialLimit = 20, loadMoreLimit = 20, cache } = options;
  
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Função para carregar Pokémon com cache
  const loadPokemonBatch = async (startOffset: number, limit: number): Promise<Pokemon[]> => {
    // Verificar cache primeiro para o range completo
    if (cache) {
      const cachedRange = cache.getCachedRange(startOffset, startOffset + limit - 1);
      if (cachedRange) {
        console.log(`⚡ Range ${startOffset}-${startOffset + limit - 1} encontrado no cache`);
        return cachedRange;
      }
    }
    
    // Buscar da API usando a função otimizada
    // Ajustar para começar do ID 1 (Pokémon válido)
    const startId = Math.max(1, startOffset + 1);
    const endId = startOffset + limit;
    
    return await pokemonApi.getPokemonByRange(startId, endId, cache);
  };

  // Carregamento inicial
  const loadInitial = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🚀 Carregando ${initialLimit} Pokémon iniciais...`);
      const initialPokemon = await loadPokemonBatch(0, initialLimit);
      
      setPokemonList(initialPokemon);
      setOffset(initialLimit);
      setHasMore(initialPokemon.length === initialLimit);
      setIsInitialized(true);
      
      console.log(`✅ Carregamento inicial concluído: ${initialPokemon.length} Pokémon`);
    } catch (err) {
      setError('Erro ao carregar lista inicial de Pokémon');
      console.error('❌ Erro no carregamento inicial:', err);
    } finally {
      setLoading(false);
    }
  }, [initialLimit, cache]);

  // Carregar mais Pokémon
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !isInitialized) {
      return;
    }

    try {
      setLoadingMore(true);
      
      console.log(`📦 Carregando mais ${loadMoreLimit} Pokémon (offset: ${offset})...`);
      const morePokemon = await loadPokemonBatch(offset, loadMoreLimit);
      
      if (morePokemon.length > 0) {
        setPokemonList(prev => [...prev, ...morePokemon]);
        setOffset(prev => prev + loadMoreLimit);
        setHasMore(morePokemon.length === loadMoreLimit);
        
        console.log(`✅ Mais ${morePokemon.length} Pokémon carregados. Total: ${pokemonList.length + morePokemon.length}`);
      } else {
        setHasMore(false);
        console.log('🏁 Não há mais Pokémon para carregar');
      }
    } catch (err) {
      console.error('❌ Erro ao carregar mais Pokémon:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [offset, loadMoreLimit, hasMore, isInitialized, loadingMore, cache, pokemonList.length]);

  // Reset da lista
  const reset = useCallback(() => {
    setPokemonList([]);
    setOffset(0);
    setHasMore(true);
    setIsInitialized(false);
    setError(null);
  }, []);

  // Carregamento inicial
  useEffect(() => {
    if (!isInitialized) {
      loadInitial();
    }
  }, [isInitialized, loadInitial]);

  return {
    pokemonList,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    reset,
    refetch: loadInitial
  };
};

// Hook específico para carregamento infinito por tipo
export const useInfinitePokemonByType = (type: string | null) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const loadPokemonByType = useCallback(async (typeName: string, startOffset: number = 0, limit: number = 20) => {
    try {
      const response = await pokemonApi.getPokemonByType(typeName);
      const pokemonInType = response.pokemon;
      
      const startIndex = startOffset;
      const endIndex = Math.min(startIndex + limit, pokemonInType.length);
      const batch = pokemonInType.slice(startIndex, endIndex);
      
      // Usar Promise.allSettled para lidar com erros individuais
      const pokemonPromises = batch.map(async (pokemon: any) => {
        try {
          const id = pokemon.pokemon.url.split('/').slice(-2)[0];
          return await pokemonApi.getPokemon(id);
        } catch (error) {
          console.log(`⚠️ Erro ao carregar Pokémon ${pokemon.pokemon.name}: ${error}`);
          return null;
        }
      });
      
      const results = await Promise.allSettled(pokemonPromises);
      const pokemonData = results
        .filter((result): result is PromiseFulfilledResult<Pokemon> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);
      
      return {
        pokemon: pokemonData,
        hasMore: endIndex < pokemonInType.length
      };
    } catch (error) {
      console.error('Erro ao carregar Pokémon por tipo:', error);
      throw error;
    }
  }, []);

  const loadInitial = useCallback(async () => {
    if (!type) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🎯 Carregando Pokémon do tipo: ${type}`);
      const result = await loadPokemonByType(type, 0, 20);
      
      setPokemonList(result.pokemon);
      setOffset(20);
      setHasMore(result.hasMore);
      
      console.log(`✅ Carregamento inicial por tipo concluído: ${result.pokemon.length} Pokémon`);
    } catch (err) {
      setError('Erro ao carregar Pokémon por tipo');
      console.error('❌ Erro no carregamento por tipo:', err);
    } finally {
      setLoading(false);
    }
  }, [type, loadPokemonByType]);

  const loadMore = useCallback(async () => {
    if (!type || loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      
      console.log(`📦 Carregando mais Pokémon do tipo ${type}...`);
      const result = await loadPokemonByType(type, offset, 20);
      
      setPokemonList(prev => [...prev, ...result.pokemon]);
      setOffset(prev => prev + 20);
      setHasMore(result.hasMore);
      
      console.log(`✅ Mais ${result.pokemon.length} Pokémon do tipo ${type} carregados`);
    } catch (err) {
      console.error('❌ Erro ao carregar mais Pokémon por tipo:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [type, offset, hasMore, loadingMore, loadPokemonByType]);

  const reset = useCallback(() => {
    setPokemonList([]);
    setOffset(0);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    if (type) {
      reset();
      loadInitial();
    }
  }, [type, loadInitial, reset]);

  return {
    pokemonList,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    reset
  };
};
