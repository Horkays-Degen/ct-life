'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Redirect to character creation
          router.push('/create-character');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Check if character exists
          const { data: character } = await supabase
            .from('characters')
            .select('id')
            .eq('user_id', data.user.id)
            .single();

          if (character) {
            router.push('/city');
          } else {
            router.push('/create-character');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {mode === 'signup' ? 'JOIN CT LIFE' : 'WELCOME BACK'}
          </h2>
          <p className="text-center text-gray-400 mb-8">
            {mode === 'signup' 
              ? 'Create your account to enter the timeline'
              : 'Sign in to continue your journey'}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="anon@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 disabled:transform-none"
            >
              {loading ? 'LOADING...' : mode === 'signup' ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'signup' ? 'signin' : 'signup');
                setError('');
              }}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              {mode === 'signup' 
                ? 'Already have an account? Sign in'
                : 'Need an account? Sign up'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our Terms of Service.
              <br />
              CT Life uses fictional currency with no real value.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
