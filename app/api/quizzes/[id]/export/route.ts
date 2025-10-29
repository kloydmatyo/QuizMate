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

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

    const quiz = await Quiz.findOne({ 
      _id: id, 
      userId: decoded.userId 
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const questions = await Question.find({ quizId: id })
      .sort({ createdAt: 1 });

    if (format === 'csv') {
      let csvContent = 'Question,Choice A,Choice B,Choice C,Choice D,Choice E,Choice F,Correct Answer\n';
      
      questions.forEach((question) => {
        const choices = [...question.answerChoices];
        while (choices.length < 6) {
          choices.push('');
        }
        
        const row = [
          `"${question.questionText.replace(/"/g, '""')}"`,
          ...choices.map(choice => `"${choice.replace(/"/g, '""')}"`),
          question.correctAnswer + 1
        ].join(',');
        
        csvContent += row + '\n';
      });

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${quiz.title.replace(/[^a-zA-Z0-9]/g, '_')}.csv"`
        }
      });
    }

    // JSON format
    const exportData = {
      quiz: {
        title: quiz.title,
        description: quiz.description,
        createdAt: quiz.createdAt
      },
      questions: questions.map(q => ({
        questionText: q.questionText,
        answerChoices: q.answerChoices,
        correctAnswer: q.correctAnswer
      }))
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${quiz.title.replace(/[^a-zA-Z0-9]/g, '_')}.json"`
      }
    });

  } catch (error) {
    console.error('Export quiz error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}