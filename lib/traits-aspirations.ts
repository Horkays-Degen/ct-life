import { Trait, Aspiration } from './types';

export const TRAITS: Trait[] = [
  {
    id: 'shitposter',
    name: 'SHITPOSTER',
    description: 'Memes and humorous content perform better',
    category: 'content',
    effects: {
      meme_virality: 1.3,
      humor_engagement: 1.25
    }
  },
  {
    id: 'thread_merchant',
    name: 'THREAD MERCHANT',
    description: 'Research threads gain extra Followers and Reputation',
    category: 'content',
    effects: {
      thread_followers: 1.4,
      thread_reputation: 1.3
    }
  },
  {
    id: 'degen',
    name: 'DEGEN',
    description: 'High-risk opportunities have larger potential returns but larger losses',
    category: 'trading',
    effects: {
      high_risk_multiplier: 1.5,
      loss_multiplier: 1.5
    }
  },
  {
    id: 'diamond_hands',
    name: 'DIAMOND HANDS',
    description: 'Market volatility decreases Conviction more slowly',
    category: 'trading',
    effects: {
      conviction_stability: 0.6,
      hold_bonus: 1.2
    }
  },
  {
    id: 'paper_hands',
    name: 'PAPER HANDS',
    description: 'Can exit positions faster but misses more upside',
    category: 'trading',
    effects: {
      exit_speed: 1.5,
      upside_capture: 0.7
    }
  },
  {
    id: 'networker',
    name: 'NETWORKER',
    description: 'Relationships and DMs progress faster',
    category: 'social',
    effects: {
      relationship_growth: 1.35,
      dm_effectiveness: 1.3
    }
  },
  {
    id: 'builder_brain',
    name: 'BUILDER BRAIN',
    description: 'Coding/Product Skill increases faster',
    category: 'building',
    effects: {
      coding_xp: 1.3,
      product_xp: 1.3,
      build_speed: 1.15
    }
  },
  {
    id: 'alpha_hunter',
    name: 'ALPHA HUNTER',
    description: 'Research reveals hidden opportunities more often',
    category: 'research',
    effects: {
      opportunity_discovery: 1.4,
      research_quality: 1.25
    }
  },
  {
    id: 'space_cadet',
    name: 'SPACE CADET',
    description: 'Hosting and participating in Spaces gives stronger bonuses',
    category: 'social',
    effects: {
      space_networking: 1.5,
      space_followers: 1.3
    }
  },
  {
    id: 'terminally_online',
    name: 'TERMINALLY ONLINE',
    description: 'Attention decreases more slowly while active. Energy drains faster.',
    category: 'lifestyle',
    effects: {
      attention_decay: 0.6,
      energy_drain: 1.3
    }
  },
  {
    id: 'touch_grass',
    name: 'TOUCH GRASS ENJOYER',
    description: 'Energy recovers faster offline. Attention drops faster while offline.',
    category: 'lifestyle',
    effects: {
      energy_recovery: 1.4,
      offline_attention_decay: 1.4
    }
  },
  {
    id: 'main_character',
    name: 'MAIN CHARACTER',
    description: 'Higher probability of both positive and negative viral events',
    category: 'chaos',
    effects: {
      viral_chance: 1.5,
      drama_chance: 1.5,
      chaos_multiplier: 1.4
    }
  },
  {
    id: 'contrarian',
    name: 'CONTRARIAN',
    description: 'Takes against popular sentiment perform better but social costs are higher',
    category: 'content',
    effects: {
      contrarian_bonus: 1.4,
      social_friction: 1.3
    }
  },
  {
    id: 'community_focused',
    name: 'COMMUNITY FOCUSED',
    description: 'Community management and moderation are more effective',
    category: 'community',
    effects: {
      community_xp: 1.3,
      moderation_quality: 1.25,
      community_trust: 1.2
    }
  },
  {
    id: 'hustler',
    name: 'HUSTLER',
    description: 'Work gigs pay more but consume more Energy',
    category: 'work',
    effects: {
      work_income: 1.25,
      work_energy_cost: 1.2
    }
  },
  {
    id: 'chill',
    name: 'CHILL',
    description: 'Stress accumulates slower but career progression is slightly slower',
    category: 'lifestyle',
    effects: {
      stress_reduction: 0.7,
      career_speed: 0.9
    }
  }
];

export const ASPIRATIONS: Aspiration[] = [
  {
    id: 'kol_top',
    name: 'KOL AT THE TOP',
    description: 'Reach 100,000 Followers',
    requirements: {
      followers: 100000
    },
    rewards: {
      badge: 'kol_100k',
      credits: 50000,
      cosmetic: 'verified_checkmark'
    },
    badge_icon: '👑'
  },
  {
    id: 'onchain_millionaire',
    name: 'ONCHAIN MILLIONAIRE',
    description: 'Reach ₵1,000,000 Net Worth',
    requirements: {
      net_worth: 1000000
    },
    rewards: {
      badge: 'millionaire',
      credits: 100000,
      cosmetic: 'luxury_penthouse'
    },
    badge_icon: '💰'
  },
  {
    id: 'alpha_legend',
    name: 'ALPHA LEGEND',
    description: 'Reach 95 Reputation and identify ten major opportunities',
    requirements: {
      reputation: 95,
      alpha_calls: 10
    },
    rewards: {
      badge: 'alpha_legend',
      credits: 75000,
      cosmetic: 'research_terminal'
    },
    badge_icon: '🔍'
  },
  {
    id: 'superconnector',
    name: 'SUPERCONNECTOR',
    description: 'Create twenty Strong Connections and five Inner Circle relationships',
    requirements: {
      strong_connections: 20,
      inner_circle: 5
    },
    rewards: {
      badge: 'superconnector',
      credits: 40000,
      cosmetic: 'vip_lounge_access'
    },
    badge_icon: '🤝'
  },
  {
    id: 'protocol_founder',
    name: 'PROTOCOL FOUNDER',
    description: 'Launch a startup and grow it to ₵10,000,000 valuation',
    requirements: {
      business_valuation: 10000000
    },
    rewards: {
      badge: 'protocol_founder',
      credits: 200000,
      cosmetic: 'founder_office'
    },
    badge_icon: '🚀'
  },
  {
    id: 'meme_lord',
    name: 'MEME LORD',
    description: 'Create fifty Viral posts and reach Meme Skill 10',
    requirements: {
      viral_posts: 50,
      meme_skill: 10
    },
    rewards: {
      badge: 'meme_lord',
      credits: 50000,
      cosmetic: 'meme_throne'
    },
    badge_icon: '😂'
  },
  {
    id: 'airdrop_boss',
    name: 'AIRDROP FINAL BOSS',
    description: 'Successfully qualify for twenty simulated airdrops',
    requirements: {
      airdrops_qualified: 20
    },
    rewards: {
      badge: 'airdrop_boss',
      credits: 100000,
      cosmetic: 'multi_chain_terminal'
    },
    badge_icon: '🪂'
  },
  {
    id: 'builder_ct',
    name: 'BUILDER OF CT',
    description: 'Launch three successful products and reach Coding 10',
    requirements: {
      products_launched: 3,
      coding_skill: 10
    },
    rewards: {
      badge: 'builder_ct',
      credits: 75000,
      cosmetic: 'dev_cave_pro'
    },
    badge_icon: '🛠️'
  }
];

// Get trait by ID
export function getTraitById(id: string): Trait | undefined {
  return TRAITS.find(t => t.id === id);
}

// Get aspiration by ID
export function getAspirationById(id: string): Aspiration | undefined {
  return ASPIRATIONS.find(a => a.id === id);
}

// Get traits by category
export function getTraitsByCategory(category: string): Trait[] {
  return TRAITS.filter(t => t.category === category);
}

// Check if aspiration is completed
export function checkAspirationCompletion(
  aspiration: Aspiration,
  characterData: any
): boolean {
  const reqs = aspiration.requirements;
  
  if (reqs.followers && characterData.followers < reqs.followers) return false;
  if (reqs.net_worth && characterData.net_worth < reqs.net_worth) return false;
  if (reqs.reputation && characterData.reputation < reqs.reputation) return false;
  if (reqs.alpha_calls && characterData.alpha_calls < reqs.alpha_calls) return false;
  if (reqs.strong_connections && characterData.strong_connections < reqs.strong_connections) return false;
  if (reqs.inner_circle && characterData.inner_circle < reqs.inner_circle) return false;
  if (reqs.business_valuation && characterData.business_valuation < reqs.business_valuation) return false;
  if (reqs.viral_posts && characterData.viral_posts < reqs.viral_posts) return false;
  if (reqs.meme_skill && characterData.meme_skill < reqs.meme_skill) return false;
  if (reqs.airdrops_qualified && characterData.airdrops_qualified < reqs.airdrops_qualified) return false;
  if (reqs.products_launched && characterData.products_launched < reqs.products_launched) return false;
  if (reqs.coding_skill && characterData.coding_skill < reqs.coding_skill) return false;
  
  return true;
}
