import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create the clips table
    const { error: tableError } = await supabase.rpc('exec_sql', {
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

    if (tableError) {
      console.error('Table creation error:', tableError);
      // Try alternative approach - direct SQL
      const { error: directError } = await supabase.from('clips').select('count').limit(1);
      
      if (directError && directError.code !== 'PGRST116') {
        return res.status(500).json({ 
          error: 'Failed to create table', 
          details: directError.message 
        });
      }
    }

    // Check if table has data
    const { count } = await supabase
      .from('clips')
      .select('*', { count: 'exact', head: true });

    let migrated = false;
    let seedCount = 0;

    // If empty, seed with initial data
    if (count === 0) {
      const initialClips = [
        {
          clip_id: "36882833",
          title: "How to Earn Commissions Without Doing the Selling",
          duration_seconds: 39,
          viral_score: "9.2",
          source_video: "Vimeo 1153676279",
          vizard_project_id: "28404293",
          status: "pending_review",
          post_status: "not_posted",
          category: "Newsletter Hour",
          category_emoji: "📰",
          clip_url: "https://cdn-video.vizard.ai/vizard/video/export/20260220/36882833-8c693cf59e424f21897ee7221cabc0e9.mp4?Expires=1772224541&Signature=p1jNYVIplqUDqloHPHxCi9LzVQXGPJjthBqqfUy0SUVL4Bc0ThzzZ9F~qgqunlmbQTXentmsEQD9C4eETxwGKHe8GEiaMPpVgQ6GCZb54R-xaZh3mPKTLoxSd0Ear9xItWt6mYbacgXURlnKAf~mGWwBjLCuyUNLuYvtmwu-Mx93KcoYE76QlkYq5FMGuKsOXi6YigG4vC~WzD8KwxyJSdiM3TwvmhZJxjG7SOhU7S81xjQVixhESjkRMW96Z--JqrXdzM~~Sgi1dk2OhiYativ96nsPZ~~XaMTCJLUL0Y8IPztaZPq7LjlJocMoGIG7OhfbGKylKzTYJ6ZnyruyPg__&Key-Pair-Id=K1STSG6HQYFY8F"
        },
        {
          clip_id: "36882832",
          title: "Why You Should Start A Local Newsletter",
          duration_seconds: 18,
          viral_score: "9",
          source_video: "Vimeo 1153676279",
          vizard_project_id: "28404293",
          status: "pending_review",
          post_status: "not_posted",
          category: "Newsletter Hour",
          category_emoji: "📰",
          clip_url: "https://cdn-video.vizard.ai/vizard/video/export/20260220/36882832-9dfd3be11fb240f3a8333425255f8d58.mp4?Expires=1772224541&Signature=pNK0AKjJD3aHoAieUe2ItMseRW9coYlkfN~AwuvPw5kHGA4jaG4S-y-vX9nBkSFWKbdF4uDu--hJ9vMkpXj47PL89nttE30VUTOesuekcQFmJEk4QKc1Xwuv0ZMBPiGQ6LmuyqRxSJE91uVExUuwp7cL1KlGFVX8oLh-3q6m~afWew09FpVYfIZML5Dh1OskVMJIIXkFl8c4Zr0UeJsfjMAf5c-NcykdEDRqTNRN1fDjQI9P8RWvuMriMl3q2DuUWnxs41-oP4hkXpGNjJ5WbNJI6EDn8mmjOyy3uRo2ZUokghFrhb36NV0kEAlnaZYo6DYradEmgDl8BcrH62VNxg__&Key-Pair-Id=K1STSG6HQYFY8F"
        },
        {
          clip_id: "36882831",
          title: "We Build Your Brand For You",
          duration_seconds: 17,
          viral_score: "8.7",
          source_video: "Vimeo 1153676279",
          vizard_project_id: "28404293",
          status: "pending_review",
          post_status: "not_posted",
          category: "Newsletter Hour",
          category_emoji: "📰",
          clip_url: "https://cdn-video.vizard.ai/vizard/video/export/20260220/36882831-f7a61e0d811d47ac84b84936058ac1c1.mp4?Expires=1772224541&Signature=A0JsRoEpRfLN2ALSurkS4PScv6fTlvvqR0o~Sd8Pul~JJSVcaf-Y~zhmVWckRsqkNrWs5biMFy7OKkzv3D1VCi4lWoTmhgaiPiCM01Jf9o3iHm1FeqEVeacHAOK9fyyR8HeOUh-G8ynTHmctkt-n3O~ZtkC3B-pnLdabk3zSLiFSeX97hanhdIS1FgFe2HQADXH7I0dCnpHtFBf4GBYofQSTvS3bGBAh1jFnXkSYCmsxSpZmKOm6sxm4hkKtExnyITeN4NjXYLOUscD22SvRRnP-EB6l6MXSb16nQ6Za3vRMbJrxAr-Td-2xJ8FXJ9sQuAysPWyNkn3GOmhALmlDZw__&Key-Pair-Id=K1STSG6HQYFY8F"
        }
      ];

      const { data: insertedData, error: insertError } = await supabase
        .from('clips')
        .insert(initialClips)
        .select();

      if (insertError) {
        console.error('Seed error:', insertError);
      } else {
        migrated = true;
        seedCount = insertedData?.length || 0;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Database migration completed',
      table_exists: true,
      current_count: count + seedCount,
      migrated,
      seeded: seedCount
    });

  } catch (error) {
    console.error('Migration error:', error);
    return res.status(500).json({ 
      error: 'Migration failed', 
      details: error.message 
    });
  }
}
