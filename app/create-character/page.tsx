'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ORIGINS, getOriginRarityColor, getOriginRarityDisplay } from '@/lib/origins';
import { TRAITS, ASPIRATIONS } from '@/lib/traits-aspirations';
import { Origin, Trait, Aspiration } from '@/lib/types';

type Step = 'avatar' | 'origin' | 'traits' | 'aspiration' | 'complete';

export default function CreateCharacterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('avatar');
  const [loading, setLoading] = useState(false);
  
  // Character data
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [avatarData, setAvatarData] = useState({
    skin_tone: '#FFDBAC',
    hair_style: 'short',
    hair_color: '#4A3F35',
    outfit: 'casual',
    accessories: [] as string[]
  });
  
  // Origin lottery
  const [rollingOrigin, setRollingOrigin] = useState(false);
  const [revealedOrigin, setRevealedOrigin] = useState<Origin | null>(null);
  const [originAnimationIndex, setOriginAnimationIndex] = useState(0);
  
  // Selected choices
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [selectedAspiration, setSelectedAspiration] = useState<string>('');

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
    }
  };

  const handleOriginLottery = () => {
    setRollingOrigin(true);
    
    // Animate through origins
    let index = 0;
    const interval = setInterval(() => {
      setOriginAnimationIndex(index % ORIGINS.length);
      index++;
    }, 100);

    // Stop after 3 seconds and reveal
    setTimeout(async () => {
      clearInterval(interval);
      
      // Server-side origin selection would happen here
      // For now, client-side random based on probabilities
      const roll = Math.random();
      let cumulative = 0;
      let selectedOrigin = ORIGINS[0];
      
      for (const origin of ORIGINS) {
        cumulative += origin.probability;
        if (roll <= cumulative) {
          selectedOrigin = origin;
          break;
        }
      }
      
      setRevealedOrigin(selectedOrigin);
      setRollingOrigin(false);
    }, 3000);
  };

  const toggleTrait = (traitId: string) => {
    if (selectedTraits.includes(traitId)) {
      setSelectedTraits(selectedTraits.filter(t => t !== traitId));
    } else if (selectedTraits.length < 2) {
      setSelectedTraits([...selectedTraits, traitId]);
    }
  };

  const handleComplete = async () => {
    if (!revealedOrigin) return;
    
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create character
      const { data: character, error: charError } = await supabase
        .from('characters')
        .insert({
          user_id: user.id,
          display_name: displayName,
          handle: handle,
          bio: bio,
          avatar_data: avatarData,
          origin_id: revealedOrigin.id,
          aspiration_id: selectedAspiration || null
        })
        .select()
        .single();

      if (charError) throw charError;

      // Create character stats
      const { error: statsError } = await supabase
        .from('character_stats')
        .insert({
          character_id: character.id,
          ct_credits: revealedOrigin.starting_credits,
          liquidity: revealedOrigin.starting_credits,
          net_worth: revealedOrigin.starting_credits,
          followers: revealedOrigin.starting_followers,
          reputation: revealedOrigin.starting_reputation
        });

      if (statsError) throw statsError;

      // Create character skills
      const skillInserts = Object.entries(revealedOrigin.starting_skills).map(([skill_id, level]) => ({
        character_id: character.id,
        skill_id,
        level,
        xp: 0,
        xp_to_next: 100
      }));

      const { error: skillsError } = await supabase
        .from('character_skills')
        .insert(skillInserts);

      if (skillsError) throw skillsError;

      // Create character traits
      if (selectedTraits.length > 0) {
        const traitInserts = selectedTraits.map(trait_id => ({
          character_id: character.id,
          trait_id
        }));

        const { error: traitsError } = await supabase
          .from('character_traits')
          .insert(traitInserts);

        if (traitsError) throw traitsError;
      }

      // Create transaction for starting credits
      await supabase
        .from('transactions')
        .insert({
          character_id: character.id,
          amount: revealedOrigin.starting_credits,
          type: 'initial',
          category: 'origin',
          description: `Starting credits from ${revealedOrigin.name}`,
          metadata: { origin_id: revealedOrigin.id }
        });

      // Redirect to city
      router.push('/city');
    } catch (err: any) {
      console.error('Error creating character:', err);
      alert(err.message || 'Failed to create character');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Progress Steps */}
        <div className="mb-8 flex justify-center space-x-4">
          {['avatar', 'origin', 'traits', 'aspiration'].map((s, i) => (
            <div
              key={s}
              className={`h-2 w-16 rounded-full ${
                ['avatar', 'origin', 'traits', 'aspiration'].indexOf(step) >= i
                  ? 'bg-purple-500'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Step: Avatar & Name */}
        {step === 'avatar' && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">CREATE YOUR PERSONA</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={20}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  @Handle
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  maxLength={20}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white"
                  placeholder="handle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio (optional)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={160}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white"
                  placeholder="Tell CT who you are..."
                />
              </div>

              <button
                onClick={() => setStep('origin')}
                disabled={!displayName || !handle}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg"
              >
                CONTINUE
              </button>
            </div>
          </div>
        )}

        {/* Step: Origin Lottery */}
        {step === 'origin' && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 text-center">
            {!revealedOrigin && !rollingOrigin && (
              <>
                <h2 className="text-4xl font-bold text-white mb-4">
                  THE TIMELINE DECIDES
                </h2>
                <p className="text-gray-400 mb-8">
                  Your CT Origin will be randomly assigned.
                  <br />
                  This cannot be changed.
                </p>
                <button
                  onClick={handleOriginLottery}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-12 py-4 rounded-full"
                >
                  SPIN THE WHEEL
                </button>
              </>
            )}

            {rollingOrigin && (
              <div className="py-12">
                <p className="text-gray-400 mb-8">calculating your place on the timeline...</p>
                <div className="text-6xl font-bold animate-pulse">
                  {ORIGINS[originAnimationIndex].name}
                </div>
              </div>
            )}

            {revealedOrigin && !rollingOrigin && (
              <div className="animate-fade-in">
                <p className="text-gray-400 mb-4">YOUR CT ORIGIN</p>
                <h2 className="text-5xl font-bold mb-2" style={{ color: getOriginRarityColor(revealedOrigin.rarity) }}>
                  {revealedOrigin.name}
                </h2>
                <p className="text-gray-400 italic mb-6">"{revealedOrigin.description}"</p>
                
                <div className="bg-slate-900/50 rounded-lg p-6 mb-6 text-left">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <div className="text-sm text-gray-400">Starting Credits</div>
                      <div className="text-2xl font-bold text-cyan-400">₵{revealedOrigin.starting_credits.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Followers</div>
                      <div className="text-2xl font-bold text-purple-400">{revealedOrigin.starting_followers.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Reputation</div>
                      <div className="text-2xl font-bold text-green-400">{revealedOrigin.starting_reputation}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-green-400 font-bold mb-2">✨ Special Effects</h3>
                    {revealedOrigin.special_effects.map((effect, i) => (
                      <div key={i} className="text-sm text-gray-300 mb-1">
                        • <strong>{effect.name}:</strong> {effect.description}
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-red-400 font-bold mb-2">⚠️ Downsides</h3>
                    {revealedOrigin.downsides.map((downside, i) => (
                      <div key={i} className="text-sm text-gray-300 mb-1">
                        • <strong>{downside.name}:</strong> {downside.description}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep('traits')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg"
                >
                  ACCEPT YOUR FATE
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step: Traits */}
        {step === 'traits' && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-2">CHOOSE TWO TRAITS</h2>
            <p className="text-gray-400 mb-6">
              Select {2 - selectedTraits.length} more trait{2 - selectedTraits.length !== 1 ? 's' : ''}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {TRAITS.map((trait) => (
                <button
                  key={trait.id}
                  onClick={() => toggleTrait(trait.id)}
                  disabled={selectedTraits.length >= 2 && !selectedTraits.includes(trait.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedTraits.includes(trait.id)
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-600 bg-slate-900/50 hover:border-slate-500'
                  } disabled:opacity-50`}
                >
                  <div className="font-bold text-white mb-1">{trait.name}</div>
                  <div className="text-sm text-gray-400">{trait.description}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep('aspiration')}
              disabled={selectedTraits.length !== 2}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg"
            >
              CONTINUE
            </button>
          </div>
        )}

        {/* Step: Aspiration */}
        {step === 'aspiration' && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-2">CHOOSE YOUR ASPIRATION</h2>
            <p className="text-gray-400 mb-6">Where do you want to go?</p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {ASPIRATIONS.map((aspiration) => (
                <button
                  key={aspiration.id}
                  onClick={() => setSelectedAspiration(aspiration.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedAspiration === aspiration.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-600 bg-slate-900/50 hover:border-slate-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{aspiration.badge_icon}</div>
                  <div className="font-bold text-white mb-1">{aspiration.name}</div>
                  <div className="text-sm text-gray-400">{aspiration.description}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleComplete}
              disabled={!selectedAspiration || loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg"
            >
              {loading ? 'CREATING...' : 'ENTER CT CITY'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
