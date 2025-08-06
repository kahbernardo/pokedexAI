import React, { useState } from 'react';
import {
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SideMenu } from '../components/SideMenu';

interface DynamicJourneyScreenProps {
  navigation: any;
}

const Container = styled.View`
  flex: 1;
  background-color: #F8F9FA;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  padding-top: 60px;
  padding-bottom: 15px;
  background-color: #4A90E2;
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
  padding: 12px;
`;

const WelcomeText = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: ${(props: any) => props.theme.colors.text};
  text-align: center;
  margin-bottom: 20px;
  line-height: 18px;
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
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const CardHeader = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CardIcon = styled.Text`
  font-size: 32px;
  margin-bottom: 12px;
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



const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const pokemonGames = [
  {
    id: 'red-green',
    title: 'Pokémon Red & Green',
    description: 'Os jogos originais que iniciaram a franquia. Explore a região de Kanto e capture os 151 Pokémon originais.',
    icon: '🔴',
    releaseDate: '27 de fevereiro de 1996',
    platform: 'Game Boy',
    generation: 1,
    gradient: ['#FF6B6B', '#FF8E8E'],
  },
  {
    id: 'blue',
    title: 'Pokémon Blue',
    description: 'Versão melhorada dos jogos originais com gráficos aprimorados e correções de bugs.',
    icon: '🔵',
    releaseDate: '15 de outubro de 1996',
    platform: 'Game Boy',
    generation: 1,
    gradient: ['#4A90E2', '#6BA3E8'],
  },
  {
    id: 'yellow',
    title: 'Pokémon Yellow',
    description: 'Versão especial baseada no anime, onde Pikachu segue o jogador e não pode evoluir.',
    icon: '⚡',
    releaseDate: '12 de setembro de 1998',
    platform: 'Game Boy',
    generation: 1,
    gradient: ['#FFD700', '#FFE55C'],
  },
  {
    id: 'gold-silver',
    title: 'Pokémon Gold & Silver',
    description: 'Segunda geração introduzindo 100 novos Pokémon, sistema de dia/noite e duas regiões para explorar.',
    icon: '🥇',
    releaseDate: '21 de novembro de 1999',
    platform: 'Game Boy Color',
    generation: 2,
    gradient: ['#FFD700', '#FFE55C'],
  },
  {
    id: 'crystal',
    title: 'Pokémon Crystal',
    description: 'Versão aprimorada de Gold & Silver com animações de Pokémon e a primeira protagonista feminina.',
    icon: '💎',
    releaseDate: '14 de dezembro de 2000',
    platform: 'Game Boy Color',
    generation: 2,
    gradient: ['#87CEEB', '#B0E0E6'],
  },
  {
    id: 'ruby-sapphire',
    title: 'Pokémon Ruby & Sapphire',
    description: 'Terceira geração com 135 novos Pokémon, sistema de habilidades e a região de Hoenn.',
    icon: '💎',
    releaseDate: '21 de novembro de 2002',
    platform: 'Game Boy Advance',
    generation: 3,
    gradient: ['#FF6B6B', '#FF8E8E'],
  },
  {
    id: 'emerald',
    title: 'Pokémon Emerald',
    description: 'Versão definitiva de Ruby & Sapphire com a Batalha da Fronteira e gráficos aprimorados.',
    icon: '💚',
    releaseDate: '16 de setembro de 2004',
    platform: 'Game Boy Advance',
    generation: 3,
    gradient: ['#32CD32', '#90EE90'],
  },
  {
    id: 'firered-leafgreen',
    title: 'Pokémon FireRed & LeafGreen',
    description: 'Remakes dos jogos originais com gráficos da terceira geração e novos recursos.',
    icon: '🔥',
    releaseDate: '29 de janeiro de 2004',
    platform: 'Game Boy Advance',
    generation: 3,
    gradient: ['#FF4500', '#FF6347'],
  },
  {
    id: 'diamond-pearl',
    title: 'Pokémon Diamond & Pearl',
    description: 'Quarta geração com 107 novos Pokémon, sistema de combate físico/especial e a região de Sinnoh.',
    icon: '💎',
    releaseDate: '28 de setembro de 2006',
    platform: 'Nintendo DS',
    generation: 4,
    gradient: ['#9370DB', '#BA55D3'],
  },
  {
    id: 'platinum',
    title: 'Pokémon Platinum',
    description: 'Versão aprimorada de Diamond & Pearl com a Distorção Mundial e novos recursos.',
    icon: '⚪',
    releaseDate: '13 de setembro de 2008',
    platform: 'Nintendo DS',
    generation: 4,
    gradient: ['#C0C0C0', '#E5E5E5'],
  },
  {
    id: 'heartgold-soulsilver',
    title: 'Pokémon HeartGold & SoulSilver',
    description: 'Remakes de Gold & Silver com gráficos da quarta geração e Pokémon que seguem o jogador.',
    icon: '💛',
    releaseDate: '12 de setembro de 2009',
    platform: 'Nintendo DS',
    generation: 4,
    gradient: ['#FFD700', '#FFE55C'],
  },
  {
    id: 'black-white',
    title: 'Pokémon Black & White',
    description: 'Quinta geração com 156 novos Pokémon, gráficos 3D e a região de Unova.',
    icon: '⚫',
    releaseDate: '18 de setembro de 2010',
    platform: 'Nintendo DS',
    generation: 5,
    gradient: ['#2F2F2F', '#4A4A4A'],
  },
  {
    id: 'black2-white2',
    title: 'Pokémon Black 2 & White 2',
    description: 'Sequência direta de Black & White com novas áreas, Pokémon e mecânicas.',
    icon: '⚪',
    releaseDate: '23 de junho de 2012',
    platform: 'Nintendo DS',
    generation: 5,
    gradient: ['#F5F5F5', '#E0E0E0'],
  },
  {
    id: 'x-y',
    title: 'Pokémon X & Y',
    description: 'Sexta geração com 72 novos Pokémon, gráficos 3D completos e a região de Kalos.',
    icon: '❌',
    releaseDate: '12 de outubro de 2013',
    platform: 'Nintendo 3DS',
    generation: 6,
    gradient: ['#FF69B4', '#FFB6C1'],
  },
  {
    id: 'omega-ruby-alpha-sapphire',
    title: 'Pokémon Omega Ruby & Alpha Sapphire',
    description: 'Remakes de Ruby & Sapphire com gráficos 3D, Mega Evolução e novos recursos.',
    icon: '💎',
    releaseDate: '28 de novembro de 2014',
    platform: 'Nintendo 3DS',
    generation: 6,
    gradient: ['#FF6B6B', '#FF8E8E'],
  },
  {
    id: 'sun-moon',
    title: 'Pokémon Sun & Moon',
    description: 'Sétima geração com 81 novos Pokémon, Z-Moves e a região de Alola.',
    icon: '☀️',
    releaseDate: '18 de novembro de 2016',
    platform: 'Nintendo 3DS',
    generation: 7,
    gradient: ['#FFD700', '#FFA500'],
  },
  {
    id: 'ultra-sun-ultra-moon',
    title: 'Pokémon Ultra Sun & Ultra Moon',
    description: 'Versões aprimoradas de Sun & Moon com novas formas de Pokémon e história expandida.',
    icon: '🌟',
    releaseDate: '17 de novembro de 2017',
    platform: 'Nintendo 3DS',
    generation: 7,
    gradient: ['#FFD700', '#FFA500'],
  },
  {
    id: 'lets-go-pikachu-eevee',
    title: 'Pokémon Let\'s Go, Pikachu! & Let\'s Go, Eevee!',
    description: 'Remakes de Yellow com mecânicas do Pokémon GO e gráficos modernos.',
    icon: '🎮',
    releaseDate: '16 de novembro de 2018',
    platform: 'Nintendo Switch',
    generation: 7,
    gradient: ['#FFD700', '#FFE55C'],
  },
  {
    id: 'sword-shield',
    title: 'Pokémon Sword & Shield',
    description: 'Oitava geração com 89 novos Pokémon, Dynamax e a região de Galar.',
    icon: '⚔️',
    releaseDate: '15 de novembro de 2019',
    platform: 'Nintendo Switch',
    generation: 8,
    gradient: ['#4A90E2', '#6BA3E8'],
  },
  {
    id: 'brilliant-diamond-shining-pearl',
    title: 'Pokémon Brilliant Diamond & Shining Pearl',
    description: 'Remakes de Diamond & Pearl com gráficos modernos e fidelidade aos originais.',
    icon: '💎',
    releaseDate: '19 de novembro de 2021',
    platform: 'Nintendo Switch',
    generation: 8,
    gradient: ['#9370DB', '#BA55D3'],
  },
  {
    id: 'legends-arceus',
    title: 'Pokémon Legends: Arceus',
    description: 'Jogo inovador com mecânicas de mundo aberto e foco na captura de Pokémon.',
    icon: '🏛️',
    releaseDate: '28 de janeiro de 2022',
    platform: 'Nintendo Switch',
    generation: 8,
    gradient: ['#8B4513', '#A0522D'],
  },
  {
    id: 'scarlet-violet',
    title: 'Pokémon Scarlet & Violet',
    description: 'Nona geração com 103 novos Pokémon, mundo aberto completo e a região de Paldea.',
    icon: '🟠',
    releaseDate: '18 de novembro de 2022',
    platform: 'Nintendo Switch',
    generation: 9,
    gradient: ['#FF4500', '#FF6347'],
  },
];

export const DynamicJourneyScreen: React.FC<DynamicJourneyScreenProps> = ({ navigation }) => {
  const [sideMenuVisible, setSideMenuVisible] = useState(false);

  const handleGamePress = (game: any) => {
    navigation.navigate('GameDetail', { gameId: game.id });
  };

  const renderGameCard = ({ item }: { item: any }) => {
    const DynamicGameCard = styled.TouchableOpacity`
      background-color: ${item.gradient[0]};
      border-radius: 20px;
      padding: 16px;
      margin: 4px;
      elevation: 8;
      shadow-color: ${item.gradient[0]};
      shadow-offset: 0px 4px;
      shadow-opacity: 0.3;
      shadow-radius: 8px;
      width: 48%;
      height: 130px;
      justify-content: space-between;
      align-items: center;
      position: relative;
      overflow: hidden;
    `;

    return (
      <DynamicGameCard 
        onPress={() => handleGamePress(item)}
        activeOpacity={0.8}
      >
        <CardBackground />
        <CardContent>
          <CardHeader>
            <CardIcon>{item.icon}</CardIcon>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
        </CardContent>
      </DynamicGameCard>
    );
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText>←</BackButtonText>
        </BackButton>
        <Title>Jornada Dinâmica</Title>
      </Header>

      <Content>
        <WelcomeText>
          Escolha um jogo para criar uma jornada Pokémon dinâmica!
        </WelcomeText>

        <FlatList
          data={pokemonGames}
          renderItem={renderGameCard}
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
