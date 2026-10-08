'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import GameHUD from '@/components/GameHUD';
import BottomNav from '@/components/BottomNav';
import CTCityMap from '@/components/CTCityMap';
import { Character, CharacterStats } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

export default function CityPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

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

      const { data: charData, error: charError } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (charError) {
        if (charError.code === 'PGRST116') {
          router.push('/create-character');
          return;
        }
        throw charError;
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

  const handleDistrictClick = (districtId: string) => {
    setSelectedDistrict(districtId);
  };

  const handleCloseDistrict = () => {
    setSelectedDistrict(null);
  };

  const getDistrictContent = (districtId: string) => {
    switch (districtId) {
      case 'timeline_plaza':
        return {
          title: '📱 Timeline Plaza',
          description: 'The heart of CT. This is where your voice matters.',
          actions: [
            { label: 'Create Post', href: '/create', icon: '✍️' },
            { label: 'Check Trending', action: () => alert('Trending feed coming soon'), icon: '🔥' },
            { label: 'Network', action: () => alert('Networking coming soon'), icon: '🤝' }
          ]
        };
      case 'degen_district':
        return {
          title: '📊 Degen District',
          description: 'High risk, high reward. Trade fictional tokens and test your conviction.',
          actions: [
            { label: 'View Markets', action: () => alert('Trading interface coming soon'), icon: '💹' },
            { label: 'Check Portfolio', href: '/portfolio', icon: '💼' }
          ]
        };
      case 'builder_block':
        return {
          title: '🛠️ Builder Block',
          description: 'Ship code, not tweets. Build the future here.',
          actions: [
            { label: 'Start Building', action: () => alert('Builder actions coming soon'), icon: '💻' },
            { label: 'Find Hackathons', action: () => alert('Hackathons coming soon'), icon: '🏆' }
          ]
        };
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading CT City...</div>
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

  const districtContent = selectedDistrict ? getDistrictContent(selectedDistrict) : null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <GameHUD stats={stats} handle={character.handle} marketRegime="BULL MARKET" />

      {/* City Map - Full Screen */}
      <div className="flex-1 relative">
        <CTCityMap onDistrictClick={handleDistrictClick} />
      </div>

      {/* District Detail Modal */}
      <AnimatePresence>
        {selectedDistrict && districtContent && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseDistrict}
          >
            <motion.div
              className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-6 md:p-8 max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">{districtContent.title}</h2>
                <button
                  onClick={handleCloseDistrict}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-400 mb-6">{districtContent.description}</p>

              <div className="space-y-3">
                {districtContent.actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (action.href) {
                        router.push(action.href);
                      } else if (action.action) {
                        action.action();
                      }
                    }}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg flex items-center gap-3 transition-colors"
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <span className="font-medium">{action.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleCloseDistrict}
                className="mt-6 w-full py-2 text-gray-400 hover:text-white transition-colors"
              >
                Back to City
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
