import { getAuthToken, verifySessionToken } from '../../lib/auth';
import { getPendingClips, getApprovedClips, getPublishedClips, getRejectedClips, getStats, getCategories, getAllClips } from '../../lib/storage';

export default function handler(req, res) {
  // Verify authentication
  const token = getAuthToken(req);
  if (!verifySessionToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filter, category, sortBy } = req.query;

  try {
    let clips;
    
    switch (filter) {
      case 'pending':
        clips = getPendingClips();
        break;
      case 'approved':
        clips = getApprovedClips();
        break;
      case 'published':
        clips = getPublishedClips();
        break;
      case 'rejected':
        clips = getRejectedClips();
        break;
      case 'all':
        clips = getAllClips();
        break;
      default:
        clips = getPendingClips(); // Default to pending
    }

    // Filter by category if specified
    if (category && category !== 'all') {
      clips = clips.filter(c => c.category === category);
    }

    // Sort clips
    if (sortBy) {
      switch (sortBy) {
        case 'viral_score':
          clips.sort((a, b) => parseInt(b.viral_score) - parseInt(a.viral_score));
          break;
        case 'duration':
          clips.sort((a, b) => b.duration_ms - a.duration_ms);
          break;
        case 'date_desc':
          clips.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        case 'date_asc':
          clips.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          break;
        default:
          // Default: newest first
          clips.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
    }

    const stats = getStats();
    const categories = getCategories();

    return res.status(200).json({
      clips,
      stats,
      categories
    });
  } catch (error) {
    console.error('Error fetching clips:', error);
    return res.status(500).json({ error: 'Failed to fetch clips' });
  }
}
