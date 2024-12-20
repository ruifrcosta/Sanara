# Sanara Mobile Application

Aplicação mobile da plataforma Sanara, construída com React Native.

## Tecnologias

- React Native
- TypeScript
- React Navigation
- Zustand

## Requisitos

- Node.js 18+
- npm ou yarn
- iOS: XCode 14+
- Android: Android Studio e SDK

## Instalação

```bash
# Instalar dependências
npm install

# iOS: Instalar pods
cd ios && pod install && cd ..

# Iniciar Metro Bundler
npm start

# Executar no iOS
npm run ios

# Executar no Android
npm run android
```

## Estrutura do Projeto

```
src/
├── components/    # Componentes reutilizáveis
├── screens/      # Telas da aplicação
├── navigation/   # Configuração de navegação
├── styles/      # Estilos e temas
├── hooks/       # Custom hooks
├── services/    # Serviços de API
└── utils/       # Funções utilitárias
```

## Scripts Disponíveis

- `npm start`: Inicia o Metro Bundler
- `npm run ios`: Executa no simulador iOS
- `npm run android`: Executa no emulador Android
- `npm run lint`: Executa o linter
- `npm test`: Executa os testes 