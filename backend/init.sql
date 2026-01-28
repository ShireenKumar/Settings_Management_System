-- Creating the setting table with:
    -- A randomly generated uuid
    -- JSONB 
CREATE TABLE IF NOT EXISTS 
settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  json_data JSONB NOT NULL,
  time_created TIMESTAMP DEFAULT NOW(),
  updated_log TIMESTAMP DEFAULT NOW()
);

-- Using indexing to speed up searching/reading 
-- Using generalized inverted index as it reads faster for a JSONB
-- CORRECTION: This is not needed!
CREATE INDEX IF NOT EXISTS idx_settings_data 
    ON settings 
    USING GIN (json_data);

-- Insert some sample data for testing
INSERT INTO settings (json_data) VALUES
  ('{"theme": "dark", "language": "en", "notifications": true}'),
  ('{"theme": "light", "language": "es", "notifications": false}'),
  ('{"theme": "auto", "language": "fr", "notifications": true}'),
  ('{"fontSize": 12, "fontFamily": "Arial", "lineHeight": 1.2}'),
  ('{"fontSize": 14, "fontFamily": "monospace", "lineHeight": 1.5}'),
  ('{"fontSize": 16, "fontFamily": "Helvetica", "lineHeight": 1.8}'),
  ('{"autoSave": true, "saveInterval": 30, "backupEnabled": false}'),
  ('{"autoSave": false, "saveInterval": 60, "backupEnabled": true}'),
  ('{"autoSave": true, "saveInterval": 15, "backupEnabled": true}'),
  ('{"sidebar": "left", "layout": "grid", "density": "comfortable"}'),
  ('{"sidebar": "right", "layout": "list", "density": "compact"}'),
  ('{"privacy": "public", "analytics": true, "cookies": "essential"}'),
  ('{"privacy": "private", "analytics": false, "cookies": "all"}'),
  ('{"mode": "focus", "timer": 25, "breaks": 5}'),
  ('{"mode": "standard", "timer": 60, "breaks": 10}');