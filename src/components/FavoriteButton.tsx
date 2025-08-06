import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleFavorite } from '../store/slices';
import { Pokemon } from '../types/pokemon';

interface FavoriteButtonProps {
  pokemon: Pokemon;
  size?: number;
}

const FavoriteButtonContainer = styled.TouchableOpacity<{ isFavorite: boolean; size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: ${props => props.size / 2}px;
  background-color: ${props => props.isFavorite ? '#FF6B6B' : 'rgba(255, 255, 255, 0.9)'};
  justify-content: center;
  align-items: center;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  border-width: 1px;
  border-color: ${props => props.isFavorite ? '#FF6B6B' : 'rgba(0, 0, 0, 0.1)'};
`;

const HeartIcon = styled.Text<{ isFavorite: boolean }>`
  font-size: ${props => props.isFavorite ? 16 : 14}px;
  color: ${props => props.isFavorite ? '#FFFFFF' : '#FF6B6B'};
`;

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  pokemon, 
  size = 32 
}) => {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(state => 
    state.favorites.pokemons.some(p => p.id === pokemon.id)
  );

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(pokemon));
  };

  return (
    <FavoriteButtonContainer
      isFavorite={isFavorite}
      size={size}
      onPress={handleToggleFavorite}
      activeOpacity={0.8}
    >
      <HeartIcon isFavorite={isFavorite}>
        {isFavorite ? '❤️' : '🤍'}
      </HeartIcon>
    </FavoriteButtonContainer>
  );
}; 