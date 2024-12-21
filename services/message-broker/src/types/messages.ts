export interface BaseMessage {
  event: string;
  data: Record<string, any>;
  timestamp: string;
  origin: string;
  correlationId?: string;
  version?: string;
}

export interface AppointmentMessage extends BaseMessage {
  event: 'appointment_created' | 'appointment_updated' | 'appointment_cancelled';
  data: {
    appointment_id: string;
    user_id: string;
    professional_id: string;
    date: string;
    time: string;
    status?: string;
    reason?: string;
  };
}

export interface PaymentMessage extends BaseMessage {
  event: 'payment_processed' | 'payment_failed' | 'payment_refunded';
  data: {
    payment_id: string;
    order_id: string;
    user_id: string;
    amount: number;
    status: string;
    transaction_id?: string;
    error?: string;
  };
}

export interface HealthRecordMessage extends BaseMessage {
  event: 'health_record_created' | 'health_record_updated';
  data: {
    record_id: string;
    patient_id: string;
    professional_id: string;
    type: string;
    content: Record<string, any>;
    attachments?: Array<{
      type: string;
      url: string;
      name: string;
    }>;
  };
}

export interface AIServiceMessage extends BaseMessage {
  event: 'transcription_requested' | 'transcription_completed' | 'analysis_requested' | 'analysis_completed';
  data: {
    request_id: string;
    content: string;
    result?: string;
    error?: string;
    metadata?: Record<string, any>;
  };
}

export interface NotificationMessage extends BaseMessage {
  event: 'notification_email' | 'notification_sms' | 'notification_push';
  data: {
    recipient_id: string;
    type: string;
    title: string;
    content: string;
    template?: string;
    variables?: Record<string, any>;
  };
}

export interface ChatMessage extends BaseMessage {
  event: 'chat_message';
  data: {
    message_id: string;
    session_id: string;
    sender_id: string;
    recipient_id: string;
    content: string;
    attachments?: Array<{
      type: string;
      url: string;
      name: string;
    }>;
  };
}

export interface UserMessage extends BaseMessage {
  event: 'user_updated' | 'user_deleted';
  data: {
    user_id: string;
    changes?: Record<string, any>;
    reason?: string;
  };
} 