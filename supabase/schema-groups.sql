-- ============================================================================
-- HASHTAG PYTHON — GROUPS SCHEMA
-- Collaborative + Competitive Features
-- ============================================================================

-- Table: challenges (desafios)
-- Stores competitive coding challenges created by group members
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('easy', 'medium', 'hard')),
  points INT NOT NULL,
  test_cases JSONB,  -- JSON array of test cases
  starter_code TEXT,  -- Starter code for challenge
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index on group_id for fast queries
CREATE INDEX idx_challenges_group_id ON challenges(group_id);
CREATE INDEX idx_challenges_created_by ON challenges(created_by);

-- RLS: Only group members can see challenges
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "challenges_select" ON challenges
  FOR SELECT
  USING (group_id IN (
    SELECT group_id FROM family_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "challenges_insert" ON challenges
  FOR INSERT
  WITH CHECK (
    group_id IN (SELECT group_id FROM family_members WHERE user_id = auth.uid())
    AND created_by = auth.uid()
  );

CREATE POLICY "challenges_update" ON challenges
  FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "challenges_delete" ON challenges
  FOR DELETE
  USING (created_by = auth.uid());

-- ============================================================================
-- Table: challenge_attempts
-- Tracks who solved which challenge and when
-- ============================================================================

CREATE TABLE IF NOT EXISTS challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  solution_code TEXT,
  passed BOOLEAN DEFAULT FALSE,
  time_seconds INT,  -- Time taken to solve
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  points_earned INT DEFAULT 0
);

CREATE INDEX idx_challenge_attempts_challenge ON challenge_attempts(challenge_id);
CREATE INDEX idx_challenge_attempts_user ON challenge_attempts(user_id);
CREATE INDEX idx_challenge_attempts_completed ON challenge_attempts(completed_at);

ALTER TABLE challenge_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "challenge_attempts_select" ON challenge_attempts
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    challenge_id IN (
      SELECT id FROM challenges WHERE group_id IN (
        SELECT group_id FROM family_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "challenge_attempts_insert" ON challenge_attempts
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- Table: help_requests
-- When someone is stuck, ask the group for help
-- ============================================================================

CREATE TABLE IF NOT EXISTS help_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phase_id INT,  -- Which phase they're stuck on
  exercise_id TEXT,  -- Specific exercise
  problem_description TEXT,
  user_code TEXT,  -- Code they tried
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'helping', 'resolved')),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  UNIQUE(group_id, user_id, phase_id, exercise_id)  -- Prevent duplicates
);

CREATE INDEX idx_help_requests_group ON help_requests(group_id);
CREATE INDEX idx_help_requests_user ON help_requests(user_id);
CREATE INDEX idx_help_requests_status ON help_requests(status);

ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "help_requests_select" ON help_requests
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    group_id IN (SELECT group_id FROM family_members WHERE user_id = auth.uid())
  );

CREATE POLICY "help_requests_insert" ON help_requests
  FOR INSERT
  WITH CHECK (
    group_id IN (SELECT group_id FROM family_members WHERE user_id = auth.uid())
    AND user_id = auth.uid()
  );

CREATE POLICY "help_requests_update" ON help_requests
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- Table: help_comments
-- Hints/suggestions from group members on help requests
-- ============================================================================

CREATE TABLE IF NOT EXISTS help_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  help_request_id UUID NOT NULL REFERENCES help_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  is_hint BOOLEAN DEFAULT TRUE,  -- True = hint only, False = full solution
  helpful_votes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_help_comments_help_request ON help_comments(help_request_id);
CREATE INDEX idx_help_comments_user ON help_comments(user_id);

ALTER TABLE help_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "help_comments_select" ON help_comments
  FOR SELECT
  USING (
    help_request_id IN (
      SELECT id FROM help_requests WHERE group_id IN (
        SELECT group_id FROM family_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "help_comments_insert" ON help_comments
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    help_request_id IN (
      SELECT id FROM help_requests WHERE group_id IN (
        SELECT group_id FROM family_members WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- Table: group_rankings
-- Leaderboard points per group (materialized view for performance)
-- ============================================================================

CREATE TABLE IF NOT EXISTS group_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  total_points INT DEFAULT 0,
  challenges_completed INT DEFAULT 0,
  help_given INT DEFAULT 0,  -- Count of helpful comments
  rank INT,  -- Rank in group (1, 2, 3...)
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_rankings_group ON group_rankings(group_id);
CREATE INDEX idx_group_rankings_points ON group_rankings(total_points DESC);

ALTER TABLE group_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "group_rankings_select" ON group_rankings
  FOR SELECT
  USING (
    group_id IN (SELECT group_id FROM family_members WHERE user_id = auth.uid())
  );

-- ============================================================================
-- Table: group_badges
-- Achievements earned by users
-- ============================================================================

CREATE TABLE IF NOT EXISTS group_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,  -- 'speedrun', 'mentor', 'perfect', 'streak', etc.
  earned_at TIMESTAMP DEFAULT NOW(),
  description TEXT,
  UNIQUE(group_id, user_id, badge_type)
);

CREATE INDEX idx_group_badges_group ON group_badges(group_id);
CREATE INDEX idx_group_badges_user ON group_badges(user_id);

ALTER TABLE group_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "group_badges_select" ON group_badges
  FOR SELECT
  USING (
    group_id IN (SELECT group_id FROM family_members WHERE user_id = auth.uid())
  );

-- ============================================================================
-- Trigger: Update group_rankings when challenge is completed
-- ============================================================================

CREATE OR REPLACE FUNCTION update_group_ranking()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.passed AND NEW.points_earned > 0 THEN
    INSERT INTO group_rankings (group_id, user_id, display_name, total_points, challenges_completed)
    SELECT
      c.group_id,
      NEW.user_id,
      fm.display_name,
      NEW.points_earned,
      1
    FROM challenges c
    JOIN family_members fm ON fm.user_id = NEW.user_id AND fm.group_id = c.group_id
    WHERE c.id = NEW.challenge_id
    ON CONFLICT (group_id, user_id)
    DO UPDATE SET
      total_points = total_points + NEW.points_earned,
      challenges_completed = challenges_completed + 1,
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_ranking
AFTER INSERT ON challenge_attempts
FOR EACH ROW
EXECUTE FUNCTION update_group_ranking();

-- ============================================================================
-- Trigger: Mark help_request as resolved when answer provided
-- ============================================================================

CREATE OR REPLACE FUNCTION update_help_request_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE help_requests
  SET status = 'helping'
  WHERE id = NEW.help_request_id AND status = 'open';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_help_request_status
AFTER INSERT ON help_comments
FOR EACH ROW
EXECUTE FUNCTION update_help_request_status();

-- ============================================================================
-- Views: Useful queries
-- ============================================================================

-- View: Latest challenges in a group
CREATE OR REPLACE VIEW group_challenges_latest AS
SELECT
  c.*,
  COUNT(ca.id) as attempt_count,
  COUNT(CASE WHEN ca.passed THEN 1 END) as solved_count,
  (SELECT display_name FROM family_members WHERE user_id = c.created_by LIMIT 1) as creator_name
FROM challenges c
LEFT JOIN challenge_attempts ca ON ca.challenge_id = c.id
GROUP BY c.id
ORDER BY c.created_at DESC;

-- View: Leaderboard with rankings
CREATE OR REPLACE VIEW group_leaderboards AS
SELECT
  gr.*,
  ROW_NUMBER() OVER (PARTITION BY gr.group_id ORDER BY gr.total_points DESC) as rank
FROM group_rankings gr;

-- ============================================================================
-- Notes for Data Migration
-- ============================================================================
-- Run this file in Supabase SQL Editor BEFORE deploying the code.
-- Execution order:
-- 1. Create all tables with RLS
-- 2. Create indexes
-- 3. Create triggers and functions
-- 4. Create views
--
-- If you get a "table doesn't exist" error, it likely means family_groups
-- table from the original schema.sql needs to exist first.
-- Run supabase/schema.sql BEFORE this file.
