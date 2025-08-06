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
import { usePokemonList, usePokemonSearch, usePokemonByType } from '../hooks/usePokemon';
import { useDebounce } from '../hooks/useDebounce';
import { Pokemon } from '../types/pokemon';
import { pokemonApi } from '../services/api';

interface PokedexScreenProps {
  navigation: any;
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
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

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.Text`
  margin-top: 10px;
  font-size: 16px;
  color: ${(props: any) => props.theme.colors.textMuted};
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
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

export const PokedexScreen: React.FC<PokedexScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<{ type: string; value: string } | null>(null);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { pokemonList: defaultPokemonList, loading: defaultLoading, refetch: refetchDefault } = usePokemonList(20, 0);
  const { searchResults, loading: searchLoading, searchPokemon } = usePokemonSearch();
  const { pokemonList: typePokemonList, loading: typeLoading, fetchPokemonByType } = usePokemonByType();

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      console.log(`🔍 Buscando por (debounced): "${debouncedSearchQuery}"`);
      setIsSearching(true);
      searchPokemon(debouncedSearchQuery);
    } else if (currentFilter) {
      handleFilter(currentFilter.type, currentFilter.value);
    } else {
      setPokemonList(defaultPokemonList);
    }
  }, [debouncedSearchQuery, currentFilter, defaultPokemonList]);

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
          await fetchPokemonByType(filterValue);
          break;
        case 'generation':
          const generation = await pokemonApi.getGeneration(parseInt(filterValue));
          const pokemonPromises = generation.pokemon_species.slice(0, 20).map(async (species: any) => {
            const id = species.url.split('/').slice(-2)[0];
            return await pokemonApi.getPokemon(id);
          });
          results = await Promise.all(pokemonPromises);
          setPokemonList(results);
          break;
        case 'location':
          const location = await pokemonApi.getLocation(parseInt(filterValue));
          console.log('📍 Localidade carregada:', location.name);
          break;
        case 'move':
          const move = await pokemonApi.getMove(filterValue);
          const movePokemonPromises = move.learned_by_pokemon.slice(0, 20).map(async (pokemon: any) => {
            const id = pokemon.url.split('/').slice(-2)[0];
            return await pokemonApi.getPokemon(id);
          });
          results = await Promise.all(movePokemonPromises);
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
    setIsSearching(false);
  };

  const handlePokemonPress = (pokemon: Pokemon) => {
    console.log(`👆 Pokémon selecionado: ${pokemon.name}`);
    navigation.navigate('PokemonDetail', { pokemonId: pokemon.id });
  };

  const onRefresh = async () => {
    console.log('🔄 Atualizando lista...');
    setRefreshing(true);
    if (currentFilter) {
      await handleFilter(currentFilter.type, currentFilter.value);
    } else {
      await refetchDefault();
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

  const getFilterDisplayName = () => {
    if (!currentFilter) return '';
    
    const filterNames = {
      name: 'Nome',
      type: 'Tipo',
      generation: 'Geração',
      location: 'Localidade',
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
        <Title>Pokédex</Title>
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
          {(currentFilter || searchQuery) && (
            <ClearButton onPress={handleClearFilters}>
              <ClearButtonText>✕</ClearButtonText>
            </ClearButton>
          )}
        </SearchInputContainer>
      </SearchContainer>

      {currentFilter && (
        <ActiveFilterContainer>
          <ActiveFilterText>
            {getFilterDisplayName()}
          </ActiveFilterText>
          <ClearFilterButton onPress={handleClearFilters}>
            <ClearFilterText>Limpar</ClearFilterText>
          </ClearFilterButton>
        </ActiveFilterContainer>
      )}

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
          <LoadingText>Carregando Pokémon...</LoadingText>
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
          ListEmptyComponent={renderEmptyState}
        />
      )}

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilter={handleApplyFilter}
      />
    </Container>
  );
}; 