import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePokemon } from '../hooks/usePokemon';
import { 
  getTypeColor, 
  capitalize, 
  getPokemonDescriptionInPortuguese,
  formatPokedexNumber,
  getPokemonNameInPortuguese
} from '../utils/helpers';

interface PokemonDetailScreenProps {
  route: { params: { pokemonId: number } };
  navigation: any;
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #F8F9FA;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-bottom-color: #E5E5E5;
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 16px;
`;

const BackButtonText = styled.Text`
  font-size: 18px;
  color: #4A90E2;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-family: ${(props: any) => props.theme.fonts.ketchum};
  color: #FFD700;
  flex: 1;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.Text`
  margin-top: 10px;
  font-size: 16px;
  color: #9B9B9B;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const PokemonImage = styled.Image`
  width: 200px;
  height: 200px;
  align-self: center;
  margin-bottom: 20px;
`;

const PokemonName = styled.Text`
  font-size: 28px;
  font-family: ${(props: any) => props.theme.fonts.ketchum};
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 8px;
`;

const PokemonNumber = styled.Text`
  font-size: 16px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 16px;
`;

const TypeContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 20px;
`;

const TypeTag = styled.View<{ backgroundColor: string }>`
  background-color: ${props => props.backgroundColor};
  padding: 8px 16px;
  border-radius: 20px;
  margin-horizontal: 4px;
`;

const TypeText = styled.Text`
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
`;

const Section = styled.View`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3.84px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-family: ${(props: any) => props.theme.fonts.ketchum};
  color: #FFD700;
  margin-bottom: 12px;
  text-align: center;
`;

const SectionDescription = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #666666;
  margin-bottom: 16px;
  text-align: center;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #333333;
  font-weight: 600;
  text-align: left;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #666666;
  text-align: right;
`;

const DescriptionText = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #333333;
  line-height: 20px;
  text-align: left;
`;

const StatsContainer = styled.View`
  margin-top: 12px;
`;

const StatRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const StatLabel = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #333333;
  width: 80px;
  text-align: left;
`;

const StatBar = styled.View`
  flex: 1;
  height: 8px;
  background-color: #E5E5E5;
  border-radius: 4px;
  margin-horizontal: 12px;
  overflow: hidden;
`;

const StatFill = styled.View<{ width: number; color: string }>`
  width: ${props => props.width}%;
  height: 100%;
  background-color: ${props => props.color};
  border-radius: 4px;
`;

const StatValue = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #666666;
  width: 40px;
  text-align: right;
`;

const MovesContainer = styled.View`
  margin-top: 12px;
`;

const MoveItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom-width: 1px;
  border-bottom-color: #F0F0F0;
`;

const MoveName = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #333333;
  flex: 1;
  text-align: left;
`;

const MoveLevel = styled.Text`
  font-size: 12px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #666666;
  text-align: right;
`;

const GenderContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 8px;
`;

const GenderText = styled.Text`
  font-size: 14px;
  font-family: ${(props: any) => props.theme.fonts.pokemonClassic};
  color: #666666;
  margin-left: 8px;
`;

export const PokemonDetailScreen: React.FC<PokemonDetailScreenProps> = ({ route, navigation }) => {
  const { pokemonId } = route.params;
  const { pokemon, species, loading, error } = usePokemon(pokemonId);

  if (loading) {
    return (
      <Container>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <BackButtonText>← Voltar</BackButtonText>
          </BackButton>
          <HeaderTitle>Carregando...</HeaderTitle>
        </Header>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#4A90E2" />
          <LoadingText>Carregando Pokémon...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (error || !pokemon) {
    return (
      <Container>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <BackButtonText>← Voltar</BackButtonText>
          </BackButton>
          <HeaderTitle>Erro</HeaderTitle>
        </Header>
        <LoadingContainer>
          <LoadingText>Erro ao carregar Pokémon</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const backgroundColor = getTypeColor(primaryType);
  const pokemonName = species ? getPokemonNameInPortuguese(species) : capitalize(pokemon.name);
  const description = species ? getPokemonDescriptionInPortuguese(species) : '';

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText>← Voltar</BackButtonText>
        </BackButton>
        <HeaderTitle>Detalhes</HeaderTitle>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <Section style={{ backgroundColor }}>
          <PokemonImage
            source={{ uri: pokemon.sprites.other['official-artwork'].front_default }}
            resizeMode="contain"
          />
          <PokemonName>{pokemonName}</PokemonName>
          <PokemonNumber>{formatPokedexNumber(pokemon.id)}</PokemonNumber>
          
          <TypeContainer>
            {pokemon.types.map((type, index) => (
              <TypeTag key={index} backgroundColor={getTypeColor(type.type.name)}>
                <TypeText>{capitalize(type.type.name)}</TypeText>
              </TypeTag>
            ))}
          </TypeContainer>
        </Section>

        <Section>
          <SectionTitle>Informações Básicas</SectionTitle>
          <SectionDescription>Dados gerais do Pokémon</SectionDescription>
          
          <InfoRow>
            <InfoLabel>Altura:</InfoLabel>
            <InfoValue>{pokemon.height / 10}m</InfoValue>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>Peso:</InfoLabel>
            <InfoValue>{pokemon.weight / 10}kg</InfoValue>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>Experiência:</InfoLabel>
            <InfoValue>{pokemon.base_experience}</InfoValue>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>Habilidades:</InfoLabel>
            <InfoValue>{pokemon.abilities.length}</InfoValue>
          </InfoRow>

          {species && (
            <GenderContainer>
              <GenderText>
                {species.gender_rate === -1 ? 'Sem gênero' : 
                 species.gender_rate === 0 ? '100% Masculino' :
                 species.gender_rate === 8 ? '100% Feminino' :
                 `${Math.round((1 - species.gender_rate / 8) * 100)}% Masculino, ${Math.round((species.gender_rate / 8) * 100)}% Feminino`}
              </GenderText>
            </GenderContainer>
          )}
        </Section>

        {description && (
          <Section>
            <SectionTitle>Descrição</SectionTitle>
            <SectionDescription>Informações sobre o Pokémon</SectionDescription>
            
            <DescriptionText>{description}</DescriptionText>
          </Section>
        )}

        <Section>
          <SectionTitle>Estatísticas</SectionTitle>
          <SectionDescription>Atributos base do Pokémon</SectionDescription>
          
          <StatsContainer>
            {pokemon.stats.map((stat, index) => (
              <StatRow key={index}>
                <StatLabel>{capitalize(stat.stat.name)}:</StatLabel>
                <StatBar>
                  <StatFill 
                    width={(stat.base_stat / 255) * 100} 
                    color={getTypeColor(primaryType)}
                  />
                </StatBar>
                <StatValue>{stat.base_stat}</StatValue>
              </StatRow>
            ))}
          </StatsContainer>
        </Section>

        <Section>
          <SectionTitle>Golpes</SectionTitle>
          <SectionDescription>Movimentos que o Pokémon pode aprender</SectionDescription>
          
          <MovesContainer>
            {pokemon.moves.slice(0, 10).map((move, index) => (
              <MoveItem key={index}>
                <MoveName>{capitalize(move.move.name.replace('-', ' '))}</MoveName>
                <MoveLevel>Nível {move.version_group_details[0]?.level_learned_at || '?'}</MoveLevel>
              </MoveItem>
            ))}
          </MovesContainer>
        </Section>
      </Content>
    </Container>
  );
}; 