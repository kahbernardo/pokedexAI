export { 
  setDarkMode, 
  setLanguage, 
  setLoading as setPreferencesLoading, 
  toggleDarkMode, 
  resetPreferences 
} from './preferencesSlice';

export { 
  setLoading as setFavoritesLoading,
  setError,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  setFavorites,
  clearFavorites,
  updateFavorite
} from './favoritesSlice'; 