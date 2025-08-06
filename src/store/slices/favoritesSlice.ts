import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoritesState } from '../../types/store';
import { Pokemon } from '../../types/pokemon';

const initialState: FavoritesState = {
  pokemons: [],
  isLoading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addFavorite: (state, action: PayloadAction<Pokemon>) => {
      const pokemon = action.payload;
      const exists = state.pokemons.find(p => p.id === pokemon.id);
      if (!exists) {
        state.pokemons.push(pokemon);
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      const pokemonId = action.payload;
      state.pokemons = state.pokemons.filter(p => p.id !== pokemonId);
    },
    toggleFavorite: (state, action: PayloadAction<Pokemon>) => {
      const pokemon = action.payload;
      const index = state.pokemons.findIndex(p => p.id === pokemon.id);
      
      if (index >= 0) {
        state.pokemons.splice(index, 1);
      } else {
        state.pokemons.push(pokemon);
      }
    },
    setFavorites: (state, action: PayloadAction<Pokemon[]>) => {
      state.pokemons = action.payload;
    },
    clearFavorites: (state) => {
      state.pokemons = [];
    },
    updateFavorite: (state, action: PayloadAction<Pokemon>) => {
      const updatedPokemon = action.payload;
      const index = state.pokemons.findIndex(p => p.id === updatedPokemon.id);
      
      if (index >= 0) {
        state.pokemons[index] = updatedPokemon;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  setFavorites,
  clearFavorites,
  updateFavorite,
} = favoritesSlice.actions;

export default favoritesSlice.reducer; 