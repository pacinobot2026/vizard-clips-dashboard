import { useState, useEffect } from 'react';
import NavigationSidebar from '../components/NavigationSidebar';
import withAuth from '../lib/withAuth';

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
      <main className="flex-1 p-8 pt-16 md:pt-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold gradient-text mb-1">🎬 Video Cue Board</h1>
            <p className="text-sm text-gray-400">Video clip review and publishing</p>
          </div>

          {/* Status Banner */}
          <div className="bg-gray-600/10 border border-gray-600/30 rounded-xl px-5 py-3 mb-4 flex items-center gap-4">
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

            <div className="w-px h-10 bg-purple-500/50" />

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
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[
              { icon: '⏳', label: 'Pending', key: 'pending' },
              { icon: '✅', label: 'Approved', key: 'approved' },
              { icon: '🚀', label: 'Published', key: 'published' },
              { icon: '❌', label: 'Rejected', key: 'rejected' },
            ].map(({ icon, label, key }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`p-4 rounded-xl border cursor-pointer transition-all text-left ${filter === key ? 'bg-purple-600 border-purple-600 scale-105' : 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800'}`}
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
          <div className="flex gap-3 flex-wrap mb-6">
            <input
              type="text"
              placeholder="🔍 Search clips..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 min-w-48 bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500"
            />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white text-sm cursor-pointer outline-none"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="viral_score">Viral Score</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          {/* Clips Grid */}
          <div className="glass-card rounded-2xl p-6">
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
                    showActions={filter === 'pending'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ClipCard({ clip, onApprove, onReject, showActions }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`bg-gray-800/70 rounded-xl border overflow-hidden transition-all ${isHovered ? 'border-purple-500/50 -translate-y-1 shadow-lg shadow-purple-900/20' : 'border-gray-600/50'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video */}
      <div className="aspect-[4/5] bg-black relative overflow-hidden">
        {clip.clip_url ? (
          <video
            src={clip.clip_url}
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
        <h3 className="text-white text-sm font-semibold mb-2 leading-snug">
          {clip.title || 'Untitled Clip'}
        </h3>
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="px-2 py-1 bg-gray-900 rounded text-xs text-gray-400">{clip.viral_score || 0}/10</span>
          <span className="px-2 py-1 bg-gray-900 rounded text-xs text-gray-400">{clip.duration || '0s'}</span>
        </div>

        {showActions && isHovered && (
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
