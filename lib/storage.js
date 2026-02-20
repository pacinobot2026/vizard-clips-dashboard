// In-memory storage for Vercel serverless
// Generate 50 demo clips for testing high volume

const demoVideos = [
  "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
];

const titles = [
  "Breakthrough AI Marketing Strategy",
  "The #1 Mistake Entrepreneurs Make",
  "How We Scaled to $1M in 90 Days",
  "3 Tools That Changed My Business",
  "Why Your Funnels Are Failing",
  "The Future of AI in Local Business",
  "Secret Growth Hack Nobody Talks About",
  "How I Got 100K Followers in 30 Days",
  "This Changed Everything For My Business",
  "The Truth About Social Media Marketing",
  "Stop Wasting Money on Ads",
  "My Proven 5-Step Framework",
  "What They Don't Tell You About Success",
  "The Fastest Way to Scale Your Business",
  "How to 10X Your Revenue This Year",
  "The One Thing That Made Me Millions",
  "Why Most Businesses Fail (And How to Win)",
  "The Ultimate Guide to Going Viral",
  "My Best-Kept Marketing Secret",
  "How to Automate Your Entire Business"
];

const sources = [
  "Newsletter Hour 2026-02-20",
  "Tech Talk Tuesday 2026-02-19",
  "Friday Funnel Review 2026-02-21",
  "Monday Mastermind 2026-02-17",
  "Weekly Workshop 2026-02-18"
];

// Generate 50 clips
let clipsCache = [];
for (let i = 1; i <= 50; i++) {
  const viralScore = Math.floor(Math.random() * 5) + 6; // 6-10
  const titleIndex = i % titles.length;
  const videoIndex = i % demoVideos.length;
  const sourceIndex = i % sources.length;
  
  clipsCache.push({
    clip_id: `clip_${String(i).padStart(3, '0')}`,
    source_video_title: sources[sourceIndex],
    vizard_project_id: `project_${Math.floor(i / 5) + 1}`,
    clip_url: demoVideos[videoIndex],
    title: `${titles[titleIndex]} - Part ${i}`,
    suggested_caption: `Amazing insight from our latest video! This is exactly what you need to know. 🚀 #Marketing #Business #Growth`,
    viral_score: String(viralScore),
    transcript: `This is the transcript for clip ${i}. Contains valuable insights about business and marketing...`,
    duration_ms: Math.floor(Math.random() * 50000) + 20000, // 20-70 seconds
    status: "pending_review",
    post_status: "not_posted",
    created_at: new Date(Date.now() - (50 - i) * 60000).toISOString(),
    updated_at: new Date(Date.now() - (50 - i) * 60000).toISOString()
  });
}

// Add a few approved and published for variety
clipsCache[48].status = "approved";
clipsCache[49].status = "approved";
clipsCache[47].status = "published";
clipsCache[47].post_status = "published";

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
