import { getAuthToken, verifySessionToken } from '../../lib/auth';
import { updateClip } from '../../lib/storage';

export default function handler(req, res) {
  // Verify authentication
  const token = getAuthToken(req);
  if (!verifySessionToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { clipId } = req.body;

  if (!clipId) {
    return res.status(400).json({ error: 'Clip ID required' });
  }

  try {
    const updatedClip = updateClip(clipId, {
      status: 'rejected'
    });

    return res.status(200).json({
      success: true,
      clip: updatedClip
    });
  } catch (error) {
    console.error('Error rejecting clip:', error);
    return res.status(500).json({ error: 'Failed to reject clip' });
  }
}
