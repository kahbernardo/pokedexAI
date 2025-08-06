# Configuração da Imagem de Fundo

## ⏳ Aguardando Imagem PNG Real

O componente está configurado para usar uma imagem PNG como fundo, mas o arquivo está vazio. Para ativar a imagem de fundo, você precisa adicionar uma imagem PNG real.

## 📁 Como Adicionar a Imagem

1. **Crie a pasta** (se não existir):
   ```bash
   mkdir -p assets/backgrounds
   ```

2. **Adicione sua imagem PNG real**:
   - Arquivo: `assets/backgrounds/menu-background.png`
   - **IMPORTANTE**: Deve ser um arquivo PNG real, não vazio

3. **Dimensões recomendadas**:
   - 1080x1920 pixels (formato 9:16)
   - Formato PNG
   - Máximo 2MB

## 🎨 Características da Imagem

Baseada na descrição, sua imagem tem:
- **Céu gradiente**: Azul claro a rosa/lavanda
- **Montanhas**: Transição suave no horizonte
- **Campo verde**: Paisagem gramada
- **Criatura alada**: Pokémon lendário branco
- **Lago**: Água azul clara
- **Casa**: Construção com telhado vermelho

## 🎯 Para Ativar a Imagem

Após adicionar a imagem PNG real, substitua no arquivo `src/components/BackgroundImage.tsx`:

```tsx
// Fundo temporário
<BackgroundContainer
  style={{
    backgroundColor: '#87CEEB',
    width: '100%',
    height: '100%',
  }}
/>

// Por:
<ImageBackground
  source={require('../../assets/backgrounds/menu-background.png')}
  style={{
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  }}
  resizeMode="cover"
/>
```

## 📱 Status Atual

- ✅ App funcionando sem erros
- 🔵 Fundo temporário azul ativo
- ⏳ Aguardando imagem PNG real

## 🔧 Teste

Para testar, execute:
```bash
npx expo start --clear
```

O app deve funcionar com o fundo azul temporário!
