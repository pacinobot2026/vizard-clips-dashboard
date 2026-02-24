import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, category, type, url, notes, tags } = req.body;

    if (!title || !category || !type || !url) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dataPath = path.join(process.cwd(), 'data', 'vault.json');
    const dataDir = path.join(process.cwd(), 'data');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read existing data or create new
    let data = { items: [] };
    if (fs.existsSync(dataPath)) {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }

    // Create new item
    const newItem = {
      id: Date.now().toString(),
      title,
      category,
      type,
      url,
      notes: notes || '',
      tags: tags || [],
      createdAt: new Date().toISOString()
    };

    // Add to items array
    data.items.unshift(newItem);

    // Save back to file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    res.status(200).json({ success: true, item: newItem });
  } catch (error) {
    console.error('Error uploading item:', error);
    res.status(500).json({ error: 'Failed to upload item' });
  }
}
