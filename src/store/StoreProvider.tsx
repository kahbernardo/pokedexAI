import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { loadPersistedData } from './middleware/persistMiddleware';
import { setDarkMode, setLanguage, setFavorites } from './slices';
import { ActivityIndicator, View } from 'react-native';

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeStore = async () => {
      try {
        const persistedData = await loadPersistedData();
        
        if (persistedData.preferences) {
          store.dispatch(setDarkMode(persistedData.preferences.darkMode));
          store.dispatch(setLanguage(persistedData.preferences.language));
        }
        
        if (persistedData.favorites?.pokemons) {
          store.dispatch(setFavorites(persistedData.favorites.pokemons));
        }
      } catch (error) {
        console.error('Erro ao inicializar store:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeStore();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return <Provider store={store}>{children}</Provider>;
}; 