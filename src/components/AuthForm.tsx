'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSwitchMode: () => void;
}

const AuthForm = ({ mode, onSwitchMode }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, name || undefined);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg border border-slate-200">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-900">
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">
              Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-600"
              placeholder="Your name"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-600"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-600"
            placeholder="••••••••"
          />
          {mode === 'signup' && (
            <p className="text-xs text-slate-700 mt-1">
              Must be at least 6 characters
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 font-semibold shadow-md disabled:opacity-60 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-700">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          <button
            onClick={onSwitchMode}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;