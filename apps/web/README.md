# Sanara Web Application

Aplicação web da plataforma Sanara, construída com Next.js e Tailwind CSS.

## Tecnologias

- Next.js
- React
- Tailwind CSS
- TypeScript
- SWR
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

# Iniciar em modo produção
npm start
```

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── styles/        # Estilos globais e temas
├── hooks/         # Custom hooks
├── utils/         # Funções utilitárias
├── services/      # Serviços de API
└── types/         # Definições de tipos
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Constrói a aplicação para produção
- `npm start`: Inicia o servidor de produção
- `npm run lint`: Executa o linter 