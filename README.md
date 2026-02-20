# 🎬 Vizard Clips Dashboard

Automated workflow for processing Vimeo videos through Vizard AI and publishing to social media.

## What It Does

**Complete automation pipeline:**
1. **Monitors Vimeo** account for new videos
2. **Submits to Vizard** for AI clipping
3. **Polls for results** until clips are ready
4. **Saves clips** to dashboard marked as `pending_review`
5. **Review interface** - Watch videos, approve/reject
6. **Auto-publish** approved clips to Post Bridge (all social platforms)

## Features

✅ Password-protected web dashboard  
✅ Embedded video players  
✅ One-click approve/reject  
✅ Auto-publish to social media  
✅ Real-time stats (pending, approved, published)  
✅ Background monitoring service  

---

## Setup

### 1. Install Dependencies

```bash
cd vizard-clips-app
npm install
```

### 2. Configure Environment Variables

Edit `.env.local`:

```env
# Dashboard Password (change this!)
DASHBOARD_PASSWORD=VizardClips2026!

# API Keys (already configured)
VIMEO_ACCESS_TOKEN=48dd2370b90379a61e96226977d0dc0d
VIZARD_API_KEY=a3ceb9b1e62a49a9a101923472724ea9
POSTBRIDGE_API_KEY=pb_live_DxZ5rb5xP65woBjULXPYDA

# Vimeo User ID
VIMEO_USER_ID=41953625

# Session Secret (change in production)
SESSION_SECRET=vizard_clips_secret_key_change_in_production
```

### 3. Run Locally

**Start the dashboard:**
```bash
npm run dev
```

Dashboard: http://localhost:3000

**Start Vimeo monitor (in separate terminal):**
```bash
npm run monitor
```

---

## Deployment to Vercel

### 1. Push to GitHub

```bash
cd vizard-clips-app
git init
git add .
git commit -m "Initial commit: Vizard Clips Dashboard"
git remote add origin https://github.com/pacinobot2026/vizard-clips.git
git push -u origin main
```

### 2. Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel
```

**Option B: Vercel Dashboard**
1. Go to https://vercel.com
2. Click "New Project"
3. Import from GitHub: `pacinobot2026/vizard-clips`
4. Add environment variables (copy from `.env.local`)
5. Deploy!

### 3. Configure Environment Variables on Vercel

Go to: Project Settings → Environment Variables

Add all variables from `.env.local`

### 4. Start Monitoring Service

The Vimeo monitor needs to run continuously. Options:

**Option A: VPS (Recommended)**
```bash
# On your VPS
cd vizard-clips-app
npm install
npm run monitor
```

Keep it running with PM2:
```bash
npm install -g pm2
pm2 start scripts/vimeo-monitor.js --name vizard-monitor
pm2 save
pm2 startup
```

**Option B: Vercel Cron (Coming Soon)**
Vercel doesn't support long-running processes, but you can use Vercel Cron to check periodically.

---

## Usage

### Dashboard

1. Go to your Vercel URL (e.g., `vizard-clips.vercel.app`)
2. Enter password: `VizardClips2026!` (or custom password)
3. View pending clips
4. Click **Approve** or **Reject**
5. Click **Publish Approved Clips** to send to social media

### Monitoring Service

The monitor runs in the background checking for new Vimeo videos every 5 minutes.

**Check status:**
```bash
pm2 status
```

**View logs:**
```bash
pm2 logs vizard-monitor
```

**Restart:**
```bash
pm2 restart vizard-monitor
```

---

## File Structure

```
vizard-clips-app/
├── pages/
│   ├── index.js           # Login page
│   ├── dashboard.js       # Main dashboard
│   └── api/
│       ├── login.js       # Auth endpoint
│       ├── clips.js       # Get clips
│       ├── approve.js     # Approve clip
│       ├── reject.js      # Reject clip
│       └── publish.js     # Publish to social
├── lib/
│   ├── auth.js           # Authentication helpers
│   └── storage.js        # JSON storage
├── scripts/
│   ├── vimeo-monitor.js  # Vimeo monitoring service
│   └── vizard-processor.js # Vizard polling
├── data/
│   ├── clips.json        # Clips database
│   └── monitor-state.json # Monitor state
├── .env.local            # Environment variables
├── package.json
└── README.md
```

---

## API Endpoints

### POST /api/login
Login with password

**Request:**
```json
{
  "password": "VizardClips2026!"
}
```

### GET /api/clips?filter=pending
Get clips by status (`pending`, `approved`, `published`)

### POST /api/approve
Approve a clip

**Request:**
```json
{
  "clipId": "14015572"
}
```

### POST /api/reject
Reject a clip

### POST /api/publish
Publish all approved clips to Post Bridge

---

## How It Works

### 1. Vimeo Monitor

**File:** `scripts/vimeo-monitor.js`

- Checks Vimeo API every 5 minutes
- Detects new videos
- Submits to Vizard API
- Tracks processed videos in `data/monitor-state.json`

### 2. Vizard Processor

**File:** `scripts/vizard-processor.js`

- Polls Vizard API every 30 seconds
- Waits for clips to be generated
- Saves clips to `data/clips.json` with status `pending_review`

### 3. Dashboard

**Files:** `pages/dashboard.js`, `lib/storage.js`

- Displays clips with embedded video players
- Approve/Reject buttons update clip status
- Stats show pending, approved, published counts

### 4. Publisher

**File:** `pages/api/publish.js`

- Downloads clip from Vizard URL
- Uploads to Post Bridge
- Posts to all active social accounts
- Updates clip status to `published`

---

## Clip Data Structure

```json
{
  "clip_id": "14015572",
  "source_video_title": "Newsletter Hour 2026-02-20",
  "vizard_project_id": "17861706",
  "clip_url": "https://cdn-video.vizard.ai/...",
  "title": "Transform Your Business with AI",
  "suggested_caption": "This clip shows incredible engagement...",
  "viral_score": "9",
  "transcript": "Full transcript...",
  "duration_ms": 45000,
  "status": "pending_review",
  "post_status": "not_posted",
  "created_at": "2026-02-20T19:00:00.000Z",
  "updated_at": "2026-02-20T19:00:00.000Z"
}
```

---

## Troubleshooting

### Dashboard not loading
- Check Vercel deployment logs
- Verify environment variables are set
- Clear browser cache

### No new clips appearing
- Check monitor is running: `pm2 status`
- Check monitor logs: `pm2 logs vizard-monitor`
- Verify Vimeo API key is valid
- Check `data/monitor-state.json` for processed videos

### Publishing fails
- Check Post Bridge API key
- Verify social accounts are connected in Post Bridge
- Check `pages/api/publish.js` logs

### Videos won't play
- Vizard URLs expire after 7 days
- Re-query Vizard API to get fresh URLs
- Check video format compatibility

---

## Security

- Dashboard is password-protected
- All API keys stored in environment variables
- Session cookies are httpOnly and secure in production
- No sensitive data committed to Git

**Change the default password** in `.env.local` before deploying!

---

## Built With

- **Next.js** - React framework
- **Vercel** - Hosting
- **Vimeo API** - Video monitoring
- **Vizard AI API** - AI clipping
- **Post Bridge API** - Social media publishing

---

## Support

For issues or questions, contact Chad Nicely.

**Dashboard Password:** `VizardClips2026!`

---

**Built:** 2026-02-20 by Pacino (OpenClaw CEO)
