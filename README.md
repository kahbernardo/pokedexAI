# Pokédex AI - App React Native

Uma aplicação completa de Pokédex desenvolvida em React Native com Expo e TypeScript, que permite buscar e visualizar informações detalhadas sobre Pokémon.

## 🚀 Funcionalidades

### Tela Principal (Home)
- **Busca por texto**: Pesquisa Pokémon por nome
- **Filtros avançados**:
  - Por tipo (Normal, Fogo, Água, etc.)
  - Por geração (1ª, 2ª, 3ª, etc.)
  - Por localidade
  - Por golpes
- **Lista em grid**: Visualização em 2 colunas com cards coloridos por tipo
- **Pull to refresh**: Atualizar a lista
- **Interface responsiva**: Design moderno e intuitivo

### Tela de Detalhes
- **Informações completas** organizadas em abas:
  - **Sobre**: Espécie, altura, peso, habilidades, reprodução, habitat
  - **Status Base**: HP, Ataque, Defesa, Sp. Atk, Sp. Def, Velocidade
  - **Evolução**: Linha evolutiva (em desenvolvimento)
  - **Golpes**: Lista de movimentos aprendidos
- **Design inspirado**: Interface similar ao design de referência
- **Dados em português**: Nomes e descrições traduzidos

## 🛠️ Tecnologias Utilizadas

- **React Native** com **Expo**
- **TypeScript** para tipagem estática
- **React Navigation** para navegação
- **Styled Components** para estilização
- **Axios** para requisições HTTP
- **PokéAPI** como fonte de dados
- **React Native Reanimated** para animações

## 🎨 Sistema de Design

### Styled Components
O projeto utiliza **styled-components** para estilização, oferecendo:
- **Componentes estilizados**: CSS-in-JS com tipagem TypeScript
- **Tema centralizado**: Sistema de cores e espaçamentos consistente
- **Props dinâmicas**: Estilos baseados em props e estado
- **Reutilização**: Componentes estilizados reutilizáveis
- **Manutenibilidade**: Estilos co-localizados com componentes

### Tema
```typescript
// Cores principais
primary: '#4A90E2'
secondary: '#F5A623'
background: '#F8F9FA'

// Cores por tipo de Pokémon
types: {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  // ... 18 tipos disponíveis
}
```

## 📱 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── PokemonCard.tsx  # Card de Pokémon (styled-components)
│   └── FilterModal.tsx  # Modal de filtros (styled-components)
├── screens/             # Telas da aplicação
│   ├── HomeScreen.tsx   # Tela principal (styled-components)
│   └── PokemonDetailScreen.tsx # Tela de detalhes (styled-components)
├── services/            # Serviços e APIs
│   └── api.ts          # Cliente da PokéAPI
├── hooks/              # Hooks personalizados
│   └── usePokemon.ts   # Hooks para dados de Pokémon
├── types/              # Definições de tipos TypeScript
│   └── pokemon.ts      # Interfaces de Pokémon
├── utils/              # Funções utilitárias
│   └── helpers.ts      # Helpers para formatação
├── theme/              # Sistema de design
│   └── index.ts        # Tema centralizado
└── navigation/         # Configuração de navegação
    └── AppNavigator.tsx # Navegador principal
```

## 🎨 Design System

### Cores por Tipo de Pokémon
- **Normal**: #A8A878
- **Fogo**: #F08030
- **Água**: #6890F0
- **Elétrico**: #F8D030
- **Grama**: #78C850
- **Gelo**: #98D8D8
- **Lutador**: #C03028
- **Venenoso**: #A040A0
- **Terra**: #E0C068
- **Voador**: #A890F0
- **Psíquico**: #F85888
- **Inseto**: #A8B820
- **Pedra**: #B8A038
- **Fantasma**: #705898
- **Dragão**: #7038F8
- **Sombrio**: #705848
- **Metálico**: #B8B8D0
- **Fada**: #EE99AC

### Exemplo de Styled Component
```typescript
const Card = styled.TouchableOpacity<{ backgroundColor: string }>`
  width: ${cardWidth}px;
  height: 160px;
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 16px;
  background-color: ${props => props.backgroundColor};
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd pokedexAI
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto**
```bash
npm start
```

4. **Escaneie o QR Code** com o app Expo Go no seu dispositivo móvel

### Alternativas de execução
```bash
# Para Android
npm run android

# Para iOS
npm run ios

# Para Web
npm run web
```

## 📊 API Utilizada

O projeto utiliza a **PokéAPI** (https://pokeapi.co/), uma API RESTful gratuita que fornece:

- Dados completos de todos os Pokémon
- Informações de espécies, tipos, golpes
- Dados de gerações e localidades
- Suporte a múltiplos idiomas (incluindo português)
- Imagens oficiais dos Pokémon

## 🔧 Funcionalidades Técnicas

### Hooks Personalizados
- `usePokemonList`: Gerencia lista com paginação
- `usePokemon`: Busca dados completos de um Pokémon
- `usePokemonSearch`: Implementa busca por nome
- `usePokemonByType`: Filtra por tipo

### Styled Components
- **Componentes estilizados**: CSS-in-JS com tipagem
- **Props dinâmicas**: Estilos baseados em estado
- **Tema centralizado**: Sistema de design consistente
- **Reutilização**: Componentes estilizados compartilhados

### Utilitários
- Formatação de altura e peso
- Conversão de nomes para português
- Cálculo de estatísticas
- Geração de cores por tipo

### Navegação
- Stack Navigator para navegação entre telas
- Parâmetros tipados para passagem de dados
- Header customizado por tela

## 🎯 Próximas Funcionalidades

- [ ] Sistema de favoritos
- [ ] Comparador de Pokémon
- [ ] Linha evolutiva completa
- [ ] Efetividade de tipos
- [ ] Modo offline
- [ ] Temas claro/escuro
- [ ] Animações avançadas
- [ ] Sons e efeitos

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abrir um Pull Request

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através dos issues do GitHub.

---

Desenvolvido com ❤️ usando React Native, Expo e Styled Components 