'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiCall } from '@/lib/api';
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Quiz {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Question {
  _id: string;
  questionText: string;
  answerChoices: string[];
  correctAnswer: number;
  quizId: string;
}

interface QuizEditorProps {
  quiz: Quiz;
  onBack: () => void;
}

export default function QuizEditor({ quiz, onBack }: QuizEditorProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  // Form state
  const [questionText, setQuestionText] = useState('');
  const [answerChoices, setAnswerChoices] = useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await apiCall(`/api/questions/${quiz._id}`, { method: 'GET' }, token);
      setQuestions(data.questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQuestionText('');
    setAnswerChoices(['', '']);
    setCorrectAnswer(0);
    setEditingQuestion(null);
    setShowAddForm(false);
  };

  const startEdit = (question: Question) => {
    setQuestionText(question.questionText);
    setAnswerChoices([...question.answerChoices]);
    setCorrectAnswer(question.correctAnswer);
    setEditingQuestion(question);
    setShowAddForm(false);
  };

  const addAnswerChoice = () => {
    if (answerChoices.length < 6) {
      setAnswerChoices([...answerChoices, '']);
    }
  };

  const removeAnswerChoice = (index: number) => {
    if (answerChoices.length > 2) {
      const newChoices = answerChoices.filter((_, i) => i !== index);
      setAnswerChoices(newChoices);
      if (correctAnswer >= newChoices.length) {
        setCorrectAnswer(newChoices.length - 1);
      }
    }
  };

  const updateAnswerChoice = (index: number, value: string) => {
    const newChoices = [...answerChoices];
    newChoices[index] = value;
    setAnswerChoices(newChoices);
  };

  const saveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionText.trim() || answerChoices.some(choice => !choice.trim())) {
      setError('Please fill in all fields');
      return;
    }

    try {
      if (editingQuestion) {
        // Update existing question
        const data = await apiCall(`/api/questions/${quiz._id}/${editingQuestion._id}`, {
          method: 'PUT',
          body: JSON.stringify({
            questionText: questionText.trim(),
            answerChoices: answerChoices.map(choice => choice.trim()),
            correctAnswer
          })
        }, token);
        
        setQuestions(questions.map(q => 
          q._id === editingQuestion._id ? data.question : q
        ));
      } else {
        // Create new question
        const data = await apiCall('/api/questions', {
          method: 'POST',
          body: JSON.stringify({
            questionText: questionText.trim(),
            answerChoices: answerChoices.map(choice => choice.trim()),
            correctAnswer,
            quizId: quiz._id
          })
        }, token);
        
        setQuestions([...questions, data.question]);
      }
      
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save question');
    }
  };

  const deleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await apiCall(`/api/questions/${quiz._id}/${questionId}`, { method: 'DELETE' }, token);
      setQuestions(questions.filter(q => q._id !== questionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={onBack}
              className="flex items-center text-slate-300 hover:text-white mr-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
              {quiz.description && (
                <p className="text-slate-400 mt-1">{quiz.description}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
            <button
              onClick={() => setError('')}
              className="float-right text-red-300 hover:text-red-100"
            >
              ×
            </button>
          </div>
        )}

        {/* Add/Edit Question Form */}
        {(showAddForm || editingQuestion) && (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={saveQuestion} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Question Text
                </label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your question"
                  rows={3}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-slate-300">
                    Answer Choices
                  </label>
                  {answerChoices.length < 6 && (
                    <button
                      type="button"
                      onClick={addAnswerChoice}
                      className="text-indigo-400 hover:text-indigo-300 text-sm"
                    >
                      + Add Choice
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  {answerChoices.map((choice, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={correctAnswer === index}
                        onChange={() => setCorrectAnswer(index)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        value={choice}
                        onChange={(e) => updateAnswerChoice(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={`Choice ${index + 1}`}
                        required
                      />
                      {answerChoices.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeAnswerChoice(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  Select the radio button next to the correct answer
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingQuestion ? 'Update Question' : 'Add Question'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Question Button */}
        {!showAddForm && !editingQuestion && (
          <div className="mb-8">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Question
            </button>
          </div>
        )}

        {/* Questions List */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">
            Questions ({questions.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="text-slate-400 mt-4">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No questions yet</p>
              <p className="text-slate-500">Add your first question to get started</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div
                  key={question._id}
                  className="bg-slate-800 rounded-lg p-6 border border-slate-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-white">
                      Question {index + 1}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(question)}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteQuestion(question._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-300 mb-4">{question.questionText}</p>

                  <div className="space-y-2">
                    {question.answerChoices.map((choice, choiceIndex) => (
                      <div
                        key={choiceIndex}
                        className={`flex items-center p-3 rounded-lg ${
                          choiceIndex === question.correctAnswer
                            ? 'bg-emerald-900/30 border border-emerald-500'
                            : 'bg-slate-700'
                        }`}
                      >
                        <span className="text-slate-400 mr-3">
                          {String.fromCharCode(65 + choiceIndex)}.
                        </span>
                        <span className="text-white">{choice}</span>
                        {choiceIndex === question.correctAnswer && (
                          <span className="ml-auto text-emerald-400 text-sm font-medium">
                            Correct
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}