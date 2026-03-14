import React, { useState, useEffect } from 'react';
import { ArrowLeft, Leaf, Activity, Award, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend
} from 'recharts';
import { getImpactStats } from '../lib/api';

export default function ImpactDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    co2Saved: 124.5,
    treesSaved: 5,
    wasteRecycled: 85.3,
    ranking: 23,
    totalReports: 12
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getImpactStats();
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching impact stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const data = [
    { name: 'Plastic', kg: 42.1, co2: 63.15 },
    { name: 'Organic', kg: 23.4, co2: 35.1 },
    { name: 'Glass', kg: 19.8, co2: 29.7 }
  ];

  const radialData = [
    { name: 'Your Impact', value: stats.co2Saved, fill: '#10b981' },
    { name: 'Avg Citizen', value: 80, fill: '#6b7280' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900/20 via-slate-900 to-cyan-900/20 p-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/citizen')}
          className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 mb-12 transition-colors text-lg font-semibold"
        >
          <ArrowLeft className="w-6 h-6" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Your Impact
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Track your environmental contribution and climb the leaderboard
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid lg:grid-cols-4 gap-6 mb-16">
          <div className="group bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 hover:border-emerald-400/40 transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-2xl mb-6 group-hover:bg-emerald-500/30 transition-colors">
              <Leaf className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-3xl font-black text-emerald-400 mb-2">{stats.co2Saved.toFixed(1)}kg</h3>
            <p className="text-slate-400 text-sm uppercase tracking-wide">CO₂ Saved</p>
          </div>

          <div className="group bg-white/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-8 hover:border-green-400/40 transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-2xl mb-6 group-hover:bg-green-500/30 transition-colors">
              <Activity className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-3xl font-black text-green-400 mb-2">{stats.wasteRecycled.toFixed(1)}kg</h3>
            <p className="text-slate-400 text-sm uppercase tracking-wide">Waste Recycled</p>
          </div>

          <div className="group bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 hover:border-cyan-400/40 transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-2xl mb-6 group-hover:bg-cyan-500/30 transition-colors">
              <Award className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-3xl font-black text-cyan-400 mb-2">#{stats.ranking}</h3>
            <p className="text-slate-400 text-sm uppercase tracking-wide">Your Ranking</p>
          </div>

          <div className="group bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 hover:border-purple-400/40 transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-2xl mb-6 group-hover:bg-purple-500/30 transition-colors">
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-3xl font-black text-purple-400 mb-2">{stats.totalReports}</h3>
            <p className="text-slate-400 text-sm uppercase tracking-wide">Reports Filed</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Bar Chart - Waste Types */}
          <div className="bg-white/5 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-emerald-400">
              <BarChart3 className="w-7 h-7" />
              Waste Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={14} />
                <YAxis stroke="#94a3b8" fontSize={14} />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid #475569',
                    color: 'white'
                  }}
                />
                <Bar dataKey="kg" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radial Chart - Impact Comparison */}
          <div className="bg-white/5 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-cyan-400">
              Impact vs Average
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" barSize={20} data={radialData}>
                <RadialBar 
                  minAngle={15} 
                  background 
                  clockWise 
                  dataKey="value" 
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ color: '#94a3b8' }} />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trees Saved */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 px-16">
            {[...Array(stats.treesSaved)].map((_, i) => (
              <div key={i} className="animate-[bounce_2s_ease-in-out_infinite]">
                <Leaf className="w-16 h-16 text-emerald-400 drop-shadow-lg" />
              </div>
            ))}
            <div>
              <p className="text-6xl font-black text-emerald-400">{stats.treesSaved}</p>
              <p className="text-xl text-slate-300">Trees Saved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

