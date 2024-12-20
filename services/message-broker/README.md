# Serviço de Message Broker

Este serviço gerencia a comunicação assíncrona entre microserviços usando RabbitMQ.

## Funcionalidades

- Comunicação assíncrona entre serviços
- Roteamento flexível de mensagens
- Garantia de entrega
- Dead Letter Queue para mensagens com erro
- Monitoramento e logging

## Requisitos

- Node.js 18+
- RabbitMQ 3.12+

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

## Desenvolvimento

```bash
npm run dev
```

## Produção

```bash
npm run build
npm start
```

## Estrutura de Mensagens

### Exchanges

#### notifications (topic)
- Notificações por email
- Notificações por SMS
- Notificações push

#### appointments (direct)
- Criação de consultas
- Atualização de consultas
- Cancelamento de consultas

#### orders (topic)
- Criação de pedidos
- Atualização de pedidos
- Processamento de pagamentos

#### chat (fanout)
- Mensagens de chat em tempo real

#### dlx (fanout)
- Dead Letter Exchange para mensagens com erro

### Filas

#### Notificações
- notifications.email
- notifications.sms
- notifications.push

#### Consultas
- appointments.created
- appointments.updated
- appointments.cancelled

#### Pedidos
- orders.created
- orders.updated
- orders.payment.processed

#### Chat
- chat.messages

#### Dead Letter Queue
- dlq

## Padrões de Roteamento

### Topic Exchange (notifications)
- notification.email.*
- notification.sms.*
- notification.push.*

### Direct Exchange (appointments)
- appointment.created
- appointment.updated
- appointment.cancelled

### Topic Exchange (orders)
- order.created
- order.updated
- order.payment.processed

### Fanout Exchange (chat)
- Todas as mensagens são enviadas para todas as filas vinculadas

## Garantia de Entrega

- Confirmação de mensagens (message acknowledgment)
- Persistência de mensagens
- Dead Letter Queue para retry
- TTL configurável

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

## Exemplo de Uso

```typescript
import { RabbitMQClient } from './lib/RabbitMQClient';

// Conectar ao RabbitMQ
const client = new RabbitMQClient('amqp://localhost:5672');
await client.connect();

// Publicar mensagem
await client.publish(
  'notifications',
  'notification.email.welcome',
  {
    to: 'user@example.com',
    subject: 'Bem-vindo!',
    body: 'Seja bem-vindo à nossa plataforma!'
  }
);

// Consumir mensagens
await client.consume(
  'notifications.email',
  async (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      // Processar mensagem
      console.log('Received:', content);
    }
  }
);
```

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

MIT 