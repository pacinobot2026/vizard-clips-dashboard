import { demoClips } from './demo-data.js';

// In-memory storage for Vercel (serverless environment)
// For production, use a database
let clipsCache = [...demoClips];

export function getAllClips() {
  return clipsCache;
}

export function getPendingClips() {
  const clips = getAllClips();
  return clips.filter(c => c.status === 'pending_review');
}

export function getApprovedClips() {
  const clips = getAllClips();
  return clips.filter(c => c.status === 'approved' && c.post_status === 'not_posted');
}

export function getPublishedClips() {
  const clips = getAllClips();
  return clips.filter(c => c.post_status === 'published');
}

export function addClip(clipData) {
  const newClip = {
    ...clipData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  clipsCache.push(newClip);
  return newClip;
}

export function updateClip(clipId, updates) {
  const index = clipsCache.findIndex(c => c.clip_id === clipId);
  
  if (index === -1) {
    throw new Error(`Clip ${clipId} not found`);
  }
  
  clipsCache[index] = {
    ...clipsCache[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return clipsCache[index];
}

export function getClip(clipId) {
  return clipsCache.find(c => c.clip_id === clipId);
}

export function deleteClip(clipId) {
  clipsCache = clipsCache.filter(c => c.clip_id !== clipId);
}

export function getStats() {
  const clips = getAllClips();
  return {
    total: clips.length,
    pending: clips.filter(c => c.status === 'pending_review').length,
    approved: clips.filter(c => c.status === 'approved' && c.post_status === 'not_posted').length,
    published: clips.filter(c => c.post_status === 'published').length,
    rejected: clips.filter(c => c.status === 'rejected').length
  };
}
