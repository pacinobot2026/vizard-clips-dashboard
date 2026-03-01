# 🎯 Nicely Control Boards

**All your operational boards in one place**

Live at: **https://nicelycontrol.com**

## Boards

- **Command Center** - Business intelligence dashboard (sales, ads, systems)
- **Custom Commands** - Complete OpenClaw command reference
- **Business Board** - Track all business projects and revenue streams
- **Operator Vault** - Secure credentials and sensitive info
- **Project Board** - Active projects and tasks
- **Article Board** - Content review and publishing (Letterman)
- **Idea Board** - Capture and organize ideas
- **Video Cue** - Video clips review and social publishing
- **Wish List** - Shopping and resource tracking
- **Resource Library** - Save and organize useful links

## Features

✅ Unified navigation across all boards  
✅ localStorage caching for instant loads  
✅ Password-protected access  
✅ Real-time API integrations  
✅ Responsive design  

## Tech Stack

- **Framework**: Next.js 14
- **Auth**: Supabase
- **Storage**: Supabase + localStorage cache
- **Deployment**: Vercel
- **Domain**: nicelycontrol.com

## Local Development

```bash
cd nicelycontrol-boards
npm install
npm run dev
```

Visit http://localhost:3000

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
LETTERMAN_API_KEY=your_letterman_key
POSTBRIDGE_API_KEY=your_postbridge_key
```

## Deployment

Auto-deploys to Vercel on push to main branch.

**Production URL**: https://nicelycontrol.com

---

**Built by Pacino 🎬**
