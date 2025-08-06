# Migração para Styled Components

## 📋 Resumo da Migração

Este projeto foi migrado de **StyleSheet** para **Styled Components**, oferecendo uma abordagem mais moderna e flexível para estilização em React Native.

## 🔄 O que Mudou

### Antes (StyleSheet)
```typescript
const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: 160,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    backgroundColor: COLORS.primary,
  },
});

// Uso
<View style={styles.card}>
```

### Depois (Styled Components)
```typescript
const Card = styled.TouchableOpacity<{ backgroundColor: string }>`
  width: ${cardWidth}px;
  height: 160px;
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 16px;
  background-color: ${props => props.backgroundColor};
`;

// Uso
<Card backgroundColor={getTypeColor(primaryType)}>
```

## ✅ Benefícios da Migração

### 1. **Props Dinâmicas**
```typescript
// Estilos baseados em props
const Tab = styled.TouchableOpacity<{ active: boolean }>`
  border-bottom-width: ${props => props.active ? '2px' : '0px'};
  border-bottom-color: #4A90E2;
`;

const TabText = styled.Text<{ active: boolean }>`
  color: ${props => props.active ? '#4A90E2' : '#9B9B9B'};
`;
```

### 2. **Tema Centralizado**
```typescript
// Acesso ao tema via props
const Container = styled.View`
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.md}px;
`;
```

### 3. **Tipagem TypeScript**
```typescript
// Tipagem forte para props
interface StyledProps {
  backgroundColor: string;
  active?: boolean;
}

const StyledComponent = styled.View<StyledProps>`
  background-color: ${props => props.backgroundColor};
`;
```

### 4. **Reutilização**
```typescript
// Componentes estilizados reutilizáveis
const Button = styled.TouchableOpacity`
  padding: 12px 24px;
  border-radius: 8px;
  background-color: #4A90E2;
`;

// Uso em diferentes contextos
<Button onPress={handlePress}>
  <ButtonText>Confirmar</ButtonText>
</Button>
```

## 🎨 Sistema de Tema

### Estrutura do Tema
```typescript
export const theme = {
  colors: {
    primary: '#4A90E2',
    secondary: '#F5A623',
    background: '#F8F9FA',
    // ... outras cores
    types: {
      normal: '#A8A878',
      fire: '#F08030',
      // ... 18 tipos
    },
  },
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 20, xl: 24, xxl: 32,
  },
  borderRadius: {
    sm: 4, md: 8, lg: 12, xl: 16, xxl: 20,
  },
  typography: {
    sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18, xxl: 20, xxxl: 24 },
    weights: { normal: '400', medium: '500', semibold: '600', bold: '700' },
  },
  shadows: {
    small: { /* ... */ },
    medium: { /* ... */ },
    large: { /* ... */ },
  },
};
```

### Configuração do ThemeProvider
```typescript
// App.tsx
import { ThemeProvider } from 'styled-components/native';
import { theme } from './src/theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* resto da aplicação */}
    </ThemeProvider>
  );
}
```

## 📁 Arquivos Migrados

### Componentes
- ✅ `src/components/PokemonCard.tsx`
- ✅ `src/components/FilterModal.tsx`

### Telas
- ✅ `src/screens/HomeScreen.tsx`
- ✅ `src/screens/PokemonDetailScreen.tsx`

### Sistema de Design
- ✅ `src/theme/index.ts` (novo)
- ✅ `App.tsx` (ThemeProvider adicionado)

## 🛠️ Padrões de Uso

### 1. **Componentes com Props Dinâmicas**
```typescript
const StatBar = styled.View<{ width: string }>`
  height: 100%;
  background-color: #4A90E2;
  border-radius: 4px;
  width: ${props => props.width};
`;

// Uso
<StatBar width={`${(stat.base_stat / 255) * 100}%`} />
```

### 2. **Estados Condicionais**
```typescript
const Tab = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding-vertical: 15px;
  align-items: center;
  border-bottom-width: ${props => props.active ? '2px' : '0px'};
  border-bottom-color: #4A90E2;
`;
```

### 3. **Composição de Componentes**
```typescript
const Header = styled.View<{ backgroundColor: string }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  padding-vertical: 15px;
  background-color: ${props => props.backgroundColor};
`;

const HeaderInfo = styled.View`
  flex: 1;
  align-items: center;
`;
```

### 4. **Acesso ao Tema**
```typescript
const Container = styled.View`
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.md}px;
`;
```

## 🔧 Melhorias Implementadas

### 1. **Responsividade**
```typescript
const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const Card = styled.TouchableOpacity`
  width: ${cardWidth}px;
  height: 160px;
`;
```

### 2. **Sombras Consistentes**
```typescript
const Card = styled.TouchableOpacity`
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;
```

### 3. **Tipografia Consistente**
```typescript
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #000000;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: #9B9B9B;
`;
```

## 🚀 Próximos Passos

### Melhorias Planejadas
- [ ] **Tema Escuro**: Implementar modo escuro
- [ ] **Animações**: Adicionar transições suaves
- [ ] **Responsividade**: Melhorar adaptação a diferentes telas
- [ ] **Acessibilidade**: Adicionar suporte a screen readers
- [ ] **Performance**: Otimizar re-renders

### Exemplos de Uso Futuro
```typescript
// Tema escuro
const DarkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: '#1A1A1A',
    text: '#FFFFFF',
  },
};

// Animações
const AnimatedCard = styled(Animated.View)`
  transform: scale(${props => props.scale});
`;

// Responsividade
const ResponsiveContainer = styled.View`
  padding: ${props => props.theme.spacing.md}px;
  
  @media (min-width: 768px) {
    padding: ${props => props.theme.spacing.lg}px;
  }
`;
```

## 📚 Recursos Adicionais

- [Styled Components Documentation](https://styled-components.com/docs)
- [React Native Styled Components](https://styled-components.com/docs/basics#react-native)
- [TypeScript with Styled Components](https://styled-components.com/docs/api#typescript)

---

A migração para styled-components oferece uma base sólida para futuras melhorias e mantém o código mais limpo e manutenível! 🎨✨ 