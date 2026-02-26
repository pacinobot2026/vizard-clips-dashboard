# Video Board — PostBridge-First Redesign

## Goal
Replace the manual URL add flow with a PostBridge media picker. Users pick a video from their PostBridge library, add a caption + social accounts → creates a PostBridge draft. Approve = pick schedule time → schedules via PostBridge.

## Todos

- [ ] `migrations/004_add_postbridge_post_id.sql` — add `postbridge_post_id TEXT` column to clips
- [ ] `pages/api/postbridge/media.js` — proxy GET /v1/media?type=video from PostBridge
- [ ] `pages/api/postbridge/accounts.js` — proxy GET /v1/social-accounts from PostBridge
- [ ] `pages/api/clips.js` — update POST handler: accept PostBridge fields, create draft via POST /v1/posts (is_draft: true), save to clips table with postbridge_post_id
- [ ] `pages/api/approve.js` — accept scheduledAt, PATCH /v1/posts/{postbridge_post_id} (is_draft: false, scheduled_at), then update clip status
- [ ] `pages/dashboard.js` — replace Add Video modal with Create Post modal (media picker + caption + account picker + category); Approve button opens schedule modal

## Notes
- Media endpoint returns: id, mime_type, object.url, object.name, object.size_bytes
- Accounts endpoint returns: id (number), platform, username
- Create draft body: { caption, social_accounts: [ids], media: [media_id], is_draft: true }
- PATCH to schedule: { is_draft: false, scheduled_at: ISO8601 | null for immediate }
- Old Vizard clips (no postbridge_post_id) → approve directly without PostBridge call
- Keep all category/filter/sort/search/edit/delete/reject functionality
