import { getPendingClips, getApprovedClips, getPublishedClips, getRejectedClips, getStats, getCategories, getAllClips, addClip, updateClip, deleteClip } from '../../lib/storage';

export default async function handler(req, res) {
  // Password protection removed - public access

  if (req.method === 'POST') {
    const { title, clip_url, category } = req.body;
    if (!title || !clip_url) return res.status(400).json({ error: 'title and clip_url are required' });
    try {
      const clip_id = `manual_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const clip = await addClip({
        clip_id,
        title,
        clip_url,
        source_video: clip_url,
        category: category || 'Manual',
        category_emoji: '🎬',
        status: 'pending_review',
        post_status: 'not_posted',
      });
      return res.status(201).json({ clip });
    } catch (error) {
      console.error('Error adding clip:', error);
      return res.status(500).json({ error: 'Failed to add clip' });
    }
  }

  if (req.method === 'PUT') {
    const { clip_id, title, clip_url, category } = req.body;
    if (!clip_id) return res.status(400).json({ error: 'clip_id is required' });
    try {
      const updates = {};
      if (title !== undefined) updates.title = title;
      if (clip_url !== undefined) { updates.clip_url = clip_url; updates.source_video = clip_url; }
      if (category !== undefined) updates.category = category;
      const clip = await updateClip(clip_id, updates);
      return res.status(200).json({ clip });
    } catch (error) {
      console.error('Error updating clip:', error);
      return res.status(500).json({ error: 'Failed to update clip' });
    }
  }

  if (req.method === 'DELETE') {
    const { clip_id } = req.body;
    if (!clip_id) return res.status(400).json({ error: 'clip_id is required' });
    try {
      await deleteClip(clip_id);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting clip:', error);
      return res.status(500).json({ error: 'Failed to delete clip' });
    }
  }

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
