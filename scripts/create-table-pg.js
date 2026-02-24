const { Client } = require('pg');

const client = new Client({
  host: 'aws-1-us-east-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.jqqvqdjxviqnsgpxcgfs',
  password: 'HUxTv6nSBmk9y1Qm',
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTable() {
  try {
    console.log('Connecting to Supabase Postgres...');
    await client.connect();
    console.log('Connected!');
    
    console.log('Creating clips table...');
    
    const createTableSQL = `
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
    `;
    
    await client.query(createTableSQL);
    console.log('✅ Table created!');
    
    console.log('Creating indexes...');
    await client.query('CREATE INDEX IF NOT EXISTS idx_clips_clip_id ON clips(clip_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_clips_status ON clips(status);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_clips_post_status ON clips(post_status);');
    console.log('✅ Indexes created!');
    
    // Seed initial data
    console.log('Checking if table is empty...');
    const countResult = await client.query('SELECT COUNT(*) FROM clips');
    const count = parseInt(countResult.rows[0].count);
    
    if (count === 0) {
      console.log('Table is empty. Seeding initial data...');
      
      const insertSQL = `
        INSERT INTO clips (clip_id, title, duration_seconds, viral_score, source_video, vizard_project_id, status, post_status, category, category_emoji, clip_url)
        VALUES 
          ('36882833', 'How to Earn Commissions Without Doing the Selling', 39, '9.2', 'Vimeo 1153676279', '28404293', 'pending_review', 'not_posted', 'Newsletter Hour', '📰', 'https://cdn-video.vizard.ai/vizard/video/export/20260220/36882833-8c693cf59e424f21897ee7221cabc0e9.mp4?Expires=1772224541&Signature=p1jNYVIplqUDqloHPHxCi9LzVQXGPJjthBqqfUy0SUVL4Bc0ThzzZ9F~qgqunlmbQTXentmsEQD9C4eETxwGKHe8GEiaMPpVgQ6GCZb54R-xaZh3mPKTLoxSd0Ear9xItWt6mYbacgXURlnKAf~mGWwBjLCuyUNLuYvtmwu-Mx93KcoYE76QlkYq5FMGuKsOXi6YigG4vC~WzD8KwxyJSdiM3TwvmhZJxjG7SOhU7S81xjQVixhESjkRMW96Z--JqrXdzM~~Sgi1dk2OhiYativ96nsPZ~~XaMTCJLUL0Y8IPztaZPq7LjlJocMoGIG7OhfbGKylKzTYJ6ZnyruyPg__&Key-Pair-Id=K1STSG6HQYFY8F'),
          ('36882832', 'Why You Should Start A Local Newsletter', 18, '9', 'Vimeo 1153676279', '28404293', 'pending_review', 'not_posted', 'Newsletter Hour', '📰', 'https://cdn-video.vizard.ai/vizard/video/export/20260220/36882832-9dfd3be11fb240f3a8333425255f8d58.mp4?Expires=1772224541&Signature=pNK0AKjJD3aHoAieUe2ItMseRW9coYlkfN~AwuvPw5kHGA4jaG4S-y-vX9nBkSFWKbdF4uDu--hJ9vMkpXj47PL89nttE30VUTOesuekcQFmJEk4QKc1Xwuv0ZMBPiGQ6LmuyqRxSJE91uVExUuwp7cL1KlGFVX8oLh-3q6m~afWew09FpVYfIZML5Dh1OskVMJIIXkFl8c4Zr0UeJsfjMAf5c-NcykdEDRqTNRN1fDjQI9P8RWvuMriMl3q2DuUWnxs41-oP4hkXpGNjJ5WbNJI6EDn8mmjOyy3uRo2ZUokghFrhb36NV0kEAlnaZYo6DYradEmgDl8BcrH62VNxg__&Key-Pair-Id=K1STSG6HQYFY8F'),
          ('36882831', 'We Build Your Brand For You', 17, '8.7', 'Vimeo 1153676279', '28404293', 'pending_review', 'not_posted', 'Newsletter Hour', '📰', 'https://cdn-video.vizard.ai/vizard/video/export/20260220/36882831-f7a61e0d811d47ac84b84936058ac1c1.mp4?Expires=1772224541&Signature=A0JsRoEpRfLN2ALSurkS4PScv6fTlvvqR0o~Sd8Pul~JJSVcaf-Y~zhmVWckRsqkNrWs5biMFy7OKkzv3D1VCi4lWoTmhgaiPiCM01Jf9o3iHm1FeqEVeacHAOK9fyyR8HeOUh-G8ynTHmctkt-n3O~ZtkC3B-pnLdabk3zSLiFSeX97hanhdIS1FgFe2HQADXH7I0dCnpHtFBf4GBYofQSTvS3bGBAh1jFnXkSYCmsxSpZmKOm6sxm4hkKtExnyITeN4NjXYLOUscD22SvRRnP-EB6l6MXSb16nQ6Za3vRMbJrxAr-Td-2xJ8FXJ9sQuAysPWyNkn3GOmhALmlDZw__&Key-Pair-Id=K1STSG6HQYFY8F')
        ON CONFLICT (clip_id) DO NOTHING;
      `;
      
      const result = await client.query(insertSQL);
      console.log(`✅ Seeded ${result.rowCount} clips!`);
    } else {
      console.log(`Table already has ${count} rows. Skipping seed.`);
    }
    
    console.log('\n🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

createTable();
