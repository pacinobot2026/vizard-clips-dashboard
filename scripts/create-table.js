const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jqqvqdjxviqnsgpxcgfs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcXZxZGp4dmlxbnNncHhjZ2ZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2MjIwOSwiZXhwIjoyMDg3NTM4MjA5fQ.ibJyHrxx2TlfRbfh-9IKD3-kY9aSXAfrDJ1ZHVFijOQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTable() {
  console.log('Creating clips table in Supabase...');
  
  // Use Postgres connection string to execute raw SQL
  const { data, error } = await supabase.rpc('exec', {
    sql: `
      CREATE TABLE IF NOT EXISTS clips (
        id SERIAL PRIMARY KEY,
        clip_id TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        duration_seconds INTEGER,
        viral_score TEXT,
        source_video TEXT,
        vizard_project_id TEXT,
        status TEXT DEFAULT 'pending_review',
        post_status TEXT DEFAULT 'not_posted',
        category TEXT,
        category_emoji TEXT,
        clip_url TEXT NOT NULL,
        suggested_caption TEXT,
        transcript TEXT,
        rejection_note TEXT,
        published_at TEXT,
        published_to_platforms TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_clips_clip_id ON clips(clip_id);
      CREATE INDEX IF NOT EXISTS idx_clips_status ON clips(status);
      CREATE INDEX IF NOT EXISTS idx_clips_post_status ON clips(post_status);
    `
  });

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success! Table created.');
    console.log('Data:', data);
  }
}

createTable();
