import { MailService } from '@sendgrid/mail';

export interface SendGridConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  templates: Record<string, string>;
}

export interface SendGridEmail {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: 'attachment' | 'inline';
    contentId?: string;
  }>;
  categories?: string[];
  customArgs?: Record<string, any>;
  sendAt?: number;
}

export interface SendGridTemplate {
  id: string;
  name: string;
  version: string;
  active: boolean;
  subject?: string;
  html?: string;
  text?: string;
  editor: 'code' | 'design';
  categories?: string[];
}

export interface SendGridStats {
  date: string;
  stats: Array<{
    metrics: {
      blocks: number;
      bounces: number;
      clicks: number;
      deferred: number;
      delivered: number;
      drops: number;
      opens: number;
      spam_reports: number;
      unique_clicks: number;
      unique_opens: number;
    };
  }>;
}

export interface SendGridClients {
  client: MailService;
} 