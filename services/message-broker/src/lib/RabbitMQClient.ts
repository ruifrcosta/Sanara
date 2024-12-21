import amqp, { Channel, Connection, Message } from 'amqplib';
import { logger } from '../utils/logger';
import { BaseMessage } from '../types/messages';

export interface QueueConfig {
  name: string;
  options?: amqp.Options.AssertQueue;
}

export interface ExchangeConfig {
  name: string;
  type: 'direct' | 'fanout' | 'topic' | 'headers';
  options?: amqp.Options.AssertExchange;
}

export interface BindingConfig {
  queue: string;
  exchange: string;
  pattern: string;
}

export interface PublishOptions {
  persistent?: boolean;
  expiration?: string | number;
  priority?: number;
  messageId?: string;
  timestamp?: number;
  correlationId?: string;
  replyTo?: string;
}

export class RabbitMQClient {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly url: string;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 10;
  private readonly reconnectInterval = 5000;
  private readonly defaultMessageOptions: PublishOptions = {
    persistent: true,
    priority: 0,
    timestamp: Date.now()
  };

  constructor(url: string) {
    this.url = url;
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      
      logger.info('Successfully connected to RabbitMQ');
      this.reconnectAttempts = 0;

      this.setupErrorHandlers();
    } catch (error) {
      logger.error('Failed to connect to RabbitMQ:', error);
      this.handleConnectionError();
    }
  }

  private setupErrorHandlers(): void {
    if (this.connection) {
      this.connection.on('error', (error) => {
        logger.error('RabbitMQ connection error:', error);
        this.handleConnectionError();
      });

      this.connection.on('close', () => {
        logger.warn('RabbitMQ connection closed');
        this.handleConnectionError();
      });
    }

    if (this.channel) {
      this.channel.on('error', (error) => {
        logger.error('RabbitMQ channel error:', error);
      });

      this.channel.on('close', () => {
        logger.warn('RabbitMQ channel closed');
      });

      // Configurar prefetch para controle de carga
      this.channel.prefetch(10);
    }
  }

  private async handleConnectionError(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnection attempts reached. Exiting...');
      process.exit(1);
    }

    this.reconnectAttempts++;
    logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(async () => {
      await this.connect();
    }, this.reconnectInterval);
  }

  async assertQueue(config: QueueConfig): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    const defaultOptions: amqp.Options.AssertQueue = {
      durable: true,
      deadLetterExchange: 'dlx',
      messageTtl: 24 * 60 * 60 * 1000, // 24 horas
    };

    await this.channel.assertQueue(
      config.name,
      { ...defaultOptions, ...config.options }
    );
    logger.info(`Queue ${config.name} asserted`);
  }

  async assertExchange(config: ExchangeConfig): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    const defaultOptions: amqp.Options.AssertExchange = {
      durable: true,
    };

    await this.channel.assertExchange(
      config.name,
      config.type,
      { ...defaultOptions, ...config.options }
    );
    logger.info(`Exchange ${config.name} asserted`);
  }

  async bindQueue(config: BindingConfig): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    await this.channel.bindQueue(
      config.queue,
      config.exchange,
      config.pattern
    );
    logger.info(`Queue ${config.queue} bound to exchange ${config.exchange} with pattern ${config.pattern}`);
  }

  private validateMessage(message: BaseMessage): void {
    if (!message.event) {
      throw new Error('Message must have an event type');
    }
    if (!message.data) {
      throw new Error('Message must have data');
    }
    if (!message.timestamp) {
      throw new Error('Message must have a timestamp');
    }
    if (!message.origin) {
      throw new Error('Message must have an origin');
    }
  }

  async publish(
    exchange: string,
    routingKey: string,
    message: BaseMessage,
    options: PublishOptions = {}
  ): Promise<boolean> {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    try {
      // Validar a mensagem
      this.validateMessage(message);

      // Adicionar timestamp se não existir
      if (!message.timestamp) {
        message.timestamp = new Date().toISOString();
      }

      const messageOptions: amqp.Options.Publish = {
        ...this.defaultMessageOptions,
        ...options,
        messageId: options.messageId || Math.random().toString(36).substring(7),
        timestamp: options.timestamp || Date.now(),
        correlationId: options.correlationId || message.correlationId
      };

      const buffer = Buffer.from(JSON.stringify(message));
      const result = this.channel.publish(
        exchange,
        routingKey,
        buffer,
        messageOptions
      );

      if (result) {
        logger.debug('Message published successfully', {
          exchange,
          routingKey,
          messageId: messageOptions.messageId
        });
      } else {
        logger.warn('Failed to publish message', {
          exchange,
          routingKey,
          messageId: messageOptions.messageId
        });
      }

      return result;
    } catch (error) {
      logger.error('Error publishing message:', error);
      throw error;
    }
  }

  async consume(
    queue: string,
    handler: (msg: Message | null) => Promise<void>,
    options: amqp.Options.Consume = {}
  ): Promise<string> {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    const defaultOptions: amqp.Options.Consume = {
      noAck: false,
      ...options
    };

    try {
      const { consumerTag } = await this.channel.consume(
        queue,
        async (msg) => {
          try {
            await handler(msg);
            if (msg && !defaultOptions.noAck) {
              this.channel?.ack(msg);
            }
          } catch (error) {
            logger.error(`Error processing message from queue ${queue}:`, error);
            if (msg && !defaultOptions.noAck) {
              // Rejeitar a mensagem e recolocá-la na fila
              this.channel?.nack(msg, false, true);
            }
          }
        },
        defaultOptions
      );

      logger.info(`Consumer started for queue ${queue} with tag ${consumerTag}`);
      return consumerTag;
    } catch (error) {
      logger.error(`Error setting up consumer for queue ${queue}:`, error);
      throw error;
    }
  }

  async cancelConsumer(consumerTag: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    await this.channel.cancel(consumerTag);
    logger.info(`Consumer ${consumerTag} cancelled`);
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
        logger.info('RabbitMQ channel closed');
      }
      
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
        logger.info('RabbitMQ connection closed');
      }
    } catch (error) {
      logger.error('Error closing RabbitMQ connection:', error);
      throw error;
    }
  }
} 