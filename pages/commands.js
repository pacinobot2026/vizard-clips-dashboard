import { useState } from 'react';
import Head from 'next/head';
import NavigationSidebar from '../components/NavigationSidebar';

export default function Commands() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const commands = [
    {
      command: '/create business',
      category: 'Business',
      description: 'Full 6-stage product creation engine',
      details: 'End-to-end product creation, launch, and scale system with Business Board integration'
    },
    {
      command: '/salespage',
      category: 'Business',
      description: 'Build Next.js sales page + deploy',
      details: 'Generate professional sales page with Stripe checkout and deploy to Vercel'
    },
    {
      command: '/create course',
      category: 'Business',
      description: 'Create complete online course in Course Sprout',
      details: 'Generate course structure (4-8 chapters), auto-create lessons with goal blocks, return live URL'
    },
    {
      command: '/salescopy',
      category: 'Business',
      description: 'Generate high-converting sales copy',
      details: 'Using proven frameworks (PAS, AIDA, 4Ps) - headline, bullets, CTAs'
    },
    {
      command: '/vsl',
      category: 'Business',
      description: 'Create VSL script + audio + video',
      details: 'Complete VSL with text slides, ElevenLabs audio, word-level timing'
    },
    {
      command: '/videoavatar',
      category: 'Business',
      description: 'Generate AI avatar video',
      details: 'Create avatar videos with HeyGen or ElevenLabs'
    },
    {
      command: '/broadcast',
      category: 'Email',
      description: 'Create/send broadcast email',
      details: 'With re-engagement fork - sends via Global Control'
    },
    {
      command: '/emailstats',
      category: 'Email',
      description: 'Get email performance stats',
      details: 'Pull broadcast or workflow stats from Global Control'
    },
    {
      command: '/reactivation',
      category: 'Email',
      description: 'CSV upload → progressive daily campaign',
      details: 'Re-engagement campaign with progressive sending'
    },
    {
      command: '/replay',
      category: 'Content',
      description: 'Create Course Sprout lesson from Vimeo',
      details: 'Auto-create lesson with video, transcript, descriptions, goal blocks'
    },
    {
      command: '/article',
      category: 'Content',
      description: 'Create Letterman article',
      details: 'Generate article with SEO optimization (local or niche)'
    },
    {
      command: '/vizard',
      category: 'Content',
      description: 'Submit video to Vizard for AI clipping',
      details: 'Send Vimeo URL to Vizard, get short-form clips for social'
    },
    {
      command: '/poplink',
      category: 'Marketing',
      description: 'Create PopLink shortlink',
      details: 'Generate branded short links via PopLinks API'
    },
    {
      command: '/makelive',
      category: 'Marketing',
      description: 'Publish bridge page from Google Sheets',
      details: 'Pull sheet data → clone/update bridge page → publish live'
    },
    {
      command: '/sob',
      category: 'Support',
      description: 'Grant SaaSOnboard product access',
      details: 'Add users to Titanium Software products (MintBird, Course Sprout, etc.)'
    },
    {
      command: '/tag',
      category: 'Support',
      description: 'Fire Global Control tag on contact',
      details: 'Find or create contact → fire tag to trigger workflow'
    },
    {
      command: '/systemhealth',
      category: 'System',
      description: 'Run health check on all APIs',
      details: 'Check 5 APIs + 9 URLs, save results'
    },
    {
      command: '/teamcall',
      category: 'System',
      description: 'Extract team assignments from Zoom',
      details: 'Parse team call transcript → update TEAM-KANBAN.md'
    }
  ];

  const categories = ['all', 'Business', 'Email', 'Content', 'Marketing', 'Support', 'System'];

  const filteredCommands = commands.filter(cmd => {
    const matchesSearch = cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cmd.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    const colors = {
      Business: '#10b981',
      Email: '#3b82f6',
      Content: '#8b5cf6',
      Marketing: '#f59e0b',
      Support: '#ec4899',
      System: '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div className="flex min-h-screen">
      <Head>
        <title>Custom Commands | OpenClaw</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <NavigationSidebar />
      
      <div className="container">
        {/* Header */}
        <header className="header">
        <h1>⌘ Custom Commands</h1>
        <p className="subtitle">Quick shortcuts for common workflows</p>
      </header>

      {/* Search & Filters */}
      <div className="controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search commands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-pills">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`pill ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat === 'all' ? 'All' : cat}
              {cat !== 'all' && (
                <span className="count">
                  {commands.filter(c => c.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="results-meta">
        <span>{filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Commands Grid */}
      <div className="commands-grid">
        {filteredCommands.map((cmd, idx) => (
          <div key={idx} className="command-card">
            <div className="card-header">
              <code className="command-name">{cmd.command}</code>
              <span
                className="category-badge"
                style={{ backgroundColor: getCategoryColor(cmd.category) }}
              >
                {cmd.category}
              </span>
            </div>
            <p className="card-description">{cmd.description}</p>
            <p className="card-details">{cmd.details}</p>
          </div>
        ))}
      </div>

      {filteredCommands.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">⌘</div>
          <p>No commands found</p>
          <span className="empty-hint">Try a different search or category</span>
        </div>
      )}

      <style jsx>{`
        .container {
          flex: 1;
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          padding: 2rem;
          padding-top: 4rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        @media (min-width: 768px) {
          .container {
            padding-top: 2rem;
          }
        }

        .header {
          margin-bottom: 2rem;
        }

        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.5rem 0;
        }

        .subtitle {
          color: #9ca3af;
          font-size: 1rem;
          margin: 0;
        }

        .controls {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s;
        }

        .search-input:focus {
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.08);
        }

        .category-pills {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .pill {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: #9ca3af;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pill:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .pill.active {
          background: #667eea;
          border-color: #667eea;
          color: white;
        }

        .count {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.125rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .results-meta {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .commands-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5rem;
        }

        .command-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s;
          cursor: pointer;
        }

        .command-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(102, 126, 234, 0.5);
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .command-name {
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 1.125rem;
          font-weight: 600;
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          padding: 0.375rem 0.75rem;
          border-radius: 8px;
          white-space: nowrap;
        }

        .category-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-description {
          color: white;
          font-size: 1rem;
          font-weight: 500;
          margin: 0 0 0.75rem 0;
        }

        .card-details {
          color: #9ca3af;
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.3;
        }

        .empty-state p {
          color: white;
          font-size: 1.25rem;
          font-weight: 500;
          margin: 0 0 0.5rem 0;
        }

        .empty-hint {
          color: #6b7280;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .header h1 {
            font-size: 2rem;
          }

          .controls {
            flex-direction: column;
          }

          .search-box {
            min-width: 100%;
          }

          .commands-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      </div>
    </div>
  );
}
