import React, { useState, useEffect } from 'react';
import {
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PokemonCard } from '../components/PokemonCard';
import { FilterModal } from '../components/FilterModal';
import { usePokemonSearch, usePokemonByType } from '../hooks/usePokemon';
import { useInfinitePokemon, useInfinitePokemonByType } from '../hooks/useInfinitePokemon';
import { useDebounce } from '../hooks/useDebounce';
import { usePokemonCache } from '../hooks/usePokemonCache';
import { Pokemon } from '../types/pokemon';
import { pokemonApi } from '../services/api';

interface PokedexScreenProps {
  navigation: any;
  route?: any;
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
  position: relative;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  padding-vertical: 15px;
  background-color: ${(props: any) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
`;

const BackButton = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  background-color: #D0021B;
  border-radius: 12px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  justify-content: center;
  align-items: center;
`;

const BackButtonText = styled.Text`
  font-size: 20px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #FFFFFF;
`;

const Title = styled.Text`
  font-size: 28px;
  font-family: ${(props: any) => props.theme.fonts.ketchum};
  color: #FFD700;
  text-align: center;
  flex: 1;
`;

const FilterButton = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  background-color: #D0021B;
  border-radius: 12px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  justify-content: center;
  align-items: center;
`;

const FilterButtonText = styled.Text`
  font-size: 20px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #FFFFFF;
`;

const SearchContainer = styled.View`
  padding-horizontal: 20px;
  padding-vertical: 15px;
  background-color: ${(props: any) => props.theme.colors.surface};
`;

const SearchInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props: any) => props.theme.colors.input};
  border-radius: 12px;
  padding-horizontal: 16px;
  border-width: 2px;
  border-color: ${(props: any) => props.theme.colors.border};
`;

const SearchIcon = styled.Text`
  font-size: 18px;
  color: #9B9B9B;
  margin-right: 12px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  padding-vertical: 16px;
  font-size: 16px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: ${(props: any) => props.theme.colors.text};
`;

const ClearButton = styled.TouchableOpacity`
  padding: 8px;
  background-color: #D0021B;
  border-radius: 20px;
  margin-left: 8px;
`;

const ClearButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 600;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
`;

const ActiveFilterContainer = styled.View`
  background-color: #4A90E2;
  padding-horizontal: 20px;
  padding-vertical: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ActiveFilterText = styled.Text`
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  flex: 1;
`;

const ClearFilterButton = styled.TouchableOpacity`
  padding: 6px 12px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
`;

const ClearFilterText = styled.Text`
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 600;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
`;

const ContentContainer = styled.View`
  flex: 1;
  position: relative;
`;

const LoadingContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: ${(props: any) => props.theme.colors.background};
  z-index: 10;
`;

const LoadingText = styled.Text`
  margin-top: 16px;
  font-size: 16px;
  color: ${(props: any) => props.theme.colors.textMuted};
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  text-align: center;
  line-height: 20px;
`;

const EmptyState = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-vertical: 50px;
`;

const EmptyStateIcon = styled.Text`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyStateText = styled.Text`
  font-size: 16px;
  color: ${(props: any) => props.theme.colors.textMuted};
  text-align: center;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  margin-bottom: 8px;
`;

const EmptyStateSubtext = styled.Text`
  font-size: 14px;
  color: ${(props: any) => props.theme.colors.textMuted};
  text-align: center;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
`;

const ResultsCount = styled.Text`
  font-size: 14px;
  color: ${(props: any) => props.theme.colors.textMuted};
  text-align: center;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  padding-vertical: 8px;
  background-color: ${(props: any) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
`;

const SearchStatus = styled.Text`
  font-size: 12px;
  color: ${(props: any) => props.theme.colors.textMuted};
  text-align: center;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  padding-vertical: 4px;
  background-color: ${(props: any) => props.theme.colors.background};
  font-style: italic;
`;

export const PokedexScreen: React.FC<PokedexScreenProps> = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<{ type: string; value: string } | null>(null);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [gameFilter, setGameFilter] = useState<any>(null);
  const [loadingProgress, setLoadingProgress] = useState<string>('');

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const cache = usePokemonCache();
  
  // Hook para carregamento infinito padrão
  const {
    pokemonList: defaultPokemonList,
    loading: defaultLoading,
    loadingMore: loadingMoreDefault,
    hasMore: hasMoreDefault,
    loadMore: loadMoreDefault,
    reset: resetDefault
  } = useInfinitePokemon({ cache });
  
  // Hook para carregamento infinito por tipo
  const {
    pokemonList: typePokemonList,
    loading: typeLoading,
    loadingMore: loadingMoreType,
    hasMore: hasMoreType,
    loadMore: loadMoreType,
    reset: resetType
  } = useInfinitePokemonByType(currentFilter?.type === 'type' ? currentFilter.value : null);
  
  const { searchResults, loading: searchLoading, searchPokemon } = usePokemonSearch();

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      console.log(`🔍 Buscando por (debounced): "${debouncedSearchQuery}"`);
      setIsSearching(true);
      searchPokemon(debouncedSearchQuery);
    } else if (gameFilter) {
      // Manter o filtro de jogo ativo
      handleGameFilter(gameFilter);
    } else if (currentFilter?.type === 'type') {
      // O hook useInfinitePokemonByType já cuida disso
      setPokemonList(typePokemonList);
    } else {
      setPokemonList(defaultPokemonList);
    }
  }, [debouncedSearchQuery, currentFilter, gameFilter, defaultPokemonList, typePokemonList]);

  useEffect(() => {
    if (searchQuery.trim() && !debouncedSearchQuery.trim()) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery, debouncedSearchQuery]);

  useEffect(() => {
    if (searchResults.length > 0) {
      console.log(`✅ Resultados da busca: ${searchResults.length} Pokémon`);
      setPokemonList(searchResults);
      setIsSearching(false);
    }
  }, [searchResults]);

  useEffect(() => {
    if (typePokemonList.length > 0) {
      console.log(`✅ Resultados por tipo: ${typePokemonList.length} Pokémon`);
      setPokemonList(typePokemonList);
    }
  }, [typePokemonList]);

  // Verificar se há filtro de jogo nos parâmetros da rota
  useEffect(() => {
    console.log('🔍 Verificando parâmetros da rota...');
    console.log('📋 Route params:', route?.params);
    
    if (route?.params?.gameFilter) {
      console.log('🎮 Filtro de jogo detectado:', route.params.gameFilter);
      setGameFilter(route.params.gameFilter);
      handleGameFilter(route.params.gameFilter);
    } else {
      console.log('❌ Nenhum filtro de jogo encontrado na rota');
    }
  }, [route?.params?.gameFilter]);

  const handleGameFilter = async (gameFilterData: any) => {
    console.log(`🎮 Filtrando Pokémon do jogo: ${gameFilterData.gameTitle}`);
    console.log(`🎯 GameFilterData completo:`, gameFilterData);
    console.log(`🆔 GameId: "${gameFilterData.gameId}"`);
    
    setLoading(true);
    setLoadingProgress(`Carregando Pokémon de ${gameFilterData.gameTitle}...`);
    
    try {
      // Usar a função específica por jogo para maior precisão (carregando apenas 20 inicialmente)
      console.log(`🚀 Chamando pokemonApi.getPokemonByGame("${gameFilterData.gameId}", 20)`);
      const results = await pokemonApi.getPokemonByGame(gameFilterData.gameId, 20);
      
      console.log(`✅ Encontrados ${results.length} Pokémon para o jogo ${gameFilterData.gameTitle}`);
      console.log(`📝 Primeiros 3 resultados:`, results.slice(0, 3).map(p => `${p.id}: ${p.name}`));
      setPokemonList(results);
      
      // Salvar informações do jogo para carregamento posterior
      setGameFilter({
        ...gameFilterData,
        currentOffset: 20,
        hasMore: results.length === 20
      });
    } catch (error) {
      console.error('❌ Erro no filtro de jogo:', error);
      Alert.alert('Erro', 'Erro ao carregar Pokémon do jogo');
    } finally {
      setLoading(false);
      setLoadingProgress('');
    }
  };

  const handleFilter = async (filterType: string, filterValue: string) => {
    console.log(`🎯 Aplicando filtro: ${filterType} = ${filterValue}`);
    setLoading(true);
    try {
      let results: Pokemon[] = [];

      switch (filterType) {
        case 'name':
          setSearchQuery(filterValue);
          break;
        case 'type':
          // O hook useInfinitePokemonByType já cuida disso automaticamente
          break;
        case 'generation':
          results = await pokemonApi.getPokemonByGeneration(parseInt(filterValue));
          setPokemonList(results);
          break;
        case 'location':
          const location = await pokemonApi.getLocation(parseInt(filterValue));
          console.log('📍 Localidade carregada:', location.name);
          break;
        case 'move':
          const move = await pokemonApi.getMove(filterValue);
          // Usar Promise.allSettled para lidar com erros individuais
          const movePokemonPromises = move.learned_by_pokemon.slice(0, 20).map(async (pokemon: any) => {
            try {
              const id = pokemon.url.split('/').slice(-2)[0];
              return await pokemonApi.getPokemon(id);
            } catch (error) {
              console.log(`⚠️ Erro ao carregar Pokémon do golpe: ${error}`);
              return null;
            }
          });
          const moveResults = await Promise.allSettled(movePokemonPromises);
          results = moveResults
            .filter((result): result is PromiseFulfilledResult<Pokemon> => 
              result.status === 'fulfilled' && result.value !== null
            )
            .map(result => result.value);
          setPokemonList(results);
          break;
        case 'region':
          const pokemonIds = await pokemonApi.getPokemonByRegion(filterValue);
          // Usar Promise.allSettled para lidar com erros individuais
          const regionPokemonPromises = pokemonIds.slice(0, 20).map(async (id: number) => {
            try {
              return await pokemonApi.getPokemon(id);
            } catch (error) {
              console.log(`⚠️ Erro ao carregar Pokémon ${id}: ${error}`);
              return null;
            }
          });
          const regionResults = await Promise.allSettled(regionPokemonPromises);
          results = regionResults
            .filter((result): result is PromiseFulfilledResult<Pokemon> => 
              result.status === 'fulfilled' && result.value !== null
            )
            .map(result => result.value);
          setPokemonList(results);
          break;
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao aplicar filtro');
      console.error('❌ Erro no filtro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = (filterType: string, filterValue: string) => {
    console.log(`🚀 Filtro aplicado: ${filterType} = ${filterValue}`);
    setCurrentFilter({ type: filterType, value: filterValue });
    setSearchQuery('');
  };

  const handleClearFilters = () => {
    console.log('🧹 Limpando filtros');
    setCurrentFilter(null);
    setSearchQuery('');
    setGameFilter(null);
    setIsSearching(false);
    
    // Resetar os hooks de carregamento infinito
    resetDefault();
    resetType();
  };

  const handlePokemonPress = (pokemon: Pokemon) => {
    console.log(`👆 Pokémon selecionado: ${pokemon.name}`);
    navigation.navigate('PokemonDetail', { pokemonId: pokemon.id });
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    // Se há filtro de jogo ativo, carregar mais Pokémon do jogo
    if (gameFilter) {
      try {
        setLoadingMore(true);
        console.log(`📦 Carregando mais Pokémon do jogo ${gameFilter.gameId}...`);
        
        const morePokemon = await pokemonApi.getMorePokemonByGame(
          gameFilter.gameId, 
          gameFilter.currentOffset || 20, 
          20
        );
        
        if (morePokemon.length > 0) {
          setPokemonList(prev => [...prev, ...morePokemon]);
          setGameFilter(prev => ({
            ...prev,
            currentOffset: (prev?.currentOffset || 20) + 20,
            hasMore: morePokemon.length === 20
          }));
          console.log(`✅ Mais ${morePokemon.length} Pokémon carregados do jogo`);
        } else {
          setGameFilter(prev => ({ ...prev, hasMore: false }));
          console.log('🏁 Não há mais Pokémon para carregar do jogo');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar mais Pokémon do jogo:', error);
      } finally {
        setLoadingMore(false);
      }
    } else if (currentFilter?.type === 'type') {
      loadMoreType();
    } else if (!gameFilter && !currentFilter) {
      loadMoreDefault();
    }
  };

  const onRefresh = async () => {
    console.log('🔄 Atualizando lista...');
    setRefreshing(true);
    if (currentFilter) {
      await handleFilter(currentFilter.type, currentFilter.value);
    } else if (gameFilter) {
      await handleGameFilter(gameFilter);
    } else {
      resetDefault();
    }
    setRefreshing(false);
  };

  const renderPokemonItem = ({ item }: { item: Pokemon }) => (
    <PokemonCard pokemon={item} onPress={handlePokemonPress} />
  );

  const renderEmptyState = () => (
    <EmptyState>
      <EmptyStateIcon>🔍</EmptyStateIcon>
      <EmptyStateText>
        {loading ? 'Carregando...' : searchQuery ? 'Nenhum Pokémon encontrado' : 'Nenhum Pokémon disponível'}
      </EmptyStateText>
      {searchQuery && (
        <EmptyStateSubtext>
          Tente buscar por outro nome ou usar os filtros
        </EmptyStateSubtext>
      )}
    </EmptyState>
  );

  const isLoading = loading || defaultLoading || searchLoading || typeLoading;
  const isLoadingMore = loadingMoreDefault || loadingMoreType || loadingMore;
  const hasMore = hasMoreDefault || hasMoreType || gameFilter?.hasMore;

  const getFilterDisplayName = () => {
    if (gameFilter) {
      return `Jogo: ${gameFilter.gameTitle}`;
    }
    
    if (!currentFilter) return '';
    
    const filterNames = {
      name: 'Nome',
      type: 'Tipo',
      generation: 'Geração',
      location: 'Localidade',
      region: 'Região',
      move: 'Golpe'
    };
    
    return `${filterNames[currentFilter.type as keyof typeof filterNames]}: ${currentFilter.value}`;
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText>←</BackButtonText>
        </BackButton>
        <Title>{gameFilter ? `Pokédex - ${gameFilter.gameTitle}` : 'Pokédex'}</Title>
        <FilterButton onPress={() => setFilterModalVisible(true)}>
          <FilterButtonText>🔍</FilterButtonText>
        </FilterButton>
      </Header>

      <SearchContainer>
        <SearchInputContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            placeholder="Que tipo de Pokémon você está procurando?"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {(currentFilter || gameFilter || searchQuery) && (
            <ClearButton onPress={handleClearFilters}>
              <ClearButtonText>✕</ClearButtonText>
            </ClearButton>
          )}
        </SearchInputContainer>
      </SearchContainer>

      {(currentFilter || gameFilter) && (
        <ActiveFilterContainer>
          <ActiveFilterText>
            {getFilterDisplayName()}
          </ActiveFilterText>
          <ClearFilterButton onPress={handleClearFilters}>
            <ClearFilterText>Limpar</ClearFilterText>
          </ClearFilterButton>
        </ActiveFilterContainer>
      )}

      <ContentContainer>
        {isSearching && searchQuery.trim() && (
          <SearchStatus>
            Buscando por "{searchQuery}"...
          </SearchStatus>
        )}

        {pokemonList.length > 0 && !isSearching && (
          <ResultsCount>
            {pokemonList.length} Pokémon encontrado{pokemonList.length !== 1 ? 's' : ''}
          </ResultsCount>
        )}

        {isLoading && !refreshing ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color="#4A90E2" />
            <LoadingText>{loadingProgress || 'Carregando Pokémon...'}</LoadingText>
          </LoadingContainer>
        ) : (
                  <FlatList
          data={pokemonList}
          renderItem={renderPokemonItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={
            isLoadingMore ? (
              <LoadingContainer style={{ height: 60, paddingVertical: 20 }}>
                <ActivityIndicator size="small" color="#4A90E2" />
                <LoadingText style={{ marginTop: 8, fontSize: 14 }}>Carregando mais Pokémon...</LoadingText>
              </LoadingContainer>
            ) : null
          }
        />
        )}
      </ContentContainer>

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilter={handleApplyFilter}
      />
    </Container>
  );
}; 