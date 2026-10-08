'use client';

import { motion } from 'framer-motion';

export interface CharacterAvatar {
  skin_tone: string;
  hair_style: 'short' | 'long' | 'bald' | 'curly' | 'ponytail';
  hair_color: string;
  outfit: 'casual' | 'hoodie' | 'suit' | 'tshirt' | 'dress';
  accessories: string[];
}

interface VisualCharacterProps {
  avatar: CharacterAvatar;
  size?: 'small' | 'medium' | 'large';
  animation?: 'idle' | 'walking' | 'typing' | 'celebrating' | 'sad';
  className?: string;
}

export default function VisualCharacter({ 
  avatar, 
  size = 'medium', 
  animation = 'idle',
  className = '' 
}: VisualCharacterProps) {
  
  const sizeMap = {
    small: 40,
    medium: 80,
    large: 120
  };

  const baseSize = sizeMap[size];

  // Animation variants
  const animations = {
    idle: {
      y: [0, -3, 0],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const }
    },
    walking: {
      x: [0, 5, 0, -5, 0],
      y: [0, -2, 0, -2, 0],
      transition: { duration: 0.8, repeat: Infinity }
    },
    typing: {
      rotate: [0, -2, 2, 0],
      transition: { duration: 0.5, repeat: Infinity }
    },
    celebrating: {
      y: [0, -10, 0],
      rotate: [0, -10, 10, 0],
      transition: { duration: 0.6, repeat: 3 }
    },
    sad: {
      y: [0, 2, 0],
      rotate: [0, 5, 0],
      transition: { duration: 1.5, repeat: Infinity }
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: baseSize, height: baseSize * 1.5 }}
      animate={animations[animation]}
    >
      {/* Character Container */}
      <svg
        viewBox="0 0 100 150"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Shadow */}
        <ellipse cx="50" cy="140" rx="20" ry="5" fill="rgba(0,0,0,0.3)" />

        {/* Body - Outfit */}
        {avatar.outfit === 'hoodie' && (
          <g>
            {/* Hoodie body */}
            <path
              d="M 35 70 L 30 120 L 70 120 L 65 70 Z"
              fill="#4B5563"
              stroke="#1F2937"
              strokeWidth="1"
            />
            {/* Hood */}
            <path
              d="M 30 55 Q 20 45 20 35 L 30 40 L 50 30 L 70 40 L 80 35 Q 80 45 70 55 Z"
              fill="#6B7280"
              stroke="#1F2937"
              strokeWidth="1"
            />
          </g>
        )}

        {avatar.outfit === 'tshirt' && (
          <g>
            {/* T-shirt */}
            <rect x="30" y="70" width="40" height="50" rx="5" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1" />
            {/* Sleeves */}
            <rect x="25" y="70" width="10" height="20" rx="3" fill="#3B82F6" />
            <rect x="65" y="70" width="10" height="20" rx="3" fill="#3B82F6" />
          </g>
        )}

        {avatar.outfit === 'suit' && (
          <g>
            {/* Suit jacket */}
            <path
              d="M 35 70 L 30 120 L 48 120 L 48 70 Z"
              fill="#1F2937"
              stroke="#0F172A"
              strokeWidth="1"
            />
            <path
              d="M 65 70 L 70 120 L 52 120 L 52 70 Z"
              fill="#1F2937"
              stroke="#0F172A"
              strokeWidth="1"
            />
            {/* Shirt */}
            <rect x="45" y="70" width="10" height="30" fill="#FFFFFF" />
            {/* Tie */}
            <rect x="48" y="75" width="4" height="25" fill="#DC2626" />
          </g>
        )}

        {avatar.outfit === 'casual' && (
          <g>
            {/* Casual shirt */}
            <rect x="32" y="70" width="36" height="50" rx="4" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="1" />
          </g>
        )}

        {/* Arms */}
        <rect x="25" y="75" width="8" height="35" rx="4" fill={avatar.skin_tone} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
        <rect x="67" y="75" width="8" height="35" rx="4" fill={avatar.skin_tone} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />

        {/* Hands */}
        <circle cx="29" cy="112" r="5" fill={avatar.skin_tone} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
        <circle cx="71" cy="112" r="5" fill={avatar.skin_tone} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />

        {/* Neck */}
        <rect x="43" y="58" width="14" height="12" rx="2" fill={avatar.skin_tone} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />

        {/* Head */}
        <circle cx="50" cy="45" r="20" fill={avatar.skin_tone} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />

        {/* Hair */}
        {avatar.hair_style === 'short' && (
          <path
            d="M 30 45 Q 30 25 50 25 Q 70 25 70 45 L 65 40 L 35 40 Z"
            fill={avatar.hair_color}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="1"
          />
        )}

        {avatar.hair_style === 'long' && (
          <g>
            <path
              d="M 30 45 Q 30 20 50 20 Q 70 20 70 45"
              fill={avatar.hair_color}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />
            <path
              d="M 30 45 L 25 70 L 35 65 Z"
              fill={avatar.hair_color}
            />
            <path
              d="M 70 45 L 75 70 L 65 65 Z"
              fill={avatar.hair_color}
            />
          </g>
        )}

        {avatar.hair_style === 'bald' && (
          <ellipse cx="50" cy="30" rx="18" ry="8" fill={avatar.skin_tone} opacity="0.8" />
        )}

        {avatar.hair_style === 'curly' && (
          <g>
            <circle cx="35" cy="32" r="6" fill={avatar.hair_color} />
            <circle cx="45" cy="28" r="6" fill={avatar.hair_color} />
            <circle cx="55" cy="28" r="6" fill={avatar.hair_color} />
            <circle cx="65" cy="32" r="6" fill={avatar.hair_color} />
            <circle cx="40" cy="38" r="5" fill={avatar.hair_color} />
            <circle cx="60" cy="38" r="5" fill={avatar.hair_color} />
          </g>
        )}

        {avatar.hair_style === 'ponytail' && (
          <g>
            <path
              d="M 30 45 Q 30 25 50 25 Q 70 25 70 45 L 65 40 L 35 40 Z"
              fill={avatar.hair_color}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />
            <ellipse cx="70" cy="45" rx="8" ry="15" fill={avatar.hair_color} />
          </g>
        )}

        {/* Face Features */}
        {/* Eyes */}
        <circle cx="42" cy="45" r="2" fill="#1F2937" />
        <circle cx="58" cy="45" r="2" fill="#1F2937" />
        
        {/* Smile */}
        <path
          d="M 42 52 Q 50 56 58 52"
          stroke="#1F2937"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Accessories */}
        {avatar.accessories.includes('glasses') && (
          <g>
            <circle cx="42" cy="45" r="6" fill="none" stroke="#1F2937" strokeWidth="2" />
            <circle cx="58" cy="45" r="6" fill="none" stroke="#1F2937" strokeWidth="2" />
            <line x1="48" y1="45" x2="52" y2="45" stroke="#1F2937" strokeWidth="2" />
          </g>
        )}

        {avatar.accessories.includes('headphones') && (
          <g>
            <path
              d="M 28 40 Q 25 45 28 50"
              stroke="#3B82F6"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 72 40 Q 75 45 72 50"
              stroke="#3B82F6"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 28 40 Q 50 30 72 40"
              stroke="#3B82F6"
              strokeWidth="3"
              fill="none"
            />
          </g>
        )}

        {avatar.accessories.includes('hat') && (
          <g>
            <ellipse cx="50" cy="25" rx="25" ry="5" fill="#DC2626" />
            <path
              d="M 35 25 L 40 15 L 60 15 L 65 25 Z"
              fill="#DC2626"
              stroke="#991B1B"
              strokeWidth="1"
            />
          </g>
        )}

        {/* Pants/Legs */}
        <g>
          <rect x="38" y="120" width="10" height="25" rx="2" fill="#1F2937" />
          <rect x="52" y="120" width="10" height="25" rx="2" fill="#1F2937" />
        </g>

        {/* Shoes */}
        <ellipse cx="43" cy="145" rx="6" ry="3" fill="#0F172A" />
        <ellipse cx="57" cy="145" rx="6" ry="3" fill="#0F172A" />
      </svg>
    </motion.div>
  );
}
