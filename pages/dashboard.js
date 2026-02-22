import { useState, useEffect } from 'react';
import NavigationSidebar from '../components/NavigationSidebar';

export default function Dashboard() {
  const [clips, setClips] = useState([]);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClips();
  }, [filter, category, sortBy]);

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
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0D1423' }}>
        <NavigationSidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
          Loading clips...
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0D1423' }}>
      <NavigationSidebar />
      
      <main style={{ flex: 1, padding: '32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ 
              fontSize: '30px', 
              fontWeight: '700', 
              background: 'linear-gradient(to right, #22d3ee, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '4px' 
            }}>
              Video Cue Board
            </h1>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Video clip review and publishing</p>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <StatCard 
              icon="⏳" 
              count={stats.pending || 0} 
              label="Pending"
              active={filter === 'pending'}
              onClick={() => setFilter('pending')}
            />
            <StatCard 
              icon="✅" 
              count={stats.approved || 0} 
              label="Approved"
              active={filter === 'approved'}
              onClick={() => setFilter('approved')}
            />
            <StatCard 
              icon="🚀" 
              count={stats.published || 0} 
              label="Published"
              active={filter === 'published'}
              onClick={() => setFilter('published')}
            />
            <StatCard 
              icon="❌" 
              count={stats.rejected || 0} 
              label="Rejected"
              active={filter === 'rejected'}
              onClick={() => setFilter('rejected')}
            />
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCategory('all')}
                style={{
                  padding: '8px 16px',
                  background: category === 'all' ? '#8b5cf6' : 'rgba(31, 41, 55, 0.5)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  style={{
                    padding: '8px 16px',
                    background: category === cat.name ? '#8b5cf6' : 'rgba(31, 41, 55, 0.5)',
                    border: '1px solid rgba(75, 85, 99, 0.5)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.emoji} {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          )}

          {/* Search and Filters */}
          <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Search clips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '10px 16px',
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '10px 16px',
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="viral_score">Viral Score</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          {/* Clips Section - in a box like Control Panel */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(75, 85, 99, 0.5)'
          }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff' }}>
                📹 Video Clips
              </h2>
              <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                {filteredClips.length} clips
              </div>
            </div>

            {filteredClips.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px', color: '#6b7280' }}>
                {searchTerm ? `No clips matching "${searchTerm}"` : `No ${filter} clips`}
              </div>
            ) : (
              <div className="video-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {filteredClips.map((clip) => (
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
      
      <style jsx>{`
        /* Mobile - 2 columns */
        @media (max-width: 768px) {
          .video-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        /* Desktop - 3 columns */
        @media (min-width: 769px) {
          .video-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

function StatCard({ icon, count, label, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{
        padding: '16px',
        background: active ? '#8b5cf6' : 'rgba(31, 41, 55, 0.5)',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        border: `1px solid ${active ? '#8b5cf6' : 'rgba(75, 85, 99, 0.5)'}`,
        transform: active ? 'scale(1.05)' : 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '28px' }}>{icon}</div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: active ? '#fff' : '#06b6d4', lineHeight: 1, marginBottom: '4px' }}>
            {count}
          </div>
          <div style={{ fontSize: '12px', color: active ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClipCard({ clip, onApprove, onReject, showActions }) {
  return (
    <div style={{
      background: 'rgba(31, 41, 55, 0.7)',
      borderRadius: '12px',
      border: '1px solid rgba(75, 85, 99, 0.5)',
      overflow: 'hidden',
      transition: 'all 0.3s',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Video Thumbnail */}
      <div style={{ 
        aspectRatio: '16/9', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        color: 'white'
      }}>
        ▶
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '8px', lineHeight: 1.4 }}>
          {clip.title || 'Untitled Clip'}
        </h3>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ 
            padding: '4px 8px', 
            background: '#1f2937', 
            borderRadius: '6px', 
            fontSize: '11px',
            color: '#9ca3af'
          }}>
            {clip.viral_score || 0}/10
          </span>
          <span style={{ 
            padding: '4px 8px', 
            background: '#1f2937', 
            borderRadius: '6px', 
            fontSize: '11px',
            color: '#9ca3af'
          }}>
            {clip.duration || '0s'}
          </span>
        </div>

        {showActions && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onApprove}
              style={{
                flex: 1,
                padding: '8px',
                background: '#10b981',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ✓ Approve
            </button>
            <button
              onClick={onReject}
              style={{
                flex: 1,
                padding: '8px',
                background: '#ef4444',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ✕ Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
