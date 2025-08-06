import React, { useState } from 'react';
import {
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SideMenu } from '../components/SideMenu';
import { BackgroundImage } from '../components/BackgroundImage';
import { useAppSelector } from '../store/hooks';

interface HomeScreenProps {
  navigation: any;
}

const Container = styled.View`
  flex: 1;
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
  font-size: 28px;
  font-family: ${(props: any) => props.theme.fonts.ketchum};
  color: #FFD700;
  text-align: center;
  flex: 1;
`;

const MenuButton = styled.TouchableOpacity`
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

const MenuButtonText = styled.Text`
  font-size: 20px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #FFFFFF;
`;

const Content = styled.View`
  flex: 1;
  padding: 20px;
`;

const WelcomeText = styled.Text`
  font-size: 18px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 30px;
  line-height: 24px;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.7);
`;

const FunctionCard = styled.TouchableOpacity<{ backgroundColor: string }>`
  background-color: ${(props: { backgroundColor: string }) => props.backgroundColor};
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  elevation: 8;
  shadow-color: ${(props: { backgroundColor: string }) => props.backgroundColor};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  position: relative;
  overflow: hidden;
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
`;

const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const CardIcon = styled.Text`
  font-size: 32px;
  margin-right: 16px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
`;

const CardTitle = styled.Text`
  font-size: 20px;
  font-family: ${(props: any) => props.theme.fonts.ketchum};
  color: #FFFFFF;
  flex: 1;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
`;

const CardDescription = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: rgba(255, 255, 255, 0.9);
  line-height: 20px;
  margin-top: 8px;
`;

const CardStatus = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
`;

const StatusDot = styled.View<{ available: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #FFFFFF;
  margin-right: 8px;
  opacity: 0.9;
`;

const StatusText = styled.Text<{ available: boolean }>`
  font-size: 12px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #FFFFFF;
  font-weight: 600;
  opacity: 0.9;
`;

const functions = [
  {
    id: 'pokedex',
    title: 'Pokédex',
    description: 'Explore e descubra todos os Pokémon com informações detalhadas, estatísticas e imagens oficiais.',
    icon: '📱',
    available: true,
    route: 'Pokedex',
    color: '#4A90E2',
  },
  {
    id: 'dynamic-journey',
    title: 'Jornada Dinâmica',
    description: 'Crie jornadas Pokémon personalizadas baseadas em todos os jogos oficiais da Nintendo.',
    icon: '🎮',
    available: true,
    route: 'DynamicJourney',
    color: '#FFD700',
  },
  {
    id: 'favorites',
    title: 'Favoritos',
    description: 'Salve seus Pokémon favoritos para acesso rápido e organização pessoal.',
    icon: '❤️',
    available: false,
    route: 'Favorites',
    color: '#FF6B6B',
  },
  {
    id: 'comparator',
    title: 'Comparador',
    description: 'Compare estatísticas e características entre diferentes Pokémon.',
    icon: '⚖️',
    available: false,
    route: 'Comparator',
    color: '#9370DB',
  },
  {
    id: 'evolution',
    title: 'Evoluções',
    description: 'Visualize as linhas evolutivas completas dos Pokémon.',
    icon: '🔄',
    available: false,
    route: 'Evolution',
    color: '#32CD32',
  },
  {
    id: 'types',
    title: 'Tipos',
    description: 'Aprenda sobre efetividade de tipos, resistências e fraquezas.',
    icon: '⚡',
    available: false,
    route: 'Types',
    color: '#FFA500',
  },
  {
    id: 'offline',
    title: 'Modo Offline',
    description: 'Acesse dados salvos mesmo sem conexão com a internet.',
    icon: '📴',
    available: false,
    route: 'Offline',
    color: '#808080',
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [sideMenuVisible, setSideMenuVisible] = useState(false);

  const handleFunctionPress = (functionItem: any) => {
    if (functionItem.available) {
      navigation.navigate(functionItem.route);
    }
  };

  const renderFunctionCard = ({ item }: { item: any }) => (
    <FunctionCard 
      onPress={() => handleFunctionPress(item)}
      activeOpacity={item.available ? 0.8 : 1}
      backgroundColor={item.available ? item.color : '#E0E0E0'}
    >
      <CardBackground />
      <CardContent>
        <CardHeader>
          <CardIcon>{item.icon}</CardIcon>
          <CardTitle>{item.title}</CardTitle>
        </CardHeader>
        
        <CardDescription>{item.description}</CardDescription>
        
        <CardStatus>
          <StatusDot available={item.available} />
          <StatusText available={item.available}>
            {item.available ? 'Disponível' : 'Em breve'}
          </StatusText>
        </CardStatus>
      </CardContent>
    </FunctionCard>
  );

  return (
    <Container>
      <BackgroundImage />
      <Header>
        <MenuButton onPress={() => setSideMenuVisible(true)}>
          <MenuButtonText>☰</MenuButtonText>
        </MenuButton>
        <Title>PokeHelp</Title>
      </Header>

      <Content>
        <WelcomeText>
          Bem-vindo ao PokeHelp!{'\n'}
          Escolha uma funcionalidade para começar sua jornada Pokémon.
        </WelcomeText>

        <FlatList
          data={functions}
          renderItem={renderFunctionCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </Content>

      <SideMenu
        visible={sideMenuVisible}
        onClose={() => setSideMenuVisible(false)}
      />
    </Container>
  );
}; 