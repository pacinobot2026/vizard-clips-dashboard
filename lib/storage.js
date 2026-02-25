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

