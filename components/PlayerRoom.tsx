'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface InteractiveObject {
  id: string;
  name: string;
  position: { x: number; y: number };
  icon: string;
  description: string;
  action: () => void;
}

interface PlayerRoomProps {
  characterName: string;
  onAction: (action: string) => void;
}

export default function PlayerRoom({ characterName, onAction }: PlayerRoomProps) {
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [timeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon');

  const objects: InteractiveObject[] = [
    {
      id: 'computer',
      name: 'Computer',
      position: { x: 35, y: 45 },
      icon: '💻',
      description: 'Your setup. Create content, research, or work.',
      action: () => onAction('computer')
    },
    {
      id: 'bed',
      name: 'Bed',
      position: { x: 70, y: 30 },
      icon: '🛏️',
      description: 'Rest and recover energy.',
      action: () => onAction('bed')
    },
    {
      id: 'phone',
      name: 'Phone',
      position: { x: 38, y: 55 },
      icon: '📱',
      description: 'Check your device - messages, quests, career.',
      action: () => onAction('phone')
    },
    {
      id: 'wardrobe',
      name: 'Wardrobe',
      position: { x: 15, y: 35 },
      icon: '👔',
      description: 'Customize your appearance.',
      action: () => onAction('wardrobe')
    },
    {
      id: 'window',
      name: 'Window',
      position: { x: 75, y: 15 },
      icon: '🪟',
      description: 'View of CT City.',
      action: () => onAction('window')
    }
  ];

  const getLighting = () => {
    switch (timeOfDay) {
      case 'morning': return 'brightness(1.1) sepia(0.1)';
      case 'afternoon': return 'brightness(1)';
      case 'evening': return 'brightness(0.8) sepia(0.2) saturate(1.2)';
      case 'night': return 'brightness(0.6) contrast(1.2)';
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden">
      {/* Room Container */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{ filter: getLighting() }}
      >
        {/* Back Wall */}
        <div className="absolute inset-0">
          {/* Wall */}
          <div className="absolute top-0 left-0 right-0 h-3/5 bg-gradient-to-b from-slate-700 to-slate-600" />
          
          {/* Floor */}
          <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-slate-800 via-slate-700 to-slate-600">
            {/* Floor planks effect */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(0,0,0,0.3) 80px, rgba(0,0,0,0.3) 82px)'
            }} />
          </div>

          {/* Wall Poster/Decorations */}
          <motion.div
            className="absolute top-[15%] left-[20%] w-24 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-xl"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-4xl">
              🚀
            </div>
          </motion.div>

          {/* Window - Shows CT City */}
          <motion.div
            className="absolute top-[10%] right-[15%] w-40 h-48 bg-gradient-to-b from-cyan-400/30 to-blue-500/30 rounded-lg border-4 border-slate-800 shadow-2xl cursor-pointer overflow-hidden"
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setHoveredObject('window')}
            onHoverEnd={() => setHoveredObject(null)}
            onClick={() => objects.find(o => o.id === 'window')?.action()}
          >
            {/* City skyline silhouette visible through window */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent">
              <div className="absolute bottom-0 left-2 w-8 h-16 bg-slate-800" />
              <div className="absolute bottom-0 left-12 w-6 h-20 bg-slate-800" />
              <div className="absolute bottom-0 left-20 w-10 h-12 bg-slate-800" />
              <div className="absolute bottom-0 right-8 w-8 h-18 bg-slate-800" />
              
              {/* Blinking lights on buildings */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                  style={{
                    left: `${10 + i * 12}%`,
                    bottom: `${20 + (i % 3) * 8}px`
                  }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
                />
              ))}
            </div>
            
            {/* Window frame divisions */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800" />
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-slate-800" />
          </motion.div>

          {/* Desk */}
          <div className="absolute bottom-[35%] left-[30%] w-48 h-32">
            {/* Desk surface */}
            <div className="absolute bottom-0 w-full h-4 bg-gradient-to-b from-amber-800 to-amber-900 rounded-t-lg" 
                 style={{ transform: 'perspective(200px) rotateX(60deg)', transformOrigin: 'bottom' }} />
            
            {/* Desk front */}
            <div className="absolute bottom-0 w-full h-16 bg-gradient-to-b from-amber-900 to-amber-950 border-t border-amber-700" />
            
            {/* Desk legs */}
            <div className="absolute bottom-0 left-2 w-2 h-16 bg-gradient-to-r from-amber-900 to-amber-800" />
            <div className="absolute bottom-0 right-2 w-2 h-16 bg-gradient-to-r from-amber-800 to-amber-900" />

            {/* Computer on desk */}
            <motion.div
              className="absolute bottom-16 left-1/2 transform -translate-x-1/2 cursor-pointer"
              whileHover={{ scale: 1.1, y: -5 }}
              onHoverStart={() => setHoveredObject('computer')}
              onHoverEnd={() => setHoveredObject(null)}
              onClick={() => objects.find(o => o.id === 'computer')?.action()}
            >
              {/* Monitor */}
              <div className="relative w-32 h-24 bg-gradient-to-b from-slate-700 to-slate-900 rounded-lg border-2 border-slate-600 shadow-xl">
                {/* Screen glow */}
                <div className="absolute inset-2 bg-gradient-to-br from-blue-400/40 to-purple-500/40 rounded">
                  {/* Fake terminal text */}
                  <div className="p-2 text-[6px] text-green-400 font-mono opacity-70">
                    {'> npm run dev\n> ready on localhost:3000\n> █'}
                  </div>
                </div>
                {/* Stand */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-slate-600 to-slate-700 rounded-b" />
              </div>
            </motion.div>

            {/* Phone on desk */}
            <motion.div
              className="absolute bottom-16 right-4 cursor-pointer"
              animate={{ rotate: [0, -2, 2, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              whileHover={{ scale: 1.2 }}
              onHoverStart={() => setHoveredObject('phone')}
              onHoverEnd={() => setHoveredObject(null)}
              onClick={() => objects.find(o => o.id === 'phone')?.action()}
            >
              <div className="w-8 h-12 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border border-slate-600 shadow-lg">
                <div className="absolute inset-1 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded" />
                <motion.div 
                  className="absolute top-1 right-1 w-1 h-1 bg-green-400 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Desk lamp */}
            <div className="absolute bottom-16 left-4">
              <div className="w-2 h-12 bg-gradient-to-b from-amber-600 to-amber-800" />
              <motion.div 
                className="absolute -top-3 -left-2 w-6 h-6 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-full"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-yellow-300 rounded-full blur-sm" />
              </motion.div>
            </div>
          </div>

          {/* Chair */}
          <div className="absolute bottom-[30%] left-[35%] w-16 h-20">
            {/* Seat */}
            <div className="absolute bottom-12 w-full h-6 bg-gradient-to-b from-slate-700 to-slate-800 rounded-t-lg" 
                 style={{ transform: 'perspective(100px) rotateX(50deg)', transformOrigin: 'bottom' }} />
            {/* Back */}
            <div className="absolute bottom-18 w-full h-16 bg-gradient-to-b from-slate-700 to-slate-800 rounded-t-lg" />
            {/* Leg */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-12 bg-gradient-to-b from-slate-600 to-slate-800" />
          </div>

          {/* Wardrobe */}
          <motion.div
            className="absolute bottom-[30%] left-[8%] w-28 h-48 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setHoveredObject('wardrobe')}
            onHoverEnd={() => setHoveredObject(null)}
            onClick={() => objects.find(o => o.id === 'wardrobe')?.action()}
          >
            {/* Wardrobe body */}
            <div className="w-full h-full bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-lg border-2 border-amber-950 shadow-2xl">
              {/* Door handles */}
              <div className="absolute top-1/2 left-4 w-2 h-3 bg-yellow-600 rounded" />
              <div className="absolute top-1/2 right-4 w-2 h-3 bg-yellow-600 rounded" />
              {/* Center divider */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-amber-950" />
            </div>
          </motion.div>

          {/* Bed */}
          <motion.div
            className="absolute bottom-[25%] right-[12%] w-56 h-40 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setHoveredObject('bed')}
            onHoverEnd={() => setHoveredObject(null)}
            onClick={() => objects.find(o => o.id === 'bed')?.action()}
          >
            {/* Mattress */}
            <div className="absolute bottom-8 w-full h-16 bg-gradient-to-b from-blue-800 to-blue-900 rounded-lg border-2 border-blue-950 shadow-xl"
                 style={{ transform: 'perspective(300px) rotateX(50deg)', transformOrigin: 'bottom' }}>
              {/* Blanket details */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)'
              }} />
            </div>
            
            {/* Pillow */}
            <div className="absolute bottom-24 right-8 w-20 h-8 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full shadow-lg"
                 style={{ transform: 'perspective(200px) rotateX(60deg)' }} />

            {/* Bed frame */}
            <div className="absolute bottom-0 w-full h-8 bg-gradient-to-b from-amber-800 to-amber-900 rounded border-2 border-amber-950" />
          </motion.div>

          {/* Backpack on floor */}
          <div className="absolute bottom-[25%] left-[20%] w-12 h-16 bg-gradient-to-br from-red-800 to-red-900 rounded-lg shadow-lg">
            <div className="absolute top-2 left-2 right-2 h-2 bg-red-950 rounded" />
          </div>

          {/* Rug */}
          <div className="absolute bottom-[28%] left-1/2 transform -translate-x-1/2 w-64 h-32 bg-gradient-to-br from-purple-900/40 to-purple-950/40 rounded-lg"
               style={{ transform: 'perspective(400px) rotateX(65deg) translateX(-50%)', transformOrigin: 'center' }}>
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(255,255,255,0.1) 15px, rgba(255,255,255,0.1) 16px)'
            }} />
          </div>
        </div>

        {/* Character placeholder - will be replaced with actual character */}
        <motion.div
          className="absolute bottom-[32%] left-[45%] text-6xl pointer-events-none"
          animate={{ 
            y: [0, -3, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🧑‍💻
        </motion.div>
      </div>

      {/* Hover Info */}
      {hoveredObject && (
        <motion.div
          className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl px-4 py-3 pointer-events-none z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-white font-bold mb-1">
            {objects.find(o => o.id === hoveredObject)?.icon} {objects.find(o => o.id === hoveredObject)?.name}
          </div>
          <div className="text-sm text-gray-400">
            {objects.find(o => o.id === hoveredObject)?.description}
          </div>
          <div className="text-xs text-purple-400 mt-1">Click to interact</div>
        </motion.div>
      )}

      {/* Room Title */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <h2 className="text-2xl font-bold text-white drop-shadow-lg">
          🏠 {characterName}'s Room
        </h2>
        <p className="text-sm text-gray-400">BEDROOM TRADER</p>
      </div>
    </div>
  );
}
