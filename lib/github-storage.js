// Persistent storage using GitHub repo as backend
// Reads/writes clips.json to the repo

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'pacinobot2026';
const REPO_NAME = 'vizard-clips-dashboard';
const FILE_PATH = 'data/clips-state.json';

let clipsCache = null;
let lastSha = null;

// Initial clips data (fallback if GitHub file doesn't exist)
const initialClips = [
  {
    "clip_id": "36882833",
    "title": "How to Earn Commissions Without Doing the Selling",
    "duration_seconds": 39,
    "viral_score": "9.2",
    "source_video": "Vimeo 1153676279",
    "vizard_project_id": "28404293",
    "status": "pending_review",
    "post_status": "not_posted",
    "category": "Newsletter Hour",
    "category_emoji": "📰",
    "clip_url": "https://cdn-video.vizard.ai/vizard/video/export/20260220/36882833-8c693cf59e424f21897ee7221cabc0e9.mp4?Expires=1772224541&Signature=p1jNYVIplqUDqloHPHxCi9LzVQXGPJjthBqqfUy0SUVL4Bc0ThzzZ9F~qgqunlmbQTXentmsEQD9C4eETxwGKHe8GEiaMPpVgQ6GCZb54R-xaZh3mPKTLoxSd0Ear9xItWt6mYbacgXURlnKAf~mGWwBjLCuyUNLuYvtmwu-Mx93KcoYE76QlkYq5FMGuKsOXi6YigG4vC~WzD8KwxyJSdiM3TwvmhZJxjG7SOhU7S81xjQVixhESjkRMW96Z--JqrXdzM~~Sgi1dk2OhiYativ96nsPZ~~XaMTCJLUL0Y8IPztaZPq7LjlJocMoGIG7OhfbGKylKzTYJ6ZnyruyPg__&Key-Pair-Id=K1STSG6HQYFY8F",
    "created_at": "2026-02-20 14:35:00"
  },
  {
    "clip_id": "36882832",
    "title": "Why You Should Start A Local Newsletter",
    "duration_seconds": 18,
    "viral_score": "9",
    "source_video": "Vimeo 1153676279",
    "vizard_project_id": "28404293",
    "status": "pending_review",
    "post_status": "not_posted",
    "category": "Newsletter Hour",
    "category_emoji": "📰",
    "clip_url": "https://cdn-video.vizard.ai/vizard/video/export/20260220/36882832-9dfd3be11fb240f3a8333425255f8d58.mp4?Expires=1772224541&Signature=pNK0AKjJD3aHoAieUe2ItMseRW9coYlkfN~AwuvPw5kHGA4jaG4S-y-vX9nBkSFWKbdF4uDu--hJ9vMkpXj47PL89nttE30VUTOesuekcQFmJEk4QKc1Xwuv0ZMBPiGQ6LmuyqRxSJE91uVExUuwp7cL1KlGFVX8oLh-3q6m~afWew09FpVYfIZML5Dh1OskVMJIIXkFl8c4Zr0UeJsfjMAf5c-NcykdEDRqTNRN1fDjQI9P8RWvuMriMl3q2DuUWnxs41-oP4hkXpGNjJ5WbNJI6EDn8mmjOyy3uRo2ZUokghFrhb36NV0kEAlnaZYo6DYradEmgDl8BcrH62VNxg__&Key-Pair-Id=K1STSG6HQYFY8F",
    "created_at": "2026-02-20 14:35:00"
  },
  {
    "clip_id": "36882831",
    "title": "We Build Your Brand For You",
    "duration_seconds": 17,
    "viral_score": "8.7",
    "source_video": "Vimeo 1153676279",
    "vizard_project_id": "28404293",
    "status": "pending_review",
    "post_status": "not_posted",
    "category": "Newsletter Hour",
    "category_emoji": "📰",
    "clip_url": "https://cdn-video.vizard.ai/vizard/video/export/20260220/36882831-f7a61e0d811d47ac84b84936058ac1c1.mp4?Expires=1772224541&Signature=A0JsRoEpRfLN2ALSurkS4PScv6fTlvvqR0o~Sd8Pul~JJSVcaf-Y~zhmVWckRsqkNrWs5biMFy7OKkzv3D1VCi4lWoTmhgaiPiCM01Jf9o3iHm1FeqEVeacHAOK9fyyR8HeOUh-G8ynTHmctkt-n3O~ZtkC3B-pnLdabk3zSLiFSeX97hanhdIS1FgFe2HQADXH7I0dCnpHtFBf4GBYofQSTvS3bGBAh1jFnXkSYCmsxSpZmKOm6sxm4hkKtExnyITeN4NjXYLOUscD22SvRRnP-EB6l6MXSb16nQ6Za3vRMbJrxAr-Td-2xJ8FXJ9sQuAysPWyNkn3GOmhALmlDZw__&Key-Pair-Id=K1STSG6HQYFY8F",
    "created_at": "2026-02-20 14:35:00"
  },
  {
    "clip_id": "36882830",
    "title": "The Secret to Laser-Focused Local Ad Campaigns",
    "duration_seconds": 38,
    "viral_score": "8.5",
    "source_video": "Vimeo 1153676279",
    "vizard_project_id": "28404293",
    "status": "pending_review",
    "post_status": "not_posted",
    "category": "Newsletter Hour",
    "category_emoji": "📰",
    "clip_url": "https://cdn-video.vizard.ai/vizard/video/export/20260220/36882830-bb45683177514d3aa47c54976b03bc4d.mp4?Expires=1772224541&Signature=JbOdrtVj0Viwxzpcr6M3a76vyg0VjjqOWrnvTlZAkE0L6aMThw~g-CK0ON2NWiigBW~oEXR5jFz~6mK4s-KEAiiOZDtuwBe0V7o0t8tKAzUH23zoWI3hayaUubSb1UG8hgeoV2F6OV9JvqipOkNVZ5q80FomCVhVacYXv22DWURiO1cwuk~ov~0b0Lh5cGJRd-wRKhg84g3gRHR7NeEsC7BF4PUg~U0qL7y-V8L3tZM4ERuzybMOh-0vwmud0ehd9uk7REhcm~IaNWr18ArlxKiAsj3jchFxbelFpaPwiBFCc4RItBXj70xZwMsl4cyxUGAuJXBoh2bAMEbjiJ3Q0A__&Key-Pair-Id=K1STSG6HQYFY8F",
    "created_at": "2026-02-20 14:35:00"
  },
  {
    "clip_id": "36882829",
    "title": "Join The Club Where The Money Is Made",
    "duration_seconds": 17,
    "viral_score": "8.5",
    "source_video": "Vimeo 1153676279",
    "vizard_project_id": "28404293",
    "status": "pending_review",
    "post_status": "not_posted",
    "category": "Newsletter Hour",
    "category_emoji": "📰",
    "clip_url": "https://cdn-video.vizard.ai/vizard/video/export/20260220/36882829-5998ea78d132466ab26b65a14bff0cce.mp4?Expires=1772224542&Signature=rVY8Jkpgq082BM-7VH3yCe~Vd4hgLKevOMxM7O99Cuzzf64RGiw7KgHzkwlGeGx1ldpLglqayXVkUtuJ9F7o-7alHWRynfDdWKyp~3B4E30-rY-gLS0tnbr2mq3jVdqrTMGLiyzrlTQV4xPq7wBBZPnSvszjx0W49xhAwkqiOZaUVUVtSQ7J-VnhlOz75I3vN0VSf-AfzqEgoa0jSB~57gWOCiSXxzwIjHqbO2h16G79BDWD9KLXaXUmZTCJvyCrRHxu4rWpzmDOTFapswez4jdmkcxYlBymVt2Yrxuegag8NQ8MRTYoU4K-p~V-dHoVhbWBb5vciOb5U5CaBwM9Yg__&Key-Pair-Id=K1STSG6HQYFY8F",
    "created_at": "2026-02-20 14:35:00"
  },
  {
    "clip_id": "36882828",
    "title": "The Hidden Goldmine In Local Newsletters",
    "duration_seconds": 15,
    "viral_score": "8.4",
    "source_video": "Vimeo 1153676279",
    "vizard_project_id": "28404293",
    "status": "pending_review",
    "post_status": "not_posted",
    "category": "Newsletter Hour",
    "category_emoji": "📰",
    "clip_url": "https://cdn-video.vizard.ai/vizard/video/export/20260220/36882828-13aeebca9270446f948c705a8c93a41e.mp4?Expires=1772224542&Signature=SvN493vPvnyXChgtfKsA5xpuLG6cMD2n5Y3FrInNCnHLI-6cLc3p1nwyc-hUh3EJAGJp8d1xa4dJuPkchvANGR5VsbuS3XcVUTXEwilu7FgtR8VTQUGcDZ9ryE9XlIJzkg2F~ouFn73mvbq~DaFW~0IL8SueSKqie~hFWi9jUDIiliXVEktmvW~wFKjiu~Z3mE2KV6581dm2iTibgLwW5o7WvDGNFtNxBRR3QK-oRJppNqKn16ykjX69xFepfCZVMq4U5YHEBg5TfvktcbINRud1eHowCvtaLyJnsYn5lAQjx480qe9Wu2PyKZoL3fCOKsAbWSTLONW9yrMXoJRGlg__&Key-Pair-Id=K1STSG6HQYFY8F",
    "created_at": "2026-02-20 14:35:00"
  },
  {
    "clip_id": "36882827",
    "title": "3 Pillars of a Profitable Newsletter: Growth, Ads, & Money",
    "duration_seconds": 34,
    "viral_score": "8.3",
    "source_video": "Vimeo 1153676279",
    "vizard_project_id": "28404293",
    "status": "pending_review",
    "post_status": "not_posted",
    "category": "Newsletter Hour",
    "category_emoji": "📰",
    "clip_url": "https://cdn-video.vizard.ai/vizard/video/export/20260220/36882827-538762df616d4523b98155dacd7f8b87.mp4?Expires=1772224542&Signature=owcK3bmKiYzPZpav2zVRfTVNMNwf~~6~AvjsEYzUP7-vYcBbyt51G-aNJN7btNnCJVYUnCzAoPlb5X6OOn0YZl6PjJIzkzH~6QD~UHX2LbVBywbOb5y7ZbhYo7Mntp7YlbCLCbmKkJalXR1KdB-X2XL1h~TcNM-iKBpFL85BHYEFH02Hlo16yLrnJmZPWCTcH~HwEoyGp4iSWyQhUXNfjCH~lqCTTf2gD8ve9I41hlz37A3JaQA0e5XieJq--FRuG3QmcJRgMdMt22sZrf85L~GcIzsYYzXOT9YFDxEnE3I8YgqiQBIhIN~ie2RTi6Zg8c9E8QlcF80gHJ8xxXoG1w__&Key-Pair-Id=K1STSG6HQYFY8F",
    "created_at": "2026-02-20 14:35:00"
  },
  {
    "clip_id": "36882826",
    "title": "The Tech Stack Behind a Pro-Level Marketing System",
    "duration_seconds": 33,
    "viral_score": "8",
    "source_video": "Vimeo 1153676279",
    "vizard_project_id": "28404293",
    "status": "pending_review",
    "post_status": "not_posted",
    "category": "Newsletter Hour",
    "category_emoji": "📰",
    "clip_url": "https://cdn-video.vizard.ai/vizard/video/export/20260220/36882826-f934bf2d98b74ca7a1a31cffb93e9560.mp4?Expires=1772224542&Signature=dd8bLXL0cew3xjZZQS5wTcQL8jxr2fDTW8Qq649xs7xiufPzXggwhqBN-cxsO5955cSP~zdxO5r65AacMNEYZ8qRb7eNAjpzmqiBkQkzjrUDDcnhjcKq6C0nHDE6rc79hy65RsTQLCspr-d9WmCsi4fI3bPtZifYp4-JQD8-BMaHP8-LZDFNjiL0Hu4M2LumXa6QDIvXEAf022mXyNRTvQhpirmeTsvqt5VClNr~V-OVqylaH720BiNx2Oaw0L5eI3GBKjXGE9XY3DEGnqzjX5x~ylQOrzhOpf3S22PpgZED7yehWLsO~29Y356eKYHK9YJqUYacbHhUIfs5dNjI2w__&Key-Pair-Id=K1STSG6HQYFY8F",
    "created_at": "2026-02-20 14:35:00"
  },
  {
    "clip_id": "36882825",
    "title": "The Ultimate Control Center For Your Business",
    "duration_seconds": 18,
    "viral_score": "8",
    "source_video": "Vimeo 1153676279",
    "vizard_project_id": "28404293",
    "status": "pending_review",
    "post_status": "not_posted",
    "category": "Newsletter Hour",
    "category_emoji": "📰",
    "clip_url": "https://cdn-video.vizard.ai/vizard/video/export/20260220/36882825-525460eb4c7a4858b976cee851315e10.mp4?Expires=1772224542&Signature=qkthkC7~-AsSRFZE-ZNJetDXsHttslwc15thbMdYV34ZxUxjQP0qNMJ6wsZSZvly4OuqrSgjOwBfwUurf2HHR5Kfoio1IZiB9~eQ8wMlq1ME7l5O6aWUgqtD-t69R8i3qAU5QJkYk~mRs6Wgk1qbKTddVUd~O-BTMm~67iU5IQtgRT1GHZhs6-IK-keMnmnS-~Me-CS9vHP2YE6muqUF~DzlGwyDELEHvDwY~VFd2J2teXeD9pQm6KJHlOIguS~V9-yq9Tn8CZwgHJw8q-Wo~sKg2ddZwuh1MKD2W1QXG7D~gvOFH2wg7N1iAH7DKREpWT0f1b7lX0ORrIckVbHNHA__&Key-Pair-Id=K1STSG6HQYFY8F",
    "created_at": "2026-02-20 14:35:00"
  }
];

async function loadFromGitHub() {
  if (!GITHUB_TOKEN) {
    console.log('No GITHUB_TOKEN - using initial clips');
    return initialClips;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (response.status === 404) {
      // File doesn't exist yet, create it
      await saveToGitHub(initialClips);
      return initialClips;
    }

    const data = await response.json();
    lastSha = data.sha;
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to load from GitHub:', error);
    return initialClips;
  }
}

async function saveToGitHub(clips) {
  if (!GITHUB_TOKEN) {
    console.log('No GITHUB_TOKEN - cannot save');
    return false;
  }

  try {
    const content = Buffer.from(JSON.stringify(clips, null, 2)).toString('base64');
    
    const body = {
      message: `Update clips state - ${new Date().toISOString()}`,
      content: content
    };

    if (lastSha) {
      body.sha = lastSha;
    }

    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    if (response.ok) {
      const result = await response.json();
      lastSha = result.content.sha;
      return true;
    } else {
      const error = await response.text();
      console.error('GitHub save failed:', error);
      return false;
    }
  } catch (error) {
    console.error('Failed to save to GitHub:', error);
    return false;
  }
}

// Initialize cache
async function ensureLoaded() {
  if (clipsCache === null) {
    clipsCache = await loadFromGitHub();
  }
  return clipsCache;
}

export async function getAllClips() {
  return await ensureLoaded();
}

export async function getPendingClips() {
  const clips = await ensureLoaded();
  return clips.filter(c => c.status === 'pending_review');
}

export async function getApprovedClips() {
  const clips = await ensureLoaded();
  return clips.filter(c => c.status === 'approved' && c.post_status === 'not_posted');
}

export async function getPublishedClips() {
  const clips = await ensureLoaded();
  return clips.filter(c => c.post_status === 'published');
}

export async function getRejectedClips() {
  const clips = await ensureLoaded();
  return clips.filter(c => c.status === 'rejected');
}

export async function getCategories() {
  const clips = await ensureLoaded();
  const cats = [...new Set(clips.map(c => c.category).filter(Boolean))];
  return cats.map(name => {
    const clip = clips.find(c => c.category === name);
    return {
      name,
      emoji: clip?.category_emoji || '📹',
      count: clips.filter(c => c.category === name).length
    };
  });
}

export async function addClip(clipData) {
  const clips = await ensureLoaded();
  const newClip = {
    ...clipData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  clips.push(newClip);
  clipsCache = clips;
  await saveToGitHub(clips);
  return newClip;
}

export async function updateClip(clipId, updates) {
  const clips = await ensureLoaded();
  const index = clips.findIndex(c => c.clip_id === clipId);
  
  if (index === -1) {
    throw new Error(`Clip ${clipId} not found`);
  }
  
  clips[index] = {
    ...clips[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  clipsCache = clips;
  await saveToGitHub(clips);
  
  return clips[index];
}

export async function bulkUpdate(clipIds, updates) {
  const clips = await ensureLoaded();
  const results = [];
  
  for (const clipId of clipIds) {
    const index = clips.findIndex(c => c.clip_id === clipId);
    if (index !== -1) {
      clips[index] = {
        ...clips[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      results.push({ clipId, success: true, clip: clips[index] });
    } else {
      results.push({ clipId, success: false, error: `Clip ${clipId} not found` });
    }
  }
  
  clipsCache = clips;
  await saveToGitHub(clips);
  
  return results;
}

export async function getClip(clipId) {
  const clips = await ensureLoaded();
  return clips.find(c => c.clip_id === clipId);
}

export async function deleteClip(clipId) {
  const clips = await ensureLoaded();
  clipsCache = clips.filter(c => c.clip_id !== clipId);
  await saveToGitHub(clipsCache);
}

export async function getStats() {
  const clips = await ensureLoaded();
  return {
    total: clips.length,
    pending: clips.filter(c => c.status === 'pending_review').length,
    approved: clips.filter(c => c.status === 'approved' && c.post_status === 'not_posted').length,
    published: clips.filter(c => c.post_status === 'published').length,
    rejected: clips.filter(c => c.status === 'rejected').length
  };
}
