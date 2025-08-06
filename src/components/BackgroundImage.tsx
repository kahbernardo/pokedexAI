import React from 'react';
import styled from 'styled-components/native';
import { ImageBackground } from 'react-native';

const BackgroundContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
`;



export const BackgroundImage: React.FC = () => {
  return (
    <BackgroundContainer>
      {/* Fundo temporário até a imagem PNG real ser adicionada */}
      {/* <BackgroundContainer
        style={{
          backgroundColor: '#87CEEB',
          width: '100%',
          height: '100%',
        }}
      /> */}
      <ImageBackground
      source={require('../../assets/backgrounds/menu-background.png')}
      style={{
        width: '100%',
        height: '100%',
      }}
        resizeMode="cover"
      />
    </BackgroundContainer>
  );
};
