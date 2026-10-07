// Core game types for CT Life

export type OriginId = 
  | 'fresh_wallet'
  | 'reply_guy'
  | 'airdrop_survivor'
  | 'talented_creator'
  | 'builder'
  | 'og_survivor'
  | 'trust_fund_kol';

export type TraitId = string;
export type AspirationId = string;
export type SkillId = 
  | 'trading'
  | 'research'
  | 'writing'
  | 'memes'
  | 'networking'
  | 'coding'
  | 'onchain'
  | 'community'
  | 'sales'
  | 'content';

export type CareerId = string;
export type PostType = 
  | 'gm'
  | 'hot_take'
  | 'research_thread'
  | 'meme'
  | 'alpha_call'
  | 'project_review'
  | 'market_take'
  | 'personal_story'
  | 'engagement_bait'
  | 'breaking_news'
  | 'builder_update';

export type PostOutcome = 
  | 'flop'
  | 'normal'
  | 'good'
  | 'banger'
  | 'viral'
  | 'timeline_takeover';

export type RelationshipLevel = 
  | 'unknown'
  | 'mutual'
  | 'familiar'
  | 'ct_friend'
  | 'strong_connection'
  | 'inner_circle';

export type MarketRegime = 
  | 'bull_market'
  | 'bear_market'
  | 'meme_season'
  | 'airdrop_season'
  | 'builder_season'
  | 'nft_revival'
  | 'ai_meta'
  | 'liquidation_week';

export interface Origin {
  id: OriginId;
  name: string;
  description: string;
  flavor_text: string;
  starting_credits: number;
  starting_followers: number;
  starting_reputation: number;
  probability: number;
  special_effects: SpecialEffect[];
  downsides: Downside[];
  starting_skills: Record<SkillId, number>;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export interface SpecialEffect {
  name: string;
  description: string;
  effect_type: string;
  value: number;
}

export interface Downside {
  name: string;
  description: string;
  effect_type: string;
  value: number;
}

export interface Trait {
  id: TraitId;
  name: string;
  description: string;
  effects: Record<string, any>;
  category: string;
}

export interface Aspiration {
  id: AspirationId;
  name: string;
  description: string;
  requirements: Record<string, any>;
  rewards: Record<string, any>;
  badge_icon?: string;
}

export interface Character {
  id: string;
  user_id: string;
  display_name: string;
  handle: string;
  bio?: string;
  avatar_data: AvatarData;
  origin_id: OriginId;
  origin_revealed_at: string;
  aspiration_id?: AspirationId;
  created_at: string;
}

export interface AvatarData {
  skin_tone: string;
  hair_style: string;
  hair_color: string;
  outfit: string;
  accessories: string[];
  background?: string;
}

export interface CharacterStats {
  character_id: string;
  ct_credits: number;
  liquidity: number;
  net_worth: number;
  energy: number;
  attention: number;
  conviction: number;
  followers: number;
  following: number;
  reputation: number;
  network_strength: number;
  total_posts: number;
  total_impressions: number;
  account_age_days: number;
  weekly_expenses: number;
  next_expense_date: string;
  updated_at: string;
}

export interface CharacterSkill {
  character_id: string;
  skill_id: SkillId;
  level: number;
  xp: number;
  xp_to_next: number;
}

export interface Skill {
  id: SkillId;
  name: string;
  description: string;
  category: string;
  max_level: number;
}

export interface Career {
  id: CareerId;
  name: string;
  category: string;
  levels: CareerLevel[];
}

export interface CareerLevel {
  level: number;
  title: string;
  requirements: Record<string, any>;
  perks: string[];
}

export interface Transaction {
  id: string;
  character_id: string;
  amount: number;
  type: string;
  category: string;
  description?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Moodlet {
  id: string;
  character_id: string;
  moodlet_id: string;
  moodlet_name: string;
  description: string;
  effects: Record<string, any>;
  icon?: string;
  expires_at: string;
  created_at: string;
}

export interface Post {
  id: string;
  character_id: string;
  post_type: PostType;
  content: string;
  impressions: number;
  likes: number;
  replies: number;
  reposts: number;
  bookmarks: number;
  outcome: PostOutcome;
  virality_score: number;
  follower_change: number;
  reputation_change: number;
  created_at: string;
}

export interface Relationship {
  id: string;
  character_id: string;
  target_character_id: string;
  relationship_level: RelationshipLevel;
  relationship_score: number;
  special_type?: string;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: Record<string, any>;
  reward: Record<string, any>;
}

export interface CharacterAchievement {
  character_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface DailyQuest {
  id: string;
  quest_date: string;
  quest_type: string;
  description: string;
  requirement: Record<string, any>;
  reward: Record<string, any>;
  created_at: string;
}

export interface CharacterQuestProgress {
  character_id: string;
  quest_id: string;
  progress: number;
  completed: boolean;
  completed_at?: string;
}

export interface MarketRegimeState {
  id: number;
  current_regime: MarketRegime;
  regime_effects: Record<string, any>;
  started_at: string;
  next_change_at?: string;
}

export interface WorldEvent {
  id: string;
  event_type: string;
  title: string;
  description: string;
  effects: Record<string, any>;
  started_at: string;
  ends_at?: string;
  active: boolean;
}

export interface CouncilElection {
  id: string;
  week_number: number;
  starts_at: string;
  ends_at: string;
  voting_open: boolean;
  winner_character_id?: string;
  policy_selected?: string;
}

export interface CouncilCandidate {
  election_id: string;
  character_id: string;
  slogan: string;
  votes: number;
  entry_fee_paid: number;
  registered_at: string;
}

// Full character profile (joined data)
export interface FullCharacterProfile {
  character: Character;
  stats: CharacterStats;
  skills: CharacterSkill[];
  traits: Trait[];
  career?: Career;
  origin: Origin;
  aspiration?: Aspiration;
  achievements: Achievement[];
  active_moodlets: Moodlet[];
}

// Game state for client
export interface GameState {
  character: Character | null;
  stats: CharacterStats | null;
  skills: CharacterSkill[];
  active_moodlets: Moodlet[];
  market_regime: MarketRegimeState | null;
  world_events: WorldEvent[];
  daily_quests: DailyQuest[];
  quest_progress: CharacterQuestProgress[];
}

// Share card data
export interface ShareCardData {
  type: 'origin' | 'milestone' | 'achievement' | 'viral' | 'council';
  character_name: string;
  handle: string;
  avatar_data: AvatarData;
  primary_stat: string;
  secondary_stats: Record<string, string | number>;
  flavor_text?: string;
  timestamp: string;
}
