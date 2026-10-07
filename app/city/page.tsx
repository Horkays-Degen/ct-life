'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Character, CharacterStats } from '@/lib/types';

export default function CityPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCharacter();
  }, []);

  const loadCharacter = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      // Load character
      const { data: charData, error: charError } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (charError) {
        if (charError.code === 'PGRST116') {
          // No character found
          router.push('/create-character');
          return;
        }
        throw charError;
      }

      setCharacter(charData);

      // Load stats
      const { data: statsData } = await supabase
        .from('character_stats')
        .select('*')
        .eq('character_id', charData.id)
        .single();

      setStats(statsData);
    } catch (err) {
      console.error('Error loading character:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!character || !stats) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Character not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top HUD */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">CT LIFE</h1>
            <div className="text-gray-400">|</div>
            <div className="text-white">@{character.handle}</div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-sm">
              <span className="text-gray-400">💰</span>
              <span className="text-cyan-400 font-bold ml-1">
                ₵{stats.ct_credits.toLocaleString()}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">⚡</span>
              <span className="text-green-400 font-bold ml-1">
                {stats.energy}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">👥</span>
              <span className="text-purple-400 font-bold ml-1">
                {stats.followers.toLocaleString()}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">⭐</span>
              <span className="text-yellow-400 font-bold ml-1">
                {stats.reputation}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            🌆 WELCOME TO CT CITY
          </h2>
          <p className="text-gray-400 mb-6">
            You've entered the timeline as <strong className="text-purple-400">{character.display_name}</strong>
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900/50 rounded-lg p-6">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-bold text-white mb-2">Timeline Plaza</h3>
              <p className="text-sm text-gray-400">Post, reply, and build your following</p>
              <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
                Coming Soon
              </button>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-6">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold text-white mb-2">Degen District</h3>
              <p className="text-sm text-gray-400">Trade fictional tokens</p>
              <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
                Coming Soon
              </button>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-6">
              <div className="text-3xl mb-2">🛠️</div>
              <h3 className="font-bold text-white mb-2">Builder Block</h3>
              <p className="text-sm text-gray-400">Build products and find cofounders</p>
              <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
                Coming Soon
              </button>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <p className="text-sm text-gray-500 mb-4">
              CT Life is in active development. More features coming soon!
            </p>
            <button
              onClick={handleSignOut}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Character Profile Preview */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Your Profile</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">Display Name</div>
              <div className="text-white font-bold">{character.display_name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Handle</div>
              <div className="text-purple-400 font-bold">@{character.handle}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Origin</div>
              <div className="text-white font-bold">{character.origin_id.replace(/_/g, ' ').toUpperCase()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Account Age</div>
              <div className="text-white">{stats.account_age_days} days</div>
            </div>
          </div>
          {character.bio && (
            <div className="mt-4">
              <div className="text-sm text-gray-400 mb-1">Bio</div>
              <div className="text-white">{character.bio}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
