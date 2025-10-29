import mongoose, { Document, Schema } from 'mongoose';

export interface IResult extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  score: number;
  answers: number[];
  completedAt: Date;
}

const ResultSchema = new Schema<IResult>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  answers: {
    type: [Number],
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);