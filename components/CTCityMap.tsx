'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Floating NPCs
  const [npcs] = useState([
    { id: 1, x: 100, y: 80, emoji: '🧑‍💻', direction: 1 },
    { id: 2, x: 300, y: 150, emoji: '👨‍💼', direction: -1 },
    { id: 3, x: 200, y: 200, emoji: '👩‍🎨', direction: 1 },
    { id: 4, x: 400, y: 120, emoji: '🧑‍🚀', direction: -1 },
    { id: 5, x: 150, y: 250, emoji: '👨‍🔬', direction: 1 },
  ]);

  const [tickers] = useState([
    { text: '$FROGGO +24%', color: '#10b981', x: 100 },
    { text: '$COPE -12%', color: '#ef4444', x: 300 },
    { text: '$YAP +5%', color: '#10b981', x: 500 },
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

      {/* Floating tickers */}
      <div className="absolute top-4 left-0 right-0 flex gap-8 overflow-hidden pointer-events-none">
        {tickers.map((ticker, idx) => (
          <motion.div
            key={idx}
            className="text-sm font-bold whitespace-nowrap"
            style={{ color: ticker.color }}
            initial={{ x: ticker.x }}
            animate={{ x: [ticker.x, ticker.x + 400] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          >
            {ticker.text}
          </motion.div>
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

          {/* Floating NPCs */}
          {npcs.map((npc) => (
            <motion.div
              key={npc.id}
              className="absolute text-3xl pointer-events-none"
              style={{ left: npc.x, top: npc.y }}
              animate={{
                x: [0, npc.direction * 30, 0],
                y: [0, -5, 0]
              }}
              transition={{
                duration: 4 + npc.id,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {npc.emoji}
            </motion.div>
          ))}

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
