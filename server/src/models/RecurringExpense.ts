import mongoose, { Schema, Document } from 'mongoose';

export interface IRecurringExpense extends Document {
  userId: mongoose.Types.ObjectId;
  description: string;
  category: string;
  amount: number;
  interval: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  nextRun: Date;
  active: boolean;
  createdAt: Date;
}

const RecurringExpenseSchema = new Schema<IRecurringExpense>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  interval: { type: String, enum: ['daily','weekly','monthly'], required: true },
  startDate: { type: Date, required: true },
  nextRun: { type: Date, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

RecurringExpenseSchema.index({ userId: 1, active: 1 });

export const RecurringExpense = mongoose.model<IRecurringExpense>('RecurringExpense', RecurringExpenseSchema);
