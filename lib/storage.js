import { supabase } from './supabase';

// Supabase-backed storage for clips
// All functions now interact with Postgres database

export async function getAllClips() {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getPendingClips() {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getApprovedClips() {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .eq('status', 'approved')
    .eq('post_status', 'not_posted')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getPublishedClips() {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .eq('post_status', 'published')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getRejectedClips() {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .eq('status', 'rejected')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('clips')
    .select('category, category_emoji')
    .not('category', 'is', null);
  
  if (error) throw error;
  
  // Group by category
  const catMap = {};
  (data || []).forEach(clip => {
    if (!catMap[clip.category]) {
      catMap[clip.category] = {
        name: clip.category,
        emoji: clip.category_emoji || '📹',
        count: 0
      };
    }
    catMap[clip.category].count++;
  });
  
  return Object.values(catMap);
}

export async function addClip(clipData) {
  const newClip = {
    ...clipData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('clips')
    .insert([newClip])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateClip(clipId, updates) {
  const { data, error } = await supabase
    .from('clips')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('clip_id', clipId)
    .select()
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error(`Clip ${clipId} not found`);
    }
    throw error;
  }
  
  return data;
}

export async function bulkUpdate(clipIds, updates) {
  const results = [];
  
  for (const clipId of clipIds) {
    try {
      const updated = await updateClip(clipId, updates);
      results.push({ clipId, success: true, clip: updated });
    } catch (error) {
      results.push({ clipId, success: false, error: error.message });
    }
  }
  
  return results;
}

export async function getClip(clipId) {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .eq('clip_id', clipId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function deleteClip(clipId) {
  const { error } = await supabase
    .from('clips')
    .delete()
    .eq('clip_id', clipId);
  
  if (error) throw error;
}

export async function getStats() {
  const { data, error } = await supabase
    .from('clips')
    .select('status, post_status');
  
  if (error) throw error;
  
  const clips = data || [];
  
  return {
    total: clips.length,
    pending: clips.filter(c => c.status === 'pending_review').length,
    approved: clips.filter(c => c.status === 'approved' && c.post_status === 'not_posted').length,
    published: clips.filter(c => c.post_status === 'published').length,
    rejected: clips.filter(c => c.status === 'rejected').length
  };
}

// Migration helper: Insert initial clips if table is empty
export async function migrateInitialData() {
  const { count } = await supabase
    .from('clips')
    .select('*', { count: 'exact', head: true });
  
  // If table is not empty, skip migration
  if (count > 0) {
    return { migrated: false, count };
  }
  
  // Initial clips data (from old in-memory storage)
  const initialClips = [
    {
      "clip_id": "36882833",
      "title": "How to Earn Commissions Without Doing the Selling",
      "duration_seconds": 39,
      "viral_score": "9.2",
      "source_video": "Vimeo 1153676279",
      "vizard_project_id": "28404293",
      "status": "pending_review",
      "post_status": "not_posted",
      "category": "Newsletter Hour",
      "category_emoji": "📰",
      "clip_url": "https://cdn-video.vizard.ai/vizard/video/export/20260220/36882833-8c693cf59e424f21897ee7221cabc0e9.mp4?Expires=1772224541&Signature=p1jNYVIplqUDqloHPHxCi9LzVQXGPJjthBqqfUy0SUVL4Bc0ThzzZ9F~qgqunlmbQTXentmsEQD9C4eETxwGKHe8GEiaMPpVgQ6GCZb54R-xaZh3mPKTLoxSd0Ear9xItWt6mYbacgXURlnKAf~mGWwBjLCuyUNLuYvtmwu-Mx93KcoYE76QlkYq5FMGuKsOXi6YigG4vC~WzD8KwxyJSdiM3TwvmhZJxjG7SOhU7S81xjQVixhESjkRMW96Z--JqrXdzM~~Sgi1dk2OhiYativ96nsPZ~~XaMTCJLUL0Y8IPztaZPq7LjlJocMoGIG7OhfbGKylKzTYJ6ZnyruyPg__&Key-Pair-Id=K1STSG6HQYFY8F"
    },
    {
      "clip_id": "36882832",
      "title": "Why You Should Start A Local Newsletter",
      "duration_seconds": 18,
      "viral_score": "9",
      "source_video": "Vimeo 1153676279",
      "vizard_project_id": "28404293",
      "status": "pending_review",
      "post_status": "not_posted",
      "category": "Newsletter Hour",
      "category_emoji": "📰",
      "clip_url": "https://cdn-video.vizard.ai/vizard/video/export/20260220/36882832-9dfd3be11fb240f3a8333425255f8d58.mp4?Expires=1772224541&Signature=pNK0AKjJD3aHoAieUe2ItMseRW9coYlkfN~AwuvPw5kHGA4jaG4S-y-vX9nBkSFWKbdF4uDu--hJ9vMkpXj47PL89nttE30VUTOesuekcQFmJEk4QKc1Xwuv0ZMBPiGQ6LmuyqRxSJE91uVExUuwp7cL1KlGFVX8oLh-3q6m~afWew09FpVYfIZML5Dh1OskVMJIIXkFl8c4Zr0UeJsfjMAf5c-NcykdEDRqTNRN1fDjQI9P8RWvuMriMl3q2DuUWnxs41-oP4hkXpGNjJ5WbNJI6EDn8mmjOyy3uRo2ZUokghFrhb36NV0kEAlnaZYo6DYradEmgDl8BcrH62VNxg__&Key-Pair-Id=K1STSG6HQYFY8F"
    },
    {
      "clip_id": "36882831",
      "title": "We Build Your Brand For You",
      "duration_seconds": 17,
      "viral_score": "8.7",
      "source_video": "Vimeo 1153676279",
      "vizard_project_id": "28404293",
      "status": "pending_review",
      "post_status": "not_posted",
      "category": "Newsletter Hour",
      "category_emoji": "📰",
      "clip_url": "https://cdn-video.vizard.ai/vizard/video/export/20260220/36882831-f7a61e0d811d47ac84b84936058ac1c1.mp4?Expires=1772224541&Signature=A0JsRoEpRfLN2ALSurkS4PScv6fTlvvqR0o~Sd8Pul~JJSVcaf-Y~zhmVWckRsqkNrWs5biMFy7OKkzv3D1VCi4lWoTmhgaiPiCM01Jf9o3iHm1FeqEVeacHAOK9fyyR8HeOUh-G8ynTHmctkt-n3O~ZtkC3B-pnLdabk3zSLiFSeX97hanhdIS1FgFe2HQADXH7I0dCnpHtFBf4GBYofQSTvS3bGBAh1jFnXkSYCmsxSpZmKOm6sxm4hkKtExnyITeN4NjXYLOUscD22SvRRnP-EB6l6MXSb16nQ6Za3vRMbJrxAr-Td-2xJ8FXJ9sQuAysPWyNkn3GOmhALmlDZw__&Key-Pair-Id=K1STSG6HQYFY8F"
    }
    // ... truncated for brevity
  ];
  
  const { data, error } = await supabase
    .from('clips')
    .insert(initialClips)
    .select();
  
  if (error) throw error;
  
  return { migrated: true, count: data.length };
}
