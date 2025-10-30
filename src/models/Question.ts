import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  questionText: string;
  answerChoices: string[];
  correctAnswer: number;
  quizId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const QuestionSchema: Schema = new Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    maxlength: [500, 'Question text cannot exceed 500 characters']
  },
  answerChoices: {
    type: [String],
    required: [true, 'Answer choices are required'],
    validate: {
      validator: function(choices: string[]) {
        return choices.length >= 2 && choices.length <= 6;
      },
      message: 'Must have between 2 and 6 answer choices'
    }
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: 0
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);