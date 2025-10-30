import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import Question from '@/models/Question';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const userId = request.headers.get('userId');
    const { id } = params;

    const quiz = await Quiz.findOne({ _id: id, userId })
      .populate('userId', 'username email');

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Get questions for this quiz
    const questions = await Question.find({ quizId: id });
    
    return NextResponse.json(
      { quiz, questions },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Quiz fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const userId = request.headers.get('userId');
    const { id } = params;
    const { title, description } = await request.json();

    // Validation
    if (!title) {
      return NextResponse.json(
        { error: 'Quiz title is required' },
        { status: 400 }
      );
    }

    const quiz = await Quiz.findOneAndUpdate(
      { _id: id, userId },
      { title, description, updatedAt: new Date() },
      { new: true }
    );

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'Quiz updated successfully',
        quiz
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Quiz update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const userId = request.headers.get('userId');
    const { id } = params;

    const quiz = await Quiz.findOneAndDelete({ _id: id, userId });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Delete all questions associated with this quiz
    await Question.deleteMany({ quizId: id });
    
    return NextResponse.json(
      { message: 'Quiz deleted successfully' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Quiz deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}