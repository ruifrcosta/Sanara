import mongoose, { Document, Schema } from 'mongoose';

// Interface para tipagem
export interface IHealthRecord extends Document {
  patientId: string;
  type: 'consultation' | 'exam' | 'prescription' | 'procedure';
  date: Date;
  provider: {
    id: string;
    name: string;
    specialty?: string;
  };
  description: string;
  symptoms?: string[];
  diagnosis?: {
    code: string;
    description: string;
    type: string;
  }[];
  prescriptions?: {
    medicationId: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  attachments?: {
    type: string;
    url: string;
    name: string;
    contentType: string;
    size: number;
  }[];
  vitalSigns?: {
    temperature?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
  };
  notes?: string;
  status: 'draft' | 'final' | 'amended' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

// Schema do MongoDB
const HealthRecordSchema = new Schema<IHealthRecord>(
  {
    patientId: {
      type: String,
      required: true,
      index: true
    },
    type: {
      type: String,
      required: true,
      enum: ['consultation', 'exam', 'prescription', 'procedure']
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    provider: {
      id: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      specialty: String
    },
    description: {
      type: String,
      required: true
    },
    symptoms: [String],
    diagnosis: [{
      code: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      type: String
    }],
    prescriptions: [{
      medicationId: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      dosage: {
        type: String,
        required: true
      },
      frequency: {
        type: String,
        required: true
      },
      duration: String,
      instructions: String
    }],
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
    vitalSigns: {
      temperature: Number,
      bloodPressure: {
        systolic: Number,
        diastolic: Number
      },
      heartRate: Number,
      respiratoryRate: Number,
      oxygenSaturation: Number
    },
    notes: String,
    status: {
      type: String,
      required: true,
      enum: ['draft', 'final', 'amended', 'cancelled'],
      default: 'draft'
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índices
HealthRecordSchema.index({ patientId: 1, date: -1 });
HealthRecordSchema.index({ 'provider.id': 1 });
HealthRecordSchema.index({ status: 1 });
HealthRecordSchema.index({ createdAt: -1 });

// Métodos estáticos
HealthRecordSchema.statics.findByPatientId = function(patientId: string) {
  return this.find({ patientId }).sort({ date: -1 });
};

HealthRecordSchema.statics.findByDateRange = function(startDate: Date, endDate: Date) {
  return this.find({
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: -1 });
};

// Middleware pre-save
HealthRecordSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'final') {
    this.metadata = {
      ...this.metadata,
      finalizedAt: new Date()
    };
  }
  next();
});

export const HealthRecord = mongoose.model<IHealthRecord>('HealthRecord', HealthRecordSchema); 