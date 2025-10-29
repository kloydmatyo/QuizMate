import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import Quiz from '@/models/Quiz';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { questionText, answerChoices, correctAnswer, quizId } = await request.json();

    // Validation
    if (!questionText || !answerChoices || correctAnswer === undefined || !quizId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 });
    }

    // Verify quiz ownership
    const quiz = await Quiz.findOne({ _id: quizId, userId: decoded.userId });
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    if (questionText.length > 500) {
      return NextResponse.json(
        { error: 'Question text cannot exceed 500 characters' },
        { status: 400 }
      );
    }

    if (!Array.isArray(answerChoices) || answerChoices.length < 2 || answerChoices.length > 6) {
      return NextResponse.json(
        { error: 'Must have between 2 and 6 answer choices' },
        { status: 400 }
      );
    }

    if (correctAnswer < 0 || correctAnswer >= answerChoices.length) {
      return NextResponse.json(
        { error: 'Invalid correct answer index' },
        { status: 400 }
      );
    }

    const question = new Question({
      questionText: questionText.trim(),
      answerChoices: answerChoices.map((choice: string) => choice.trim()),
      correctAnswer,
      quizId
    });

    await question.save();

    return NextResponse.json(
      { 
        message: 'Question created successfully',
        question: {
          id: question._id,
          questionText: question.questionText,
          answerChoices: question.answerChoices,
          correctAnswer: question.correctAnswer,
          quizId: question.quizId
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create question error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}