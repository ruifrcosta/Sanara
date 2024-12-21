# Sanara Desktop Application

Aplicação desktop da plataforma Sanara, construída com Electron e React.

## Tecnologias

- Electron
- React
- TypeScript
- Vite
- Zustand

## Requisitos

- Node.js 18+
- npm ou yarn

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev

# Construir para produção
npm run build

# Empacotar aplicação
npm run package
```

## Estrutura do Projeto

```
src/
├── main/         # Processo principal do Electron
├── renderer/     # Interface do usuário (React)
├── preload/      # Scripts de preload
└── shared/       # Código compartilhado
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Constrói a aplicação para produção
- `npm run package`: Empacota a aplicação para distribuição
- `npm run lint`: Executa o linter 