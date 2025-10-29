import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import Question from '@/models/Question';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 });
    }

    const quiz = await Quiz.findOne({ 
      _id: id, 
      userId: decoded.userId 
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const questions = await Question.find({ quizId: id })
      .sort({ createdAt: 1 });

    return NextResponse.json({ 
      quiz: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt
      },
      questions 
    });

  } catch (error) {
    console.error('Get quiz error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 });
    }

    const { title, description } = await request.json();

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Quiz title is required' },
        { status: 400 }
      );
    }

    const quiz = await Quiz.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      { 
        title: title.trim(), 
        description: description?.trim() || '' 
      },
      { new: true }
    );

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Quiz updated successfully',
      quiz: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        updatedAt: quiz.updatedAt
      }
    });

  } catch (error) {
    console.error('Update quiz error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 });
    }

    const quiz = await Quiz.findOneAndDelete({ 
      _id: id, 
      userId: decoded.userId 
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Delete all questions associated with this quiz
    await Question.deleteMany({ quizId: id });

    return NextResponse.json({ message: 'Quiz deleted successfully' });

  } catch (error) {
    console.error('Delete quiz error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}