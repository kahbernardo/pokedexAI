import React, { useState } from 'react';
import {
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SideMenu } from '../components/SideMenu';

interface JourneyGeneratorScreenProps {
  navigation: any;
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  padding-vertical: 15px;
  background-color: ${(props: any) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
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
  padding: 20px;
`;

const WelcomeText = styled.Text`
  font-size: 18px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: ${(props: any) => props.theme.colors.text};
  text-align: center;
  margin-bottom: 30px;
  line-height: 24px;
`;

const GameCard = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.surface};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3.84px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
`;

const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const CardIcon = styled.Text`
  font-size: 32px;
  margin-right: 16px;
`;

const CardTitle = styled.Text`
  font-size: 20px;
  font-family: ${(props: any) => props.theme.fonts.ketchum};
  color: ${(props: any) => props.theme.colors.text};
  font-weight: bold;
  flex: 1;
`;

const CardDescription = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: ${(props: any) => props.theme.colors.textSecondary};
  line-height: 20px;
  margin-bottom: 12px;
`;

const CardFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ReleaseDate = styled.Text`
  font-size: 12px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: ${(props: any) => props.theme.colors.textSecondary};
  font-style: italic;
`;

const PlatformTag = styled.View`
  background-color: #4A90E2;
  padding-horizontal: 8px;
  padding-vertical: 4px;
  border-radius: 6px;
`;

const PlatformText = styled.Text`
  font-size: 10px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #FFFFFF;
  font-weight: bold;
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
  },
  {
    id: 'blue',
    title: 'Pokémon Blue',
    description: 'Versão melhorada dos jogos originais com gráficos aprimorados e correções de bugs.',
    icon: '🔵',
    releaseDate: '15 de outubro de 1996',
    platform: 'Game Boy',
    generation: 1,
  },
  {
    id: 'yellow',
    title: 'Pokémon Yellow',
    description: 'Versão especial baseada no anime, onde Pikachu segue o jogador e não pode evoluir.',
    icon: '⚡',
    releaseDate: '12 de setembro de 1998',
    platform: 'Game Boy',
    generation: 1,
  },
  {
    id: 'gold-silver',
    title: 'Pokémon Gold & Silver',
    description: 'Segunda geração introduzindo 100 novos Pokémon, sistema de dia/noite e duas regiões para explorar.',
    icon: '🥇',
    releaseDate: '21 de novembro de 1999',
    platform: 'Game Boy Color',
    generation: 2,
  },
  {
    id: 'crystal',
    title: 'Pokémon Crystal',
    description: 'Versão aprimorada de Gold & Silver com animações de Pokémon e a primeira protagonista feminina.',
    icon: '💎',
    releaseDate: '14 de dezembro de 2000',
    platform: 'Game Boy Color',
    generation: 2,
  },
  {
    id: 'ruby-sapphire',
    title: 'Pokémon Ruby & Sapphire',
    description: 'Terceira geração com 135 novos Pokémon, sistema de habilidades e a região de Hoenn.',
    icon: '💎',
    releaseDate: '21 de novembro de 2002',
    platform: 'Game Boy Advance',
    generation: 3,
  },
  {
    id: 'emerald',
    title: 'Pokémon Emerald',
    description: 'Versão definitiva de Ruby & Sapphire com a Batalha da Fronteira e gráficos aprimorados.',
    icon: '💚',
    releaseDate: '16 de setembro de 2004',
    platform: 'Game Boy Advance',
    generation: 3,
  },
  {
    id: 'firered-leafgreen',
    title: 'Pokémon FireRed & LeafGreen',
    description: 'Remakes dos jogos originais com gráficos da terceira geração e novos recursos.',
    icon: '🔥',
    releaseDate: '29 de janeiro de 2004',
    platform: 'Game Boy Advance',
    generation: 3,
  },
  {
    id: 'diamond-pearl',
    title: 'Pokémon Diamond & Pearl',
    description: 'Quarta geração com 107 novos Pokémon, sistema de combate físico/especial e a região de Sinnoh.',
    icon: '💎',
    releaseDate: '28 de setembro de 2006',
    platform: 'Nintendo DS',
    generation: 4,
  },
  {
    id: 'platinum',
    title: 'Pokémon Platinum',
    description: 'Versão aprimorada de Diamond & Pearl com a Distorção Mundial e novos recursos.',
    icon: '⚪',
    releaseDate: '13 de setembro de 2008',
    platform: 'Nintendo DS',
    generation: 4,
  },
  {
    id: 'heartgold-soulsilver',
    title: 'Pokémon HeartGold & SoulSilver',
    description: 'Remakes de Gold & Silver com gráficos da quarta geração e Pokémon que seguem o jogador.',
    icon: '💛',
    releaseDate: '12 de setembro de 2009',
    platform: 'Nintendo DS',
    generation: 4,
  },
  {
    id: 'black-white',
    title: 'Pokémon Black & White',
    description: 'Quinta geração com 156 novos Pokémon, gráficos 3D e a região de Unova.',
    icon: '⚫',
    releaseDate: '18 de setembro de 2010',
    platform: 'Nintendo DS',
    generation: 5,
  },
  {
    id: 'black2-white2',
    title: 'Pokémon Black 2 & White 2',
    description: 'Sequência direta de Black & White com novas áreas, Pokémon e mecânicas.',
    icon: '⚪',
    releaseDate: '23 de junho de 2012',
    platform: 'Nintendo DS',
    generation: 5,
  },
  {
    id: 'x-y',
    title: 'Pokémon X & Y',
    description: 'Sexta geração com 72 novos Pokémon, gráficos 3D completos e a região de Kalos.',
    icon: '❌',
    releaseDate: '12 de outubro de 2013',
    platform: 'Nintendo 3DS',
    generation: 6,
  },
  {
    id: 'omega-ruby-alpha-sapphire',
    title: 'Pokémon Omega Ruby & Alpha Sapphire',
    description: 'Remakes de Ruby & Sapphire com gráficos 3D, Mega Evolução e novos recursos.',
    icon: '💎',
    releaseDate: '28 de novembro de 2014',
    platform: 'Nintendo 3DS',
    generation: 6,
  },
  {
    id: 'sun-moon',
    title: 'Pokémon Sun & Moon',
    description: 'Sétima geração com 81 novos Pokémon, Z-Moves e a região de Alola.',
    icon: '☀️',
    releaseDate: '18 de novembro de 2016',
    platform: 'Nintendo 3DS',
    generation: 7,
  },
  {
    id: 'ultra-sun-ultra-moon',
    title: 'Pokémon Ultra Sun & Ultra Moon',
    description: 'Versões aprimoradas de Sun & Moon com novas formas de Pokémon e história expandida.',
    icon: '🌟',
    releaseDate: '17 de novembro de 2017',
    platform: 'Nintendo 3DS',
    generation: 7,
  },
  {
    id: 'lets-go-pikachu-eevee',
    title: 'Pokémon Let\'s Go, Pikachu! & Let\'s Go, Eevee!',
    description: 'Remakes de Yellow com mecânicas do Pokémon GO e gráficos modernos.',
    icon: '🎮',
    releaseDate: '16 de novembro de 2018',
    platform: 'Nintendo Switch',
    generation: 7,
  },
  {
    id: 'sword-shield',
    title: 'Pokémon Sword & Shield',
    description: 'Oitava geração com 89 novos Pokémon, Dynamax e a região de Galar.',
    icon: '⚔️',
    releaseDate: '15 de novembro de 2019',
    platform: 'Nintendo Switch',
    generation: 8,
  },
  {
    id: 'brilliant-diamond-shining-pearl',
    title: 'Pokémon Brilliant Diamond & Shining Pearl',
    description: 'Remakes de Diamond & Pearl com gráficos modernos e fidelidade aos originais.',
    icon: '💎',
    releaseDate: '19 de novembro de 2021',
    platform: 'Nintendo Switch',
    generation: 8,
  },
  {
    id: 'legends-arceus',
    title: 'Pokémon Legends: Arceus',
    description: 'Jogo inovador com mecânicas de mundo aberto e foco na captura de Pokémon.',
    icon: '🏛️',
    releaseDate: '28 de janeiro de 2022',
    platform: 'Nintendo Switch',
    generation: 8,
  },
  {
    id: 'scarlet-violet',
    title: 'Pokémon Scarlet & Violet',
    description: 'Nona geração com 103 novos Pokémon, mundo aberto completo e a região de Paldea.',
    icon: '🟠',
    releaseDate: '18 de novembro de 2022',
    platform: 'Nintendo Switch',
    generation: 9,
  },
];

export const JourneyGeneratorScreen: React.FC<JourneyGeneratorScreenProps> = ({ navigation }) => {
  const [sideMenuVisible, setSideMenuVisible] = useState(false);

  const handleGamePress = (game: any) => {
    // Aqui você pode adicionar lógica para gerar uma jornada baseada no jogo selecionado
    console.log('Jogo selecionado:', game.title);
  };

  const renderGameCard = ({ item }: { item: any }) => (
    <GameCard 
      onPress={() => handleGamePress(item)}
      activeOpacity={0.8}
    >
      <CardHeader>
        <CardIcon>{item.icon}</CardIcon>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      
      <CardDescription>{item.description}</CardDescription>
      
      <CardFooter>
        <ReleaseDate>{item.releaseDate}</ReleaseDate>
        <PlatformTag>
          <PlatformText>{item.platform}</PlatformText>
        </PlatformTag>
      </CardFooter>
    </GameCard>
  );

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
          Escolha um jogo para criar uma jornada Pokémon dinâmica!{'\n'}
          Cada jogo oferece uma experiência única com diferentes Pokémon e regiões.
        </WelcomeText>

        <FlatList
          data={pokemonGames}
          renderItem={renderGameCard}
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
