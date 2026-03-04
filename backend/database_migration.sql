-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  name text NOT NULL,
  phone_number text NOT NULL,
  zip_code text NOT NULL,
  role text NOT NULL CHECK (role IN ('Parent', 'Teacher', 'Admin')),
  active boolean DEFAULT true
);

-- Create alert_log table
CREATE TABLE IF NOT EXISTS alert_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  zip_code text NOT NULL,
  aqi_value integer NOT NULL,
  alert_message text NOT NULL,
  recipients_count integer NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscribers_zip_code ON subscribers(zip_code);
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON subscribers(active);
CREATE INDEX IF NOT EXISTS idx_alert_log_zip_code ON alert_log(zip_code);
CREATE INDEX IF NOT EXISTS idx_alert_log_created_at ON alert_log(created_at);

ALTER TABLE subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE alert_log DISABLE ROW LEVEL SECURITY;