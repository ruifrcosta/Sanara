# Serviço de Banco de Dados

Este serviço gerencia as conexões e modelos de dados para MongoDB e PostgreSQL na plataforma de saúde.

## Estrutura

- `MongoDB`: Dados não estruturados (registros médicos, chat)
- `PostgreSQL`: Dados transacionais (usuários, pedidos, produtos)

## Requisitos

- Node.js 18+
- MongoDB 6+
- PostgreSQL 14+
- Redis (opcional, para cache)

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Gere os tipos do Prisma:
```bash
npm run generate:prisma
```

5. Execute as migrações do PostgreSQL:
```bash
npm run migrate:postgres
```

## Desenvolvimento

```bash
npm run dev
```

## Produção

```bash
npm run build
npm start
```

## Estrutura de Dados

### MongoDB

#### HealthRecord
- Registros médicos
- Histórico de consultas
- Exames
- Prescrições

#### ChatSession
- Sessões de chat médico
- Mensagens
- Metadados de consulta

### PostgreSQL

#### Users
- Informações de usuário
- Autenticação
- Perfis

#### Products
- Catálogo de produtos
- Estoque
- Preços

#### Orders
- Pedidos
- Itens
- Pagamentos

#### Prescriptions
- Prescrições médicas
- Medicamentos
- Dosagens

## Índices e Performance

### MongoDB
- Índices compostos para consultas frequentes
- TTL para dados temporários
- Sharding para escalabilidade

### PostgreSQL
- Índices B-tree para chaves primárias
- Índices parciais para consultas específicas
- Particionamento para tabelas grandes

## Segurança

- Conexões SSL/TLS
- Autenticação por usuário
- Backup automático
- Logs de auditoria

## Monitoramento

- Logs estruturados
- Métricas de performance
- Alertas de erro
- Health checks

## Scripts

- `npm run build`: Compila o TypeScript
- `npm run start`: Inicia em produção
- `npm run dev`: Inicia em desenvolvimento
- `npm run lint`: Executa o linter
- `npm run test`: Executa os testes
- `npm run migrate:postgres`: Executa migrações do PostgreSQL
- `npm run generate:prisma`: Gera tipos do Prisma

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

MIT 