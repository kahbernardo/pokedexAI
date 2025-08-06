import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StoreProvider } from './src/store/StoreProvider';
import { theme, getThemeColors } from './src/theme';
import { useFonts } from './src/hooks/useFonts';
import { useAppSelector } from './src/store/hooks';

const AppContent = () => {
  const darkMode = useAppSelector(state => state.preferences.darkMode);
  const themeColors = getThemeColors(darkMode);
  
  const dynamicTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      ...themeColors,
    },
  };

  return (
    <ThemeProvider theme={dynamicTheme}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const fontsLoaded = useFonts();

  const handleLoadingFinish = () => {
    setIsLoading(false);
  };

  if (!fontsLoaded || isLoading) {
    return <LoadingScreen onFinish={handleLoadingFinish} />;
  }

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
