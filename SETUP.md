# Configuração do Projeto Pokédex AI

## ⚠️ Problema de Compatibilidade

Este projeto foi desenvolvido com as versões mais recentes das dependências, que requerem **Node.js versão 18 ou superior**. 

### Erro Atual
Se você está vendo erros como:
```
ReferenceError: ReadableStream is not defined
ReferenceError: fetch is not defined
```

Isso indica que você está usando uma versão antiga do Node.js.

## 🔧 Soluções

### Opção 1: Atualizar Node.js (Recomendado)

1. **Instalar Node Version Manager (nvm)**
```bash
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Windows
# Baixe o nvm-windows do GitHub
```

2. **Instalar Node.js 18+**
```bash
nvm install 18
nvm use 18
```

3. **Verificar a versão**
```bash
node --version
# Deve mostrar v18.x.x ou superior
```

4. **Reinstalar dependências**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Opção 2: Usar versões compatíveis (Alternativa)

Se não puder atualizar o Node.js, você pode usar versões mais antigas das dependências:

1. **Editar package.json**
```json
{
  "dependencies": {
    "expo": "~49.0.0",
    "react-native": "0.72.6",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "axios": "^1.5.0"
  }
}
```

2. **Reinstalar dependências**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Executando o Projeto

Após resolver a compatibilidade:

```bash
# Iniciar o projeto
npm start

# Ou usar comandos específicos
npm run android  # Para Android
npm run ios      # Para iOS
npm run web      # Para Web
```

## 📱 Testando no Dispositivo

1. **Instalar Expo Go** no seu dispositivo móvel
2. **Escanear o QR Code** que aparece no terminal
3. **Aguardar** o carregamento do app

## 🔍 Verificando se está funcionando

O app deve mostrar:
- Tela inicial com lista de Pokémon
- Campo de busca funcionando
- Botão de filtros
- Cards coloridos por tipo de Pokémon
- Navegação para detalhes ao tocar em um Pokémon

## 🆘 Se ainda houver problemas

1. **Limpar cache do Expo**
```bash
npx expo start --clear
```

2. **Verificar logs**
```bash
npx expo doctor
```

3. **Reiniciar o Metro bundler**
```bash
npx expo start --reset-cache
```

## 📞 Suporte

Se continuar com problemas, verifique:
- Versão do Node.js (`node --version`)
- Versão do npm (`npm --version`)
- Logs de erro completos
- Configuração do ambiente de desenvolvimento 