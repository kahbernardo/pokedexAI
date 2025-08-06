import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SideMenu } from '../components/SideMenu';

interface GameDetailScreenProps {
  navigation: any;
  route: any;
}

const Container = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  padding-top: 60px;
  padding-bottom: 15px;
  background-color: ${(props: any) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
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

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const GameIcon = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

const IconText = styled.Text`
  font-size: 64px;
  margin-bottom: 16px;
`;

const GameTitle = styled.Text`
  font-size: 28px;
  font-family: ${(props: any) => props.theme.fonts.ketchum};
  color: ${(props: any) => props.theme.colors.text};
  text-align: center;
  font-weight: bold;
  margin-bottom: 8px;
`;

const GameSubtitle = styled.Text`
  font-size: 16px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: ${(props: any) => props.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 24px;
`;

const InfoCard = styled.View`
  background-color: ${(props: any) => props.theme.colors.surface};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3.84px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
`;

const InfoTitle = styled.Text`
  font-size: 18px;
  font-family: ${(props: any) => props.theme.fonts.ketchum};
  color: ${(props: any) => props.theme.colors.text};
  font-weight: bold;
  margin-bottom: 12px;
`;

const InfoText = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: ${(props: any) => props.theme.colors.textSecondary};
  line-height: 20px;
  margin-bottom: 8px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: ${(props: any) => props.theme.colors.textSecondary};
  font-weight: 600;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: ${(props: any) => props.theme.colors.text};
`;

const PlatformTag = styled.View`
  background-color: #4A90E2;
  padding-horizontal: 12px;
  padding-vertical: 6px;
  border-radius: 8px;
`;

const PlatformText = styled.Text`
  font-size: 12px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #FFFFFF;
  font-weight: bold;
`;

const GenerateButton = styled.TouchableOpacity`
  background-color: #4CAF50;
  border-radius: 16px;
  padding: 20px;
  margin-top: 20px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 6px;
  align-items: center;
`;

const GenerateButtonText = styled.Text`
  font-size: 18px;
  font-family: ${(props: any) => props.theme.fonts.ketchum};
  color: #FFFFFF;
  font-weight: bold;
`;

const GenerateButtonSubtext = styled.Text`
  font-size: 12px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #FFFFFF;
  opacity: 0.9;
  margin-top: 4px;
  text-align: center;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

// Dados dos jogos com informações completas
const pokemonGamesData = {
  'red-green': {
    id: 'red-green',
    title: 'Pokémon Red & Green',
    description: 'Os jogos originais que iniciaram a franquia. Explore a região de Kanto e capture os 151 Pokémon originais. Neste jogo, você inicia sua jornada como um treinador Pokémon, enfrentando o Team Rocket e se tornando o campeão da Liga Pokémon.',
    icon: '🔴',
    releaseDate: '27 de fevereiro de 1996',
    platform: 'Game Boy',
    generation: 1,
    pokemonRange: { start: 1, end: 151 },
    features: ['151 Pokémon originais', 'Região de Kanto', 'Sistema de evolução', 'Liga Pokémon', 'Team Rocket'],
    starters: ['Bulbasaur', 'Charmander', 'Squirtle']
  },
  'blue': {
    id: 'blue',
    title: 'Pokémon Blue',
    description: 'Versão melhorada dos jogos originais com gráficos aprimorados e correções de bugs. Oferece a mesma experiência dos jogos Red & Green, mas com melhorias técnicas e visuais.',
    icon: '🔵',
    releaseDate: '15 de outubro de 1996',
    platform: 'Game Boy',
    generation: 1,
    pokemonRange: { start: 1, end: 151 },
    features: ['151 Pokémon originais', 'Gráficos aprimorados', 'Correções de bugs', 'Região de Kanto'],
    starters: ['Bulbasaur', 'Charmander', 'Squirtle']
  },
  'yellow': {
    id: 'yellow',
    title: 'Pokémon Yellow',
    description: 'Versão especial baseada no anime, onde Pikachu segue o jogador e não pode evoluir. Esta versão traz elementos únicos como Pikachu como parceiro constante e referências ao anime.',
    icon: '⚡',
    releaseDate: '12 de setembro de 1998',
    platform: 'Game Boy',
    generation: 1,
    pokemonRange: { start: 1, end: 151 },
    features: ['Pikachu como parceiro', 'Baseado no anime', '151 Pokémon originais', 'Região de Kanto'],
    starters: ['Pikachu']
  },
  'gold-silver': {
    id: 'gold-silver',
    title: 'Pokémon Gold & Silver',
    description: 'Segunda geração introduzindo 100 novos Pokémon, sistema de dia/noite e duas regiões para explorar. Após completar a Liga de Johto, você pode explorar Kanto novamente.',
    icon: '🥇',
    releaseDate: '21 de novembro de 1999',
    platform: 'Game Boy Color',
    generation: 2,
    pokemonRange: { start: 1, end: 251 },
    features: ['100 novos Pokémon', 'Sistema dia/noite', 'Duas regiões', 'Pokémon que seguem', 'Sistema de reprodução'],
    starters: ['Chikorita', 'Cyndaquil', 'Totodile']
  },
  'crystal': {
    id: 'crystal',
    title: 'Pokémon Crystal',
    description: 'Versão aprimorada de Gold & Silver com animações de Pokémon e a primeira protagonista feminina. Inclui a Torre de Batalha e recursos únicos.',
    icon: '💎',
    releaseDate: '14 de dezembro de 2000',
    platform: 'Game Boy Color',
    generation: 2,
    pokemonRange: { start: 1, end: 251 },
    features: ['Animações de Pokémon', 'Protagonista feminina', 'Torre de Batalha', '100 novos Pokémon'],
    starters: ['Chikorita', 'Cyndaquil', 'Totodile']
  },
  'ruby-sapphire': {
    id: 'ruby-sapphire',
    title: 'Pokémon Ruby & Sapphire',
    description: 'Terceira geração com 135 novos Pokémon, sistema de habilidades e a região de Hoenn. Introduz conceitos como Pokémon Contests e Team Magma/Aqua.',
    icon: '💎',
    releaseDate: '21 de novembro de 2002',
    platform: 'Game Boy Advance',
    generation: 3,
    pokemonRange: { start: 1, end: 386 },
    features: ['135 novos Pokémon', 'Sistema de habilidades', 'Pokémon Contests', 'Team Magma/Aqua', 'Região de Hoenn'],
    starters: ['Treecko', 'Torchic', 'Mudkip']
  },
  'emerald': {
    id: 'emerald',
    title: 'Pokémon Emerald',
    description: 'Versão definitiva de Ruby & Sapphire com a Batalha da Fronteira e gráficos aprimorados. Combina elementos de ambos os jogos anteriores.',
    icon: '💚',
    releaseDate: '16 de setembro de 2004',
    platform: 'Game Boy Advance',
    generation: 3,
    pokemonRange: { start: 1, end: 386 },
    features: ['Batalha da Fronteira', 'Gráficos aprimorados', '135 novos Pokémon', 'Região de Hoenn'],
    starters: ['Treecko', 'Torchic', 'Mudkip']
  },
  'firered-leafgreen': {
    id: 'firered-leafgreen',
    title: 'Pokémon FireRed & LeafGreen',
    description: 'Remakes dos jogos originais com gráficos da terceira geração e novos recursos. Inclui a Ilha Sevii e melhorias significativas.',
    icon: '🔥',
    releaseDate: '29 de janeiro de 2004',
    platform: 'Game Boy Advance',
    generation: 3,
    pokemonRange: { start: 1, end: 386 },
    features: ['Remake dos originais', 'Ilha Sevii', 'Gráficos da 3ª geração', '151 Pokémon originais'],
    starters: ['Bulbasaur', 'Charmander', 'Squirtle']
  },
  'diamond-pearl': {
    id: 'diamond-pearl',
    title: 'Pokémon Diamond & Pearl',
    description: 'Quarta geração com 107 novos Pokémon, sistema de combate físico/especial e a região de Sinnoh. Introduz o sistema de evolução por localização.',
    icon: '💎',
    releaseDate: '28 de setembro de 2006',
    platform: 'Nintendo DS',
    generation: 4,
    pokemonRange: { start: 1, end: 493 },
    features: ['107 novos Pokémon', 'Combate físico/especial', 'Evolução por localização', 'Região de Sinnoh'],
    starters: ['Turtwig', 'Chimchar', 'Piplup']
  },
  'platinum': {
    id: 'platinum',
    title: 'Pokémon Platinum',
    description: 'Versão aprimorada de Diamond & Pearl com a Distorção Mundial e novos recursos. Inclui Giratina e melhorias na história.',
    icon: '⚪',
    releaseDate: '13 de setembro de 2008',
    platform: 'Nintendo DS',
    generation: 4,
    pokemonRange: { start: 1, end: 493 },
    features: ['Distorção Mundial', 'Giratina', '107 novos Pokémon', 'Região de Sinnoh'],
    starters: ['Turtwig', 'Chimchar', 'Piplup']
  },
  'heartgold-soulsilver': {
    id: 'heartgold-soulsilver',
    title: 'Pokémon HeartGold & SoulSilver',
    description: 'Remakes de Gold & Silver com gráficos da quarta geração e Pokémon que seguem o jogador. Inclui o Pokéwalker e melhorias visuais.',
    icon: '💛',
    releaseDate: '12 de setembro de 2009',
    platform: 'Nintendo DS',
    generation: 4,
    pokemonRange: { start: 1, end: 493 },
    features: ['Pokémon que seguem', 'Pokéwalker', '100 novos Pokémon', 'Duas regiões'],
    starters: ['Chikorita', 'Cyndaquil', 'Totodile']
  },
  'black-white': {
    id: 'black-white',
    title: 'Pokémon Black & White',
    description: 'Quinta geração com 156 novos Pokémon, gráficos 3D e a região de Unova. Foca apenas em Pokémon da nova geração até o final da história principal.',
    icon: '⚫',
    releaseDate: '18 de setembro de 2010',
    platform: 'Nintendo DS',
    generation: 5,
    pokemonRange: { start: 494, end: 649 },
    features: ['156 novos Pokémon', 'Gráficos 3D', 'Região de Unova', 'Sistema de estações'],
    starters: ['Snivy', 'Tepig', 'Oshawott']
  },
  'black2-white2': {
    id: 'black2-white2',
    title: 'Pokémon Black 2 & White 2',
    description: 'Sequência direta de Black & White com novas áreas, Pokémon e mecânicas. Inclui Pokémon de gerações anteriores e novas funcionalidades.',
    icon: '⚪',
    releaseDate: '23 de junho de 2012',
    platform: 'Nintendo DS',
    generation: 5,
    pokemonRange: { start: 1, end: 649 },
    features: ['Sequência direta', 'Novas áreas', 'Pokémon de outras gerações', 'Região de Unova'],
    starters: ['Snivy', 'Tepig', 'Oshawott']
  },
  'x-y': {
    id: 'x-y',
    title: 'Pokémon X & Y',
    description: 'Sexta geração com 72 novos Pokémon, gráficos 3D completos e a região de Kalos. Introduz Mega Evolução e personalização do personagem.',
    icon: '❌',
    releaseDate: '12 de outubro de 2013',
    platform: 'Nintendo 3DS',
    generation: 6,
    pokemonRange: { start: 1, end: 721 },
    features: ['72 novos Pokémon', 'Gráficos 3D completos', 'Mega Evolução', 'Personalização', 'Região de Kalos'],
    starters: ['Chespin', 'Fennekin', 'Froakie']
  },
  'omega-ruby-alpha-sapphire': {
    id: 'omega-ruby-alpha-sapphire',
    title: 'Pokémon Omega Ruby & Alpha Sapphire',
    description: 'Remakes de Ruby & Sapphire com gráficos 3D, Mega Evolução e novos recursos. Inclui Delta Episode e melhorias significativas.',
    icon: '💎',
    releaseDate: '28 de novembro de 2014',
    platform: 'Nintendo 3DS',
    generation: 6,
    pokemonRange: { start: 1, end: 721 },
    features: ['Remake 3D', 'Mega Evolução', 'Delta Episode', '135 novos Pokémon', 'Região de Hoenn'],
    starters: ['Treecko', 'Torchic', 'Mudkip']
  },
  'sun-moon': {
    id: 'sun-moon',
    title: 'Pokémon Sun & Moon',
    description: 'Sétima geração com 81 novos Pokémon, Z-Moves e a região de Alola. Remove Gyms e introduz Trial Captains e Kahunas.',
    icon: '☀️',
    releaseDate: '18 de novembro de 2016',
    platform: 'Nintendo 3DS',
    generation: 7,
    pokemonRange: { start: 1, end: 802 },
    features: ['81 novos Pokémon', 'Z-Moves', 'Trial Captains', 'Região de Alola', 'Sem Gyms'],
    starters: ['Rowlet', 'Litten', 'Popplio']
  },
  'ultra-sun-ultra-moon': {
    id: 'ultra-sun-ultra-moon',
    title: 'Pokémon Ultra Sun & Ultra Moon',
    description: 'Versões aprimoradas de Sun & Moon com novas formas de Pokémon e história expandida. Inclui Ultra Necrozma e novas áreas.',
    icon: '🌟',
    releaseDate: '17 de novembro de 2017',
    platform: 'Nintendo 3DS',
    generation: 7,
    pokemonRange: { start: 1, end: 807 },
    features: ['História expandida', 'Ultra Necrozma', 'Novas áreas', '81 novos Pokémon'],
    starters: ['Rowlet', 'Litten', 'Popplio']
  },
  'lets-go-pikachu-eevee': {
    id: 'lets-go-pikachu-eevee',
    title: 'Pokémon Let\'s Go, Pikachu! & Let\'s Go, Eevee!',
    description: 'Remakes de Yellow com mecânicas do Pokémon GO e gráficos modernos. Simplifica o sistema de captura e inclui Pokémon que seguem.',
    icon: '🎮',
    releaseDate: '16 de novembro de 2018',
    platform: 'Nintendo Switch',
    generation: 7,
    pokemonRange: { start: 1, end: 151 },
    features: ['Mecânicas do Pokémon GO', 'Gráficos modernos', '151 Pokémon originais', 'Pokémon que seguem'],
    starters: ['Pikachu', 'Eevee']
  },
  'sword-shield': {
    id: 'sword-shield',
    title: 'Pokémon Sword & Shield',
    description: 'Oitava geração com 89 novos Pokémon, Dynamax e a região de Galar. Introduz Wild Area e sistema de raids.',
    icon: '⚔️',
    releaseDate: '15 de novembro de 2019',
    platform: 'Nintendo Switch',
    generation: 8,
    pokemonRange: { start: 1, end: 898 },
    features: ['89 novos Pokémon', 'Dynamax', 'Wild Area', 'Raids', 'Região de Galar'],
    starters: ['Grookey', 'Scorbunny', 'Sobble']
  },
  'brilliant-diamond-shining-pearl': {
    id: 'brilliant-diamond-shining-pearl',
    title: 'Pokémon Brilliant Diamond & Shining Pearl',
    description: 'Remakes de Diamond & Pearl com gráficos modernos e fidelidade aos originais. Mantém a essência dos jogos originais.',
    icon: '💎',
    releaseDate: '19 de novembro de 2021',
    platform: 'Nintendo Switch',
    generation: 8,
    pokemonRange: { start: 1, end: 493 },
    features: ['Remake fiel', 'Gráficos modernos', '107 novos Pokémon', 'Região de Sinnoh'],
    starters: ['Turtwig', 'Chimchar', 'Piplup']
  },
  'legends-arceus': {
    id: 'legends-arceus',
    title: 'Pokémon Legends: Arceus',
    description: 'Jogo inovador com mecânicas de mundo aberto e foco na captura de Pokémon. Ambientado no passado de Sinnoh.',
    icon: '🏛️',
    releaseDate: '28 de janeiro de 2022',
    platform: 'Nintendo Switch',
    generation: 8,
    pokemonRange: { start: 1, end: 242 },
    features: ['Mundo aberto', 'Captura em tempo real', 'Passado de Sinnoh', 'Hisuian Forms'],
    starters: ['Rowlet', 'Cyndaquil', 'Oshawott']
  },
  'scarlet-violet': {
    id: 'scarlet-violet',
    title: 'Pokémon Scarlet & Violet',
    description: 'Nona geração com 103 novos Pokémon, mundo aberto completo e a região de Paldea. Primeiro jogo verdadeiramente open-world.',
    icon: '🟠',
    releaseDate: '18 de novembro de 2022',
    platform: 'Nintendo Switch',
    generation: 9,
    pokemonRange: { start: 1, end: 1008 },
    features: ['103 novos Pokémon', 'Mundo aberto completo', 'Terastalização', 'Região de Paldea'],
    starters: ['Sprigatito', 'Fuecoco', 'Quaxly']
  }
};

export const GameDetailScreen: React.FC<GameDetailScreenProps> = ({ navigation, route }) => {
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { gameId } = route.params;
  const game = pokemonGamesData[gameId];

  const handleGenerateTeam = async () => {
    if (!game) return;
    
    setIsGenerating(true);
    
    try {
      // Simular geração de equipe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navegar para a tela de equipe gerada
      navigation.navigate('GeneratedTeam', {
        gameId: game.id,
        gameTitle: game.title,
        pokemonRange: game.pokemonRange,
        generation: game.generation
      });
    } catch (error) {
      console.error('Erro ao gerar equipe:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!game) {
    return (
      <Container>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <BackButtonText>←</BackButtonText>
          </BackButton>
          <Title>Jogo não encontrado</Title>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText>←</BackButtonText>
        </BackButton>
        <Title>Detalhes do Jogo</Title>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <GameIcon>
          <IconText>{game.icon}</IconText>
          <GameTitle>{game.title}</GameTitle>
          <GameSubtitle>{game.platform} • {game.releaseDate}</GameSubtitle>
        </GameIcon>

        <InfoCard>
          <InfoTitle>Descrição</InfoTitle>
          <InfoText>{game.description}</InfoText>
        </InfoCard>

        <InfoCard>
          <InfoTitle>Informações do Jogo</InfoTitle>
          <InfoRow>
            <InfoLabel>Geração:</InfoLabel>
            <InfoValue>{game.generation}ª Geração</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Plataforma:</InfoLabel>
            <PlatformTag>
              <PlatformText>{game.platform}</PlatformText>
            </PlatformTag>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Data de Lançamento:</InfoLabel>
            <InfoValue>{game.releaseDate}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Pokémon Disponíveis:</InfoLabel>
            <InfoValue>{game.pokemonRange.start}-{game.pokemonRange.end}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Starters:</InfoLabel>
            <InfoValue>{game.starters.join(', ')}</InfoValue>
          </InfoRow>
        </InfoCard>

        <InfoCard>
          <InfoTitle>Características Principais</InfoTitle>
          {game.features.map((feature, index) => (
            <InfoText key={index}>• {feature}</InfoText>
          ))}
        </InfoCard>

        <GenerateButton 
          onPress={handleGenerateTeam}
          disabled={isGenerating}
          activeOpacity={0.8}
        >
          {isGenerating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <GenerateButtonText>Gerar Equipe Dinâmica</GenerateButtonText>
              <GenerateButtonSubtext>
                6 Pokémon aleatórios disponíveis neste jogo
              </GenerateButtonSubtext>
            </>
          )}
        </GenerateButton>
      </Content>

      <SideMenu
        visible={sideMenuVisible}
        onClose={() => setSideMenuVisible(false)}
      />
    </Container>
  );
};
