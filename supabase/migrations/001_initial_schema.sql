-- Ciudad Real memory site — initial schema
-- Run this in the Supabase SQL Editor (or via Supabase CLI)

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  country TEXT,
  city TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  flag_emoji TEXT,
  edit_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE content_type AS ENUM ('photo', 'audio', 'note', 'memory', 'capsule');

CREATE TABLE profile_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type content_type NOT NULL,
  content_text TEXT,
  file_path TEXT,
  unlock_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX idx_profiles_group_id ON profiles(group_id);
CREATE INDEX idx_profile_content_profile_id ON profile_content(profile_id);

-- ---------------------------------------------------------------------------
-- Row Level Security — public read, writes via API routes (service role)
-- ---------------------------------------------------------------------------

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read groups"
  ON groups FOR SELECT
  USING (true);

CREATE POLICY "Public read profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Public read profile_content"
  ON profile_content FOR SELECT
  USING (true);

-- No INSERT/UPDATE/DELETE policies for anon/authenticated roles.
-- Mutations go through Next.js API routes using the service role key,
-- after verifying edit_token in application code.
