import { getAuthToken, verifySessionToken } from '../../lib/auth';
import { getPendingClips, getApprovedClips, getPublishedClips, getStats } from '../../lib/storage';

export default function handler(req, res) {
  // Verify authentication
  const token = getAuthToken(req);
  if (!verifySessionToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filter } = req.query;

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
      default:
        clips = getPendingClips(); // Default to pending
    }

    const stats = getStats();

    return res.status(200).json({
      clips,
      stats
    });
  } catch (error) {
    console.error('Error fetching clips:', error);
    return res.status(500).json({ error: 'Failed to fetch clips' });
  }
}
