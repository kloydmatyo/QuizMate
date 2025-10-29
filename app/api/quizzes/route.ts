import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    const quizzes = await Quiz.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .select('title description createdAt updatedAt');

    return NextResponse.json({ quizzes });

  } catch (error) {
    console.error('Get quizzes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const { title, description } = await request.json();

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Quiz title is required' },
        { status: 400 }
      );
    }

    if (title.length > 100) {
      return NextResponse.json(
        { error: 'Title cannot exceed 100 characters' },
        { status: 400 }
      );
    }

    if (description && description.length > 500) {
      return NextResponse.json(
        { error: 'Description cannot exceed 500 characters' },
        { status: 400 }
      );
    }

    const quiz = new Quiz({
      title: title.trim(),
      description: description?.trim() || '',
      userId: decoded.userId
    });

    await quiz.save();

    return NextResponse.json(
      { 
        message: 'Quiz created successfully',
        quiz: {
          id: quiz._id,
          title: quiz.title,
          description: quiz.description,
          createdAt: quiz.createdAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create quiz error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}