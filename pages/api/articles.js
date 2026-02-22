const axios = require('axios');

// Letterman publications
const PUBLICATIONS = {
  'West Valley': '677895a2584a3ce5878fcf5b',
  'Save the Doggy': '68a78eba3ce3e647df7fefaa',
  'Vegas Fork': '68a790aa3ce3e647df7ff272'
};

const PUBLICATION_EMOJIS = {
  'West Valley': '📍',
  'Save the Doggy': '🐕',
  'Vegas Fork': '🍴'
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filter, category, sortBy } = req.query;

  try {
    // Get Letterman API key from environment
    const LETTERMAN_API_KEY = process.env.LETTERMAN_API_KEY || '';
    
    if (!LETTERMAN_API_KEY) {
      return res.status(500).json({ error: 'Letterman API key not configured' });
    }

    // Fetch articles from all publications
    const allArticles = [];
    
    for (const [pubName, pubId] of Object.entries(PUBLICATIONS)) {
      try {
        const response = await axios.get(
          `https://api.letterman.ai/api/newsletters/get-by-publication/${pubId}`,
          {
            headers: {
              'Authorization': `Bearer ${LETTERMAN_API_KEY}`
            },
            timeout: 5000
          }
        );

        if (response.data && response.data.data) {
          const articles = response.data.data.map(article => ({
            id: article._id,
            title: article.title || 'Untitled',
            publication: pubName,
            publication_emoji: PUBLICATION_EMOJIS[pubName],
            status: article.status || 'draft',
            image_url: article.previewImageUrl || article.archiveThumbnailImageUrl || null,
            url_path: article.urlPath || null,
            created_at: article.createdAt || new Date().toISOString(),
            updated_at: article.updatedAt || null
          }));
          
          allArticles.push(...articles);
        }
      } catch (err) {
        console.error(`Error fetching ${pubName}:`, err.message);
      }
    }

    // Filter by status
    let filteredArticles = allArticles;
    
    if (filter === 'draft') {
      filteredArticles = allArticles.filter(a => a.status === 'draft');
    } else if (filter === 'approved') {
      filteredArticles = allArticles.filter(a => a.status === 'approved' || a.status === 'scheduled');
    } else if (filter === 'published') {
      filteredArticles = allArticles.filter(a => a.status === 'published');
    } else if (filter === 'rejected') {
      filteredArticles = allArticles.filter(a => a.status === 'rejected');
    }

    // Filter by category (publication)
    if (category && category !== 'all') {
      filteredArticles = filteredArticles.filter(a => a.publication === category);
    }

    // Sort
    if (sortBy === 'date_desc') {
      filteredArticles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'date_asc') {
      filteredArticles.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === 'title') {
      filteredArticles.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    // Calculate stats
    const stats = {
      draft: allArticles.filter(a => a.status === 'draft').length,
      approved: allArticles.filter(a => a.status === 'approved' || a.status === 'scheduled').length,
      published: allArticles.filter(a => a.status === 'published').length,
      rejected: allArticles.filter(a => a.status === 'rejected').length
    };

    // Get categories
    const categoryMap = {};
    allArticles.forEach(article => {
      if (!categoryMap[article.publication]) {
        categoryMap[article.publication] = {
          name: article.publication,
          emoji: article.publication_emoji,
          count: 0
        };
      }
      categoryMap[article.publication].count++;
    });
    
    const categories = Object.values(categoryMap);

    return res.status(200).json({
      articles: filteredArticles,
      stats,
      categories
    });

  } catch (error) {
    console.error('Error fetching articles:', error);
    return res.status(500).json({ error: 'Failed to fetch articles' });
  }
}
