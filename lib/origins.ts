import { Origin } from './types';

export const ORIGINS: Origin[] = [
  {
    id: 'fresh_wallet',
    name: 'FRESH WALLET',
    description: 'you discovered crypto three business days ago.',
    flavor_text: 'everyone starts somewhere. most just don\'t start this recently.',
    starting_credits: 2500,
    starting_followers: 80,
    starting_reputation: 50,
    probability: 0.22,
    rarity: 'common',
    special_effects: [
      {
        name: 'Beginner\'s Curiosity',
        description: 'All Skills train 25% faster during early game',
        effect_type: 'skill_xp_multiplier',
        value: 1.25
      },
      {
        name: 'Nothing to Lose',
        description: 'Recover Conviction faster after early losses',
        effect_type: 'conviction_recovery',
        value: 1.3
      }
    ],
    downsides: [
      {
        name: 'Nobody Knows You',
        description: 'Very low initial Network. Premium opportunities initially inaccessible',
        effect_type: 'network_penalty',
        value: -20
      }
    ],
    starting_skills: {
      trading: 0,
      research: 0,
      writing: 0,
      memes: 0,
      networking: 0,
      coding: 0,
      onchain: 0,
      community: 0,
      sales: 0,
      content: 0
    }
  },
  {
    id: 'reply_guy',
    name: 'REPLY GUY',
    description: 'gm ser. noticed you followed.',
    flavor_text: 'you\'ve mastered the art of being in everyone\'s mentions.',
    starting_credits: 4000,
    starting_followers: 1500,
    starting_reputation: 48,
    probability: 0.18,
    rarity: 'common',
    special_effects: [
      {
        name: 'Professional Replier',
        description: 'Replies generate 30% more relationship progress',
        effect_type: 'relationship_multiplier',
        value: 1.3
      },
      {
        name: 'Always in the Mentions',
        description: 'More likely to discover conversations involving larger accounts',
        effect_type: 'opportunity_discovery',
        value: 1.2
      }
    ],
    downsides: [
      {
        name: 'Where Are Your Own Tweets?',
        description: 'Original posts initially receive slightly reduced organic reach',
        effect_type: 'post_reach_penalty',
        value: 0.85
      }
    ],
    starting_skills: {
      trading: 0,
      research: 0,
      writing: 0,
      memes: 0,
      networking: 2,
      coding: 0,
      onchain: 0,
      community: 1,
      sales: 0,
      content: 0
    }
  },
  {
    id: 'airdrop_survivor',
    name: 'AIRDROP SURVIVOR',
    description: 'one allocation changed everything.',
    flavor_text: 'that testnet grind paid off. now you\'re chasing the next one.',
    starting_credits: 12000,
    starting_followers: 600,
    starting_reputation: 52,
    probability: 0.17,
    rarity: 'uncommon',
    special_effects: [
      {
        name: 'Eligibility Hunter',
        description: 'Higher chance of discovering quests, testnets, points programs',
        effect_type: 'quest_discovery',
        value: 1.4
      },
      {
        name: 'Multi-Chain Brain',
        description: 'Onchain Skill improves faster',
        effect_type: 'skill_xp_bonus',
        value: 1.25
      }
    ],
    downsides: [
      {
        name: 'Death by a Thousand Transactions',
        description: 'Onchain activities consume more Energy and operational costs',
        effect_type: 'energy_cost_increase',
        value: 1.15
      }
    ],
    starting_skills: {
      trading: 0,
      research: 2,
      writing: 0,
      memes: 0,
      networking: 0,
      coding: 0,
      onchain: 2,
      community: 0,
      sales: 0,
      content: 0
    }
  },
  {
    id: 'talented_creator',
    name: 'TALENTED CREATOR',
    description: 'you somehow understand the algorithm.',
    flavor_text: 'some people just know what the timeline wants to see.',
    starting_credits: 6000,
    starting_followers: 2500,
    starting_reputation: 52,
    probability: 0.15,
    rarity: 'uncommon',
    special_effects: [
      {
        name: 'Natural Reach',
        description: 'Content receives higher base chance of going viral',
        effect_type: 'virality_boost',
        value: 1.35
      },
      {
        name: 'Creative Instinct',
        description: 'Writing and Content Creation XP increases 20% faster',
        effect_type: 'creative_skill_boost',
        value: 1.2
      }
    ],
    downsides: [
      {
        name: 'Creator Burnout',
        description: 'Publishing too frequently causes faster Energy depletion',
        effect_type: 'burnout_risk',
        value: 1.2
      }
    ],
    starting_skills: {
      trading: 0,
      research: 0,
      writing: 2,
      memes: 2,
      networking: 0,
      coding: 0,
      onchain: 0,
      community: 0,
      sales: 0,
      content: 3
    }
  },
  {
    id: 'builder',
    name: 'BUILDER',
    description: 'followers: 214. github commits: concerning.',
    flavor_text: 'you ship products while everyone else ships tweets.',
    starting_credits: 8000,
    starting_followers: 350,
    starting_reputation: 55,
    probability: 0.13,
    rarity: 'uncommon',
    special_effects: [
      {
        name: 'Ship It',
        description: 'Building products requires less game time',
        effect_type: 'build_time_reduction',
        value: 0.75
      },
      {
        name: 'Grant Magnet',
        description: 'Increased probability of discovering hackathons and grants',
        effect_type: 'grant_discovery',
        value: 1.5
      },
      {
        name: 'Builder Reputation',
        description: 'Successfully shipping provides extra Reputation',
        effect_type: 'reputation_bonus',
        value: 1.4
      }
    ],
    downsides: [
      {
        name: 'Distribution Problem',
        description: 'Initial follower growth and networking slower',
        effect_type: 'follower_growth_penalty',
        value: 0.7
      }
    ],
    starting_skills: {
      trading: 0,
      research: 2,
      writing: 0,
      memes: 0,
      networking: 0,
      coding: 3,
      onchain: 1,
      community: 0,
      sales: 0,
      content: 0
    }
  },
  {
    id: 'og_survivor',
    name: 'OG SURVIVOR',
    description: '2017. 2021. still here.',
    flavor_text: 'you\'ve seen this movie before. multiple times.',
    starting_credits: 25000,
    starting_followers: 4000,
    starting_reputation: 65,
    probability: 0.10,
    rarity: 'rare',
    special_effects: [
      {
        name: 'Seen This Movie Before',
        description: 'Market crashes reduce Conviction less',
        effect_type: 'conviction_stability',
        value: 0.6
      },
      {
        name: 'Old Connections',
        description: 'Starts with several existing Mutual relationships',
        effect_type: 'starting_relationships',
        value: 5
      }
    ],
    downsides: [
      {
        name: 'Market PTSD',
        description: 'Large trading losses cause longer-lasting negative Moodlets',
        effect_type: 'loss_duration',
        value: 1.5
      }
    ],
    starting_skills: {
      trading: 2,
      research: 2,
      writing: 1,
      memes: 1,
      networking: 1,
      coding: 0,
      onchain: 1,
      community: 1,
      sales: 0,
      content: 1
    }
  },
  {
    id: 'trust_fund_kol',
    name: 'TRUST FUND KOL',
    description: 'your bear market was somebody else\'s problem.',
    flavor_text: 'starting with advantages means everyone is watching for mistakes.',
    starting_credits: 40000,
    starting_followers: 20000,
    starting_reputation: 45,
    probability: 0.05,
    rarity: 'legendary',
    special_effects: [
      {
        name: 'Connections',
        description: 'Premium opportunities appear much earlier',
        effect_type: 'premium_access',
        value: 2.0
      },
      {
        name: 'Daddy\'s Dry Powder',
        description: 'First business startup costs reduced',
        effect_type: 'startup_cost_reduction',
        value: 0.5
      }
    ],
    downsides: [
      {
        name: 'Everyone Is Watching',
        description: 'Bad calls and failed promotions cause substantially larger Reputation damage',
        effect_type: 'reputation_penalty_multiplier',
        value: 2.5
      },
      {
        name: 'Can You Actually Cook?',
        description: 'Some Skills progress slower because success came from resources',
        effect_type: 'skill_xp_penalty',
        value: 0.85
      }
    ],
    starting_skills: {
      trading: 0,
      research: 0,
      writing: 0,
      memes: 0,
      networking: 3,
      coding: 0,
      onchain: 0,
      community: 0,
      sales: 2,
      content: 2
    }
  }
];

// Server-side function to randomly select origin based on probabilities
export function rollOrigin(): Origin {
  const roll = Math.random();
  let cumulative = 0;
  
  for (const origin of ORIGINS) {
    cumulative += origin.probability;
    if (roll <= cumulative) {
      return origin;
    }
  }
  
  // Fallback to Fresh Wallet if something goes wrong
  return ORIGINS[0];
}

// Get origin by ID
export function getOriginById(id: string): Origin | undefined {
  return ORIGINS.find(o => o.id === id);
}

// Get rarity color
export function getOriginRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common': return '#9CA3AF'; // gray
    case 'uncommon': return '#10B981'; // green
    case 'rare': return '#3B82F6'; // blue
    case 'legendary': return '#F59E0B'; // gold
    default: return '#9CA3AF';
  }
}

// Get rarity display
export function getOriginRarityDisplay(rarity: string): string {
  switch (rarity) {
    case 'common': return 'COMMON';
    case 'uncommon': return 'UNCOMMON';
    case 'rare': return 'RARE';
    case 'legendary': return 'LEGENDARY';
    default: return '';
  }
}
