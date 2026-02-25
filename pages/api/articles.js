import { supabase } from '../../lib/supabase';

const LETTERMAN_BASE = 'https://api.letterman.ai/api/ai/newsletters-storage';

async function getLettermanKey(req) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const result = await supabase.auth.getUser(token);
      const user = result?.data?.user;
      if (user) {
        const { data } = await supabase
          .from('settings')
          .select('value')
          .eq('user_id', user.id)
          .eq('key', 'letterman_api_key')
          .single();
        if (data?.value) return data.value;
      }
    }
  } catch (err) {
    console.error('getLettermanKey error:', err.message);
  }
  // Fall back to environment variable
  return process.env.LETTERMAN_API_KEY || null;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const LETTERMAN_API_KEY = await getLettermanKey(req);
  if (!LETTERMAN_API_KEY) {
    return res.status(400).json({ error: 'Letterman API key not configured', noKey: true });
  }

  const headers = { Authorization: `Bearer ${LETTERMAN_API_KEY}` };

  try {
    // Step 1: Fetch all publications dynamically
    const pubsRes = await fetch(LETTERMAN_BASE, {
      headers,
      signal: AbortSignal.timeout(10000),
    });
    const publications = await pubsRes.json();

    if (!Array.isArray(publications)) {
      return res.status(400).json({ error: 'Invalid Letterman API key or unexpected response', noKey: true });
    }

    // Step 2: Fetch articles for each publication
    const allArticles = [];

    for (const pub of publications) {
      const pubId = pub._id;
      const pubName = pub.name || 'Unknown';
      try {
        const response = await fetch(
          `${LETTERMAN_BASE}/${pubId}/newsletters`,
          { headers, signal: AbortSignal.timeout(10000) }
        );
        const data = await response.json();
        console.log(`[pub:${pubName}] response keys:`, Object.keys(data || {}), '| type samples:', (data?.data?.newsletters || data?.newsletters || []).slice(0, 2).map(n => n?.type || n?.state));
        const newsletters = data?.data?.newsletters || data?.newsletters || data?.data || [];
        allArticles.push(...(Array.isArray(newsletters) ? newsletters : []).map(article => ({
          id: article._id,
          title: article.title || 'Untitled',
          publication: pubName,
          publication_id: pubId,
          status: article.state || 'draft',
          image_url: article.previewImageUrl || article.archiveThumbnailImageUrl || null,
          url_path: article.urlPath || null,
          created_at: article.createdAt || new Date().toISOString(),
          updated_at: article.updatedAt || null,
        })));
      } catch (err) {
        console.error(`Error fetching articles for publication "${pubName}":`, err.message);
      }
    }

    return res.status(200).json({ articles: allArticles, total: allArticles.length });
  } catch (error) {
    console.error('Error fetching articles:', error.message);
    return res.status(500).json({ error: 'Failed to fetch articles' });
  }
}
