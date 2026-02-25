# Dashboard — Add/Edit/Delete Video Clips via Public URL

## Todo

- [ ] Extend `pages/api/clips.js` with POST (add), PUT (update), DELETE handlers
- [ ] Add `getVideoEmbed(url)` helper in dashboard to handle YouTube/Vimeo iframes vs direct `<video>`
- [ ] Add "+ Add Video" button + add modal (with URL, title, category + public URL note)
- [ ] Add `handleAddClip`, `handleUpdateClip`, `handleDeleteClip` functions to Dashboard
- [ ] Pass `onEdit`/`onDelete` to `ClipCard`; show buttons on hover
- [ ] Update `ClipCard` to render iframe (YouTube/Vimeo) or `<video>` (direct URLs)

## Notes
- `storage.js` already has `addClip`, `updateClip`, `deleteClip`
- `clip_id` will be generated server-side (`manual_${Date.now()}_${random}`)
- `clip_url` is NOT NULL in schema — the user-provided URL goes there
- Keep all changes in `pages/api/clips.js` and `pages/dashboard.js` only
