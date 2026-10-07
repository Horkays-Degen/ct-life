'use client';

import { CharacterStats } from '@/lib/types';
import { useState, useEffect } from 'react';

interface GameHUDProps {
  stats: CharacterStats;
  handle: string;
  marketRegime?: string;
  playersOnline?: number;
}

export default function GameHUD({ stats, handle, marketRegime = 'BULL MARKET', playersOnline }: GameHUDProps) {
  const [statChanges, setStatChanges] = useState<Record<string, number>>({});

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  // Get meter color based on value
  const getMeterColor = (value: number): string => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Show floating stat change notification
  const showStatChange = (stat: string, change: number) => {
    setStatChanges(prev => ({ ...prev, [stat]: change }));
    setTimeout(() => {
      setStatChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[stat];
        return newChanges;
      });
    }, 2000);
  };

  // Get current time in UTC
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="px-4 py-2 flex items-center justify-between">
        {/* Left: Branding */}
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            CT LIFE
          </h1>
          <div className="text-sm text-gray-400">@{handle}</div>
        </div>

        {/* Center: Time & Market */}
        <div className="hidden md:flex items-center space-x-4 text-sm">
          <div className="text-gray-400">{currentTime}</div>
          <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300">
            {marketRegime}
          </div>
          {playersOnline !== undefined && (
            <div className="text-gray-400">👥 {playersOnline} online</div>
          )}
        </div>

        {/* Right: Quick Stats */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="relative">
            <span className="text-gray-400">💰</span>
            <span className="text-cyan-400 font-bold ml-1">₵{formatNumber(stats.ct_credits)}</span>
            {statChanges.credits && (
              <div className={`absolute -top-6 right-0 text-xs font-bold animate-fade-in ${statChanges.credits > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {statChanges.credits > 0 ? '+' : ''}{formatNumber(statChanges.credits)}
              </div>
            )}
          </div>
          <div className="relative">
            <span className="text-gray-400">👥</span>
            <span className="text-purple-400 font-bold ml-1">{formatNumber(stats.followers)}</span>
            {statChanges.followers && (
              <div className={`absolute -top-6 right-0 text-xs font-bold animate-fade-in ${statChanges.followers > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {statChanges.followers > 0 ? '+' : ''}{formatNumber(statChanges.followers)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meters Bar */}
      <div className="px-4 py-2 bg-slate-800/50 border-t border-slate-700">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {/* Energy */}
          <div className="group relative">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">⚡ ENERGY</span>
              <span className="text-white font-bold">{Math.floor(stats.energy)}</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getMeterColor(stats.energy)}`}
                style={{ width: `${stats.energy}%` }}
              />
            </div>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-gray-300 whitespace-nowrap z-50">
              Required for all actions
            </div>
          </div>

          {/* Attention */}
          <div className="group relative">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">👁️ ATTENTION</span>
              <span className="text-white font-bold">{Math.floor(stats.attention)}</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getMeterColor(stats.attention)}`}
                style={{ width: `${stats.attention}%` }}
              />
            </div>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-gray-300 whitespace-nowrap z-50">
              Affects post reach & opportunities
            </div>
          </div>

          {/* Reputation */}
          <div className="group relative">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">⭐ REPUTATION</span>
              <span className="text-white font-bold">{Math.floor(stats.reputation)}</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getMeterColor(stats.reputation)}`}
                style={{ width: `${stats.reputation}%` }}
              />
            </div>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-gray-300 whitespace-nowrap z-50">
              Trust score - unlocks opportunities
            </div>
          </div>

          {/* Conviction */}
          <div className="group relative">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">💎 CONVICTION</span>
              <span className="text-white font-bold">{Math.floor(stats.conviction)}</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getMeterColor(stats.conviction)}`}
                style={{ width: `${stats.conviction}%` }}
              />
            </div>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-gray-300 whitespace-nowrap z-50">
              Psychological resilience
            </div>
          </div>

          {/* Network */}
          <div className="group relative">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">🤝 NETWORK</span>
              <span className="text-white font-bold">{Math.floor(stats.network_strength)}</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getMeterColor(stats.network_strength)}`}
                style={{ width: `${stats.network_strength}%` }}
              />
            </div>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-gray-300 whitespace-nowrap z-50">
              Strength of relationships
            </div>
          </div>

          {/* Liquidity */}
          <div className="group relative">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">💵 LIQUIDITY</span>
              <span className="text-white font-bold">{formatNumber(stats.liquidity)}</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${stats.liquidity > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, (stats.liquidity / stats.net_worth) * 100)}%` }}
              />
            </div>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-gray-300 whitespace-nowrap z-50">
              Spendable credits vs. net worth
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
