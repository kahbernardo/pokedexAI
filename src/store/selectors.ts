import { RootState } from './index';

// Seletores de Preferências
export const selectDarkMode = (state: RootState) => state.preferences.darkMode;
export const selectLanguage = (state: RootState) => state.preferences.language;
export const selectPreferencesLoading = (state: RootState) => state.preferences.isLoading;

// Seletores de Favoritos
export const selectFavorites = (state: RootState) => state.favorites.pokemons;
export const selectFavoritesLoading = (state: RootState) => state.favorites.isLoading;
export const selectFavoritesError = (state: RootState) => state.favorites.error;

// Seletores derivados
export const selectFavoriteCount = (state: RootState) => state.favorites.pokemons.length;

export const selectIsFavorite = (pokemonId: number) => (state: RootState) => 
  state.favorites.pokemons.some(pokemon => pokemon.id === pokemonId);

export const selectFavoriteById = (pokemonId: number) => (state: RootState) =>
  state.favorites.pokemons.find(pokemon => pokemon.id === pokemonId); 