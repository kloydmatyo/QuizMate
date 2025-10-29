'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiCall } from '@/lib/api';
import { Plus, BookOpen, Edit, Trash2, Download, LogOut, User } from 'lucide-react';
import QuizEditor from '@/components/QuizEditor';

interface Quiz {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizDescription, setNewQuizDescription] = useState('');
  const [error, setError] = useState('');
  const { user, logout, token } = useAuth();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/api/quizzes', { method: 'GET' }, token);
      setQuizzes(data.quizzes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle.trim()) return;

    try {
      const data = await apiCall('/api/quizzes', {
        method: 'POST',
        body: JSON.stringify({
          title: newQuizTitle,
          description: newQuizDescription
        })
      }, token);

      setQuizzes([data.quiz, ...quizzes]);
      setNewQuizTitle('');
      setNewQuizDescription('');
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
    }
  };

  const deleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      await apiCall(`/api/quizzes/${quizId}`, { method: 'DELETE' }, token);
      setQuizzes(quizzes.filter(q => q._id !== quizId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quiz');
    }
  };

  const exportQuiz = async (quizId: string, format: 'csv' | 'json') => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quiz.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export quiz');
    }
  };

  if (selectedQuiz) {
    return (
      <QuizEditor
        quiz={selectedQuiz}
        onBack={() => {
          setSelectedQuiz(null);
          fetchQuizzes();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-indigo-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">Quiz Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-slate-300">
                <User className="w-5 h-5 mr-2" />
                <span>{user?.username}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-slate-300 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Create Quiz Section */}
        <div className="mb-8">
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Quiz
            </button>
          ) : (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Create New Quiz</h2>
              <form onSubmit={createQuiz} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter quiz title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newQuizDescription}
                    onChange={(e) => setNewQuizDescription(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter quiz description"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Create Quiz
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewQuizTitle('');
                      setNewQuizDescription('');
                    }}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Quizzes List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Quizzes</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="text-slate-400 mt-4">Loading quizzes...</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No quizzes yet</p>
              <p className="text-slate-500">Create your first quiz to get started</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">{quiz.title}</h3>
                  {quiz.description && (
                    <p className="text-slate-400 mb-4 line-clamp-2">{quiz.description}</p>
                  )}
                  <p className="text-sm text-slate-500 mb-4">
                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedQuiz(quiz)}
                      className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    
                    <div className="relative group">
                      <button className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </button>
                      <div className="absolute top-full left-0 mt-1 bg-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                          onClick={() => exportQuiz(quiz._id, 'csv')}
                          className="block w-full text-left px-4 py-2 text-white hover:bg-slate-600 rounded-t-lg"
                        >
                          CSV
                        </button>
                        <button
                          onClick={() => exportQuiz(quiz._id, 'json')}
                          className="block w-full text-left px-4 py-2 text-white hover:bg-slate-600 rounded-b-lg"
                        >
                          JSON
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteQuiz(quiz._id)}
                      className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
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