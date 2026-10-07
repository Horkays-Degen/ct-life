'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import GameHUD from '@/components/GameHUD';
import BottomNav from '@/components/BottomNav';
import { Character, CharacterStats, PostType } from '@/lib/types';

const POST_TYPES: { id: PostType; name: string; description: string; emoji: string; energyCost: number }[] = [
  { id: 'gm', name: 'GM Post', description: 'The sacred ritual', emoji: '☀️', energyCost: 5 },
  { id: 'hot_take', name: 'Hot Take', description: 'Controversial opinion', emoji: '🔥', energyCost: 15 },
  { id: 'research_thread', name: 'Research Thread', description: 'Deep analysis', emoji: '🧵', energyCost: 40 },
  { id: 'meme', name: 'Meme', description: 'Cultural commentary', emoji: '😂', energyCost: 10 },
  { id: 'alpha_call', name: 'Alpha Call', description: 'Share the alpha', emoji: '💎', energyCost: 25 },
  { id: 'project_review', name: 'Project Review', description: 'Detailed review', emoji: '🔍', energyCost: 35 },
  { id: 'market_take', name: 'Market Take', description: 'Market analysis', emoji: '📊', energyCost: 20 },
  { id: 'personal_story', name: 'Personal Story', description: 'Share your journey', emoji: '📖', energyCost: 15 },
  { id: 'engagement_bait', name: 'Engagement Bait', description: 'Ask a question', emoji: '🎣', energyCost: 8 },
  { id: 'builder_update', name: 'Builder Update', description: 'Shipping progress', emoji: '🛠️', energyCost: 20 },
];

export default function CreatePage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [selectedType, setSelectedType] = useState<PostType>('gm');
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [result, setResult] = useState<any>(null);

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

  const handlePost = async () => {
    if (!character || !stats || !content.trim()) return;

    setPosting(true);
    setResult(null);

    try {
      const { data, error } = await supabase.rpc('create_post', {
        p_character_id: character.id,
        p_post_type: selectedType,
        p_content: content.trim()
      });

      if (error) throw error;

      setResult(data);
      setContent('');

      // Reload stats to reflect changes
      setTimeout(() => {
        loadCharacter();
      }, 500);

    } catch (err: any) {
      console.error('Post creation error:', err);
      alert(err.message || 'Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'timeline_takeover': return 'from-yellow-400 to-orange-500';
      case 'viral': return 'from-pink-400 to-purple-500';
      case 'banger': return 'from-green-400 to-cyan-500';
      case 'good': return 'from-blue-400 to-indigo-500';
      case 'normal': return 'from-gray-400 to-gray-500';
      case 'flop': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const selectedPostType = POST_TYPES.find(t => t.id === selectedType)!;

  if (!character || !stats) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20 md:pb-0">
      <GameHUD stats={stats} handle={character.handle} />
      
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Result Display */}
        {result && (
          <div className={`mb-6 bg-gradient-to-r ${getOutcomeColor(result.outcome)} p-6 rounded-2xl text-white animate-fade-in`}>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold mb-2">{result.outcome.replace(/_/g, ' ').toUpperCase()}</div>
              <div className="text-sm opacity-90">Your post is moving!</div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{result.impressions.toLocaleString()}</div>
                <div className="text-xs opacity-80">Impressions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{result.likes.toLocaleString()}</div>
                <div className="text-xs opacity-80">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{result.replies.toLocaleString()}</div>
                <div className="text-xs opacity-80">Replies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{result.reposts.toLocaleString()}</div>
                <div className="text-xs opacity-80">Reposts</div>
              </div>
            </div>

            <div className="flex justify-center gap-4 text-sm">
              <div className="bg-white/20 px-4 py-2 rounded-full">
                {result.follower_change > 0 ? '+' : ''}{result.follower_change} Followers
              </div>
              {result.reputation_change !== 0 && (
                <div className="bg-white/20 px-4 py-2 rounded-full">
                  {result.reputation_change > 0 ? '+' : ''}{result.reputation_change} Reputation
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 md:p-8">
          <h2 className="text-3xl font-bold text-white mb-4">✍️ Create Content</h2>
          <p className="text-gray-400 mb-6">Post to the CT timeline and watch your numbers grow</p>

          {/* Post Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Post Type</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {POST_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedType === type.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-600 bg-slate-900/50 hover:border-slate-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.emoji}</div>
                  <div className="text-xs font-bold text-white">{type.name}</div>
                  <div className="text-xs text-gray-400">⚡{type.energyCost}</div>
                </button>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {selectedPostType.description} • Costs {selectedPostType.energyCost} energy
            </div>
          </div>

          {/* Content Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Your Post {content.length > 0 && `(${content.length} characters)`}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening on CT?"
              rows={6}
              maxLength={280}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Post Button */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Energy: <span className={stats.energy >= selectedPostType.energyCost ? 'text-green-400' : 'text-red-400'}>
                {stats.energy}/{selectedPostType.energyCost}
              </span>
            </div>
            <button
              onClick={handlePost}
              disabled={posting || !content.trim() || stats.energy < selectedPostType.energyCost}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-slate-800/30 border border-slate-700 rounded-xl p-4">
          <h3 className="text-sm font-bold text-white mb-2">💡 Tips</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Different post types use different skills and have different viral potential</li>
            <li>• Your Origin and Traits affect post performance</li>
            <li>• Even small accounts can go viral with the right content and luck</li>
            <li>• High-quality posts build Reputation over time</li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
