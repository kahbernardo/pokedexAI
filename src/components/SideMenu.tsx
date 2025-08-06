import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setLanguage, toggleDarkMode } from '../store/slices';
import { ThemeSwitch } from './ThemeSwitch';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

const Overlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
`;

const MenuContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 100%;
  background-color: #FFFFFF;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  padding-top: 60px;
`;

const MenuHeader = styled.View`
  padding: 20px;
  padding-top: 60px;
  background-color: #4A90E2;
  border-bottom-width: 1px;
  border-bottom-color: #E5E5E5;
  min-height: 100px;
`;

const MenuTitle = styled.Text`
  font-size: 24px;
  font-family: ${(props: any) => props.theme.fonts.ketchum};
  color: #FFFFFF;
  font-weight: bold;
  margin-bottom: 4px;
`;

const MenuSubtitle = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #FFFFFF;
  opacity: 0.8;
`;

const MenuContent = styled.ScrollView`
  flex: 1;
  padding: 20px;
  padding-bottom: 40px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-family: ${(props: any) => props.theme.fonts.ketchum};
  color: #FFD700;
  margin-bottom: 16px;
  font-weight: bold;
`;

const OptionContainer = styled.View`
  margin-bottom: 24px;
`;

const LanguageContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
`;

const LanguageButton = styled.TouchableOpacity<{ selected: boolean }>`
  width: 60px;
  height: 40px;
  border-radius: 8px;
  background-color: ${(props: { selected: boolean }) => props.selected ? '#4A90E2' : '#F0F0F0'};
  border-width: 2px;
  border-color: ${(props: { selected: boolean }) => props.selected ? '#4A90E2' : '#E0E0E0'};
  justify-content: center;
  align-items: center;
  elevation: ${(props: { selected: boolean }) => props.selected ? 3 : 1};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: { selected: boolean }) => props.selected ? 0.25 : 0.1};
  shadow-radius: 3.84px;
`;

const FlagText = styled.Text`
  font-size: 20px;
`;

const LanguageName = styled.Text<{ selected: boolean }>`
  font-size: 10px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: ${(props: { selected: boolean }) => props.selected ? '#FFFFFF' : '#333333'};
  font-weight: ${(props: { selected: boolean }) => props.selected ? '600' : '400'};
  text-align: center;
  margin-top: 4px;
`;

const SectionDescription = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #666666;
  text-align: center;
  font-style: italic;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  justify-content: center;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
`;

const CloseButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 18px;
  font-weight: bold;
`;

const languages = [
  { code: 'pt-br', name: 'BR', flag: '🇧🇷' },
  { code: 'en', name: 'EN', flag: '🇺🇸' },
  { code: 'es', name: 'ES', flag: '🇪🇸' },
  { code: 'fr', name: 'FR', flag: '🇫🇷' },
  { code: 'de', name: 'DE', flag: '🇩🇪' },
  { code: 'it', name: 'IT', flag: '🇮🇹' },
  { code: 'ja', name: 'JP', flag: '🇯🇵' },
  { code: 'ko', name: 'KR', flag: '🇰🇷' },
];

export const SideMenu: React.FC<SideMenuProps> = ({
  visible,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const language = useAppSelector(state => state.preferences.language);
  const darkMode = useAppSelector(state => state.preferences.darkMode);

  const handleLanguageChange = (newLanguage: string) => {
    dispatch(setLanguage(newLanguage));
  };

  const handleDarkModeChange = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Overlay onPress={onClose} activeOpacity={1}>
        <MenuContainer>
          <MenuHeader>
            <MenuTitle>Menu</MenuTitle>
            <MenuSubtitle>Configurações da Pokédex</MenuSubtitle>
            <CloseButton onPress={onClose}>
              <CloseButtonText>✕</CloseButtonText>
            </CloseButton>
          </MenuHeader>

          <MenuContent showsVerticalScrollIndicator={true}>
            <SectionTitle>Idioma</SectionTitle>
            
            <OptionContainer>
              <LanguageContainer>
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => handleLanguageChange(lang.code)}
                    activeOpacity={0.8}
                  >
                    <LanguageButton selected={language === lang.code}>
                      <FlagText>{lang.flag}</FlagText>
                    </LanguageButton>
                    <LanguageName selected={language === lang.code}>
                      {lang.name}
                    </LanguageName>
                  </TouchableOpacity>
                ))}
              </LanguageContainer>
            </OptionContainer>

            <SectionTitle>Visual</SectionTitle>
            
            <OptionContainer>
              <ThemeSwitch 
                isDarkMode={darkMode} 
                onToggle={handleDarkModeChange} 
              />
            </OptionContainer>

            <OptionContainer>
              <SectionDescription>
                Outras configurações estarão disponíveis em breve...
              </SectionDescription>
            </OptionContainer>
          </MenuContent>
        </MenuContainer>
      </Overlay>
    </Modal>
  );
}; 