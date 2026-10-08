'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import GameHUD from '@/components/GameHUD';
import BottomNav from '@/components/BottomNav';
import PlayerRoom from '@/components/PlayerRoom';
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

  const handleRoomAction = (action: string) => {
    switch (action) {
      case 'computer':
        router.push('/create');
        break;
      case 'phone':
        router.push('/device');
        break;
      case 'bed':
        // Sleep/rest action
        if (confirm('Rest and recover energy? (Feature coming soon)')) {
          // Will implement sleep mechanics
        }
        break;
      case 'wardrobe':
        alert('Character customization coming soon!');
        break;
      case 'window':
        router.push('/city');
        break;
    }
  };

  if (loading || !character || !stats) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your room...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <GameHUD stats={stats} handle={character.handle} />

      {/* Player Room - Full Screen */}
      <div className="flex-1 relative">
        <PlayerRoom 
          characterName={character.display_name}
          onAction={handleRoomAction}
        />
      </div>

      <BottomNav />
    </div>
  );
}
