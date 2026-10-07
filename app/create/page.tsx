'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import GameHUD from '@/components/GameHUD';
import BottomNav from '@/components/BottomNav';
import { Character, CharacterStats } from '@/lib/types';

export default function CreatePage() {
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

  return (
    <div className="min-h-screen bg-slate-900 pb-20 md:pb-0">
      <GameHUD stats={stats} handle={character.handle} />
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 md:p-8">
          <h2 className="text-3xl font-bold text-white mb-4">✍️ Create Content</h2>
          <p className="text-gray-400 mb-6">Post creation system coming in next update...</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
