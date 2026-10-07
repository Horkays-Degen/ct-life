-- Server-side Origin Lottery RPC Function
-- This ensures clients cannot manipulate their origin selection

CREATE OR REPLACE FUNCTION roll_origin_and_create_character(
  p_user_id UUID,
  p_display_name TEXT,
  p_handle TEXT,
  p_bio TEXT,
  p_avatar_data JSONB,
  p_trait_ids TEXT[],
  p_aspiration_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_origin_id TEXT;
  v_origin RECORD;
  v_character_id UUID;
  v_random_value DECIMAL;
  v_cumulative DECIMAL := 0;
  v_result JSONB;
BEGIN
  -- Check if user already has a character
  IF EXISTS (SELECT 1 FROM characters WHERE user_id = p_user_id) THEN
    RAISE EXCEPTION 'User already has a character';
  END IF;

  -- Verify handle is unique
  IF EXISTS (SELECT 1 FROM characters WHERE handle = p_handle) THEN
    RAISE EXCEPTION 'Handle already taken';
  END IF;

  -- Generate random value for weighted selection
  v_random_value := random();

  -- Select origin based on weighted probabilities
  -- Probabilities hardcoded to prevent client manipulation
  IF v_random_value <= 0.22 THEN
    v_origin_id := 'fresh_wallet';
  ELSIF v_random_value <= 0.40 THEN -- 0.22 + 0.18
    v_origin_id := 'reply_guy';
  ELSIF v_random_value <= 0.57 THEN -- 0.40 + 0.17
    v_origin_id := 'airdrop_survivor';
  ELSIF v_random_value <= 0.72 THEN -- 0.57 + 0.15
    v_origin_id := 'talented_creator';
  ELSIF v_random_value <= 0.85 THEN -- 0.72 + 0.13
    v_origin_id := 'builder';
  ELSIF v_random_value <= 0.95 THEN -- 0.85 + 0.10
    v_origin_id := 'og_survivor';
  ELSE -- remaining 0.05
    v_origin_id := 'trust_fund_kol';
  END IF;

  -- Get origin details (we'll need to insert origin data first)
  -- For now, use hardcoded values matching our TypeScript definitions
  DECLARE
    v_starting_credits INTEGER;
    v_starting_followers INTEGER;
    v_starting_reputation INTEGER;
    v_starting_skills JSONB;
  BEGIN
    CASE v_origin_id
      WHEN 'fresh_wallet' THEN
        v_starting_credits := 2500;
        v_starting_followers := 80;
        v_starting_reputation := 50;
        v_starting_skills := '{"trading":0,"research":0,"writing":0,"memes":0,"networking":0,"coding":0,"onchain":0,"community":0,"sales":0,"content":0}';
      WHEN 'reply_guy' THEN
        v_starting_credits := 4000;
        v_starting_followers := 1500;
        v_starting_reputation := 48;
        v_starting_skills := '{"trading":0,"research":0,"writing":0,"memes":0,"networking":2,"coding":0,"onchain":0,"community":1,"sales":0,"content":0}';
      WHEN 'airdrop_survivor' THEN
        v_starting_credits := 12000;
        v_starting_followers := 600;
        v_starting_reputation := 52;
        v_starting_skills := '{"trading":0,"research":2,"writing":0,"memes":0,"networking":0,"coding":0,"onchain":2,"community":0,"sales":0,"content":0}';
      WHEN 'talented_creator' THEN
        v_starting_credits := 6000;
        v_starting_followers := 2500;
        v_starting_reputation := 52;
        v_starting_skills := '{"trading":0,"research":0,"writing":2,"memes":2,"networking":0,"coding":0,"onchain":0,"community":0,"sales":0,"content":3}';
      WHEN 'builder' THEN
        v_starting_credits := 8000;
        v_starting_followers := 350;
        v_starting_reputation := 55;
        v_starting_skills := '{"trading":0,"research":2,"writing":0,"memes":0,"networking":0,"coding":3,"onchain":1,"community":0,"sales":0,"content":0}';
      WHEN 'og_survivor' THEN
        v_starting_credits := 25000;
        v_starting_followers := 4000;
        v_starting_reputation := 65;
        v_starting_skills := '{"trading":2,"research":2,"writing":1,"memes":1,"networking":1,"coding":0,"onchain":1,"community":1,"sales":0,"content":1}';
      WHEN 'trust_fund_kol' THEN
        v_starting_credits := 40000;
        v_starting_followers := 20000;
        v_starting_reputation := 45;
        v_starting_skills := '{"trading":0,"research":0,"writing":0,"memes":0,"networking":3,"coding":0,"onchain":0,"community":0,"sales":2,"content":2}';
    END CASE;

    -- Create character (atomic transaction)
    INSERT INTO characters (
      user_id,
      display_name,
      handle,
      bio,
      avatar_data,
      origin_id,
      aspiration_id
    )
    VALUES (
      p_user_id,
      p_display_name,
      p_handle,
      p_bio,
      p_avatar_data,
      v_origin_id,
      p_aspiration_id
    )
    RETURNING id INTO v_character_id;

    -- Create character stats
    INSERT INTO character_stats (
      character_id,
      ct_credits,
      liquidity,
      net_worth,
      energy,
      attention,
      conviction,
      followers,
      reputation
    )
    VALUES (
      v_character_id,
      v_starting_credits,
      v_starting_credits,
      v_starting_credits,
      100,
      50,
      75,
      v_starting_followers,
      v_starting_reputation
    );

    -- Create character skills
    INSERT INTO character_skills (character_id, skill_id, level, xp, xp_to_next)
    SELECT 
      v_character_id,
      skill_key,
      (skill_value::INTEGER),
      0,
      100
    FROM jsonb_each_text(v_starting_skills) AS skills(skill_key, skill_value);

    -- Create character traits
    IF p_trait_ids IS NOT NULL AND array_length(p_trait_ids, 1) > 0 THEN
      INSERT INTO character_traits (character_id, trait_id)
      SELECT v_character_id, unnest(p_trait_ids);
    END IF;

    -- Create initial transaction
    INSERT INTO transactions (
      character_id,
      amount,
      type,
      category,
      description,
      metadata
    )
    VALUES (
      v_character_id,
      v_starting_credits,
      'initial',
      'origin',
      'Starting credits from ' || v_origin_id,
      jsonb_build_object('origin_id', v_origin_id)
    );

    -- Build result JSON
    v_result := jsonb_build_object(
      'success', true,
      'character_id', v_character_id,
      'origin_id', v_origin_id,
      'starting_credits', v_starting_credits,
      'starting_followers', v_starting_followers,
      'starting_reputation', v_starting_reputation
    );

    RETURN v_result;
  END;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION roll_origin_and_create_character TO authenticated;

COMMENT ON FUNCTION roll_origin_and_create_character IS 
'Server-side origin lottery and character creation. Prevents client manipulation of origin selection.';
