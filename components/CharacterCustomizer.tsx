'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import VisualCharacter, { CharacterAvatar } from './VisualCharacter';

interface CharacterCustomizerProps {
  initialAvatar: CharacterAvatar;
  onSave: (avatar: CharacterAvatar) => void;
  onCancel: () => void;
}

const SKIN_TONES = [
  { name: 'Light', value: '#FFDBAC' },
  { name: 'Medium Light', value: '#F1C27D' },
  { name: 'Medium', value: '#E0AC69' },
  { name: 'Tan', value: '#C68642' },
  { name: 'Brown', value: '#8D5524' },
  { name: 'Dark', value: '#5C3317' },
];

const HAIR_STYLES = [
  { name: 'Short', value: 'short' as const },
  { name: 'Long', value: 'long' as const },
  { name: 'Bald', value: 'bald' as const },
  { name: 'Curly', value: 'curly' as const },
  { name: 'Ponytail', value: 'ponytail' as const },
];

const HAIR_COLORS = [
  { name: 'Black', value: '#1F2937' },
  { name: 'Brown', value: '#4A3F35' },
  { name: 'Blonde', value: '#F9E4B7' },
  { name: 'Red', value: '#C1554D' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'White', value: '#E5E7EB' },
];

const OUTFITS = [
  { name: 'Casual', value: 'casual' as const, emoji: '👕' },
  { name: 'Hoodie', value: 'hoodie' as const, emoji: '🧥' },
  { name: 'T-Shirt', value: 'tshirt' as const, emoji: '👔' },
  { name: 'Suit', value: 'suit' as const, emoji: '🤵' },
];

const ACCESSORIES = [
  { name: 'Glasses', value: 'glasses', emoji: '👓' },
  { name: 'Headphones', value: 'headphones', emoji: '🎧' },
  { name: 'Hat', value: 'hat', emoji: '🎩' },
];

export default function CharacterCustomizer({ initialAvatar, onSave, onCancel }: CharacterCustomizerProps) {
  const [avatar, setAvatar] = useState<CharacterAvatar>(initialAvatar);
  const [currentTab, setCurrentTab] = useState<'skin' | 'hair' | 'outfit' | 'accessories'>('skin');

  const toggleAccessory = (accessory: string) => {
    if (avatar.accessories.includes(accessory)) {
      setAvatar({
        ...avatar,
        accessories: avatar.accessories.filter(a => a !== accessory)
      });
    } else {
      setAvatar({
        ...avatar,
        accessories: [...avatar.accessories, accessory]
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-slate-800 border-2 border-slate-600 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
          <h2 className="text-3xl font-bold text-white mb-2">👔 Customize Your Character</h2>
          <p className="text-purple-100">Create your CT Life avatar</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Preview */}
          <div className="flex flex-col items-center justify-center bg-slate-900 rounded-xl p-8 border border-slate-700">
            <h3 className="text-white font-bold mb-4">Preview</h3>
            <VisualCharacter avatar={avatar} size="large" animation="idle" />
            <div className="mt-6 space-y-2">
              <button
                onClick={() => setAvatar({ ...avatar, accessories: [] })}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear Accessories
              </button>
            </div>
          </div>

          {/* Customization Options */}
          <div className="flex flex-col">
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {(['skin', 'hair', 'outfit', 'accessories'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                    currentTab === tab
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Options Panel */}
            <div className="flex-1 bg-slate-900 rounded-xl p-4 border border-slate-700 overflow-y-auto max-h-[400px]">
              {/* Skin Tone */}
              {currentTab === 'skin' && (
                <div>
                  <h4 className="text-white font-bold mb-3">Skin Tone</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {SKIN_TONES.map((tone) => (
                      <button
                        key={tone.value}
                        onClick={() => setAvatar({ ...avatar, skin_tone: tone.value })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          avatar.skin_tone === tone.value
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div
                          className="w-full h-12 rounded-lg mb-2"
                          style={{ backgroundColor: tone.value }}
                        />
                        <div className="text-xs text-white">{tone.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hair */}
              {currentTab === 'hair' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-bold mb-3">Hair Style</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {HAIR_STYLES.map((style) => (
                        <button
                          key={style.value}
                          onClick={() => setAvatar({ ...avatar, hair_style: style.value })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            avatar.hair_style === style.value
                              ? 'border-purple-500 bg-purple-500/20'
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <div className="text-white text-sm font-medium">{style.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-bold mb-3">Hair Color</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {HAIR_COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setAvatar({ ...avatar, hair_color: color.value })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            avatar.hair_color === color.value
                              ? 'border-purple-500'
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <div
                            className="w-full h-8 rounded"
                            style={{ backgroundColor: color.value }}
                          />
                          <div className="text-xs text-white mt-1">{color.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Outfit */}
              {currentTab === 'outfit' && (
                <div>
                  <h4 className="text-white font-bold mb-3">Outfit</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {OUTFITS.map((outfit) => (
                      <button
                        key={outfit.value}
                        onClick={() => setAvatar({ ...avatar, outfit: outfit.value })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          avatar.outfit === outfit.value
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="text-3xl mb-2">{outfit.emoji}</div>
                        <div className="text-white text-sm font-medium">{outfit.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Accessories */}
              {currentTab === 'accessories' && (
                <div>
                  <h4 className="text-white font-bold mb-3">Accessories</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {ACCESSORIES.map((accessory) => (
                      <button
                        key={accessory.value}
                        onClick={() => toggleAccessory(accessory.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          avatar.accessories.includes(accessory.value)
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="text-3xl mb-2">{accessory.emoji}</div>
                        <div className="text-white text-sm font-medium">{accessory.name}</div>
                        {avatar.accessories.includes(accessory.value) && (
                          <div className="text-xs text-purple-400 mt-1">✓ Active</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-700 p-6 flex justify-between">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(avatar)}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all"
          >
            Save Character
          </button>
        </div>
      </motion.div>
    </div>
  );
}
