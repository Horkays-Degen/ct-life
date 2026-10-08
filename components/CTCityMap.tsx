'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualCharacter, { CharacterAvatar } from './VisualCharacter';

interface District {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  locked: boolean;
  description: string;
  icon: string;
}

const DISTRICTS: District[] = [
  {
    id: 'timeline_plaza',
    name: 'Timeline Plaza',
    position: { x: 50, y: 30 },
    size: { width: 180, height: 140 },
    color: '#3b82f6',
    locked: false,
    description: 'The heart of CT. Post, reply, and watch your reach grow.',
    icon: '📱'
  },
  {
    id: 'degen_district',
    name: 'Degen District',
    position: { x: 250, y: 120 },
    size: { width: 160, height: 120 },
    color: '#10b981',
    locked: false,
    description: 'High-risk trading zone. Neon charts and volatile tokens.',
    icon: '📊'
  },
  {
    id: 'builder_block',
    name: 'Builder Block',
    position: { x: 50, y: 180 },
    size: { width: 140, height: 120 },
    color: '#8b5cf6',
    locked: false,
    description: 'Code, ship, and build the future.',
    icon: '🛠️'
  },
  {
    id: 'spaces_arena',
    name: 'Spaces Arena',
    position: { x: 250, y: 30 },
    size: { width: 120, height: 100 },
    color: '#ec4899',
    locked: true,
    description: 'Audio arena. Host, speak, and network.',
    icon: '🎤'
  },
  {
    id: 'research_lab',
    name: 'Research Lab',
    position: { x: 420, y: 80 },
    size: { width: 140, height: 110 },
    color: '#06b6d4',
    locked: true,
    description: 'Deep research and alpha discovery.',
    icon: '🔬'
  },
  {
    id: 'meme_factory',
    name: 'Meme Factory',
    position: { x: 420, y: 200 },
    size: { width: 130, height: 100 },
    color: '#f59e0b',
    locked: true,
    description: 'Produce viral memes and timeline gold.',
    icon: '😂'
  },
  {
    id: 'kol_tower',
    name: 'KOL Tower',
    position: { x: 250, y: 260 },
    size: { width: 100, height: 180 },
    color: '#fbbf24',
    locked: true,
    description: 'Luxury tower for the timeline elite.',
    icon: '👑'
  },
  {
    id: 'airdrop_terminal',
    name: 'Airdrop Terminal',
    position: { x: 50, y: 320 },
    size: { width: 160, height: 100 },
    color: '#14b8a6',
    locked: true,
    description: 'Multi-chain terminal. Claim your allocations.',
    icon: '🪂'
  }
];

interface CTCityMapProps {
  onDistrictClick: (districtId: string) => void;
}

export default function CTCityMap({ onDistrictClick }: CTCityMapProps) {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  // Enhanced NPCs with actual characters
  const [npcs] = useState([
    { 
      id: 1, 
      x: 100, 
      y: 80, 
      avatar: {
        skin_tone: '#F1C27D',
        hair_style: 'short' as const,
        hair_color: '#1F2937',
        outfit: 'hoodie' as const,
        accessories: ['headphones']
      },
      direction: 1,
      speed: 0.5
    },
    { 
      id: 2, 
      x: 300, 
      y: 150, 
      avatar: {
        skin_tone: '#FFDBAC',
        hair_style: 'long' as const,
        hair_color: '#F9E4B7',
        outfit: 'tshirt' as const,
        accessories: ['glasses']
      },
      direction: -1,
      speed: 0.3
    },
    { 
      id: 3, 
      x: 200, 
      y: 200, 
      avatar: {
        skin_tone: '#C68642',
        hair_style: 'curly' as const,
        hair_color: '#4A3F35',
        outfit: 'casual' as const,
        accessories: []
      },
      direction: 1,
      speed: 0.4
    },
    { 
      id: 4, 
      x: 400, 
      y: 120, 
      avatar: {
        skin_tone: '#E0AC69',
        hair_style: 'ponytail' as const,
        hair_color: '#EC4899',
        outfit: 'suit' as const,
        accessories: ['glasses']
      },
      direction: -1,
      speed: 0.6
    },
    { 
      id: 5, 
      x: 150, 
      y: 250, 
      avatar: {
        skin_tone: '#8D5524',
        hair_style: 'bald' as const,
        hair_color: '#1F2937',
        outfit: 'hoodie' as const,
        accessories: ['hat']
      },
      direction: 1,
      speed: 0.35
    },
    { 
      id: 6, 
      x: 320, 
      y: 280, 
      avatar: {
        skin_tone: '#FFDBAC',
        hair_style: 'short' as const,
        hair_color: '#3B82F6',
        outfit: 'tshirt' as const,
        accessories: ['headphones']
      },
      direction: -1,
      speed: 0.45
    },
    { 
      id: 7, 
      x: 450, 
      y: 160, 
      avatar: {
        skin_tone: '#5C3317',
        hair_style: 'long' as const,
        hair_color: '#8B5CF6',
        outfit: 'casual' as const,
        accessories: []
      },
      direction: 1,
      speed: 0.55
    }
  ]);

  const [tickers] = useState([
    { text: '$FROGGO +24%', color: '#10b981', x: 100, speed: 1 },
    { text: '$COPE -12%', color: '#ef4444', x: 300, speed: 1.2 },
    { text: '$YAP +5%', color: '#10b981', x: 500, speed: 0.8 },
    { text: '$BAGS +18%', color: '#10b981', x: 700, speed: 1.1 },
    { text: '$QUANTUM -8%', color: '#ef4444', x: 900, speed: 0.9 },
  ]);

  // Moving cars
  const [cars] = useState([
    { id: 1, x: 50, y: 180, direction: 1, color: '#3B82F6', speed: 2 },
    { id: 2, x: 400, y: 250, direction: -1, color: '#EC4899', speed: 1.8 },
    { id: 3, x: 200, y: 320, direction: 1, color: '#10B981', speed: 2.2 },
  ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.5, Math.min(2, prev * delta)));
  };

  return (
    <div 
      className="relative w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      ref={mapRef}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'gridScroll 20s linear infinite'
        }} />
      </div>

      {/* Floating tickers - Enhanced */}
      <div className="absolute top-4 left-0 right-0 overflow-hidden pointer-events-none">
        <div className="flex gap-8">
          {tickers.map((ticker, idx) => (
            <motion.div
              key={idx}
              className="text-sm font-bold whitespace-nowrap px-3 py-1 rounded-full border"
              style={{ 
                color: ticker.color,
                backgroundColor: `${ticker.color}22`,
                borderColor: `${ticker.color}66`
              }}
              initial={{ x: ticker.x }}
              animate={{ x: [ticker.x, ticker.x + 1000] }}
              transition={{ duration: 20 / ticker.speed, repeat: Infinity, ease: 'linear' }}
            >
              {ticker.text}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating particles/effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-30"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3
            }}
          />
        ))}
      </div>

      {/* City Title */}
      <motion.div 
        className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
          CT CITY
        </h1>
        <p className="text-center text-gray-400 text-sm mt-2">Click a district to enter</p>
      </motion.div>

      {/* The City Map */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center'
        }}
      >
        <div className="relative" style={{ width: '600px', height: '500px' }}>
          {/* Roads/Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <line x1="140" y1="100" x2="310" y2="80" stroke="#475569" strokeWidth="4" strokeDasharray="8,4" />
            <line x1="140" y1="240" x2="310" y2="180" stroke="#475569" strokeWidth="4" strokeDasharray="8,4" />
            <line x1="310" y1="180" x2="310" y2="320" stroke="#475569" strokeWidth="4" strokeDasharray="8,4" />
            <line x1="140" y1="380" x2="310" y2="320" stroke="#475569" strokeWidth="4" strokeDasharray="8,4" />
          </svg>

          {/* Districts */}
          {DISTRICTS.map((district) => (
            <motion.div
              key={district.id}
              className="absolute cursor-pointer"
              style={{
                left: district.position.x,
                top: district.position.y,
                width: district.size.width,
                height: district.size.height,
                zIndex: district.locked ? 1 : 2
              }}
              onHoverStart={() => setHoveredDistrict(district.id)}
              onHoverEnd={() => setHoveredDistrict(null)}
              onClick={() => !district.locked && onDistrictClick(district.id)}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Building Base (Isometric) */}
              <div className="relative w-full h-full">
                {/* Building Front Face */}
                <div 
                  className="absolute bottom-0 w-full rounded-t-lg transition-all duration-300"
                  style={{
                    height: '70%',
                    background: district.locked 
                      ? 'linear-gradient(to bottom, #1e293b 0%, #0f172a 100%)'
                      : `linear-gradient(to bottom, ${district.color}dd 0%, ${district.color}44 100%)`,
                    border: `2px solid ${district.locked ? '#334155' : district.color}`,
                    boxShadow: district.locked 
                      ? 'none' 
                      : `0 10px 40px ${district.color}66, inset 0 -10px 20px rgba(0,0,0,0.3)`
                  }}
                >
                  {/* Windows/Details */}
                  <div className="absolute inset-0 p-2 grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, idx) => (
                      <motion.div
                        key={idx}
                        className="bg-yellow-200/20 rounded-sm"
                        animate={{
                          opacity: district.locked ? 0.2 : [0.4, 0.8, 0.4]
                        }}
                        transition={{
                          duration: 2 + idx * 0.3,
                          repeat: Infinity,
                          delay: idx * 0.2
                        }}
                      />
                    ))}
                  </div>

                  {/* Rooftop Antenna/Details */}
                  {!district.locked && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <motion.div
                        className="w-1 h-6 bg-red-500"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-400 rounded-full" />
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* Building Roof (Isometric Top) */}
                <div 
                  className="absolute top-0 w-full rounded-sm"
                  style={{
                    height: '30%',
                    background: district.locked 
                      ? 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'
                      : `linear-gradient(135deg, ${district.color}ff 0%, ${district.color}aa 100%)`,
                    transform: 'perspective(100px) rotateX(45deg)',
                    transformOrigin: 'bottom',
                    border: `1px solid ${district.locked ? '#475569' : district.color}`
                  }}
                />

                {/* District Icon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl pointer-events-none filter drop-shadow-lg">
                  {district.locked ? '🔒' : district.icon}
                </div>

                {/* District Name */}
                <div 
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center pointer-events-none"
                >
                  <div className="text-white font-bold text-sm drop-shadow-lg">
                    {district.name}
                  </div>
                  {district.locked && (
                    <div className="text-xs text-gray-500">Coming Soon</div>
                  )}
                </div>

                {/* Hover Glow */}
                {hoveredDistrict === district.id && !district.locked && (
                  <motion.div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${district.color}44 0%, transparent 70%)`,
                      filter: 'blur(20px)'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </div>
            </motion.div>
          ))}

          {/* Floating NPCs - Actual Characters */}
          {npcs.map((npc) => (
            <motion.div
              key={npc.id}
              className="absolute pointer-events-none"
              style={{ left: npc.x, top: npc.y, zIndex: 5 }}
              animate={{
                x: [0, npc.direction * 40 * npc.speed, 0],
                transition: { duration: 5 / npc.speed, repeat: Infinity, ease: 'linear' }
              }}
            >
              <VisualCharacter 
                avatar={npc.avatar}
                size="small"
                animation="walking"
              />
            </motion.div>
          ))}

          {/* Moving Cars */}
          {cars.map((car) => (
            <motion.div
              key={car.id}
              className="absolute pointer-events-none"
              style={{ left: car.x, top: car.y, zIndex: 3 }}
              animate={{
                x: car.direction === 1 ? [0, 600] : [600, 0],
                transition: { duration: 15 / car.speed, repeat: Infinity, ease: 'linear' }
              }}
            >
              {/* Simple car SVG */}
              <svg width="40" height="20" viewBox="0 0 40 20">
                {/* Car body */}
                <rect x="5" y="8" width="30" height="10" rx="2" fill={car.color} />
                {/* Car top */}
                <path d="M 12 8 L 15 3 L 25 3 L 28 8 Z" fill={car.color} opacity="0.8" />
                {/* Windows */}
                <rect x="16" y="4" width="8" height="3" fill="#60A5FA" opacity="0.6" />
                {/* Wheels */}
                <circle cx="13" cy="18" r="3" fill="#1F2937" />
                <circle cx="27" cy="18" r="3" fill="#1F2937" />
                {/* Wheel details */}
                <circle cx="13" cy="18" r="1.5" fill="#475569" />
                <circle cx="27" cy="18" r="1.5" fill="#475569" />
                {/* Headlights */}
                {car.direction === 1 && (
                  <circle cx="35" cy="13" r="1.5" fill="#FCD34D" opacity="0.8" />
                )}
                {car.direction === -1 && (
                  <circle cx="5" cy="13" r="1.5" fill="#FCD34D" opacity="0.8" />
                )}
              </svg>
            </motion.div>
          ))}

          {/* Animated Billboards on Buildings */}
          <motion.div
            className="absolute top-[15%] left-[25%] bg-slate-900/80 border border-purple-500 rounded p-2 text-xs text-purple-300 font-bold pointer-events-none"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🚀 TO THE MOON
          </motion.div>

          <motion.div
            className="absolute top-[40%] right-[10%] bg-slate-900/80 border border-green-500 rounded p-2 text-xs text-green-300 font-bold pointer-events-none"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✅ VERIFIED
          </motion.div>

          <motion.div
            className="absolute bottom-[45%] left-[15%] bg-slate-900/80 border border-cyan-500 rounded p-2 text-xs text-cyan-300 font-bold pointer-events-none"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            💎 WAGMI
          </motion.div>

          {/* Street Lamps */}
          <div className="absolute bottom-[30%] left-[20%] pointer-events-none">
            <div className="w-1 h-16 bg-slate-700" />
            <motion.div 
              className="w-6 h-6 bg-yellow-300 rounded-full -mt-2 -ml-2.5"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="absolute inset-0 bg-yellow-300 rounded-full blur-md" />
            </motion.div>
          </div>

          <div className="absolute bottom-[30%] right-[25%] pointer-events-none">
            <div className="w-1 h-16 bg-slate-700" />
            <motion.div 
              className="w-6 h-6 bg-yellow-300 rounded-full -mt-2 -ml-2.5"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.3, repeat: Infinity, delay: 0.5 }}
            >
              <div className="absolute inset-0 bg-yellow-300 rounded-full blur-md" />
            </motion.div>
          </div>

          {/* Floating text bubbles */}
          <motion.div
            className="absolute text-xs bg-slate-800/90 px-2 py-1 rounded-full text-white"
            style={{ left: 180, top: 120 }}
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            gm
          </motion.div>

          <motion.div
            className="absolute text-xs bg-slate-800/90 px-2 py-1 rounded-full text-white"
            style={{ left: 350, top: 200 }}
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            wen token
          </motion.div>
        </div>
      </motion.div>

      {/* District Info Panel */}
      <AnimatePresence>
        {hoveredDistrict && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl p-4 max-w-sm pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {(() => {
              const district = DISTRICTS.find(d => d.id === hoveredDistrict);
              return district ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{district.icon}</span>
                    <h3 className="text-white font-bold">{district.name}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{district.description}</p>
                  {district.locked && (
                    <div className="mt-2 text-xs text-yellow-500">🔒 Unlocks later</div>
                  )}
                </>
              ) : null;
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 pointer-events-none">
        <div>🖱️ Drag to pan</div>
        <div>🔍 Scroll to zoom</div>
      </div>

      <style jsx>{`
        @keyframes gridScroll {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
}
