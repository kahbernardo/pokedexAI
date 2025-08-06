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
  background-color: ${(props: { backgroundColor: string }) => props.backgroundColor};
  elevation: 3;
  shadow-color: ${(props: any) => props.theme.colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  position: relative;
`;

const CardContent = styled.View`
  flex: 1;
`;

const Number = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #FFFFFF;
  opacity: 0.8;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
`;

const Name = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 8px;
  text-align: left;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
`;

const TypeContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const TypeBadge = styled.View<{ backgroundColor: string }>`
  padding-horizontal: 8px;
  padding-vertical: 4px;
  border-radius: 12px;
  background-color: ${(props: { backgroundColor: string }) => props.backgroundColor};
  margin-right: 4px;
  margin-bottom: 4px;
`;

const TypeText = styled.Text`
  font-size: 10px;
  font-weight: 600;
  color: #FFFFFF;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
`;

const PokemonImage = styled.Image`
  width: 80px;
  height: 80px;
  position: absolute;
  bottom: 8px;
  right: 8px;
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
    if (pokemon.types.length === 1) {
      return getTypeColor(pokemon.types[0].type.name);
    }
    
    const color1 = getTypeColor(pokemon.types[0].type.name);
    const color2 = getTypeColor(pokemon.types[1].type.name);
    
    return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
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
        <Name>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Name>
        
        <TypeContainer>
          {pokemon.types.map((type, index) => (
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