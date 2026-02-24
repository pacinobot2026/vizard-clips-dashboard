import { getPendingClips, getApprovedClips, getPublishedClips, getRejectedClips, getStats, getCategories, getAllClips } from '../../lib/storage';

export default async function handler(req, res) {
  // Password protection removed - public access

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filter, category, sortBy } = req.query;

  try {
    let clips;
    
    switch (filter) {
      case 'pending':
        clips = await getPendingClips();
        break;
      case 'approved':
        clips = await getApprovedClips();
        break;
      case 'published':
        clips = await getPublishedClips();
        break;
      case 'rejected':
        clips = await getRejectedClips();
        break;
      case 'all':
        clips = await getAllClips();
        break;
      default:
        clips = await getPendingClips();
    }

    // Filter by category if specified
    if (category && category !== 'all') {
      clips = clips.filter(c => c.category === category);
    }

    // Sort clips
    if (sortBy) {
      switch (sortBy) {
        case 'viral_score':
          clips.sort((a, b) => parseFloat(b.viral_score) - parseFloat(a.viral_score));
          break;
        case 'duration':
          clips.sort((a, b) => (b.duration_seconds || 0) - (a.duration_seconds || 0));
          break;
        case 'date_desc':
          clips.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        case 'date_asc':
          clips.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          break;
        default:
          clips.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
    }

    const stats = await getStats();
    const categories = await getCategories();

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
