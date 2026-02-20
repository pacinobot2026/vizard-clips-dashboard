import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CLIPS_FILE = path.join(DATA_DIR, 'clips.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize clips file if it doesn't exist
if (!fs.existsSync(CLIPS_FILE)) {
  fs.writeFileSync(CLIPS_FILE, JSON.stringify({ clips: [] }, null, 2));
}

export function getAllClips() {
  const data = fs.readFileSync(CLIPS_FILE, 'utf-8');
  return JSON.parse(data).clips;
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
  const clips = getAllClips();
  const newClip = {
    ...clipData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  clips.push(newClip);
  saveClips(clips);
  return newClip;
}

export function updateClip(clipId, updates) {
  const clips = getAllClips();
  const index = clips.findIndex(c => c.clip_id === clipId);
  
  if (index === -1) {
    throw new Error(`Clip ${clipId} not found`);
  }
  
  clips[index] = {
    ...clips[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  saveClips(clips);
  return clips[index];
}

export function getClip(clipId) {
  const clips = getAllClips();
  return clips.find(c => c.clip_id === clipId);
}

export function deleteClip(clipId) {
  const clips = getAllClips();
  const filtered = clips.filter(c => c.clip_id !== clipId);
  saveClips(filtered);
}

function saveClips(clips) {
  fs.writeFileSync(CLIPS_FILE, JSON.stringify({ clips }, null, 2));
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
