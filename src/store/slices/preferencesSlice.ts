import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PreferencesState } from '../../types/store';

const initialState: PreferencesState = {
  darkMode: false,
  language: 'pt-br',
  isLoading: false,
  favoriteType: 'none',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setFavoriteType: (state, action: PayloadAction<string>) => {
      state.favoriteType = action.payload;
    },
    resetPreferences: (state) => {
      state.darkMode = false;
      state.language = 'pt-br';
      state.isLoading = false;
      state.favoriteType = 'none';
    },
  },
});

export const {
  setDarkMode,
  setLanguage,
  setLoading,
  toggleDarkMode,
  setFavoriteType,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer; 