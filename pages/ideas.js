import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../components/NavigationSidebar';

export default function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('urgent');
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: '', description: '', category: 'business', priority: 'medium' });
  const [viewMode, setViewMode] = useState('cards'); // 'list' or 'cards'

  useEffect(() => {
    loadMockIdeas();
  }, [filter, category, sortBy]);

  const loadMockIdeas = () => {
    // Mock ideas data
    const mockIdeas = [
      {
        id: 1,
        title: "AI-powered local news aggregator for each city",
        description: "Build a system that scrapes local news sources and creates personalized newsletters for different neighborhoods",
        category: "Software",
        status: "urgent",
        priority: "high",
        tags: ["AI", "Newsletter", "Local"],
        created_at: "2026-02-22T00:45:00Z"
      },
      {
        id: 2,
        title: "Automated video clip generation from long-form content",
        description: "Use Vizard to automatically create short clips from all our training videos and post to social",
        category: "Software",
        status: "urgent",
        priority: "high",
        tags: ["Video", "Automation", "Social Media"],
        created_at: "2026-02-21T10:30:00Z"
      },
      {
        id: 3,
        title: "Course Sprout + MintBird integration for upsells",
        description: "When someone completes a course module, trigger MintBird funnel for relevant upsell product",
        category: "Software",
        status: "active",
        priority: "medium",
        tags: ["Integration", "Course Sprout", "MintBird"],
        created_at: "2026-02-20T14:20:00Z"
      },
      {
        id: 4,
        title: "Weekly live Q&A for Entourage members",
        description: "Host a weekly Zoom call where members can ask questions about their local media sites",
        category: "Events",
        status: "active",
        priority: "medium",
        tags: ["Entourage", "Live", "Support"],
        created_at: "2026-02-22T09:15:00Z"
      },
      {
        id: 5,
        title: "Bundle all Titanium tools into one monthly subscription",
        description: "Single price point for MintBird + PopLinks + Course Sprout + Letterman + GC + QuizForma",
        category: "Launches",
        status: "someday",
        priority: "low",
        tags: ["Pricing", "Bundle", "Strategy"],
        created_at: "2026-02-19T16:45:00Z"
      },
      {
        id: 6,
        title: "Launch 'Local Media OS' course teaching the full system",
        description: "Complete course on building local media empire: finding topics, setting up sites, monetization, scaling",
        category: "Launches",
        status: "urgent",
        priority: "high",
        tags: ["Course", "Training", "Local Media"],
        created_at: "2026-02-18T12:30:00Z"
      },
      {
        id: 7,
        title: "Partner with local businesses for sponsored content",
        description: "Reach out to West Valley businesses to sponsor newsletter sections or dedicated articles",
        category: "Events",
        status: "someday",
        priority: "medium",
        tags: ["Sponsorship", "Revenue", "Local"],
        created_at: "2026-02-21T11:00:00Z"
      },
      {
        id: 8,
        title: "Create template library for PopLinks bridge pages",
        description: "Pre-built, high-converting templates members can clone and customize",
        category: "Workshops",
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

    // Sort
    if (sortBy === 'date_desc') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'date_asc') {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }

    // Calculate stats
    const statsCalc = {
      urgent: mockIdeas.filter(i => i.status === 'urgent').length,
      active: mockIdeas.filter(i => i.status === 'active').length,
      someday: mockIdeas.filter(i => i.status === 'someday').length,
      completed: mockIdeas.filter(i => i.status === 'completed').length
    };

    // Calculate categories
    const categoryMap = {};
    mockIdeas.forEach(i => {
      if (!categoryMap[i.category]) {
        categoryMap[i.category] = 0;
      }
      categoryMap[i.category]++;
    });

    const categoriesCalc = Object.keys(categoryMap).map(name => ({
      name,
      count: categoryMap[name]
    }));

    setIdeas(filtered);
    setStats(statsCalc);
    setCategories(categoriesCalc);
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
      
      <main style={{ flex: 1, padding: '32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#0D1423' }}>
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
                💡 Idea Board
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

            /* Mobile Responsive */
            @media (max-width: 768px) {
              main {
                padding: 16px !important;
              }
              h1 {
                font-size: 24px !important;
              }
              /* Stat cards - 2 columns on mobile (4 cards = 2 rows) */
              div[style*="gridTemplateColumns: 'repeat(4, 1fr)'"] {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 12px !important;
              }
              /* Search/filter row - stack vertically */
              div[style*="flexWrap: 'wrap'"] {
                flex-direction: column !important;
              }
              /* Card grids - 1 column */
              div[style*="repeat(auto-fill"] {
                grid-template-columns: 1fr !important;
              }
              /* Categories - dropdown on mobile */
              .desktop-categories {
                display: none !important;
              }
              .mobile-categories {
                display: block !important;
              }
            }
          `}</style>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <StatCard 
              icon="🔥" 
              count={stats.urgent || 0} 
              label="Urgent"
              active={filter === 'urgent'}
              onClick={() => setFilter('urgent')}
              delay={0}
            />
            <StatCard 
              icon="⚡" 
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
              label="Done"
              active={filter === 'completed'}
              onClick={() => setFilter('completed')}
              delay={0.3}
            />
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <>
              {/* Desktop Category Buttons */}
              <div className="desktop-categories" style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                    {cat.name} ({cat.count})
                  </button>
                ))}
              </div>
              
              {/* Mobile Category Dropdown */}
              <div className="mobile-categories" style={{ marginBottom: '16px', display: 'none' }}>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
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
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Search, Filters, and View Toggle - IDENTICAL TO ARTICLE BOARD */}
          <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Search ideas..."
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
              <option value="title">Title</option>
              <option value="priority">Priority</option>
            </select>
            
            {/* View Toggle */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(31, 41, 55, 0.5)', borderRadius: '8px', padding: '4px', border: '1px solid rgba(75, 85, 99, 0.5)' }}>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 16px',
                  background: viewMode === 'list' ? '#8b5cf6' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: '600'
                }}
              >
                📋 List
              </button>
              <button
                onClick={() => setViewMode('cards')}
                style={{
                  padding: '6px 16px',
                  background: viewMode === 'cards' ? '#8b5cf6' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: '600'
                }}
              >
                🎴 Cards
              </button>
            </div>
          </div>

          {/* Ideas List/Cards */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(75, 85, 99, 0.5)',
            animation: 'scaleIn 0.4s ease-out 0.4s both'
          }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff' }}>
                💡 Ideas
              </h2>
              <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                {filteredIdeas.length} {filteredIdeas.length === 1 ? 'idea' : 'ideas'}
              </div>
            </div>

            {filteredIdeas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px', color: '#6b7280' }}>
                {searchTerm ? `No ideas matching "${searchTerm}"` : `No ideas in ${filter}`}
              </div>
            ) : viewMode === 'list' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredIdeas.map((idea) => (
                  <IdeaCardList key={idea.id} idea={idea} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {filteredIdeas.map((idea) => (
                  <IdeaCardGrid key={idea.id} idea={idea} />
                ))}
              </div>
            )}
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

// List View - Expandable rows
function IdeaCardList({ idea }) {
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
        borderRadius: '8px',
        border: '1px solid rgba(75, 85, 99, 0.5)',
        padding: '12px 16px',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
        e.currentTarget.style.background = 'rgba(31, 41, 55, 0.9)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
        e.currentTarget.style.background = 'rgba(31, 41, 55, 0.7)';
      }}
    >
      {/* Single line with title and badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: '500', flex: 1, minWidth: '200px' }}>
          {idea.title}
        </h3>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ 
            padding: '2px 8px', 
            background: `${priorityColors[idea.priority]}20`,
            borderRadius: '4px', 
            fontSize: '10px',
            color: priorityColors[idea.priority],
            fontWeight: '600'
          }}>
            {idea.priority}
          </span>
          <span style={{ 
            fontSize: '11px',
            color: '#6b7280'
          }}>
            {new Date(idea.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Description (expanded only) */}
      {isExpanded && (
        <div style={{ 
          marginTop: '10px', 
          paddingTop: '10px', 
          borderTop: '1px solid rgba(75, 85, 99, 0.3)',
          color: '#9ca3af',
          fontSize: '13px',
          lineHeight: 1.5
        }}>
          {idea.description}
          
          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {idea.tags.map(tag => (
                <span key={tag} style={{ 
                  padding: '2px 6px', 
                  background: 'rgba(96, 165, 250, 0.15)',
                  borderRadius: '4px', 
                  fontSize: '10px',
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

// Cards View - Grid cards like Video Board
function IdeaCardGrid({ idea }) {
  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };

  const priorityGradients = {
    high: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    medium: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    low: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  };

  return (
    <div style={{
      background: 'rgba(31, 41, 55, 0.7)',
      borderRadius: '12px',
      border: '1px solid rgba(75, 85, 99, 0.5)',
      overflow: 'hidden',
      transition: 'all 0.3s',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Priority Header */}
      <div style={{ 
        background: priorityGradients[idea.priority],
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80px'
      }}>
        <span style={{ fontSize: '48px' }}>
          {idea.priority === 'high' ? '🔥' : idea.priority === 'medium' ? '⚡' : '💭'}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '8px', lineHeight: 1.4, minHeight: '40px' }}>
          {idea.title}
        </h3>
        
        <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {idea.description}
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ 
            padding: '4px 8px', 
            background: '#1f2937', 
            borderRadius: '6px', 
            fontSize: '11px',
            color: '#9ca3af'
          }}>
            {idea.category}
          </span>
          <span style={{ 
            padding: '4px 8px', 
            background: '#1f2937', 
            borderRadius: '6px', 
            fontSize: '11px',
            color: '#9ca3af'
          }}>
            {new Date(idea.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Tags */}
        {idea.tags && idea.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {idea.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{ 
                padding: '2px 6px', 
                background: 'rgba(96, 165, 250, 0.15)',
                borderRadius: '4px', 
                fontSize: '10px',
                color: '#60a5fa'
              }}>
                #{tag}
              </span>
            ))}
            {idea.tags.length > 3 && (
              <span style={{ 
                padding: '2px 6px', 
                fontSize: '10px',
                color: '#6b7280'
              }}>
                +{idea.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
