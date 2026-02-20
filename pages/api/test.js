import { getAllClips, getStats } from '../../lib/storage';

export default function handler(req, res) {
  try {
    const clips = getAllClips();
    const stats = getStats();
    
    return res.status(200).json({
      success: true,
      clipCount: clips.length,
      stats,
      sampleClip: clips[0] || null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
