'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import GameHUD from '@/components/GameHUD';
import BottomNav from '@/components/BottomNav';
import { Character, CharacterStats } from '@/lib/types';

export default function HomePage() {
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

      const { data: charData } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!charData) {
        router.push('/create-character');
        return;
      }

      setCharacter(charData);

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

  if (loading || !character || !stats) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20 md:pb-0">
      <GameHUD stats={stats} handle={character.handle} />

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 md:p-8">
          <h2 className="text-3xl font-bold text-white mb-4">🏠 Your Setup</h2>
          <p className="text-gray-400 mb-6">
            This is your personal space in CT Life.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 rounded-lg p-6">
              <h3 className="font-bold text-white mb-3">📊 Today's Progress</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Posts Created</span>
                  <span className="text-white font-bold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Followers Gained</span>
                  <span className="text-green-400 font-bold">+0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Credits Earned</span>
                  <span className="text-cyan-400 font-bold">₵0</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-6">
              <h3 className="font-bold text-white mb-3">🎯 Daily Quests</h3>
              <p className="text-sm text-gray-400">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
