// Real Letterman API integration for Article Board
// Fetches actual articles from Chad's 3 publications

const LETTERMAN_API = 'https://api.letterman.ai/api/ai';
const LETTERMAN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWY1YjI4N2E0YTYwZTRmYjc4NjFmNDMiLCJrZXkiOiIyMzYwMDFhMTJiY2JiZGEyMTE5YTg3YzU3OTg4NmI5YyIsImlkIjoiNjk4MjljYjU0NjQyYzFmNTE1MThhZDU5IiwiaWF0IjoxNzcwMTY3NDc3LCJleHAiOjE4MDE3MDM0Nzd9.4FT3rraAWG4OtcTMY0k_LtV37cOLAYqmUwT_SF9S0cE';

const PUBLICATIONS = {
  'West Valley Shoutouts': {
    id: '677895a2584a3ce5878fcf5b',
    emoji: '📍',
    domain: 'westvalleyshoutouts.com'
  },
  'Save The Doggy': {
    id: '68a78eba3ce3e647df7fefaa',
    emoji: '🐕',
    domain: 'savethedoggy.com'
  },
  'Vegas Fork': {
    id: '68a790aa3ce3e647df7ff272',
    emoji: '🍴',
    domain: 'vegasfork.com'
  }
};

// Map Article Board filters to Letterman states
const STATE_MAPPING = {
  'draft': 'DRAFT',
  'approved': 'APPROVED',
  'published': 'PUBLISHED',
  'rejected': 'REJECTED'  // Note: Letterman may not have this state, we'll handle it
};

export default async function handler(req, res) {
  const { filter = 'draft', category = 'all', sortBy = 'date_desc' } = req.query;

  try {
    const allArticles = await fetchArticlesFromLetterman(filter, category);
    const articles = transformArticles(allArticles, sortBy);
    const stats = calculateStats(allArticles);
    const categories = buildCategories(allArticles);

    res.status(200).json({
      articles,
      stats,
      categories
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ 
      error: 'Failed to fetch articles',
      message: error.message 
    });
  }
}

async function fetchArticlesFromLetterman(filter, category) {
  const letterState = STATE_MAPPING[filter] || 'DRAFT';
  const allArticles = [];

  // Determine which publications to fetch from
  const pubsToFetch = category === 'all' 
    ? Object.entries(PUBLICATIONS)
    : Object.entries(PUBLICATIONS).filter(([name]) => name === category);

  // Fetch from each publication
  for (const [pubName, pubInfo] of pubsToFetch) {
    try {
      const url = `${LETTERMAN_API}/newsletters-storage/${pubInfo.id}/newsletters?state=${letterState}&type=ARTICLE`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${LETTERMAN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`Failed to fetch ${pubName}:`, response.status);
        continue;
      }

      const data = await response.json();
      const articles = data.data || [];

      // Transform and add publication info
      articles.forEach(article => {
        allArticles.push({
          id: article.id || article._id,
          title: article.title || article.name || 'Untitled Article',
          description: article.description || '',
          publication: pubName,
          publicationEmoji: pubInfo.emoji,
          status: filter, // Use the filter as the status
          image_url: article.imageUrl || article.settings?.seo?.image || null,
          created_at: article.createdAt || article.created_at || new Date().toISOString(),
          updated_at: article.updatedAt || article.updated_at || new Date().toISOString(),
          url_path: article.settings?.seo?.urlPath || '',
          scrapable: true, // Assume all Letterman articles are scrapable for now
          keywords: article.keywords || [],
          _raw: article // Keep raw data for debugging
        });
      });
    } catch (error) {
      console.error(`Error fetching ${pubName}:`, error);
    }
  }

  return allArticles;
}

function transformArticles(articles, sortBy) {
  // Sort articles
  const sorted = [...articles];
  
  if (sortBy === 'date_desc') {
    sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortBy === 'date_asc') {
    sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (sortBy === 'title') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  return sorted;
}

function calculateStats(articles) {
  return {
    draft: articles.filter(a => a.status === 'draft').length,
    approved: articles.filter(a => a.status === 'approved').length,
    published: articles.filter(a => a.status === 'published').length,
    rejected: articles.filter(a => a.status === 'rejected').length
  };
}

function buildCategories(articles) {
  const categoryMap = {};
  
  articles.forEach(article => {
    const pub = article.publication;
    if (!categoryMap[pub]) {
      categoryMap[pub] = {
        name: pub,
        emoji: article.publicationEmoji,
        count: 0
      };
    }
    categoryMap[pub].count++;
  });

  return Object.values(categoryMap);
}
