import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  sender: string;
  senderType: 'patient' | 'provider' | 'system';
  content: string;
  attachments?: {
    type: string;
    url: string;
    name: string;
    contentType: string;
    size: number;
  }[];
  metadata?: Record<string, any>;
  sentAt: Date;
  readAt?: Date;
}

export interface IChatSession extends Document {
  patientId: string;
  providerId: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'general';
  status: 'active' | 'closed' | 'archived';
  startedAt: Date;
  endedAt?: Date;
  messages: IMessage[];
  metadata?: {
    consultationId?: string;
    prescriptionId?: string;
    diagnosis?: string[];
    symptoms?: string[];
    urgencyLevel?: 'low' | 'medium' | 'high';
    [key: string]: any;
  };
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: String,
      required: true
    },
    senderType: {
      type: String,
      required: true,
      enum: ['patient', 'provider', 'system']
    },
    content: {
      type: String,
      required: true
    },
    attachments: [{
      type: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      contentType: String,
      size: Number
    }],
    metadata: {
      type: Map,
      of: Schema.Types.Mixed
    },
    sentAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    readAt: Date
  },
  {
    _id: true
  }
);

const ChatSessionSchema = new Schema<IChatSession>(
  {
    patientId: {
      type: String,
      required: true,
      index: true
    },
    providerId: {
      type: String,
      required: true,
      index: true
    },
    type: {
      type: String,
      required: true,
      enum: ['consultation', 'follow-up', 'emergency', 'general']
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'closed', 'archived'],
      default: 'active'
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    endedAt: Date,
    messages: [MessageSchema],
    metadata: {
      consultationId: String,
      prescriptionId: String,
      diagnosis: [String],
      symptoms: [String],
      urgencyLevel: {
        type: String,
        enum: ['low', 'medium', 'high']
      }
    },
    lastMessageAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índices
ChatSessionSchema.index({ patientId: 1, lastMessageAt: -1 });
ChatSessionSchema.index({ providerId: 1, lastMessageAt: -1 });
ChatSessionSchema.index({ status: 1 });
ChatSessionSchema.index({ type: 1 });
ChatSessionSchema.index({ 'metadata.urgencyLevel': 1 });

// Métodos estáticos
ChatSessionSchema.statics.findActiveSessions = function(userId: string, userType: 'patient' | 'provider') {
  const query = userType === 'patient' ? { patientId: userId } : { providerId: userId };
  return this.find({
    ...query,
    status: 'active'
  }).sort({ lastMessageAt: -1 });
};

ChatSessionSchema.statics.findByDateRange = function(startDate: Date, endDate: Date) {
  return this.find({
    startedAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ startedAt: -1 });
};

// Middleware pre-save
ChatSessionSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    const lastMessage = this.messages[this.messages.length - 1];
    if (lastMessage) {
      this.lastMessageAt = lastMessage.sentAt;
    }
  }
  next();
});

export const ChatSession = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema); 