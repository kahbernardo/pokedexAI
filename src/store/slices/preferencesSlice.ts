import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PreferencesState } from '../../types/store';

const initialState: PreferencesState = {
  darkMode: false,
  language: 'pt-br',
  isLoading: false,
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
    resetPreferences: (state) => {
      state.darkMode = false;
      state.language = 'pt-br';
      state.isLoading = false;
    },
  },
});

export const {
  setDarkMode,
  setLanguage,
  setLoading,
  toggleDarkMode,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer; 