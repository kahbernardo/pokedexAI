import { Pokemon, PokemonSpecies } from '../types/pokemon';

export const formatHeight = (height: number): string => {
  const meters = height / 10;
  const feet = meters * 3.28084;
  const inches = (feet % 1) * 12;
  const feetInt = Math.floor(feet);
  const inchesInt = Math.floor(inches);
  
  return `${feetInt}'${inchesInt}" (${meters.toFixed(1)}m)`;
};

export const formatWeight = (weight: number): string => {
  const kg = weight / 10;
  const lbs = kg * 2.20462;
  
  return `${lbs.toFixed(1)} lbs (${kg.toFixed(1)} kg)`;
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getPokemonNameInPortuguese = (species: PokemonSpecies): string => {
  const portugueseName = species.names.find(
    name => name.language.name === 'pt-BR'
  );
  return portugueseName ? portugueseName.name : capitalize(species.name);
};

export const getPokemonDescriptionInPortuguese = (species: PokemonSpecies): string => {
  const portugueseDescription = species.flavor_text_entries.find(
    entry => entry.language.name === 'pt-BR'
  );
  return portugueseDescription ? portugueseDescription.flavor_text : '';
};

export const calculateTotalStats = (pokemon: Pokemon): number => {
  return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
};

export const getTypeColor = (typeName: string): string => {
  const TYPE_COLORS: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  
  return TYPE_COLORS[typeName] || '#A8A878';
};

export const formatPokedexNumber = (id: number): string => {
  return `#${id.toString().padStart(3, '0')}`;
};

export const getGenderRate = (genderRate: number): { male: number; female: number } => {
  if (genderRate === -1) {
    return { male: 0, female: 0 };
  }
  
  const femalePercentage = (genderRate / 8) * 100;
  const malePercentage = 100 - femalePercentage;
  
  return {
    male: malePercentage,
    female: femalePercentage,
  };
};

export const getEggGroupsInPortuguese = (eggGroups: any[]): string[] => {
  const eggGroupTranslations: { [key: string]: string } = {
    monster: 'Monstro',
    water1: 'Água 1',
    bug: 'Inseto',
    flying: 'Voador',
    ground: 'Terra',
    fairy: 'Fada',
    plant: 'Planta',
    humanshape: 'Forma Humana',
    water3: 'Água 3',
    mineral: 'Mineral',
    amorphous: 'Amorfo',
    water2: 'Água 2',
    ditto: 'Ditto',
    dragon: 'Dragão',
    no_eggs: 'Sem Ovos',
  };
  
  return eggGroups.map(group => 
    eggGroupTranslations[group.name] || capitalize(group.name)
  );
};

export const getHabitatInPortuguese = (habitat: any): string => {
  const habitatTranslations: { [key: string]: string } = {
    cave: 'Caverna',
    forest: 'Floresta',
    grassland: 'Pradaria',
    mountain: 'Montanha',
    rare: 'Raro',
    rough_terrain: 'Terreno Áspero',
    sea: 'Mar',
    urban: 'Urbano',
    waters_edge: 'Beira da Água',
  };
  
  return habitat ? (habitatTranslations[habitat.name] || capitalize(habitat.name)) : 'Desconhecido';
};

export const getGrowthRateInPortuguese = (growthRate: any): string => {
  const growthRateTranslations: { [key: string]: string } = {
    slow: 'Lento',
    medium: 'Médio',
    fast: 'Rápido',
    medium_slow: 'Médio-Lento',
    slow_then_very_fast: 'Lento Depois Muito Rápido',
    fast_then_very_slow: 'Rápido Depois Muito Lento',
  };
  
  return growthRateTranslations[growthRate.name] || capitalize(growthRate.name);
}; 