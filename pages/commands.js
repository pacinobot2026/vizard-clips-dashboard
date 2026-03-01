import { useState } from 'react';
import Head from 'next/head';
import NavigationSidebar from '../components/NavigationSidebar';
import withAuth from '../lib/withAuth';

function Commands() {
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
      Business: 'bg-green-500',
      Email: 'bg-blue-500',
      Content: 'bg-purple-500',
      Marketing: 'bg-amber-500',
      Support: 'bg-pink-500',
      System: 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="flex min-h-screen">
      <Head>
        <title>Custom Commands</title>
      </Head>
      <NavigationSidebar />
      <main className="flex-1 p-8 pt-16 md:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-1">
                ⌘ Custom Commands
              </h1>
              <p className="text-sm text-gray-400">
                Quick shortcuts for common workflows
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search commands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap mb-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'bg-gray-800/50 border-gray-600/50 text-white hover:bg-gray-800'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
                {cat !== 'all' && (
                  <span className="ml-2 text-xs opacity-75">
                    {commands.filter(c => c.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-400">
            {filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}
          </div>

          {/* Commands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCommands.map((cmd, idx) => (
              <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <code className="text-purple-400 font-mono font-semibold">{cmd.command}</code>
                  <span className={`${getCategoryColor(cmd.category)} text-white text-xs px-2 py-1 rounded-full`}>
                    {cmd.category}
                  </span>
                </div>
                <p className="text-white font-medium mb-1">{cmd.description}</p>
                <p className="text-sm text-gray-400">{cmd.details}</p>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCommands.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⌘</div>
              <p className="text-gray-400 text-lg mb-2">No commands found</p>
              <p className="text-sm text-gray-500">Try a different search or category</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default withAuth(Commands);
