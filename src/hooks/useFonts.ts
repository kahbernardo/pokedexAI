import { useFonts as useExpoFonts } from 'expo-font';

export const useFonts = () => {
  const [fontsLoaded] = useExpoFonts({
    'Ketchum': require('../../assets/fonts/Ketchum.otf'),
    'Ketchum-Italic': require('../../assets/fonts/Ketchum Italic.otf'),
    'Pokemon-Classic': require('../../assets/fonts/Pokemon Classic.ttf'),
  });

  return fontsLoaded;
}; 