import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { View, Animated } from 'react-native';

interface LoadingScreenProps {
  onFinish: () => void;
}

const Container = styled.View`
  flex: 1;
  background-color: #FFFFFF;
  justify-content: center;
  align-items: center;
`;

const LogoContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.Text`
  font-size: 48px;
  font-family: 'Ketchum';
  color: #D0021B;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const PokeBallContainer = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  border-width: 3px;
  border-color: #000000;
  overflow: hidden;
  margin-bottom: 20px;
`;

const PokeBallTop = styled.View`
  width: 100%;
  height: 50%;
  background-color: #D0021B;
`;

const PokeBallBottom = styled.View`
  width: 100%;
  height: 50%;
  background-color: #000000;
`;

const PokeBallCenter = styled.View`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #FFFFFF;
  border-width: 3px;
  border-color: #000000;
  margin-left: -10px;
  margin-top: -10px;
`;

const LoadingText = styled.Text`
  font-size: 16px;
  font-family: 'Pokemon-Classic';
  color: #333333;
  text-align: center;
  opacity: 0.8;
`;

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Timer para finalizar após 4 segundos
    const timer = setTimeout(() => {
      // Animação de saída
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <Container>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <LogoContainer>
          <PokeBallContainer>
            <PokeBallTop />
            <PokeBallBottom />
            <PokeBallCenter />
          </PokeBallContainer>
          
          <LogoText>PokeHelp</LogoText>
          
          <LoadingText>Carregando...</LoadingText>
        </LogoContainer>
      </Animated.View>
    </Container>
  );
}; 