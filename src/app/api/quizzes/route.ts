import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/models/Quiz';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const userId = request.headers.get('userId');
    const { title, description } = await request.json();

    // Validation
    if (!title) {
      return NextResponse.json(
        { error: 'Quiz title is required' },
        { status: 400 }
      );
    }

    const quiz = new Quiz({
      title,
      description,
      userId
    });

    await quiz.save();
    
    return NextResponse.json(
      { 
        message: 'Quiz created successfully',
        quiz
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Quiz creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const userId = request.headers.get('userId');
    
    const quizzes = await Quiz.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');
    
    return NextResponse.json(
      { quizzes },
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