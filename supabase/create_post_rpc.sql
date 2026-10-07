-- Server-side Post Creation and Performance Calculation
-- This ensures post outcomes cannot be manipulated by the client

CREATE OR REPLACE FUNCTION create_post(
  p_character_id UUID,
  p_post_type TEXT,
  p_content TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stats RECORD;
  v_skills RECORD;
  v_origin_id TEXT;
  v_traits TEXT[];
  v_energy_cost INTEGER;
  v_base_score DECIMAL;
  v_skill_multiplier DECIMAL := 1.0;
  v_origin_multiplier DECIMAL := 1.0;
  v_trait_multiplier DECIMAL := 1.0;
  v_virality_roll DECIMAL;
  v_outcome TEXT;
  v_impressions INTEGER;
  v_likes INTEGER;
  v_replies INTEGER;
  v_reposts INTEGER;
  v_bookmarks INTEGER;
  v_follower_change INTEGER;
  v_reputation_change INTEGER;
  v_xp_gains JSONB := '{}';
  v_post_id UUID;
BEGIN
  -- Get character stats
  SELECT cs.*, c.origin_id 
  INTO v_stats
  FROM character_stats cs
  JOIN characters c ON c.id = cs.character_id
  WHERE cs.character_id = p_character_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Character not found';
  END IF;

  -- Get character skills as JSON
  SELECT jsonb_object_agg(skill_id, level) 
  INTO v_skills
  FROM character_skills 
  WHERE character_id = p_character_id;

  -- Get character traits
  SELECT array_agg(trait_id) 
  INTO v_traits
  FROM character_traits 
  WHERE character_id = p_character_id;

  v_origin_id := v_stats.origin_id;

  -- Calculate energy cost based on post type
  v_energy_cost := CASE p_post_type
    WHEN 'gm' THEN 5
    WHEN 'hot_take' THEN 15
    WHEN 'research_thread' THEN 40
    WHEN 'meme' THEN 10
    WHEN 'alpha_call' THEN 25
    WHEN 'project_review' THEN 35
    WHEN 'market_take' THEN 20
    WHEN 'personal_story' THEN 15
    WHEN 'engagement_bait' THEN 8
    WHEN 'builder_update' THEN 20
    ELSE 15
  END;

  -- Check energy
  IF v_stats.energy < v_energy_cost THEN
    RAISE EXCEPTION 'Not enough energy. Need % but have %', v_energy_cost, v_stats.energy;
  END IF;

  -- Calculate base score from followers and attention
  v_base_score := (v_stats.followers::DECIMAL / 1000.0) + (v_stats.attention::DECIMAL / 10.0);

  -- Calculate skill multiplier based on post type
  v_skill_multiplier := CASE p_post_type
    WHEN 'research_thread' THEN 
      1.0 + (COALESCE((v_skills->>'research')::DECIMAL, 0) / 50.0) + (COALESCE((v_skills->>'writing')::DECIMAL, 0) / 100.0)
    WHEN 'meme' THEN 
      1.0 + (COALESCE((v_skills->>'memes')::DECIMAL, 0) / 40.0) + (COALESCE((v_skills->>'content')::DECIMAL, 0) / 100.0)
    WHEN 'hot_take' THEN 
      1.0 + (COALESCE((v_skills->>'writing')::DECIMAL, 0) / 50.0)
    WHEN 'builder_update' THEN 
      1.0 + (COALESCE((v_skills->>'coding')::DECIMAL, 0) / 50.0)
    ELSE 
      1.0 + (COALESCE((v_skills->>'content')::DECIMAL, 0) / 60.0)
  END;

  -- Apply origin multipliers
  v_origin_multiplier := CASE 
    WHEN v_origin_id = 'talented_creator' THEN 1.35
    WHEN v_origin_id = 'reply_guy' THEN 0.85 -- reduced reach on original posts
    WHEN v_origin_id = 'trust_fund_kol' THEN 1.2
    ELSE 1.0
  END;

  -- Apply trait multipliers
  IF v_traits IS NOT NULL THEN
    IF 'shitposter' = ANY(v_traits) AND p_post_type = 'meme' THEN
      v_trait_multiplier := v_trait_multiplier * 1.3;
    END IF;
    IF 'thread_merchant' = ANY(v_traits) AND p_post_type = 'research_thread' THEN
      v_trait_multiplier := v_trait_multiplier * 1.4;
    END IF;
    IF 'main_character' = ANY(v_traits) THEN
      v_trait_multiplier := v_trait_multiplier * 1.5;
    END IF;
  END IF;

  -- Roll for virality (0.0 to 1.0, with heavy randomness)
  v_virality_roll := random() * 2.0; -- Can exceed 1.0 for viral posts

  -- Calculate final score
  v_base_score := v_base_score * v_skill_multiplier * v_origin_multiplier * v_trait_multiplier * v_virality_roll;

  -- Determine outcome tier
  IF v_base_score < 5 THEN
    v_outcome := 'flop';
    v_impressions := GREATEST(50, (v_stats.followers * 0.05)::INTEGER);
    v_follower_change := -LEAST(5, v_stats.followers / 100);
    v_reputation_change := -1;
  ELSIF v_base_score < 15 THEN
    v_outcome := 'normal';
    v_impressions := GREATEST(200, (v_stats.followers * 0.3)::INTEGER);
    v_follower_change := GREATEST(1, v_stats.followers / 200);
    v_reputation_change := 0;
  ELSIF v_base_score < 40 THEN
    v_outcome := 'good';
    v_impressions := GREATEST(800, (v_stats.followers * 0.8)::INTEGER);
    v_follower_change := GREATEST(10, v_stats.followers / 50);
    v_reputation_change := 1;
  ELSIF v_base_score < 80 THEN
    v_outcome := 'banger';
    v_impressions := GREATEST(5000, (v_stats.followers * 3.0)::INTEGER);
    v_follower_change := GREATEST(50, v_stats.followers / 20);
    v_reputation_change := 2;
  ELSIF v_base_score < 150 THEN
    v_outcome := 'viral';
    v_impressions := GREATEST(50000, (v_stats.followers * 20.0)::INTEGER);
    v_follower_change := GREATEST(500, v_stats.followers / 5);
    v_reputation_change := 3;
  ELSE
    v_outcome := 'timeline_takeover';
    v_impressions := GREATEST(500000, (v_stats.followers * 100.0)::INTEGER);
    v_follower_change := GREATEST(5000, v_stats.followers);
    v_reputation_change := 5;
  END IF;

  -- Calculate engagement metrics based on impressions
  v_likes := (v_impressions * (0.03 + random() * 0.05))::INTEGER;
  v_replies := (v_impressions * (0.005 + random() * 0.01))::INTEGER;
  v_reposts := (v_impressions * (0.01 + random() * 0.02))::INTEGER;
  v_bookmarks := (v_impressions * (0.008 + random() * 0.015))::INTEGER;

  -- Calculate XP gains
  v_xp_gains := jsonb_build_object(
    'content', 5 + FLOOR(random() * 10),
    'writing', CASE WHEN p_post_type IN ('research_thread', 'hot_take', 'market_take') THEN 3 + FLOOR(random() * 7) ELSE 0 END,
    'memes', CASE WHEN p_post_type = 'meme' THEN 5 + FLOOR(random() * 10) ELSE 0 END,
    'research', CASE WHEN p_post_type IN ('research_thread', 'project_review') THEN 4 + FLOOR(random() * 8) ELSE 0 END
  );

  -- Insert post
  INSERT INTO posts (
    character_id,
    post_type,
    content,
    impressions,
    likes,
    replies,
    reposts,
    bookmarks,
    outcome,
    virality_score,
    follower_change,
    reputation_change
  )
  VALUES (
    p_character_id,
    p_post_type,
    p_content,
    v_impressions,
    v_likes,
    v_replies,
    v_reposts,
    v_bookmarks,
    v_outcome,
    v_base_score,
    v_follower_change,
    v_reputation_change
  )
  RETURNING id INTO v_post_id;

  -- Update character stats
  UPDATE character_stats
  SET 
    energy = energy - v_energy_cost,
    followers = GREATEST(0, followers + v_follower_change),
    reputation = GREATEST(0, LEAST(100, reputation + v_reputation_change)),
    total_posts = total_posts + 1,
    total_impressions = total_impressions + v_impressions,
    attention = LEAST(100, attention + 5) -- Posting increases attention
  WHERE character_id = p_character_id;

  -- Update skills with XP
  UPDATE character_skills
  SET xp = xp + COALESCE((v_xp_gains->>skill_id)::INTEGER, 0)
  WHERE character_id = p_character_id
    AND skill_id IN ('content', 'writing', 'memes', 'research')
    AND COALESCE((v_xp_gains->>skill_id)::INTEGER, 0) > 0;

  -- Return result
  RETURN jsonb_build_object(
    'success', true,
    'post_id', v_post_id,
    'outcome', v_outcome,
    'impressions', v_impressions,
    'likes', v_likes,
    'replies', v_replies,
    'reposts', v_reposts,
    'bookmarks', v_bookmarks,
    'follower_change', v_follower_change,
    'reputation_change', v_reputation_change,
    'energy_cost', v_energy_cost,
    'xp_gains', v_xp_gains
  );
END;
$$;

GRANT EXECUTE ON FUNCTION create_post TO authenticated;

COMMENT ON FUNCTION create_post IS 
'Server-side post creation with virality algorithm. Calculates outcomes based on skills, origin, traits, and randomness.';
