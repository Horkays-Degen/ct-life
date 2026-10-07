'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import GameHUD from '@/components/GameHUD';
import BottomNav from '@/components/BottomNav';
import { Character, CharacterStats } from '@/lib/types';

export default function DevicePage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [stats, setStats] = useState<CharacterStats | null>(null);

  useEffect(() => {
    loadCharacter();
  }, []);

  const loadCharacter = async () => {
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
  };

  if (!character || !stats) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>;
  }

  const deviceApps = [
    { icon: '👤', name: 'Profile', description: 'View your CT profile' },
    { icon: '💼', name: 'Career', description: 'Track career progression' },
    { icon: '📊', name: 'Skills', description: 'View skill levels' },
    { icon: '🎯', name: 'Quests', description: 'Daily & special quests' },
    { icon: '🔔', name: 'Notifications', description: '0 new' },
    { icon: '🏆', name: 'Achievements', description: 'Unlock rewards' },
    { icon: '⚙️', name: 'Settings', description: 'Game settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pb-20 md:pb-0">
      <GameHUD stats={stats} handle={character.handle} />
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 md:p-8">
          <h2 className="text-3xl font-bold text-white mb-4">📱 Your Device</h2>
          <p className="text-gray-400 mb-6">Crypto Twitter in your pocket</p>

          <div className="grid md:grid-cols-2 gap-4">
            {deviceApps.map((app, idx) => (
              <button
                key={idx}
                className="bg-slate-900/50 hover:bg-slate-900/80 rounded-lg p-4 text-left transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{app.icon}</div>
                  <div>
                    <div className="font-bold text-white">{app.name}</div>
                    <div className="text-sm text-gray-400">{app.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
