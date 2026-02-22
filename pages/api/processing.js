export default async function handler(req, res) {
  try {
    const VIZARD_API_KEY = process.env.VIZARD_API_KEY || 'a3ceb9b1e62a49a9a101923472724ea9';
    
    // Track active projects (you can expand this to use a database/file)
    // For now, we'll check for projects submitted in last 24 hours from clips-state.json
    const fs = require('fs');
    const path = require('path');
    const axios = require('axios');
    
    const clipsFile = path.join(process.cwd(), 'data', 'clips-state.json');
    
    if (!fs.existsSync(clipsFile)) {
      return res.status(200).json({ processing: 0 });
    }
    
    const clips = JSON.parse(fs.readFileSync(clipsFile, 'utf-8'));
    
    // Get unique project IDs submitted recently
    const projectIds = [...new Set(
      clips
        .filter(c => c.vizard_project_id)
        .map(c => c.vizard_project_id)
    )];
    
    // Check status of each project
    let processingCount = 0;
    
    for (const projectId of projectIds.slice(0, 5)) { // Check max 5 recent projects
      try {
        const response = await axios.get(
          `https://elb-api.vizard.ai/hvizard-server-front/open-api/v1/project/query/${projectId}`,
          {
            headers: { 'VIZARDAI_API_KEY': VIZARD_API_KEY },
            timeout: 3000
          }
        );
        
        if (response.data.code === 1000) {
          processingCount++;
        }
      } catch (err) {
        // Skip errors, just continue
      }
    }
    
    return res.status(200).json({ processing: processingCount });
    
  } catch (error) {
    console.error('Processing check error:', error);
    return res.status(200).json({ processing: 0 });
  }
}
