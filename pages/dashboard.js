import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [clips, setClips] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchClips();
  }, [filter]);

  const fetchClips = async () => {
    try {
      const res = await fetch(`/api/clips?filter=${filter}`);
      if (res.status === 401) {
        router.push('/');
        return;
      }
      const data = await res.json();
      setClips(data.clips);
      setStats(data.stats);
      setLoading(false);
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
        fetchClips(); // Refresh clips
      }
    } catch (err) {
      console.error('Error approving clip:', err);
    }
  };

  const handleReject = async (clipId) => {
    try {
      const res = await fetch('/api/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId })
      });
      
      if (res.ok) {
        fetchClips(); // Refresh clips
      }
    } catch (err) {
      console.error('Error rejecting clip:', err);
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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🎬 Vizard Clips Dashboard</h1>
        
        <div style={styles.stats}>
          <StatBox label="Pending" count={stats.pending} active={filter === 'pending'} onClick={() => setFilter('pending')} />
          <StatBox label="Approved" count={stats.approved} active={filter === 'approved'} onClick={() => setFilter('approved')} />
          <StatBox label="Published" count={stats.published} active={filter === 'published'} onClick={() => setFilter('published')} />
        </div>

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
        {clips.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>No {filter} clips</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {clips.map(clip => (
              <ClipCard 
                key={clip.clip_id}
                clip={clip}
                onApprove={handleApprove}
                onReject={handleReject}
                showActions={filter === 'pending'}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatBox({ label, count, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{
        ...styles.statBox,
        ...(active ? styles.statBoxActive : {})
      }}
    >
      <div style={styles.statCount}>{count || 0}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

function ClipCard({ clip, onApprove, onReject, showActions }) {
  return (
    <div style={styles.card}>
      <video 
        controls 
        style={styles.video}
        src={clip.clip_url}
      >
        Your browser does not support the video tag.
      </video>
      
      <div style={styles.cardContent}>
        <h3 style={styles.clipTitle}>{clip.title}</h3>
        <p style={styles.sourceTitle}>Source: {clip.source_video_title}</p>
        <p style={styles.caption}>{clip.suggested_caption}</p>
        
        <div style={styles.meta}>
          <span style={styles.badge}>🔥 Viral Score: {clip.viral_score}/10</span>
          {clip.post_status === 'published' && (
            <span style={styles.badgePublished}>✓ Published</span>
          )}
        </div>

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
    minHeight: '100vh',
    background: '#f7fafc',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    background: 'white',
    padding: '24px',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '24px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '24px',
    color: '#1a202c'
  },
  stats: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px'
  },
  statBox: {
    flex: 1,
    padding: '20px',
    background: '#f7fafc',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid transparent'
  },
  statBoxActive: {
    background: '#667eea',
    color: 'white',
    border: '2px solid #667eea'
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
  publishButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px 24px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '24px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s'
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
    color: '#1a202c'
  },
  sourceTitle: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '12px'
  },
  caption: {
    fontSize: '14px',
    color: '#4a5568',
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
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontSize: '20px',
    color: '#718096'
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyText: {
    fontSize: '18px',
    color: '#718096'
  }
};
