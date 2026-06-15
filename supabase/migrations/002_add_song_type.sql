-- Add 'song' to profile_content type constraint
ALTER TABLE profile_content DROP CONSTRAINT IF EXISTS profile_content_type_check;

ALTER TABLE profile_content ADD CONSTRAINT profile_content_type_check
  CHECK (type IN ('photo', 'audio', 'note', 'memory', 'capsule', 'song'));
