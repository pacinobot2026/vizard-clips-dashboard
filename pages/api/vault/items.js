import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dataPath = path.join(process.cwd(), 'data', 'vault.json');
    
    // Create data directory and file if they don't exist
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(dataPath)) {
      const initialData = { items: [] };
      fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
      return res.status(200).json(initialData);
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    res.status(200).json(data);
  } catch (error) {
    console.error('Error reading vault data:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
}
