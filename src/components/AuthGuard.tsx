'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from './AuthForm';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-2 text-slate-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <AuthForm
          mode={authMode}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;