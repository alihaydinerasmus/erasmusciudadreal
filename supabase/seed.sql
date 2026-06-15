-- Seed data for local testing
-- Run after 001_initial_schema.sql

INSERT INTO groups (id, slug, name)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'ciudad-real-2526',
  'Ciudad Real ''25–26'
);

-- Demo edit tokens (share each /profile/[id]/edit?token=... link privately)
INSERT INTO profiles (id, group_id, name, country, city, lat, lng, flag_emoji, edit_token)
VALUES
  (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'María García',
    'Spain',
    'Madrid',
    40.4168,
    -3.7038,
    '🇪🇸',
    'demo-token-maria-2526'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Luca Rossi',
    'Italy',
    'Rome',
    41.9028,
    12.4964,
    '🇮🇹',
    'demo-token-luca-2526'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Emma Schmidt',
    'Germany',
    'Berlin',
    52.5200,
    13.4050,
    '🇩🇪',
    'demo-token-emma-2526'
  );
