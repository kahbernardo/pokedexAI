import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

interface ThemeSwitchProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const SwitchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #F8F9FA;
  border-radius: 16px;
  border-width: 1px;
  border-color: #E5E5E5;
  margin-vertical: 8px;
`;

const SwitchLabel = styled.Text`
  font-size: 16px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #333333;
  font-weight: 600;
`;

const SwitchWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #4A90E2;
  border-radius: 30px;
  padding: 6px;
  width: 140px;
  height: 50px;
  position: relative;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
`;

const SwitchTrack = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 12px;
`;

const SwitchThumb = styled.View<{ isDarkMode: boolean }>`
  position: absolute;
  width: 38px;
  height: 38px;
  border-radius: 19px;
  background-color: #FFFFFF;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  left: ${props => props.isDarkMode ? '72px' : '6px'};
  transition: left 0.3s ease;
`;

const LightText = styled.Text<{ isDarkMode: boolean }>`
  font-size: 16px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #FFFFFF;
  font-weight: ${props => props.isDarkMode ? '400' : '700'};
  opacity: ${props => props.isDarkMode ? '0.7' : '1'};
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
`;

const DarkText = styled.Text<{ isDarkMode: boolean }>`
  font-size: 16px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #FFFFFF;
  font-weight: ${props => props.isDarkMode ? '700' : '400'};
  opacity: ${props => props.isDarkMode ? '1' : '0.7'};
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
`;

const MoonStars = styled.View`
  position: absolute;
  right: 12px;
  top: 8px;
  flex-direction: row;
  align-items: center;
`;

const Star = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #FFFFFF;
  margin-right: 3px;
  opacity: 0.8;
`;

const SunIcon = styled.Text`
  position: absolute;
  left: 12px;
  top: 8px;
  font-size: 16px;
  opacity: 0.8;
`;

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ isDarkMode, onToggle }) => {
  return (
    <SwitchContainer>
      <SwitchLabel>
        {isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
      </SwitchLabel>
      
      <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
        <SwitchWrapper>
          <SwitchTrack>
            <LightText isDarkMode={isDarkMode}>Light</LightText>
            <DarkText isDarkMode={isDarkMode}>Dark</DarkText>
            
            <SunIcon>☀️</SunIcon>
            
            <MoonStars>
              <Star />
              <Star />
            </MoonStars>
          </SwitchTrack>
          
          <SwitchThumb isDarkMode={isDarkMode} />
        </SwitchWrapper>
      </TouchableOpacity>
    </SwitchContainer>
  );
}; 