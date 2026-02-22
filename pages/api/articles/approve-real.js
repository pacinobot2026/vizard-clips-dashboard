// Approve article - updates status to APPROVED in Letterman

const LETTERMAN_API = 'https://api.letterman.ai/api/ai';
const LETTERMAN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWY1YjI4N2E0YTYwZTRmYjc4NjFmNDMiLCJrZXkiOiIyMzYwMDFhMTJiY2JiZGEyMTE5YTg3YzU3OTg4NmI5YyIsImlkIjoiNjk4MjljYjU0NjQyYzFmNTE1MThhZDU5IiwiaWF0IjoxNzcwMTY3NDc3LCJleHAiOjE4MDE3MDM0Nzd9.4FT3rraAWG4OtcTMY0k_LtV37cOLAYqmUwT_SF9S0cE';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { articleId } = req.body;

  if (!articleId) {
    return res.status(400).json({ error: 'Article ID is required' });
  }

  try {
    // Update article status to APPROVED
    const url = `${LETTERMAN_API}/newsletters/${articleId}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${LETTERMAN_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        state: 'APPROVED'
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Letterman API error:', response.status, errorData);
      return res.status(response.status).json({ 
        error: 'Failed to approve article',
        details: errorData 
      });
    }

    const data = await response.json();
    
    res.status(200).json({ 
      success: true,
      article: data
    });
  } catch (error) {
    console.error('Error approving article:', error);
    res.status(500).json({ 
      error: 'Failed to approve article',
      message: error.message 
    });
  }
}
