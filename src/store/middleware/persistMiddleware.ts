import AsyncStorage from '@react-native-async-storage/async-storage';
import { Middleware } from '@reduxjs/toolkit';

const PREFERENCES_KEY = '@pokedex_preferences';
const FAVORITES_KEY = '@pokedex_favorites';

export const persistMiddleware: Middleware = store => next => action => {
  const result = next(action);
  
  // Persistir preferências
  if (action.type?.startsWith('preferences/')) {
    const preferences = store.getState().preferences;
    AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
      .catch(error => console.error('Erro ao salvar preferências:', error));
  }
  
  // Persistir favoritos
  if (action.type?.startsWith('favorites/')) {
    const favorites = store.getState().favorites;
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      .catch(error => console.error('Erro ao salvar favoritos:', error));
  }
  
  return result;
};

export const loadPersistedData = async () => {
  try {
    const [preferencesData, favoritesData] = await Promise.all([
      AsyncStorage.getItem(PREFERENCES_KEY),
      AsyncStorage.getItem(FAVORITES_KEY),
    ]);

    return {
      preferences: preferencesData ? JSON.parse(preferencesData) : null,
      favorites: favoritesData ? JSON.parse(favoritesData) : null,
    };
  } catch (error) {
    console.error('Erro ao carregar dados persistidos:', error);
    return { preferences: null, favorites: null };
  }
}; 