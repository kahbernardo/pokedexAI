import React, { useState } from 'react';
import {
  FlatList,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SideMenu } from '../components/SideMenu';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setFavoriteType } from '../store/slices/preferencesSlice';

interface FavoriteTypeScreenProps {
  navigation: any;
}

const Container = styled.View`
  flex: 1;
  background-color: #F8F9FA;
  position: relative;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  padding-top: 60px;
  padding-bottom: 15px;
  background-color: rgba(74, 144, 226, 0.9);
  border-bottom-width: 1px;
  border-bottom-color: rgba(255, 255, 255, 0.2);
  elevation: 4;
  shadow-color: #4A90E2;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-family: ${(props: any) => props.theme.fonts.ketchum};
  color: #FFD700;
  text-align: center;
  flex: 1;
`;

const BackButton = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  background-color: #D0021B;
  border-radius: 12px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`;

const BackButtonText = styled.Text`
  font-size: 20px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #FFFFFF;
`;

const Content = styled.View`
  flex: 1;
  padding: 16px;
`;

const WelcomeText = styled.Text`
  font-size: 16px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #333333;
  text-align: center;
  margin-bottom: 20px;
  line-height: 20px;
`;

const TypeCard = styled.TouchableOpacity<{ backgroundColor: string; isSelected: boolean }>`
  background-color: ${props => props.backgroundColor};
  border-radius: 20px;
  padding: 16px;
  margin: 4px;
  elevation: ${props => props.isSelected ? 12 : 8};
  shadow-color: ${props => props.backgroundColor};
  shadow-offset: 0px 4px;
  shadow-opacity: ${props => props.isSelected ? 0.5 : 0.3};
  shadow-radius: 8px;
  width: 48%;
  height: 120px;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  border-width: ${props => props.isSelected ? 3 : 0};
  border-color: #FFD700;
`;

const CardBackground = styled.View`
  position: absolute;
  top: -20px;
  right: -20px;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
`;

const CardContent = styled.View`
  flex: 1;
  z-index: 1;
  justify-content: center;
  align-items: center;
`;

const CardIcon = styled.Text`
  font-size: 32px;
  margin-bottom: 8px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
`;

const CardTitle = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.ketchum};
  color: #FFFFFF;
  font-weight: bold;
  text-align: center;
  line-height: 16px;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
`;

const SelectedIndicator = styled.View`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background-color: #FFD700;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
`;

const SelectedText = styled.Text`
  font-size: 12px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #000000;
  font-weight: bold;
`;

const pokemonTypes = [
  {
    id: 'none',
    name: 'Nenhum',
    icon: '⚪',
    color: '#E0E0E0',
    description: 'Usar fundo padrão'
  },
  {
    id: 'normal',
    name: 'Normal',
    icon: '⚪',
    color: '#A8A878',
    description: 'Tipo básico'
  },
  {
    id: 'fire',
    name: 'Fogo',
    icon: '🔥',
    color: '#F08030',
    description: 'Poder das chamas'
  },
  {
    id: 'water',
    name: 'Água',
    icon: '💧',
    color: '#6890F0',
    description: 'Força dos mares'
  },
  {
    id: 'dark',
    name: 'Sombrio',
    icon: '🌑',
    color: '#705848',
    description: 'Trevas profundas'
  }
];

export const FavoriteTypeScreen: React.FC<FavoriteTypeScreenProps> = ({ navigation }) => {
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const dispatch = useAppDispatch();
  const currentFavoriteType = useAppSelector(state => state.preferences.favoriteType);

  const handleTypeSelect = (typeId: string) => {
    dispatch(setFavoriteType(typeId));
  };

  const renderTypeCard = ({ item }: { item: any }) => {
    const isSelected = currentFavoriteType === item.id;
    
    return (
      <TypeCard 
        backgroundColor={item.color}
        isSelected={isSelected}
        onPress={() => handleTypeSelect(item.id)}
        activeOpacity={0.8}
      >
        <CardBackground />
        <CardContent>
          <CardIcon>{item.icon}</CardIcon>
          <CardTitle>{item.name}</CardTitle>
        </CardContent>
        {isSelected && (
          <SelectedIndicator>
            <SelectedText>✓</SelectedText>
          </SelectedIndicator>
        )}
      </TypeCard>
    );
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText>←</BackButtonText>
        </BackButton>
        <Title>Tipo Favorito</Title>
      </Header>

      <Content>
        <WelcomeText>
          Escolha seu tipo Pokémon favorito!{'\n'}
          O fundo do app será alterado automaticamente.{'\n'}
          (Apenas alguns tipos têm backgrounds especiais)
        </WelcomeText>

        <FlatList
          data={pokemonTypes}
          renderItem={renderTypeCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      </Content>

      <SideMenu
        visible={sideMenuVisible}
        onClose={() => setSideMenuVisible(false)}
      />
    </Container>
  );
};
