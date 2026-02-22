import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavigationSidebar from '../components/NavigationSidebar';

export default function Dashboard() {
  const [clips, setClips] = useState([]);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [viewMode, setViewMode] = useState('compact');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClips, setSelectedClips] = useState(new Set());
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingClipId, setRejectingClipId] = useState(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [bulkAction, setBulkAction] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchClips();
  }, [filter, category, sortBy]);

  const fetchClips = async () => {
    try {
      const params = new URLSearchParams({
        filter,
        category,
        sortBy
      });
      
      const res = await fetch(`/api/clips?${params}`);
      const data = await res.json();
      setClips(data.clips);
      setStats(data.stats);
      setCategories(data.categories || []);
      setLoading(false);
      setSelectedClips(new Set()); // Clear selection when fetching new data
    } catch (err) {
      console.error('Error fetching clips:', err);
      setLoading(false);
    }
  };

  const handleApprove = async (clipId) => {
    try {
      const res = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId })
      });
      
      if (res.ok) {
        fetchClips();
      }
    } catch (err) {
      console.error('Error approving clip:', err);
    }
  };

  const handleReject = async (clipId, note = null) => {
    try {
      const res = await fetch('/api/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId, note })
      });
      
      if (res.ok) {
        fetchClips();
      }
    } catch (err) {
      console.error('Error rejecting clip:', err);
    }
  };

  const openRejectModal = (clipId) => {
    setRejectingClipId(clipId);
    setRejectionNote('');
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (rejectingClipId) {
      handleReject(rejectingClipId, rejectionNote);
    }
    setShowRejectModal(false);
    setRejectingClipId(null);
    setRejectionNote('');
  };

  const handleBulkAction = async (action) => {
    if (selectedClips.size === 0) {
      alert('No clips selected');
      return;
    }

    let note = null;
    if (action === 'reject') {
      note = prompt('Rejection note (optional):');
      if (note === null) return; // User cancelled
    }

    if (!confirm(`${action === 'approve' ? 'Approve' : 'Reject'} ${selectedClips.size} clips?`)) {
      return;
    }

    setBulkAction(true);
    try {
      const res = await fetch('/api/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clipIds: Array.from(selectedClips),
          action,
          note
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(`✅ ${data.successful} clips ${action === 'approve' ? 'approved' : 'rejected'}!`);
        fetchClips();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Bulk action failed');
      console.error(err);
    } finally {
      setBulkAction(false);
    }
  };

  const toggleSelectClip = (clipId) => {
    const newSelected = new Set(selectedClips);
    if (newSelected.has(clipId)) {
      newSelected.delete(clipId);
    } else {
      newSelected.add(clipId);
    }
    setSelectedClips(newSelected);
  };

  const selectAll = () => {
    if (selectedClips.size === filteredClips.length) {
      setSelectedClips(new Set());
    } else {
      setSelectedClips(new Set(filteredClips.map(c => c.clip_id)));
    }
  };

  const handlePublishAll = async () => {
    if (!confirm('Publish all approved clips to social media?')) {
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST'
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert(`✅ Published ${data.published} clips successfully!`);
        fetchClips();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Error publishing clips');
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  const filteredClips = clips.filter(clip =>
    clip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clip.suggested_caption.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading clips...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <NavigationSidebar />
      <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🎬 Video Cue Dashboard</h1>
        
        {/* Status Tabs */}
        <div style={styles.stats}>
          <StatBox label="Pending" count={stats.pending} active={filter === 'pending'} onClick={() => setFilter('pending')} />
          <StatBox label="Approved" count={stats.approved} active={filter === 'approved'} onClick={() => setFilter('approved')} />
          <StatBox label="Published" count={stats.published} active={filter === 'published'} onClick={() => setFilter('published')} />
          <StatBox label="Rejected" count={stats.rejected} active={filter === 'rejected'} onClick={() => setFilter('rejected')} color="#f56565" />
        </div>

        {/* Category Filter */}
        <div style={styles.categoryBar}>
          <button
            onClick={() => setCategory('all')}
            style={{
              ...styles.categoryChip,
              ...(category === 'all' ? styles.categoryChipActive : {})
            }}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setCategory(cat.name)}
              style={{
                ...styles.categoryChip,
                ...(category === cat.name ? styles.categoryChipActive : {})
              }}
            >
              {cat.emoji} {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <input
            type="text"
            placeholder="🔍 Search clips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="viral_score">Viral Score (High to Low)</option>
            <option value="duration">Duration (Long to Short)</option>
          </select>
          
          <button
            onClick={() => setViewMode(viewMode === 'compact' ? 'detailed' : 'compact')}
            style={styles.viewButton}
          >
            {viewMode === 'compact' ? '📋 Detailed' : '📱 Compact'}
          </button>
        </div>

        {/* Bulk Actions Bar */}
        {selectedClips.size > 0 && filter === 'pending' && (
          <div style={styles.bulkBar}>
            <span style={styles.bulkText}>{selectedClips.size} selected</span>
            <div style={styles.bulkActions}>
              <button
                onClick={() => handleBulkAction('approve')}
                disabled={bulkAction}
                style={{ ...styles.bulkButton, ...styles.bulkApprove }}
              >
                ✓ Approve All
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                disabled={bulkAction}
                style={{ ...styles.bulkButton, ...styles.bulkReject }}
              >
                ✕ Reject All
              </button>
              <button
                onClick={() => setSelectedClips(new Set())}
                style={styles.bulkButton}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Publish Button */}
        {stats.approved > 0 && (
          <button 
            onClick={handlePublishAll}
            disabled={publishing}
            style={styles.publishButton}
          >
            {publishing ? 'Publishing...' : `🚀 Publish ${stats.approved} Approved Clips`}
          </button>
        )}
      </header>

      <main style={styles.main}>
        {filteredClips.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>
              {searchTerm ? `No clips matching "${searchTerm}"` : `No ${filter} clips${category !== 'all' ? ` in ${category}` : ''}`}
            </p>
          </div>
        ) : (
          <>
            <div style={styles.resultsHeader}>
              <span style={styles.resultsCount}>
                {filteredClips.length} clip{filteredClips.length !== 1 ? 's' : ''}
              </span>
              {filter === 'pending' && (
                <button onClick={selectAll} style={styles.selectAllButton}>
                  {selectedClips.size === filteredClips.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>
            
            <div style={viewMode === 'compact' ? styles.compactGrid : styles.grid}>
              {filteredClips.map(clip => (
                viewMode === 'compact' ? (
                  <CompactClipCard
                    key={clip.clip_id}
                    clip={clip}
                    onApprove={handleApprove}
                    onReject={openRejectModal}
                    showActions={filter === 'pending'}
                    selected={selectedClips.has(clip.clip_id)}
                    onSelect={toggleSelectClip}
                  />
                ) : (
                  <ClipCard 
                    key={clip.clip_id}
                    clip={clip}
                    onApprove={handleApprove}
                    onReject={openRejectModal}
                    showActions={filter === 'pending'}
                    selected={selectedClips.has(clip.clip_id)}
                    onSelect={toggleSelectClip}
                  />
                )
              ))}
            </div>
          </>
        )}
      </main>

      {/* Rejection Note Modal */}
      {showRejectModal && (
        <Modal onClose={() => setShowRejectModal(false)}>
          <h3 style={styles.modalTitle}>Reject Clip</h3>
          <p style={styles.modalText}>Add a note explaining why this clip was rejected (optional):</p>
          <textarea
            value={rejectionNote}
            onChange={(e) => setRejectionNote(e.target.value)}
            placeholder="e.g., Audio quality is too low, Content doesn't match brand..."
            style={styles.textarea}
            rows={4}
            autoFocus
          />
          <div style={styles.modalActions}>
            <button
              onClick={() => setShowRejectModal(false)}
              style={styles.modalCancel}
            >
              Cancel
            </button>
            <button
              onClick={confirmReject}
              style={{ ...styles.modalButton, ...styles.modalReject }}
            >
              Reject Clip
            </button>
          </div>
        </Modal>
      )}
      </div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function StatBox({ label, count, active, onClick, color }) {
  return (
    <div 
      onClick={onClick}
      style={{
        ...styles.statBox,
        ...(active ? { ...styles.statBoxActive, background: color || '#667eea', borderColor: color || '#667eea' } : {})
      }}
    >
      <div style={styles.statCount}>{count || 0}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

function CompactClipCard({ clip, onApprove, onReject, showActions, selected, onSelect }) {
  const [showVideo, setShowVideo] = useState(false);
  
  return (
    <div style={{
      ...styles.compactCard,
      ...(selected ? styles.compactCardSelected : {})
    }}>
      {showActions && (
        <div style={styles.checkbox}>
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(clip.clip_id)}
            onClick={(e) => e.stopPropagation()}
            style={styles.checkboxInput}
          />
        </div>
      )}
      
      {showVideo ? (
        <video 
          controls 
          autoPlay
          style={styles.compactVideo}
          src={clip.clip_url}
        />
      ) : (
        <div 
          style={styles.videoThumbnail}
          onClick={() => setShowVideo(true)}
        >
          <div style={styles.playButton}>▶</div>
          <div style={styles.duration}>{Math.floor(clip.duration_ms / 1000)}s</div>
        </div>
      )}
      
      <div style={styles.compactContent}>
        <div style={styles.categoryBadge}>
          {clip.category_emoji} {clip.category}
        </div>
        <h4 style={styles.compactTitle}>{clip.title}</h4>
        <div style={styles.compactMeta}>
          <span style={styles.viralBadge}>🔥 {clip.viral_score}/10</span>
          {clip.post_status === 'published' && (
            <span style={styles.publishedBadge}>✓</span>
          )}
        </div>
        
        {clip.rejection_note && (
          <div style={styles.rejectionNote}>
            ❌ {clip.rejection_note}
          </div>
        )}
        
        {showActions && (
          <div style={styles.compactActions}>
            <button 
              onClick={() => onApprove(clip.clip_id)}
              style={styles.compactApprove}
              title="Approve"
            >
              ✓
            </button>
            <button 
              onClick={() => onReject(clip.clip_id)}
              style={styles.compactReject}
              title="Reject"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ClipCard({ clip, onApprove, onReject, showActions, selected, onSelect }) {
  return (
    <div style={{
      ...styles.card,
      ...(selected ? styles.cardSelected : {})
    }}>
      {showActions && (
        <div style={styles.cardCheckbox}>
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(clip.clip_id)}
            style={styles.checkboxInput}
          />
        </div>
      )}
      
      <video 
        controls 
        style={styles.video}
        src={clip.clip_url}
      />
      
      <div style={styles.cardContent}>
        <div style={styles.categoryBadge}>
          {clip.category_emoji} {clip.category}
        </div>
        <h3 style={styles.clipTitle}>{clip.title}</h3>
        <p style={styles.sourceTitle}>Source: {clip.source_video_title}</p>
        <p style={styles.caption}>{clip.suggested_caption}</p>
        
        <div style={styles.meta}>
          <span style={styles.badge}>🔥 Viral Score: {clip.viral_score}/10</span>
          {clip.post_status === 'published' && (
            <span style={styles.badgePublished}>✓ Published</span>
          )}
        </div>

        {clip.rejection_note && (
          <div style={styles.rejectionNoteDetailed}>
            <strong>Rejection Note:</strong> {clip.rejection_note}
          </div>
        )}

        {showActions && (
          <div style={styles.actions}>
            <button 
              onClick={() => onApprove(clip.clip_id)}
              style={{ ...styles.button, ...styles.approveButton }}
            >
              ✓ Approve
            </button>
            <button 
              onClick={() => onReject(clip.clip_id)}
              style={{ ...styles.button, ...styles.rejectButton }}
            >
              ✕ Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    minHeight: '100vh',
    background: '#0a0a0a',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif'
  },
  header: {
    background: '#111827',
    padding: '24px 32px',
    borderBottom: '1px solid #1f2937',
    marginBottom: '0'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#fff',
    backgroundClip: 'text',
    letterSpacing: '-0.5px'
  },
  stats: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px'
  },
  statBox: {
    flex: 1,
    padding: '24px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
  },
  statBoxActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
  },
  statCount: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    opacity: 0.8
  },
  categoryBar: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '16px'
  },
  categoryChip: {
    padding: '8px 16px',
    background: '#1a202c',
    border: '2px solid #2d3748',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  categoryChipActive: {
    background: '#667eea',
    color: 'white',
    borderColor: '#667eea'
  },
  toolbar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px'
  },
  searchInput: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid #2d3748',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none'
  },
  select: {
    padding: '12px 16px',
    border: '2px solid #2d3748',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    background: '#1a202c',
    cursor: 'pointer',
    outline: 'none'
  },
  viewButton: {
    padding: '12px 24px',
    background: '#1a202c',
    border: '2px solid #2d3748',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  bulkBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    background: '#2d3748',
    borderRadius: '8px',
    marginBottom: '16px'
  },
  bulkText: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#e2e8f0'
  },
  bulkActions: {
    display: 'flex',
    gap: '8px'
  },
  bulkButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#1a202c'
  },
  bulkApprove: {
    background: '#48bb78',
    color: 'white'
  },
  bulkReject: {
    background: '#f56565',
    color: 'white'
  },
  publishButton: {
    width: '100%',
    padding: '18px',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 24px rgba(72, 187, 120, 0.4)',
    letterSpacing: '0.3px'
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px 24px'
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  resultsCount: {
    fontSize: '14px',
    color: '#a0aec0'
  },
  selectAllButton: {
    padding: '8px 16px',
    background: '#1a202c',
    border: '2px solid #2d3748',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  compactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '24px'
  },
  compactCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  compactCardSelected: {
    border: '2px solid #667eea',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.5)',
    transform: 'translateY(-4px)'
  },
  checkbox: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    zIndex: 10
  },
  checkboxInput: {
    width: '20px',
    height: '20px',
    cursor: 'pointer'
  },
  videoThumbnail: {
    width: '100%',
    paddingBottom: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '48px',
    color: 'white',
    opacity: 0.9
  },
  duration: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    background: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600'
  },
  compactVideo: {
    width: '100%',
    maxHeight: '200px',
    background: '#000'
  },
  compactContent: {
    padding: '12px'
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    background: '#2d3748',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#cbd5e0'
  },
  compactTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#f7fafc',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  compactMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  viralBadge: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#f59e0b'
  },
  publishedBadge: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#059669'
  },
  rejectionNote: {
    fontSize: '11px',
    color: '#e53e3e',
    background: '#fff5f5',
    padding: '6px 8px',
    borderRadius: '4px',
    marginBottom: '8px',
    lineHeight: '1.4'
  },
  compactActions: {
    display: 'flex',
    gap: '8px'
  },
  compactApprove: {
    flex: 1,
    padding: '8px',
    background: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  compactReject: {
    flex: 1,
    padding: '8px',
    background: '#f56565',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  cardSelected: {
    border: '2px solid #667eea',
    boxShadow: '0 16px 48px rgba(102, 126, 234, 0.5)',
    transform: 'translateY(-4px)'
  },
  cardCheckbox: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: 10
  },
  video: {
    width: '100%',
    maxHeight: '400px',
    background: '#000'
  },
  cardContent: {
    padding: '20px'
  },
  clipTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#f7fafc'
  },
  sourceTitle: {
    fontSize: '14px',
    color: '#a0aec0',
    marginBottom: '12px'
  },
  caption: {
    fontSize: '14px',
    color: '#cbd5e0',
    marginBottom: '16px',
    lineHeight: '1.5'
  },
  meta: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap'
  },
  badge: {
    padding: '6px 12px',
    background: '#fef5e7',
    color: '#f59e0b',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600'
  },
  badgePublished: {
    padding: '6px 12px',
    background: '#d1fae5',
    color: '#059669',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600'
  },
  rejectionNoteDetailed: {
    fontSize: '13px',
    color: '#e53e3e',
    background: '#fff5f5',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
    lineHeight: '1.5',
    border: '1px solid #feb2b2'
  },
  actions: {
    display: 'flex',
    gap: '12px'
  },
  button: {
    flex: 1,
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  approveButton: {
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white'
  },
  rejectButton: {
    background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
    color: 'white'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'rgba(26, 32, 44, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#f7fafc'
  },
  modalText: {
    fontSize: '14px',
    color: '#a0aec0',
    marginBottom: '16px'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #2d3748',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'system-ui',
    resize: 'vertical',
    outline: 'none',
    marginBottom: '16px'
  },
  modalActions: {
    display: 'flex',
    gap: '12px'
  },
  modalButton: {
    flex: 1,
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  modalCancel: {
    flex: 1,
    padding: '12px',
    border: '2px solid #2d3748',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    background: '#1a202c',
    cursor: 'pointer'
  },
  modalReject: {
    background: '#f56565',
    color: 'white'
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontSize: '20px',
    color: '#a0aec0'
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyText: {
    fontSize: '18px',
    color: '#a0aec0'
  }
};
