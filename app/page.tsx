'use client';

import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import Dashboard from '@/components/Dashboard';

function AuthWrapper() {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      {isLogin ? (
        <LoginForm onToggleMode={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onToggleMode={() => setIsLogin(true)} />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}
