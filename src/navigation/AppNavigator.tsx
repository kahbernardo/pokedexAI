import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { PokedexScreen } from '../screens/PokedexScreen';
import { PokemonDetailScreen } from '../screens/PokemonDetailScreen';
import { DynamicJourneyScreen } from '../screens/DynamicJourneyScreen';
import { GameDetailScreen } from '../screens/GameDetailScreen';
import { FavoriteTypeScreen } from '../screens/FavoriteTypeScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Pokedex" component={PokedexScreen} />
      <Stack.Screen name="PokemonDetail" component={PokemonDetailScreen} />
      <Stack.Screen name="DynamicJourney" component={DynamicJourneyScreen} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} />
      <Stack.Screen name="FavoriteType" component={FavoriteTypeScreen} />
    </Stack.Navigator>
  );
}; 