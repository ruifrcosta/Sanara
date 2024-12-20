import { MailService } from '@sendgrid/mail';
import { SendGridConfig, SendGridEmail, SendGridTemplate, SendGridStats } from '../types/sendgrid';
import { logger } from '../utils/logger';

export class SendGridService {
  private client: MailService;
  private config: SendGridConfig;

  constructor(config: SendGridConfig) {
    this.config = config;
    this.client = new MailService();
    this.client.setApiKey(config.apiKey);
  }

  // Envio de E-mails
  async sendEmail(data: SendGridEmail): Promise<void> {
    try {
      const msg = {
        to: data.to,
        from: {
          email: this.config.fromEmail,
          name: this.config.fromName,
        },
        subject: data.subject,
        text: data.text,
        html: data.html,
        templateId: data.templateId,
        dynamicTemplateData: data.dynamicTemplateData,
        attachments: data.attachments,
        categories: data.categories,
        customArgs: data.customArgs,
        sendAt: data.sendAt,
      };

      await this.client.send(msg);
      logger.info('Email sent successfully', {
        to: data.to,
        subject: data.subject,
        templateId: data.templateId,
      });
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  // Envio em Lote
  async sendBulkEmails(emails: SendGridEmail[]): Promise<void> {
    try {
      const messages = emails.map(email => ({
        to: email.to,
        from: {
          email: this.config.fromEmail,
          name: this.config.fromName,
        },
        subject: email.subject,
        text: email.text,
        html: email.html,
        templateId: email.templateId,
        dynamicTemplateData: email.dynamicTemplateData,
        attachments: email.attachments,
        categories: email.categories,
        customArgs: email.customArgs,
        sendAt: email.sendAt,
      }));

      await this.client.send(messages);
      logger.info('Bulk emails sent successfully', {
        count: messages.length,
      });
    } catch (error) {
      logger.error('Error sending bulk emails:', error);
      throw error;
    }
  }

  // Templates
  async getTemplate(templateId: string): Promise<SendGridTemplate> {
    try {
      const response = await this.client.request({
        method: 'GET',
        url: `/v3/templates/${templateId}`,
      });

      const template = response[1];
      return {
        id: template.id,
        name: template.name,
        version: template.versions[0].id,
        active: template.versions[0].active,
        subject: template.versions[0].subject,
        html: template.versions[0].html_content,
        text: template.versions[0].plain_content,
        editor: template.versions[0].editor,
        categories: template.categories,
      };
    } catch (error) {
      logger.error('Error getting template:', error);
      throw error;
    }
  }

  // Estatísticas
  async getStats(startDate: string, endDate: string): Promise<SendGridStats> {
    try {
      const response = await this.client.request({
        method: 'GET',
        url: `/v3/stats`,
        qs: {
          start_date: startDate,
          end_date: endDate,
          aggregated_by: 'day',
        },
      });

      return {
        date: startDate,
        stats: response[1],
      };
    } catch (error) {
      logger.error('Error getting stats:', error);
      throw error;
    }
  }

  // Validação de E-mail
  async validateEmailAddress(email: string): Promise<boolean> {
    try {
      const response = await this.client.request({
        method: 'POST',
        url: '/v3/validations/email',
        body: { email },
      });

      return response[1].result.valid;
    } catch (error) {
      logger.error('Error validating email:', error);
      return false;
    }
  }

  // Gerenciamento de Listas de Supressão
  async addToSuppressionList(emails: string[]): Promise<void> {
    try {
      await this.client.request({
        method: 'POST',
        url: '/v3/asm/suppressions/global',
        body: { recipient_emails: emails },
      });

      logger.info('Emails added to suppression list', {
        count: emails.length,
      });
    } catch (error) {
      logger.error('Error adding to suppression list:', error);
      throw error;
    }
  }

  async removeFromSuppressionList(emails: string[]): Promise<void> {
    try {
      await this.client.request({
        method: 'DELETE',
        url: '/v3/asm/suppressions/global',
        body: { recipient_emails: emails },
      });

      logger.info('Emails removed from suppression list', {
        count: emails.length,
      });
    } catch (error) {
      logger.error('Error removing from suppression list:', error);
      throw error;
    }
  }

  // Verificação de Bounce
  async checkBounceStatus(email: string): Promise<boolean> {
    try {
      const response = await this.client.request({
        method: 'GET',
        url: `/v3/suppression/bounces/${email}`,
      });

      return response[1].length > 0;
    } catch (error) {
      logger.error('Error checking bounce status:', error);
      return false;
    }
  }
} 