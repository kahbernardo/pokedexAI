import React from 'react';
import { Dimensions, Image } from 'react-native';
import styled from 'styled-components/native';
import { Pokemon } from '../types/pokemon';
import { FavoriteButton } from './FavoriteButton';

interface PokemonCardProps {
  pokemon: Pokemon;
  onPress: (pokemon: Pokemon) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

const Card = styled.TouchableOpacity<{ backgroundColor: string }>`
  width: ${cardWidth}px;
  height: 160px;
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 16px;
  margin-horizontal: 6px;
  background-color: ${(props: { backgroundColor: string }) => props.backgroundColor || '#A8A878'};
  elevation: 3;
  shadow-color: ${(props: any) => props.theme.colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  position: relative;
  overflow: hidden;
`;

const CardContent = styled.View`
  flex: 1;
  margin-right: 70px; /* Espaço para a imagem */
  padding-right: 2px;
`;

const Number = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: #FFFFFF;
  opacity: 0.8;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  margin-bottom: 1px;
`;

const Name = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 4px;
  text-align: left;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  line-height: 14px;
`;

const TypeContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 3px;
  max-width: 100%;
`;

const TypeBadge = styled.View<{ backgroundColor: string }>`
  padding-horizontal: 4px;
  padding-vertical: 1px;
  border-radius: 6px;
  background-color: ${(props: { backgroundColor: string }) => props.backgroundColor};
  border-width: 1px;
  border-color: #FFFFFF;
  margin-right: 2px;
  margin-bottom: 2px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
`;

const TypeText = styled.Text`
  font-size: 8px;
  font-weight: 700;
  color: #FFFFFF;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
`;

const PokemonImage = styled.Image`
  width: 68px;
  height: 68px;
  position: absolute;
  bottom: 8px;
  right: 8px;
  z-index: 1;
`;

const FavoriteButtonContainer = styled.View`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
`;

const typeColors: { [key: string]: string } = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onPress }) => {
  const getTypeColor = (type: string) => {
    return typeColors[type.toLowerCase()] || '#A8A878';
  };

  const getCardBackgroundColor = () => {
    // Verificação robusta da estrutura de dados
    if (!pokemon || !pokemon.types || !Array.isArray(pokemon.types) || pokemon.types.length === 0) {
      return '#A8A878'; // Cor padrão
    }
    
    const firstType = pokemon.types[0];
    if (!firstType || !firstType.type || !firstType.type.name) {
      return '#A8A878'; // Cor padrão
    }
    
    // Sempre usar o primeiro tipo para o background
    return getTypeColor(firstType.type.name);
  };
  
  return (
    <Card 
      backgroundColor={getCardBackgroundColor()}
      onPress={() => onPress(pokemon)}
      activeOpacity={0.8}
    >
      <FavoriteButtonContainer>
        <FavoriteButton pokemon={pokemon} size={28} />
      </FavoriteButtonContainer>
      
      <CardContent>
        <Number>#{pokemon.id.toString().padStart(3, '0')}</Number>
        <Name numberOfLines={1}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Name>
        
        <TypeContainer>
          {pokemon.types && pokemon.types.map((type, index) => (
            <TypeBadge 
              key={index} 
              backgroundColor={getTypeColor(type.type.name)}
            >
              <TypeText>
                {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
              </TypeText>
            </TypeBadge>
          ))}
        </TypeContainer>
      </CardContent>
      
      <PokemonImage 
        source={{ uri: pokemon.sprites.front_default }}
        resizeMode="contain"
      />
    </Card>
  );
}; 