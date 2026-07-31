import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Sparkles, BarChart3, Disc, Star, Music, Award, Calendar, Layers, Loader2, ArrowRight } from 'lucide-react';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#14b8a6'];

export const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [analyticsData, aiData] = await Promise.all([
        analyticsService.getAnalytics(),
        analyticsService.getAiSummary()
      ]);
      setAnalytics(analyticsData);
      setAiSummary(aiData);
    } catch (err) {
      setError('Failed to load catalog analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-slate-400 text-sm font-medium">Generating catalog analytics & AI insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-center">
          {error}
        </div>
      </div>
    );
  }

  const hasData = analytics && analytics.totalAlbums > 0;

  // Format Recharts Data
  const genreData = analytics?.genreDistribution
    ? Object.entries(analytics.genreDistribution).map(([name, value]) => ({ name, value }))
    : [];

  const artistData = analytics?.artistDistribution
    ? Object.entries(analytics.artistDistribution).map(([name, count]) => ({ name, count }))
    : [];

  const yearData = analytics?.releaseYearDistribution
    ? Object.entries(analytics.releaseYearDistribution).map(([year, count]) => ({ year, count }))
    : [];

  const ratingData = analytics?.ratingDistribution
    ? Object.entries(analytics.ratingDistribution).map(([rating, count]) => ({ rating, count }))
    : [];

  return (
    <div className="relative min-h-full pb-10">
      <div className="sticky top-0 z-0 bg-gradient-to-b from-[#1a1a1a] to-transparent h-64 w-full absolute pointer-events-none -mt-4 opacity-70" />
      <div className="px-6 py-8 space-y-8 relative z-10">
        {/* Header Banner */}
        <div className="bg-[#181818] p-8 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Catalog Analytics Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Library Insights & <span className="gradient-text">AI Summary</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Interactive metrics, distribution charts, and AI-driven narrative analysis of your music catalog.
            </p>
          </div>
        </div>

        {/* AI Feature Hero Card */}
        <div className="bg-[#181818] p-8 rounded-xl border border-slate-800/50 relative overflow-hidden bg-gradient-to-br from-[#181818] via-[#121212] to-[#1db954]/10 shadow-2xl">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">AI Music Taste Summary</h2>
                  <p className="text-xs text-indigo-300">Natural-Language Collection Intelligence</p>
                </div>
              </div>

              {aiSummary && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    Top Genre: {aiSummary.topGenre}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Disc className="w-3.5 h-3.5 text-purple-400" />
                    Top Artist: {aiSummary.topArtist}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Era: {aiSummary.dominantEra}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 text-base sm:text-lg leading-relaxed shadow-inner">
              "{aiSummary?.summary}"
            </div>
          </div>
        </div>

        {!hasData ? (
          <div className="py-16 text-center bg-[#181818] rounded-xl border-none p-8 space-y-4">
            <Disc className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Catalog Data Available</h3>
            <p className="text-sm text-slate-400">Save albums from the iTunes Search page to unlock your charts.</p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white gradient-btn"
            >
              <span>Search Albums</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl border-none flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Disc className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Albums</p>
                  <p className="text-2xl font-extrabold text-white mt-0.5">{analytics.totalAlbums}</p>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl border-none flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Rating</p>
                  <p className="text-2xl font-extrabold text-white mt-0.5">{analytics.averageRating} / 5.0</p>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl border-none flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tracks</p>
                  <p className="text-2xl font-extrabold text-white mt-0.5">{analytics.totalTracks}</p>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart 1: Genre Distribution (Pie Chart) */}
              <div className="glass-card p-6 rounded-xl border-none space-y-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-lg">Genre Distribution</h3>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Albums by Artist (Bar Chart) */}
              <div className="glass-card p-6 rounded-xl border-none space-y-4">
                <div className="flex items-center gap-2">
                  <Disc className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-white text-lg">Albums by Artist</h3>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={artistData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#94a3b8" allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Releases by Year (Line Chart) */}
              <div className="glass-card p-6 rounded-xl border-none space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-lg">Releases by Year</h3>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#94a3b8" allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                      <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 4: Rating Distribution (Histogram / Bar Chart) */}
              <div className="glass-card p-6 rounded-xl border-none space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-lg">Rating Distribution</h3>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ratingData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="rating" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#94a3b8" allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                      <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
