import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from '../utils/logger';

export interface SendEmailData {
  to: string;
  subject: string;
  content: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass
      }
    });
  }

  async sendEmail(data: SendEmailData) {
    try {
      const mailOptions = {
        from: config.email.from,
        to: data.to,
        subject: data.subject,
        html: data.content,
        attachments: data.attachments
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: data.to
      });

      return info;
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw error;
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Failed to verify email service connection:', error);
      throw error;
    }
  }
} 