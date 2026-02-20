// In-memory storage for Vercel serverless
// Generate 50 demo clips with categories

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

const categories = [
  { name: "Newsletter Hour", emoji: "📰" },
  { name: "Real Estate Tips", emoji: "🏠" },
  { name: "Tech Talk Tuesday", emoji: "💻" },
  { name: "Marketing Mastery", emoji: "📊" },
  { name: "Business Growth", emoji: "📈" }
];

// Generate 50 clips with categories
let clipsCache = [];
for (let i = 1; i <= 50; i++) {
  const viralScore = Math.floor(Math.random() * 5) + 6; // 6-10
  const titleIndex = i % titles.length;
  const videoIndex = i % demoVideos.length;
  const categoryIndex = i % categories.length;
  const category = categories[categoryIndex];
  
  clipsCache.push({
    clip_id: `clip_${String(i).padStart(3, '0')}`,
    source_video_title: `${category.name} 2026-02-${15 + (i % 10)}`,
    category: category.name,
    category_emoji: category.emoji,
    vizard_project_id: `project_${Math.floor(i / 5) + 1}`,
    clip_url: demoVideos[videoIndex],
    title: `${titles[titleIndex]} - Part ${i}`,
    suggested_caption: `Amazing insight from our latest ${category.name}! This is exactly what you need to know. 🚀 #Marketing #Business #Growth`,
    viral_score: String(viralScore),
    transcript: `This is the transcript for clip ${i}. Contains valuable insights about business and marketing...`,
    duration_ms: Math.floor(Math.random() * 50000) + 20000, // 20-70 seconds
    status: "pending_review",
    post_status: "not_posted",
    rejection_note: null,
    created_at: new Date(Date.now() - (50 - i) * 60000).toISOString(),
    updated_at: new Date(Date.now() - (50 - i) * 60000).toISOString()
  });
}

// Add variety - some approved, some rejected with notes
clipsCache[48].status = "approved";
clipsCache[49].status = "approved";
clipsCache[47].status = "published";
clipsCache[47].post_status = "published";
clipsCache[45].status = "rejected";
clipsCache[45].rejection_note = "Audio quality is too low";
clipsCache[44].status = "rejected";
clipsCache[44].rejection_note = "Content doesn't match brand guidelines";

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

export function getRejectedClips() {
  return clipsCache.filter(c => c.status === 'rejected');
}

export function getCategories() {
  const cats = [...new Set(clipsCache.map(c => c.category))];
  return cats.map(name => {
    const clip = clipsCache.find(c => c.category === name);
    return {
      name,
      emoji: clip.category_emoji,
      count: clipsCache.filter(c => c.category === name).length
    };
  });
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

export function bulkUpdate(clipIds, updates) {
  const results = [];
  for (const clipId of clipIds) {
    try {
      const updated = updateClip(clipId, updates);
      results.push({ clipId, success: true, clip: updated });
    } catch (error) {
      results.push({ clipId, success: false, error: error.message });
    }
  }
  return results;
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
