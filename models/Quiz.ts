import mongoose, { Document, Schema } from 'mongoose';

export interface IQuiz extends Document {
  title: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema = new Schema<IQuiz>({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);