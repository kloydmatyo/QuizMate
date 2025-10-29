import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import Quiz from '@/models/Quiz';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string; id: string }> }
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

    const { quizId, id } = await params;
    if (!mongoose.Types.ObjectId.isValid(quizId) || 
        !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Verify quiz ownership
    const quiz = await Quiz.findOne({ 
      _id: quizId, 
      userId: decoded.userId 
    });
    
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const { questionText, answerChoices, correctAnswer } = await request.json();

    // Validation
    if (!questionText || !answerChoices || correctAnswer === undefined) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const question = await Question.findOneAndUpdate(
      { _id: id, quizId: quizId },
      {
        questionText: questionText.trim(),
        answerChoices: answerChoices.map((choice: string) => choice.trim()),
        correctAnswer
      },
      { new: true }
    );

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Question updated successfully',
      question
    });

  } catch (error) {
    console.error('Update question error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string; id: string }> }
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

    const { quizId, id } = await params;
    if (!mongoose.Types.ObjectId.isValid(quizId) || 
        !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Verify quiz ownership
    const quiz = await Quiz.findOne({ 
      _id: quizId, 
      userId: decoded.userId 
    });
    
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const question = await Question.findOneAndDelete({ 
      _id: id, 
      quizId: quizId 
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Question deleted successfully' });

  } catch (error) {
    console.error('Delete question error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}