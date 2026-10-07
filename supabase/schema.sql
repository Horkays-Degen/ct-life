-- Core game database schema for CT Life

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (linked to Supabase auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- CT Origins
CREATE TABLE origins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  flavor_text TEXT NOT NULL,
  starting_credits INTEGER NOT NULL,
  starting_followers INTEGER NOT NULL,
  starting_reputation INTEGER NOT NULL DEFAULT 50,
  probability DECIMAL NOT NULL, -- 0.0 to 1.0
  special_effects JSONB NOT NULL DEFAULT '[]',
  downsides JSONB NOT NULL DEFAULT '[]',
  starting_skills JSONB NOT NULL DEFAULT '{}',
  rarity TEXT NOT NULL -- common, uncommon, rare, legendary
);

-- Traits
CREATE TABLE traits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  effects JSONB NOT NULL DEFAULT '{}',
  category TEXT NOT NULL
);

-- Aspirations
CREATE TABLE aspirations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements JSONB NOT NULL DEFAULT '{}',
  rewards JSONB NOT NULL DEFAULT '{}',
  badge_icon TEXT
);

-- Characters (player personas)
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  handle TEXT NOT NULL UNIQUE,
  bio TEXT,
  avatar_data JSONB NOT NULL DEFAULT '{}',
  origin_id TEXT NOT NULL REFERENCES origins(id),
  origin_revealed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  aspiration_id TEXT REFERENCES aspirations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Character Traits (junction table)
CREATE TABLE character_traits (
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  trait_id TEXT NOT NULL REFERENCES traits(id),
  selected_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (character_id, trait_id)
);

-- Character Stats
CREATE TABLE character_stats (
  character_id UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
  
  -- Resources
  ct_credits BIGINT NOT NULL DEFAULT 0,
  liquidity BIGINT NOT NULL DEFAULT 0,
  net_worth BIGINT NOT NULL DEFAULT 0,
  
  -- Meters
  energy INTEGER NOT NULL DEFAULT 100 CHECK (energy >= 0 AND energy <= 100),
  attention INTEGER NOT NULL DEFAULT 50 CHECK (attention >= 0 AND attention <= 100),
  conviction INTEGER NOT NULL DEFAULT 75 CHECK (conviction >= 0 AND conviction <= 100),
  
  -- Social
  followers INTEGER NOT NULL DEFAULT 0 CHECK (followers >= 0),
  following INTEGER NOT NULL DEFAULT 0,
  reputation INTEGER NOT NULL DEFAULT 50 CHECK (reputation >= 0 AND reputation <= 100),
  network_strength INTEGER NOT NULL DEFAULT 0 CHECK (network_strength >= 0 AND network_strength <= 100),
  
  -- Meta
  total_posts INTEGER NOT NULL DEFAULT 0,
  total_impressions BIGINT NOT NULL DEFAULT 0,
  account_age_days INTEGER NOT NULL DEFAULT 0,
  
  -- Expenses
  weekly_expenses INTEGER NOT NULL DEFAULT 100,
  next_expense_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills
CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  max_level INTEGER NOT NULL DEFAULT 10
);

-- Character Skills
CREATE TABLE character_skills (
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES skills(id),
  level INTEGER NOT NULL DEFAULT 0 CHECK (level >= 0 AND level <= 10),
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  xp_to_next INTEGER NOT NULL DEFAULT 100,
  PRIMARY KEY (character_id, skill_id)
);

-- Careers
CREATE TABLE careers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  levels JSONB NOT NULL DEFAULT '[]' -- array of level definitions
);

-- Character Career Progress
CREATE TABLE character_careers (
  character_id UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
  career_id TEXT NOT NULL REFERENCES careers(id),
  current_level INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Economy Ledger
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  type TEXT NOT NULL, -- work, trade, business, expense, quest, gift, etc
  category TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_character ON transactions(character_id, created_at DESC);

-- Moodlets
CREATE TABLE active_moodlets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  moodlet_id TEXT NOT NULL,
  moodlet_name TEXT NOT NULL,
  description TEXT NOT NULL,
  effects JSONB NOT NULL DEFAULT '{}',
  icon TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_moodlets_character ON active_moodlets(character_id, expires_at);

-- Posts (simulated content)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  post_type TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- Simulated metrics
  impressions INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  replies INTEGER NOT NULL DEFAULT 0,
  reposts INTEGER NOT NULL DEFAULT 0,
  bookmarks INTEGER NOT NULL DEFAULT 0,
  
  -- Outcome
  outcome TEXT NOT NULL, -- flop, normal, good, banger, viral, timeline_takeover
  virality_score DECIMAL NOT NULL DEFAULT 0,
  
  -- Meta
  follower_change INTEGER NOT NULL DEFAULT 0,
  reputation_change INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_character ON posts(character_id, created_at DESC);

-- Relationships
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  target_character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  relationship_level TEXT NOT NULL, -- unknown, mutual, familiar, ct_friend, strong_connection, inner_circle
  relationship_score INTEGER NOT NULL DEFAULT 0,
  special_type TEXT, -- cofounder, rival, mentor, etc
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(character_id, target_character_id),
  CHECK (character_id != target_character_id)
);

CREATE INDEX idx_relationships_character ON relationships(character_id);

-- Achievements
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  requirement JSONB NOT NULL DEFAULT '{}',
  reward JSONB NOT NULL DEFAULT '{}'
);

-- Character Achievements
CREATE TABLE character_achievements (
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES achievements(id),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (character_id, achievement_id)
);

-- Daily Quests
CREATE TABLE daily_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quest_date DATE NOT NULL,
  quest_type TEXT NOT NULL,
  description TEXT NOT NULL,
  requirement JSONB NOT NULL DEFAULT '{}',
  reward JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Character Quest Progress
CREATE TABLE character_quest_progress (
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES daily_quests(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (character_id, quest_id)
);

-- Market Regime (server-wide singleton)
CREATE TABLE market_regime (
  id INTEGER PRIMARY KEY DEFAULT 1,
  current_regime TEXT NOT NULL,
  regime_effects JSONB NOT NULL DEFAULT '{}',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  next_change_at TIMESTAMPTZ,
  CHECK (id = 1) -- only one row allowed
);

-- World Events
CREATE TABLE world_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  effects JSONB NOT NULL DEFAULT '{}',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Council Elections
CREATE TABLE council_elections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_number INTEGER NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  voting_open BOOLEAN NOT NULL DEFAULT TRUE,
  winner_character_id UUID REFERENCES characters(id),
  policy_selected TEXT
);

CREATE TABLE council_candidates (
  election_id UUID NOT NULL REFERENCES council_elections(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  slogan TEXT NOT NULL,
  votes INTEGER NOT NULL DEFAULT 0,
  entry_fee_paid INTEGER NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (election_id, character_id)
);

CREATE TABLE council_votes (
  election_id UUID NOT NULL REFERENCES council_elections(id) ON DELETE CASCADE,
  voter_character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  candidate_character_id UUID NOT NULL REFERENCES characters(id),
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (election_id, voter_character_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_traits ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_moodlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE council_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own user record" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own user record" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view characters" ON characters FOR SELECT USING (true);
CREATE POLICY "Users can create own character" ON characters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own character" ON characters FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view character stats" ON character_stats FOR SELECT USING (true);
CREATE POLICY "Users can update own stats" ON character_stats FOR UPDATE USING (
  auth.uid() = (SELECT user_id FROM characters WHERE id = character_id)
);

-- Add policies for other tables (select visible to all, modify only own data)
CREATE POLICY "Anyone can view skills" ON character_skills FOR SELECT USING (true);
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Anyone can view relationships" ON relationships FOR SELECT USING (true);
CREATE POLICY "Anyone can view achievements" ON character_achievements FOR SELECT USING (true);

-- Functions
CREATE OR REPLACE FUNCTION update_character_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_character_stats_updated_at
  BEFORE UPDATE ON character_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_character_updated_at();
