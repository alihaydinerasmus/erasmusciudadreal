-- Private storage bucket for profile photos
-- Run after 001_initial_schema.sql
-- If you already ran 001 with file_url, run the rename below first.

-- Rename legacy column (safe to run if column was already file_path)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profile_content' AND column_name = 'file_url'
  ) THEN
    ALTER TABLE profile_content RENAME COLUMN file_url TO file_path;
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-media', 'profile-media', false)
ON CONFLICT (id) DO UPDATE SET public = false;
