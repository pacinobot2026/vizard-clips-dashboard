# 🌙 Article Board → Letterman Integration

**Built:** 2026-02-22 overnight session  
**Status:** Ready for testing (NOT deployed yet)

## What I Built

The Article Board currently uses mock/sample data. I've created **real Letterman API integration** so you can actually review and manage your articles across all 3 publications in one place.

### Features

✅ **Fetch real articles** from Letterman  
✅ **3 publications integrated:**
- 📍 West Valley Shoutouts
- 🐕 Save The Doggy
- 🍴 Vegas Fork

✅ **Full workflow:**
- View by status (Draft → Approved → Published → Rejected)
- Filter by publication
- Approve articles (moves to APPROVED state)
- Reject articles (moves to REJECTED or adds rejected keyword)

✅ **Same beautiful UI** you already have

---

## Files Created

### 1. `/pages/api/articles-real.js`
Replaces the mock data endpoint. Fetches actual articles from Letterman API.

**What it does:**
- Queries all 3 publications based on filter (draft/approved/published)
- Transforms Letterman data to Article Board format
- Returns stats and categories for the UI
- Handles errors gracefully (if one publication fails, others still load)

### 2. `/pages/api/articles/approve-real.js`
Makes approve button actually work.

**What it does:**
- Calls Letterman API: `PUT /newsletters/{id}` with `state: 'APPROVED'`
- Returns success/error
- Article moves from Draft → Approved

### 3. `/pages/api/articles/reject-real.js`
Makes reject button actually work.

**What it does:**
- Tries to set state to REJECTED
- If Letterman doesn't support REJECTED state, falls back to DRAFT + "rejected" keyword
- Article can be filtered out or moved to rejected bucket

---

## How to Test

### Option 1: Quick Test (Recommended)

**Step 1:** Rename the files to make them active:
```bash
cd C:\Users\Administrator\.openclaw\workspace\vizard-clips\pages\api

# Backup originals
mv articles.js articles-mock.js
mv articles\approve.js articles\approve-mock.js  
mv articles\reject.js articles\reject-mock.js

# Activate real versions
mv articles-real.js articles.js
mv articles\approve-real.js articles\approve.js
mv articles\reject-real.js articles\reject.js
```

**Step 2:** Build and test locally:
```bash
cd C:\Users\Administrator\.openclaw\workspace\vizard-clips
npm run build
npm run dev
```

**Step 3:** Open `http://localhost:3000/articles` and test:
- Do you see real articles from your Letterman publications?
- Does filtering by Draft/Approved/Published work?
- Does the approve button work? (check in Letterman)
- Does the reject button work?

### Option 2: Deploy to Vercel (After testing)

If everything works:
```bash
git add .
git commit -m "Integrate Article Board with real Letterman API"
git push origin main
```

Vercel will auto-deploy. Test at: `https://vizard-clips-app.vercel.app/articles`

---

## What to Check

### In Article Board UI:
- [ ] Articles load from Letterman (not sample data)
- [ ] Correct publication names show up
- [ ] Stats cards show accurate counts
- [ ] Category filters work (West Valley, Save The Doggy, Vegas Fork)
- [ ] Search works
- [ ] View toggle works (List/Card views)

### Test Approve Workflow:
1. Find a DRAFT article
2. Click Approve
3. Check Letterman dashboard - is it now APPROVED?
4. Refresh Article Board - does it show in Approved tab?

### Test Reject Workflow:
1. Find a DRAFT article  
2. Click Reject
3. Check Letterman dashboard - what state is it?
4. Does it disappear from Draft view?

---

## Potential Issues & Solutions

### Issue: No articles showing up
**Possible causes:**
- No articles in DRAFT/APPROVED/PUBLISHED state in Letterman
- API key expired (check credentials/titanium-api-keys.txt)
- Publication IDs changed (check Letterman API docs)

**Fix:**
- Check browser console for errors
- Check Letterman dashboard - do you have articles in those states?
- Test the API directly: `GET https://api.letterman.ai/api/ai/newsletters-storage/677895a2584a3ce5878fcf5b/newsletters?state=DRAFT&type=ARTICLE`

### Issue: Approve/Reject not working
**Possible causes:**
- Letterman API doesn't support state changes via PUT
- Article ID format mismatch

**Fix:**
- Check browser Network tab for API response
- Verify article IDs match Letterman format
- May need to use different Letterman endpoint (check skill docs)

### Issue: "REJECTED" state doesn't exist
**Expected behavior:**  
The reject endpoint handles this - it falls back to DRAFT + "rejected" keyword. You can still filter rejected articles by checking for that keyword.

---

## Rollback Plan

If something breaks:
```bash
cd C:\Users\Administrator\.openclaw\workspace\vizard-clips\pages\api

# Restore mocks
mv articles-mock.js articles.js
mv articles\approve-mock.js articles\approve.js
mv articles\reject-mock.js articles\reject.js

# Rebuild
npm run build
git checkout pages/api/
```

---

## Next Steps (Ideas)

Once this is working, you could:

1. **Add "Publish" button** - Move approved articles to PUBLISHED state
2. **Bulk actions** - Approve/reject multiple articles at once
3. **Article editing** - Click to edit headline, content, etc. right from the board
4. **Scheduled publishing** - Set articles to publish at specific times
5. **AI content preview** - See AI-generated preview before approving
6. **More publications** - Add Summerlin Shoutouts, United Patriots, etc.

---

## Technical Notes

### Publication IDs (from Letterman)
```javascript
{
  'West Valley Shoutouts': '677895a2584a3ce5878fcf5b',
  'Save The Doggy': '68a78eba3ce3e647df7fefaa',
  'Vegas Fork': '68a790aa3ce3e647df7ff272'
}
```

### State Mapping
```javascript
Article Board → Letterman
{
  'draft': 'DRAFT',
  'approved': 'APPROVED', 
  'published': 'PUBLISHED',
  'rejected': 'REJECTED' (or DRAFT + rejected keyword)
}
```

### API Authentication
Uses JWT token from `credentials/titanium-api-keys.txt`
- Header: `Authorization: Bearer {token}`
- Token expires: 2027-04-03 (over a year from now)

---

## Why This Matters

**Before:** Article Board was just a pretty UI with fake data  
**After:** Article Board is a REAL tool that:
- Saves you time (review 3 publications in one place)
- Simplifies workflow (approve/reject with one click)
- Keeps you organized (see everything at a glance)

Instead of opening:
1. westvalleyshoutouts.com/admin
2. savethedoggy.com/admin  
3. vegasfork.com/admin

You just open: **Article Board** 🎯

---

## Questions?

If something doesn't work or you need help:
1. Check browser console for errors
2. Check server logs (Vercel dashboard)
3. Ping me and I'll debug it

---

Built with 🎬 by Pacino (overnight session)
