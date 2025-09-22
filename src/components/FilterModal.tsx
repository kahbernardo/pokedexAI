import React, { useState, useEffect } from 'react';
import {
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import { pokemonApi } from '../services/api';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilter: (filterType: string, filterValue: string) => void;
}

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  background-color: #FFFFFF;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  min-height: 60%;
  max-height: 85%;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #E5E5E5;
`;

const Title = styled.Text`
  font-size: 24px;
  font-family: ${props => props.theme.fonts.ketchum};
  color: #000000;
  text-align: center;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 8px;
  background-color: #F0F0F0;
  border-radius: 20px;
`;

const CloseText = styled.Text`
  font-size: 18px;
  color: #666666;
  font-family: ${props => props.theme.fonts.pokemonClassic};
`;

const FilterTypesContainer = styled.ScrollView`
  padding: 20px;
`;

const FilterTypeItem = styled.TouchableOpacity<{ selected: boolean }>`
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  background-color: ${props => props.selected ? '#4A90E2' : '#F8F9FA'};
  border-width: 2px;
  border-color: ${props => props.selected ? '#4A90E2' : '#E5E5E5'};
`;

const FilterTypeTitle = styled.Text<{ selected: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.selected ? '#FFFFFF' : '#000000'};
  margin-bottom: 4px;
  text-align: left;
  font-family: ${props => props.theme.fonts.pokemonClassic};
`;

const FilterTypeDescription = styled.Text<{ selected: boolean }>`
  font-size: 14px;
  color: ${props => props.selected ? '#E8F4FD' : '#9B9B9B'};
  text-align: left;
  font-family: ${props => props.theme.fonts.pokemonClassic};
`;

const OptionsContainer = styled.View`
  flex: 1;
`;

const SearchContainer = styled.View`
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #E5E5E5;
`;

const SearchInput = styled.TextInput`
  border-width: 2px;
  border-color: #E5E5E5;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-family: ${props => props.theme.fonts.pokemonClassic};
  background-color: #F8F9FA;
`;

const SearchResults = styled.Text`
  font-size: 12px;
  color: #9B9B9B;
  margin-top: 8px;
  text-align: center;
  font-family: ${props => props.theme.fonts.pokemonClassic};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const LoadingText = styled.Text`
  margin-top: 16px;
  font-size: 16px;
  color: #9B9B9B;
  font-family: ${props => props.theme.fonts.pokemonClassic};
`;

const OptionsList = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const OptionItem = styled.TouchableOpacity<{ selected: boolean }>`
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: ${props => props.selected ? '#E8F4FD' : '#FFFFFF'};
  border-width: 1px;
  border-color: ${props => props.selected ? '#4A90E2' : '#E5E5E5'};
`;

const OptionText = styled.Text<{ selected: boolean }>`
  font-size: 16px;
  color: ${props => props.selected ? '#4A90E2' : '#000000'};
  text-align: left;
  font-family: ${props => props.theme.fonts.pokemonClassic};
`;

const ActionButtons = styled.View`
  flex-direction: row;
  padding: 20px;
  border-top-width: 1px;
  border-top-color: #E5E5E5;
  gap: 12px;
`;

const ActionButton = styled.TouchableOpacity<{ primary?: boolean }>`
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  background-color: ${props => props.primary ? '#4A90E2' : '#F0F0F0'};
  align-items: center;
`;

const ActionButtonText = styled.Text<{ primary?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.primary ? '#FFFFFF' : '#666666'};
  font-family: ${props => props.theme.fonts.pokemonClassic};
`;

const BackButton = styled.TouchableOpacity`
  padding: 16px 20px;
  border-top-width: 1px;
  border-top-color: #E5E5E5;
  align-items: center;
`;

const BackButtonText = styled.Text`
  font-size: 16px;
  color: #4A90E2;
  font-weight: 600;
  font-family: ${props => props.theme.fonts.pokemonClassic};
`;

const EmptyState = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const EmptyStateText = styled.Text`
  font-size: 16px;
  color: #9B9B9B;
  text-align: center;
  font-family: ${props => props.theme.fonts.pokemonClassic};
`;

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilter,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const filterTypes = [
    { 
      id: 'name', 
      title: '🔍 Buscar por Nome', 
      description: 'Encontre Pokémon pelo nome',
      icon: '🔍'
    },
    { 
      id: 'type', 
      title: '⚡ Filtrar por Tipo', 
      description: 'Veja Pokémon de tipos específicos',
      icon: '⚡'
    },
    { 
      id: 'generation', 
      title: '🌟 Filtrar por Geração', 
      description: 'Explore Pokémon por geração',
      icon: '🌟'
    },
    { 
      id: 'location', 
      title: '🗺️ Filtrar por Localidade', 
      description: 'Descubra Pokémon por região',
      icon: '🗺️'
    },
    { 
      id: 'move', 
      title: '💥 Filtrar por Golpe', 
      description: 'Encontre Pokémon que aprendem golpes específicos',
      icon: '💥'
    },
    { 
      id: 'region', 
      title: '🌍 Filtrar por Região', 
      description: 'Explore Pokémon por região do mundo',
      icon: '🌍'
    },
  ];

  const typeOptions = [
    { id: 'normal', name: 'Normal', color: '#A8A878' },
    { id: 'fire', name: 'Fogo', color: '#F08030' },
    { id: 'water', name: 'Água', color: '#6890F0' },
    { id: 'electric', name: 'Elétrico', color: '#F8D030' },
    { id: 'grass', name: 'Planta', color: '#78C850' },
    { id: 'ice', name: 'Gelo', color: '#98D8D8' },
    { id: 'fighting', name: 'Lutador', color: '#C03028' },
    { id: 'poison', name: 'Venenoso', color: '#A040A0' },
    { id: 'ground', name: 'Terra', color: '#E0C068' },
    { id: 'flying', name: 'Voador', color: '#A890F0' },
    { id: 'psychic', name: 'Psíquico', color: '#F85888' },
    { id: 'bug', name: 'Inseto', color: '#A8B820' },
    { id: 'rock', name: 'Pedra', color: '#B8A038' },
    { id: 'ghost', name: 'Fantasma', color: '#705898' },
    { id: 'dragon', name: 'Dragão', color: '#7038F8' },
    { id: 'dark', name: 'Sombrio', color: '#705848' },
    { id: 'steel', name: 'Metálico', color: '#B8B8D0' },
    { id: 'fairy', name: 'Fada', color: '#EE99AC' },
  ];

  const loadFilterOptions = async (filterType: string) => {
    setLoading(true);
    setSelectedOptions([]);
    try {
      let options: any[] = [];

      switch (filterType) {
        case 'type':
          options = typeOptions;
          break;
        case 'generation':
          const generations = await pokemonApi.getGenerations();
          options = generations.results.map((gen: any, index: number) => ({
            id: (index + 1).toString(),
            name: `Geração ${index + 1}`,
            description: `Pokémon da ${index + 1}ª geração`
          }));
          break;
        case 'location':
          const locations = await pokemonApi.getLocations();
          options = locations.results.slice(0, 50).map((location: any) => ({
            id: location.name,
            name: location.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: `Localidade: ${location.name}`
          }));
          break;
        case 'move':
          const moves = await pokemonApi.getMoves(100, 0);
          options = moves.results.map((move: any) => ({
            id: move.name,
            name: move.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: `Golpe: ${move.name}`
          }));
          break;
        case 'region':
          const regions = await pokemonApi.getRegions();
          options = regions.results.map((region: any) => ({
            id: region.name,
            name: region.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: `Região: ${region.name}`
          }));
          break;
      }

      setFilterOptions(options);
      console.log(`✅ Opções carregadas para ${filterType}:`, options.length);
    } catch (error) {
      console.error('❌ Erro ao carregar opções:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSelect = (filterType: string) => {
    console.log(`🎯 Filtro selecionado: ${filterType}`);
    setSelectedFilter(filterType);
    setSearchQuery('');
    setSelectedOptions([]);
    loadFilterOptions(filterType);
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleApplyFilter = () => {
    if (selectedOptions.length > 0) {
      console.log(`🚀 Aplicando filtro: ${selectedFilter}`, selectedOptions);
      selectedOptions.forEach(optionId => {
        onApplyFilter(selectedFilter, optionId);
      });
      onClose();
    }
  };

  const handleClearAll = () => {
    setSelectedFilter('');
    setSearchQuery('');
    setFilterOptions([]);
    setSelectedOptions([]);
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const filteredOptions = filterOptions.filter(option =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <ModalOverlay>
        <ModalContent>
          <Header>
            <Title>Filtros Avançados</Title>
            <CloseButton onPress={onClose}>
              <CloseText>✕</CloseText>
            </CloseButton>
          </Header>

          {!selectedFilter ? (
            <FilterTypesContainer>
              {filterTypes.map((filter) => (
                <FilterTypeItem
                  key={filter.id}
                  selected={false}
                  onPress={() => handleFilterSelect(filter.id)}
                >
                  <FilterTypeTitle selected={false}>
                    {filter.icon} {filter.title}
                  </FilterTypeTitle>
                  <FilterTypeDescription selected={false}>
                    {filter.description}
                  </FilterTypeDescription>
                </FilterTypeItem>
              ))}
            </FilterTypesContainer>
          ) : (
            <OptionsContainer>
              <SearchContainer>
                <SearchInput
                  placeholder={`Buscar ${selectedFilter === 'type' ? 'tipos' : selectedFilter === 'generation' ? 'gerações' : selectedFilter === 'location' ? 'localidades' : selectedFilter === 'region' ? 'regiões' : 'golpes'}...`}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <SearchResults>
                  {filteredOptions.length} de {filterOptions.length} opções encontradas
                </SearchResults>
              </SearchContainer>

              {loading ? (
                <LoadingContainer>
                  <ActivityIndicator size="large" color="#4A90E2" />
                  <LoadingText>Carregando opções...</LoadingText>
                </LoadingContainer>
              ) : filteredOptions.length === 0 ? (
                <EmptyState>
                  <EmptyStateText>
                    Nenhuma opção encontrada para "{searchQuery}"
                  </EmptyStateText>
                </EmptyState>
              ) : (
                <>
                  <OptionsList>
                    {filteredOptions.map((option, index) => (
                      <OptionItem
                        key={index}
                        selected={selectedOptions.includes(option.id)}
                        onPress={() => handleOptionSelect(option.id)}
                      >
                        <OptionText selected={selectedOptions.includes(option.id)}>
                          {option.name}
                        </OptionText>
                        {option.description && (
                          <OptionText selected={selectedOptions.includes(option.id)} style={{ fontSize: 12, opacity: 0.7 }}>
                            {option.description}
                          </OptionText>
                        )}
                      </OptionItem>
                    ))}
                  </OptionsList>

                  {selectedOptions.length > 0 && (
                    <ActionButtons>
                      <ActionButton onPress={handleClearAll}>
                        <ActionButtonText>Limpar</ActionButtonText>
                      </ActionButton>
                      <ActionButton primary onPress={handleApplyFilter}>
                        <ActionButtonText primary>
                          Aplicar ({selectedOptions.length})
                        </ActionButtonText>
                      </ActionButton>
                    </ActionButtons>
                  )}

                  <BackButton onPress={() => setSelectedFilter('')}>
                    <BackButtonText>← Voltar aos Filtros</BackButtonText>
                  </BackButton>
                </>
              )}
            </OptionsContainer>
          )}
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}; 