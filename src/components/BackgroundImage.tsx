import React from 'react';
import styled from 'styled-components/native';
import { ImageBackground } from 'react-native';
import { useAppSelector } from '../store/hooks';

const BackgroundContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
`;



export const BackgroundImage: React.FC = () => {
  const favoriteType = useAppSelector(state => state.preferences.favoriteType);

  const getBackgroundSource = () => {
    if (favoriteType === 'none') {
      return require('../../assets/backgrounds/menu-background.png');
    }
    
    // Apenas os backgrounds válidos disponíveis
    const backgroundMap: { [key: string]: any } = {
      normal: require('../../assets/backgrounds/normal-background.png'),
      fire: require('../../assets/backgrounds/fire-background.png'),
      water: require('../../assets/backgrounds/water-background.png'),
      dark: require('../../assets/backgrounds/dark-background.png'),
    };

    return backgroundMap[favoriteType] || require('../../assets/backgrounds/menu-background.png');
  };

  return (
    <BackgroundContainer>
      <ImageBackground
        source={getBackgroundSource()}
        style={{
          width: '100%',
          height: '100%',
        }}
        
        resizeMode="cover"
        onError={(error) => console.log('Erro ao carregar imagem de fundo:', error)}
      />
    </BackgroundContainer>
  );
};
