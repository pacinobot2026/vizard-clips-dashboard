// In-memory storage for Vercel serverless
// Demo clips pre-loaded
let clipsCache = [
  {
    clip_id: "demo_001",
    source_video_title: "Newsletter Hour 2026-02-18",
    vizard_project_id: "demo_project_001",
    clip_url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    title: "Breakthrough AI Marketing Strategy Revealed",
    suggested_caption: "This clip showcases an incredible breakthrough in AI marketing that's transforming how businesses engage with customers. 🚀 #AIMarketing #BusinessGrowth",
    viral_score: "9",
    transcript: "Today I want to share with you an incredible breakthrough in AI marketing...",
    duration_ms: 45000,
    status: "pending_review",
    post_status: "not_posted",
    created_at: "2026-02-20T18:30:00.000Z",
    updated_at: "2026-02-20T18:30:00.000Z"
  },
  {
    clip_id: "demo_002",
    source_video_title: "Newsletter Hour 2026-02-18",
    vizard_project_id: "demo_project_001",
    clip_url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
    title: "The #1 Mistake Most Entrepreneurs Make",
    suggested_caption: "Stop making this critical mistake! 99% of entrepreneurs fall into this trap. 💡",
    viral_score: "8",
    transcript: "The number one mistake I see entrepreneurs making every single day...",
    duration_ms: 32000,
    status: "pending_review",
    post_status: "not_posted",
    created_at: "2026-02-20T18:31:00.000Z",
    updated_at: "2026-02-20T18:31:00.000Z"
  },
  {
    clip_id: "demo_003",
    source_video_title: "Tech Talk Tuesday 2026-02-19",
    vizard_project_id: "demo_project_002",
    clip_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    title: "How We Scaled to $1M in 90 Days",
    suggested_caption: "From zero to $1M in just 90 days! Here's the exact framework we used. 🔥💰",
    viral_score: "10",
    transcript: "Let me walk you through the exact framework we used to scale...",
    duration_ms: 58000,
    status: "approved",
    post_status: "not_posted",
    created_at: "2026-02-20T19:00:00.000Z",
    updated_at: "2026-02-20T19:15:00.000Z"
  }
];

export function getAllClips() {
  return clipsCache;
}

export function getPendingClips() {
  return clipsCache.filter(c => c.status === 'pending_review');
}

export function getApprovedClips() {
  return clipsCache.filter(c => c.status === 'approved' && c.post_status === 'not_posted');
}

export function getPublishedClips() {
  return clipsCache.filter(c => c.post_status === 'published');
}

export function addClip(clipData) {
  const newClip = {
    ...clipData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  clipsCache.push(newClip);
  return newClip;
}

export function updateClip(clipId, updates) {
  const index = clipsCache.findIndex(c => c.clip_id === clipId);
  
  if (index === -1) {
    throw new Error(`Clip ${clipId} not found`);
  }
  
  clipsCache[index] = {
    ...clipsCache[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return clipsCache[index];
}

export function getClip(clipId) {
  return clipsCache.find(c => c.clip_id === clipId);
}

export function deleteClip(clipId) {
  clipsCache = clipsCache.filter(c => c.clip_id !== clipId);
}

export function getStats() {
  return {
    total: clipsCache.length,
    pending: clipsCache.filter(c => c.status === 'pending_review').length,
    approved: clipsCache.filter(c => c.status === 'approved' && c.post_status === 'not_posted').length,
    published: clipsCache.filter(c => c.post_status === 'published').length,
    rejected: clipsCache.filter(c => c.status === 'rejected').length
  };
}
