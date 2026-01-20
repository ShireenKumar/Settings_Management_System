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
CREATE INDEX IF NOT EXISTS idx_settings_data 
    ON settings 
    USING GIN (json_data);

-- Insert some sample data for testing
INSERT INTO settings (json_data) VALUES
  ('{"theme": "dark", "language": "en", "notifications": true}'),
  ('{"fontSize": 14, "fontFamily": "monospace", "lineHeight": 1.5}'),
  ('{"autoSave": true, "saveInterval": 30, "backupEnabled": false}');