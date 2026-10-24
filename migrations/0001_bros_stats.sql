-- Run as an explicit D1 migration, never during a public HTTP request.
CREATE TABLE IF NOT EXISTS stats_events (
  event_id TEXT PRIMARY KEY NOT NULL,
  occurred_at INTEGER NOT NULL,
  day TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL CHECK (event_name IN ('page_view', 'whatsapp_click', 'package_select')),
  path TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('direct', 'google', 'bing', 'facebook', 'instagram', 'other', 'internal')),
  device TEXT NOT NULL CHECK (device IN ('mobile', 'desktop', 'tablet')),
  target TEXT
);
CREATE INDEX IF NOT EXISTS stats_events_day ON stats_events(day);
CREATE TABLE IF NOT EXISTS stats_daily_budget (
  day TEXT PRIMARY KEY NOT NULL,
  event_count INTEGER NOT NULL CHECK (event_count >= 0)
);
-- SQLite serializes each INSERT and its triggers: concurrent collectors cannot
-- race past this cap. Duplicate event IDs do not increment the AFTER trigger.
CREATE TRIGGER IF NOT EXISTS stats_daily_cap
BEFORE INSERT ON stats_events
WHEN COALESCE((SELECT event_count FROM stats_daily_budget WHERE day = NEW.day), 0) >= 10000
BEGIN
  SELECT RAISE(IGNORE);
END;
CREATE TRIGGER IF NOT EXISTS stats_daily_count
AFTER INSERT ON stats_events
BEGIN
  INSERT INTO stats_daily_budget (day, event_count) VALUES (NEW.day, 1)
  ON CONFLICT(day) DO UPDATE SET event_count = event_count + 1;
END;
