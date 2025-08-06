import { Pokemon } from './pokemon';

export interface AppState {
  preferences: PreferencesState;
  favorites: FavoritesState;
}

export interface PreferencesState {
  darkMode: boolean;
  language: string;
  isLoading: boolean;
}

export interface FavoritesState {
  pokemons: Pokemon[];
  isLoading: boolean;
  error: string | null;
} 