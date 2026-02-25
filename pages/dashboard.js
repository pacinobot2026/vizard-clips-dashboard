import { useState, useEffect } from 'react';
import NavigationSidebar from '../components/NavigationSidebar';
import withAuth from '../lib/withAuth';

function getVideoEmbed(url) {
  if (!url) return { type: 'none' };
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return { type: 'iframe', src: `https://www.youtube.com/embed/${ytMatch[1]}` };
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return { type: 'iframe', src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  // Direct video
  return { type: 'video', src: url };
}

function Dashboard() {
  const [clips, setClips] = useState([]);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [loading, setLoading] = useState(true);
  const [processingCount, setProcessingCount] = useState(0);
  const [nextCheckIn, setNextCheckIn] = useState(300);
  const [nextPostIn, setNextPostIn] = useState(7200);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClip, setNewClip] = useState({ title: '', clip_url: '', category: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClip, setEditingClip] = useState(null);

  useEffect(() => {
    fetchClips();
  }, [filter, category, sortBy]);

  useEffect(() => {
    fetchProcessing();
    const processingInterval = setInterval(fetchProcessing, 5 * 60 * 1000);
    const countdownInterval = setInterval(() => {
      setNextCheckIn(prev => (prev <= 1 ? 300 : prev - 1));
      setNextPostIn(prev => (prev <= 1 ? 7200 : prev - 1));
    }, 1000);
    return () => {
      clearInterval(processingInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const fetchProcessing = async () => {
    try {
      const res = await fetch('/api/processing');
      const data = await res.json();
      setProcessingCount(data.processing || 0);
      setNextCheckIn(300);
    } catch (err) {
      console.error('Error fetching processing count:', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatLongTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const fetchClips = async () => {
    try {
      const params = new URLSearchParams({ filter, category, sortBy });
      const res = await fetch(`/api/clips?${params}`);
      const data = await res.json();
      setClips(data.clips);
      setStats(data.stats);
      setCategories(data.categories || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching clips:', err);
      setLoading(false);
    }
  };

  const filteredClips = clips.filter(clip =>
    searchTerm === '' ||
    (clip.title && clip.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddClip = async () => {
    if (!newClip.title.trim() || !newClip.clip_url.trim()) return;
    try {
      await fetch('/api/clips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClip),
      });
      setShowAddModal(false);
      setNewClip({ title: '', clip_url: '', category: '' });
      fetchClips();
    } catch (err) {
      console.error('Error adding clip:', err);
    }
  };

  const handleUpdateClip = async () => {
    if (!editingClip.title.trim() || !editingClip.clip_url.trim()) return;
    try {
      await fetch('/api/clips', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clip_id: editingClip.clip_id, title: editingClip.title, clip_url: editingClip.clip_url, category: editingClip.category }),
      });
      setShowEditModal(false);
      setEditingClip(null);
      fetchClips();
    } catch (err) {
      console.error('Error updating clip:', err);
    }
  };

  const handleDeleteClip = async (clipId) => {
    if (!confirm('Delete this clip?')) return;
    try {
      await fetch('/api/clips', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clip_id: clipId }),
      });
      fetchClips();
    } catch (err) {
      console.error('Error deleting clip:', err);
    }
  };

  const handleApprove = async (clipId) => {
    try {
      await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId })
      });
      fetchClips();
    } catch (err) {
      console.error('Error approving clip:', err);
    }
  };

  const handleReject = async (clipId) => {
    try {
      await fetch('/api/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId })
      });
      fetchClips();
    } catch (err) {
      console.error('Error rejecting clip:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <NavigationSidebar />
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading clips...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <NavigationSidebar />
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6 flex justify-between items-center gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-1">🎬 Video Cue Board</h1>
              <p className="text-sm text-gray-400">Video clip review and publishing</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 md:px-6 py-3 bg-purple-600 rounded-lg text-white text-sm font-semibold cursor-pointer hover:scale-105 transition-transform border-none whitespace-nowrap flex-shrink-0"
            >
              + Add Video
            </button>
          </div>

          {/* Status Banner */}
          <div className="bg-gray-600/10 border border-gray-600/30 rounded-xl px-4 py-3 mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            {/* Processing Status */}
            <div className={`flex items-center gap-3 flex-1 px-3 py-2 rounded-lg transition-colors ${processingCount > 0 ? 'bg-purple-400/10' : ''}`}>
              <span className="text-2xl">⚙️</span>
              <div>
                <div className={`text-sm font-semibold ${processingCount > 0 ? 'text-purple-400' : 'text-gray-400'}`}>
                  {processingCount > 0
                    ? `${processingCount} video${processingCount > 1 ? 's' : ''} being edited`
                    : 'No videos processing'
                  }
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Next check: {formatTime(nextCheckIn)}</div>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-purple-500/50" />

            {/* Social Posting Timer */}
            <div className={`flex items-center gap-3 flex-1 px-3 py-2 rounded-lg transition-colors ${stats.approved > 0 ? 'bg-blue-400/10' : ''}`}>
              <span className="text-2xl">🚀</span>
              <div>
                <div className="text-sm font-semibold text-blue-400">Next social post</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {stats.approved > 0
                    ? `In ${formatLongTime(nextPostIn)} (automated)`
                    : 'No approved clips ready'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
            {[
              { icon: '⏳', label: 'Pending', key: 'pending' },
              { icon: '✅', label: 'Approved', key: 'approved' },
              { icon: '🚀', label: 'Published', key: 'published' },
              { icon: '❌', label: 'Rejected', key: 'rejected' },
            ].map(({ icon, label, key }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`p-3 md:p-4 rounded-xl border cursor-pointer transition-all text-left ${filter === key ? 'bg-purple-600 border-purple-600 scale-105' : 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <div className={`text-2xl font-bold leading-none mb-1 ${filter === key ? 'text-white' : 'text-cyan-400'}`}>{stats[key] || 0}</div>
                    <div className={`text-xs ${filter === key ? 'text-white/70' : 'text-gray-500'}`}>{label}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {['all', ...categories.map(c => c.name)].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(typeof cat === 'string' ? cat : cat)}
                  className={`px-4 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${category === cat ? 'bg-purple-600 border-purple-600 text-white' : 'bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-800'}`}
                >
                  {cat === 'all' ? 'All Categories' : `${categories.find(c => c.name === cat)?.emoji || ''} ${cat} (${categories.find(c => c.name === cat)?.count || 0})`}
                </button>
              ))}
            </div>
          )}

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="🔍 Search clips..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500"
            />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full sm:w-auto bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white text-sm cursor-pointer outline-none"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="viral_score">Viral Score</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          {/* Clips Grid */}
          <div className="glass-card rounded-2xl p-4 md:p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-white">📹 Video Clips</h2>
              <span className="text-sm text-gray-400">{filteredClips.length} clips</span>
            </div>

            {filteredClips.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                {searchTerm ? `No clips matching "${searchTerm}"` : `No ${filter} clips`}
              </div>
            ) : (
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                {filteredClips.map(clip => (
                  <ClipCard
                    key={clip.clip_id}
                    clip={clip}
                    onApprove={() => handleApprove(clip.clip_id)}
                    onReject={() => handleReject(clip.clip_id)}
                    onEdit={() => { setEditingClip({ ...clip }); setShowEditModal(true); }}
                    onDelete={() => handleDeleteClip(clip.clip_id)}
                    showActions={filter === 'pending'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Video Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-0 sm:p-5"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-gray-800 rounded-t-2xl sm:rounded-2xl border border-gray-600/50 max-w-xl w-full p-5 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-2">🎬 Add Video</h2>
            <p className="text-xs text-yellow-400 mb-6">⚠️ The video URL must be publicly accessible (no login required to view).</p>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Video title..."
                value={newClip.title}
                onChange={e => setNewClip({ ...newClip, title: e.target.value })}
                className="bg-gray-700/70 border border-gray-600/50 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-purple-500"
              />
              <input
                type="url"
                placeholder="Public video URL (YouTube, Vimeo, or direct link)..."
                value={newClip.clip_url}
                onChange={e => setNewClip({ ...newClip, clip_url: e.target.value })}
                className="bg-gray-700/70 border border-gray-600/50 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="Category (optional)..."
                value={newClip.category}
                onChange={e => setNewClip({ ...newClip, category: e.target.value })}
                className="bg-gray-700/70 border border-gray-600/50 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-purple-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAddClip}
                  className="flex-1 py-3 bg-purple-600 border-none rounded-lg text-white text-sm font-semibold cursor-pointer hover:bg-purple-500 transition-colors"
                >
                  Add Clip
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-700/70 border border-gray-600/50 rounded-lg text-gray-400 text-sm font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {showEditModal && editingClip && (
        <div
          className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-0 sm:p-5"
          onClick={() => { setShowEditModal(false); setEditingClip(null); }}
        >
          <div
            className="bg-gray-800 rounded-t-2xl sm:rounded-2xl border border-gray-600/50 max-w-xl w-full p-5 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-2">✏️ Edit Clip</h2>
            <p className="text-xs text-yellow-400 mb-6">⚠️ The video URL must be publicly accessible (no login required to view).</p>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Video title..."
                value={editingClip.title}
                onChange={e => setEditingClip({ ...editingClip, title: e.target.value })}
                className="bg-gray-700/70 border border-gray-600/50 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-purple-500"
              />
              <input
                type="url"
                placeholder="Public video URL..."
                value={editingClip.clip_url || ''}
                onChange={e => setEditingClip({ ...editingClip, clip_url: e.target.value })}
                className="bg-gray-700/70 border border-gray-600/50 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="Category (optional)..."
                value={editingClip.category || ''}
                onChange={e => setEditingClip({ ...editingClip, category: e.target.value })}
                className="bg-gray-700/70 border border-gray-600/50 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-purple-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateClip}
                  className="flex-1 py-3 bg-purple-600 border-none rounded-lg text-white text-sm font-semibold cursor-pointer hover:bg-purple-500 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => { setShowEditModal(false); setEditingClip(null); }}
                  className="flex-1 py-3 bg-gray-700/70 border border-gray-600/50 rounded-lg text-gray-400 text-sm font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClipCard({ clip, onApprove, onReject, onEdit, onDelete, showActions }) {
  const [isHovered, setIsHovered] = useState(false);
  const embed = getVideoEmbed(clip.clip_url);

  return (
    <div
      className={`bg-gray-800/70 rounded-xl border overflow-hidden transition-all ${isHovered ? 'border-purple-500/50 -translate-y-1 shadow-lg shadow-purple-900/20' : 'border-gray-600/50'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video */}
      <div className="aspect-[4/5] bg-black relative overflow-hidden">
        {embed.type === 'iframe' ? (
          <iframe
            src={embed.src}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        ) : embed.type === 'video' ? (
          <video
            src={embed.src}
            controls
            preload="metadata"
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl text-white">
            ▶
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-white text-sm font-semibold leading-snug">
            {clip.title || 'Untitled Clip'}
          </h3>
          <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
            <button
              onClick={onEdit}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', color: '#9ca3af', fontSize: '13px' }}
              title="Edit"
            >✏️</button>
            <button
              onClick={onDelete}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', color: '#9ca3af', fontSize: '13px' }}
              title="Delete"
            >🗑</button>
          </div>
        </div>
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="px-2 py-1 bg-gray-900 rounded text-xs text-gray-400">{clip.viral_score || 0}/10</span>
          <span className="px-2 py-1 bg-gray-900 rounded text-xs text-gray-400">{clip.duration || '0s'}</span>
        </div>

        {showActions && (
          <div className="flex gap-2">
            <button
              onClick={onApprove}
              className="flex-1 py-2 bg-green-600 border-none rounded-md text-white text-sm font-semibold cursor-pointer hover:bg-green-500 transition-colors"
            >
              ✓ Approve
            </button>
            <button
              onClick={onReject}
              className="flex-1 py-2 bg-red-600 border-none rounded-md text-white text-sm font-semibold cursor-pointer hover:bg-red-500 transition-colors"
            >
              ✕ Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
