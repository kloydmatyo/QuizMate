import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import Quiz from '@/models/Quiz';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const userId = request.headers.get('userId');
    const { questionText, answerChoices, correctAnswer, quizId } = await request.json();

    // Validation
    if (!questionText || !answerChoices || correctAnswer === undefined || !quizId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (answerChoices.length < 2 || answerChoices.length > 6) {
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

    // Verify quiz belongs to user
    const quiz = await Quiz.findOne({ _id: quizId, userId });
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    const question = new Question({
      questionText,
      answerChoices,
      correctAnswer,
      quizId
    });

    await question.save();
    
    return NextResponse.json(
      { 
        message: 'Question created successfully',
        question
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Question creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}