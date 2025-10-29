import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import Quiz from '@/models/Quiz';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
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

    const { quizId } = await params;
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 });
    }

    // Verify quiz ownership
    const quiz = await Quiz.findOne({ 
      _id: quizId, 
      userId: decoded.userId 
    });
    
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const questions = await Question.find({ quizId: quizId })
      .sort({ createdAt: 1 });

    return NextResponse.json({ questions });

  } catch (error) {
    console.error('Get questions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}