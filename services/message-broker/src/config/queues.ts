import { ExchangeConfig, QueueConfig, BindingConfig } from '../lib/RabbitMQClient';

// Exchanges
export const exchanges: ExchangeConfig[] = [
  {
    name: 'notifications',
    type: 'topic',
    options: {
      durable: true
    }
  },
  {
    name: 'appointments',
    type: 'direct',
    options: {
      durable: true
    }
  },
  {
    name: 'orders',
    type: 'topic',
    options: {
      durable: true
    }
  },
  {
    name: 'chat',
    type: 'fanout',
    options: {
      durable: true
    }
  },
  {
    name: 'health_records',
    type: 'topic',
    options: {
      durable: true
    }
  },
  {
    name: 'ai_service',
    type: 'direct',
    options: {
      durable: true
    }
  },
  {
    name: 'users',
    type: 'topic',
    options: {
      durable: true
    }
  },
  {
    name: 'dlx',
    type: 'fanout',
    options: {
      durable: true
    }
  }
];

// Filas
export const queues: QueueConfig[] = [
  // Notificações
  {
    name: 'notifications.email',
    options: {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'notifications.email.dlq'
    }
  },
  {
    name: 'notifications.sms',
    options: {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'notifications.sms.dlq'
    }
  },
  {
    name: 'notifications.push',
    options: {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'notifications.push.dlq'
    }
  },

  // Consultas
  {
    name: 'appointments.created',
    options: {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'appointments.created.dlq'
    }
  },
  {
    name: 'appointments.updated',
    options: {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'appointments.updated.dlq'
    }
  },
  {
    name: 'appointments.cancelled',
    options: {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'appointments.cancelled.dlq'
    }
  },

  // Pedidos e Pagamentos
  {
    name: 'orders.created',
    options: {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'orders.created.dlq'
    }
  },
  {
    name: 'orders.updated',
    options: {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'orders.updated.dlq'
    }
  },
  {
    name: 'orders.payment.processed',
    options: {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'orders.payment.processed.dlq'
    }
  },

  // Prontuário Eletrônico
  {
    name: 'health_records.created',
    options: {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'health_records.created.dlq'
    }
  },
  {
    name: 'health_records.updated',
    options: {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'health_records.updated.dlq'
    }
  },

  // Serviço de IA
  {
    name: 'ai.transcription',
    options: {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'ai.transcription.dlq'
    }
  },
  {
    name: 'ai.analysis',
    options: {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'ai.analysis.dlq'
    }
  },

  // Chat
  {
    name: 'chat.messages',
    options: {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'chat.messages.dlq'
    }
  },

  // Usuários
  {
    name: 'users.updated',
    options: {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'users.updated.dlq'
    }
  },

  // Dead Letter Queues
  {
    name: 'dlq',
    options: {
      durable: true,
      messageTtl: 7 * 24 * 60 * 60 * 1000 // 7 dias
    }
  }
];

// Bindings
export const bindings: BindingConfig[] = [
  // Notificações
  {
    queue: 'notifications.email',
    exchange: 'notifications',
    pattern: 'notification.email.*'
  },
  {
    queue: 'notifications.sms',
    exchange: 'notifications',
    pattern: 'notification.sms.*'
  },
  {
    queue: 'notifications.push',
    exchange: 'notifications',
    pattern: 'notification.push.*'
  },

  // Consultas
  {
    queue: 'appointments.created',
    exchange: 'appointments',
    pattern: 'appointment.created'
  },
  {
    queue: 'appointments.updated',
    exchange: 'appointments',
    pattern: 'appointment.updated'
  },
  {
    queue: 'appointments.cancelled',
    exchange: 'appointments',
    pattern: 'appointment.cancelled'
  },

  // Pedidos
  {
    queue: 'orders.created',
    exchange: 'orders',
    pattern: 'order.created'
  },
  {
    queue: 'orders.updated',
    exchange: 'orders',
    pattern: 'order.updated'
  },
  {
    queue: 'orders.payment.processed',
    exchange: 'orders',
    pattern: 'order.payment.processed'
  },

  // Prontuário Eletrônico
  {
    queue: 'health_records.created',
    exchange: 'health_records',
    pattern: 'health_record.created'
  },
  {
    queue: 'health_records.updated',
    exchange: 'health_records',
    pattern: 'health_record.updated'
  },

  // Serviço de IA
  {
    queue: 'ai.transcription',
    exchange: 'ai_service',
    pattern: 'ai.transcription.request'
  },
  {
    queue: 'ai.analysis',
    exchange: 'ai_service',
    pattern: 'ai.analysis.request'
  },

  // Chat
  {
    queue: 'chat.messages',
    exchange: 'chat',
    pattern: ''  // fanout não usa pattern
  },

  // Usuários
  {
    queue: 'users.updated',
    exchange: 'users',
    pattern: 'user.updated'
  },

  // Dead Letter Queue
  {
    queue: 'dlq',
    exchange: 'dlx',
    pattern: '#'
  }
]; 