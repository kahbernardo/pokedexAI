import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsContextType {
  language: string;
  setLanguage: (language: string) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState('pt-br');
  const [darkMode, setDarkModeState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedLanguage, savedDarkMode] = await Promise.all([
        AsyncStorage.getItem('@pokedex_language'),
        AsyncStorage.getItem('@pokedex_darkMode'),
      ]);

      if (savedLanguage) {
        setLanguageState(savedLanguage);
      }

      if (savedDarkMode) {
        setDarkModeState(savedDarkMode === 'true');
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setLanguage = async (newLanguage: string) => {
    try {
      await AsyncStorage.setItem('@pokedex_language', newLanguage);
      setLanguageState(newLanguage);
      console.log(`🌍 Idioma alterado para: ${newLanguage}`);
    } catch (error) {
      console.error('Erro ao salvar idioma:', error);
    }
  };

  const setDarkMode = async (newDarkMode: boolean) => {
    try {
      await AsyncStorage.setItem('@pokedex_darkMode', newDarkMode.toString());
      setDarkModeState(newDarkMode);
      console.log(`🌙 Modo escuro ${newDarkMode ? 'ativado' : 'desativado'}`);
    } catch (error) {
      console.error('Erro ao salvar modo escuro:', error);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}; 