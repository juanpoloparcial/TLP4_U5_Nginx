import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  titulo: string;
  descripcion?: string;
  estado: 'pendiente' | 'completada';
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  estado: { type: String, enum: ['pendiente','completada'], default: 'pendiente' }
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);
