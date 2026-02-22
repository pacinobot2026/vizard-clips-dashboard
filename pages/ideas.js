import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../components/NavigationSidebar';

export default function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('inbox');
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: '', description: '', category: 'business', priority: 'medium' });

  useEffect(() => {
    loadMockIdeas();
  }, [filter, category]);

  const loadMockIdeas = () => {
    // Mock ideas data
    const mockIdeas = [
      {
        id: 1,
        title: "AI-powered local news aggregator for each city",
        description: "Build a system that scrapes local news sources and creates personalized newsletters for different neighborhoods",
        category: "Product Idea",
        status: "inbox",
        priority: "high",
        tags: ["AI", "Newsletter", "Local"],
        created_at: "2026-02-22T00:45:00Z"
      },
      {
        id: 2,
        title: "Automated video clip generation from long-form content",
        description: "Use Vizard to automatically create short clips from all our training videos and post to social",
        category: "Content Strategy",
        status: "active",
        priority: "high",
        tags: ["Video", "Automation", "Social Media"],
        created_at: "2026-02-21T10:30:00Z"
      },
      {
        id: 3,
        title: "Course Sprout + MintBird integration for upsells",
        description: "When someone completes a course module, trigger MintBird funnel for relevant upsell product",
        category: "Product Idea",
        status: "active",
        priority: "medium",
        tags: ["Integration", "Course Sprout", "MintBird"],
        created_at: "2026-02-20T14:20:00Z"
      },
      {
        id: 4,
        title: "Weekly live Q&A for Entourage members",
        description: "Host a weekly Zoom call where members can ask questions about their local media sites",
        category: "Community",
        status: "inbox",
        priority: "medium",
        tags: ["Entourage", "Live", "Support"],
        created_at: "2026-02-22T09:15:00Z"
      },
      {
        id: 5,
        title: "Bundle all Titanium tools into one monthly subscription",
        description: "Single price point for MintBird + PopLinks + Course Sprout + Letterman + GC + QuizForma",
        category: "Business Model",
        status: "someday",
        priority: "low",
        tags: ["Pricing", "Bundle", "Strategy"],
        created_at: "2026-02-19T16:45:00Z"
      },
      {
        id: 6,
        title: "Launch 'Local Media OS' course teaching the full system",
        description: "Complete course on building local media empire: finding topics, setting up sites, monetization, scaling",
        category: "Product Idea",
        status: "active",
        priority: "high",
        tags: ["Course", "Training", "Local Media"],
        created_at: "2026-02-18T12:30:00Z"
      },
      {
        id: 7,
        title: "Partner with local businesses for sponsored content",
        description: "Reach out to West Valley businesses to sponsor newsletter sections or dedicated articles",
        category: "Revenue",
        status: "inbox",
        priority: "medium",
        tags: ["Sponsorship", "Revenue", "Local"],
        created_at: "2026-02-21T11:00:00Z"
      },
      {
        id: 8,
        title: "Create template library for PopLinks bridge pages",
        description: "Pre-built, high-converting templates members can clone and customize",
        category: "Product Feature",
        status: "completed",
        priority: "medium",
        tags: ["PopLinks", "Templates", "UX"],
        created_at: "2026-02-15T15:20:00Z"
      }
    ];

    // Filter by status
    let filtered = mockIdeas.filter(i => i.status === filter);

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(i => i.category === category);
    }

    // Calculate stats
    const statsCalc = {
      inbox: mockIdeas.filter(i => i.status === 'inbox').length,
      active: mockIdeas.filter(i => i.status === 'active').length,
      someday: mockIdeas.filter(i => i.status === 'someday').length,
      completed: mockIdeas.filter(i => i.status === 'completed').length
    };

    setIdeas(filtered);
    setStats(statsCalc);
    setLoading(false);
  };

  const filteredIdeas = ideas.filter(idea => 
    searchTerm === '' || 
    (idea.title && idea.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (idea.description && idea.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddIdea = () => {
    console.log('New idea:', newIdea);
    setShowAddModal(false);
    setNewIdea({ title: '', description: '', category: 'business', priority: 'medium' });
    loadMockIdeas();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0D1423' }}>
        <NavigationSidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
          Loading ideas...
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0D1423' }}>
      <NavigationSidebar />
      
      <main style={{ flex: 1, padding: '32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ 
            marginBottom: '24px',
            animation: 'fadeIn 0.6s ease-out',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '30px', 
                fontWeight: '700', 
                background: 'linear-gradient(90deg, #22d3ee, #60a5fa, #a78bfa, #22d3ee)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '4px',
                animation: 'gradientShift 3s ease infinite'
              }}>
                💡 2nd Brain - Ideas
              </h1>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Capture and organize your ideas</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '12px 24px',
                background: '#8b5cf6',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              + New Idea
            </button>
          </div>
          
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <StatCard 
              icon="📥" 
              count={stats.inbox || 0} 
              label="Inbox"
              active={filter === 'inbox'}
              onClick={() => setFilter('inbox')}
              delay={0}
            />
            <StatCard 
              icon="🔥" 
              count={stats.active || 0} 
              label="Active"
              active={filter === 'active'}
              onClick={() => setFilter('active')}
              delay={0.1}
            />
            <StatCard 
              icon="💭" 
              count={stats.someday || 0} 
              label="Someday"
              active={filter === 'someday'}
              onClick={() => setFilter('someday')}
              delay={0.2}
            />
            <StatCard 
              icon="✅" 
              count={stats.completed || 0} 
              label="Completed"
              active={filter === 'completed'}
              onClick={() => setFilter('completed')}
              delay={0.3}
            />
          </div>

          {/* Search */}
          <div style={{ marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="🔍 Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Ideas List */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(75, 85, 99, 0.5)',
            animation: 'scaleIn 0.4s ease-out 0.4s both'
          }}>
            {filteredIdeas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px', color: '#6b7280' }}>
                No ideas in {filter}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: '16px', textAlign: 'right', color: '#9ca3af', fontSize: '14px' }}>
            {filteredIdeas.length} {filteredIdeas.length === 1 ? 'idea' : 'ideas'}
          </div>
        </div>
      </main>

      {/* Add Idea Modal */}
      {showAddModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div 
            style={{
              background: '#1f2937',
              borderRadius: '16px',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              maxWidth: '600px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '24px' }}>
              💡 New Idea
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                placeholder="Idea title..."
                value={newIdea.title}
                onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(31, 41, 55, 0.7)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />

              <textarea
                placeholder="Description..."
                value={newIdea.description}
                onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                rows={4}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(31, 41, 55, 0.7)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleAddIdea}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#8b5cf6',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Save Idea
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(31, 41, 55, 0.7)',
                    border: '1px solid rgba(75, 85, 99, 0.5)',
                    borderRadius: '8px',
                    color: '#9ca3af',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
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

function StatCard({ icon, count, label, active, onClick, delay = 0 }) {
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
        transform: active ? 'scale(1.05)' : 'none',
        animation: `slideUp 0.5s ease-out ${delay}s both`
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

function IdeaCard({ idea }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };
  
  return (
    <div 
      style={{
        background: 'rgba(31, 41, 55, 0.7)',
        borderRadius: '12px',
        border: '1px solid rgba(75, 85, 99, 0.5)',
        padding: '20px',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(139, 92, 246, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '600', marginBottom: '8px', lineHeight: 1.4 }}>
            {idea.title}
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ 
              padding: '4px 8px', 
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '6px', 
              fontSize: '11px',
              color: '#a78bfa',
              fontWeight: '600'
            }}>
              {idea.category}
            </span>
            <span style={{ 
              padding: '4px 8px', 
              background: `${priorityColors[idea.priority]}15`,
              border: `1px solid ${priorityColors[idea.priority]}30`,
              borderRadius: '6px', 
              fontSize: '11px',
              color: priorityColors[idea.priority],
              fontWeight: '600'
            }}>
              {idea.priority}
            </span>
            <span style={{ 
              padding: '4px 8px', 
              background: '#1f2937', 
              borderRadius: '6px', 
              fontSize: '11px',
              color: '#9ca3af'
            }}>
              {new Date(idea.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {isExpanded && (
        <div style={{ 
          marginTop: '16px', 
          paddingTop: '16px', 
          borderTop: '1px solid rgba(75, 85, 99, 0.3)',
          color: '#d1d5db',
          fontSize: '14px',
          lineHeight: 1.6
        }}>
          {idea.description}
          
          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {idea.tags.map(tag => (
                <span key={tag} style={{ 
                  padding: '4px 10px', 
                  background: 'rgba(96, 165, 250, 0.1)',
                  border: '1px solid rgba(96, 165, 250, 0.2)',
                  borderRadius: '6px', 
                  fontSize: '11px',
                  color: '#60a5fa'
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
