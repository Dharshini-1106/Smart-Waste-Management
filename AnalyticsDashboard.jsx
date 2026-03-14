import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, MapPin, Activity, AlertTriangle } from 'recharts';
import { Search, Users, Truck, AlertCircle } from 'lucide-react';

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState({ metrics: {}, trends: [], driverPerformance: [] });
  const [neighborhoodData, setNeighborhoodData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchBinsAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const analyticsData = await res.json();
      setData(analyticsData);
    } catch (err) {
      console.error('Error fetching analytics', err);
    }
  };

  const fetchBinsAnalytics = async () => {
    try {
      const res = await fetch('/api/bins/analytics', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setNeighborhoodData(await res.json());
    } catch (err) {
      console.error('Error fetching neighborhood data', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="text-cyan-400" />
          Analytics Dashboard
        </h1>
        <div className="flex gap-4 text-sm">
          <button onClick={fetchAnalytics} className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700">
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8 bg-blue-500/20 p-2 rounded-xl text-blue-400" />
            <div>
              <p className="text-slate-400 text-sm">Total Bins</p>
              <p className="text-2xl font-bold text-white">{data.metrics.totalBins || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-8 h-8 bg-red-500/20 p-2 rounded-xl text-red-400" />
            <div>
              <p className="text-slate-400 text-sm">Full Bins</p>
              <p className="text-2xl font-bold text-white">{data.metrics.fullBins || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 bg-emerald-500/20 p-2 rounded-xl text-emerald-400" />
            <div>
              <p className="text-slate-400 text-sm">Open Reports</p>
              <p className="text-2xl font-bold text-white">{data.metrics.openReports || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-8 h-8 bg-amber-500/20 p-2 rounded-xl text-amber-400" />
            <div>
              <p className="text-slate-400 text-sm">Active Routes</p>
              <p className="text-2xl font-bold text-white">{data.metrics.activeRoutes || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 bg-green-500/20 p-2 rounded-xl text-green-400" />
            <div>
              <p className="text-slate-400 text-sm">Efficiency</p>
              <p className="text-2xl font-bold text-white">{data.metrics.collectionEfficiency || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Trends */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h2 className="text-xl font-bold mb-4">Collection Trends (Weekly)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="waste" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
              <Line type="monotone" dataKey="collections" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Neighborhood Volumes */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h2 className="text-xl font-bold mb-4">Waste by Neighborhood</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={neighborhoodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" angle={-45} height={80} />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="volume" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Driver Performance & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h2 className="text-xl font-bold mb-4">Driver Performance</h2>
          <div className="space-y-4">
            {data.driverPerformance && data.driverPerformance.map((driver, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-slate-900 rounded-xl">
                <span className="font-bold">{driver.driver}</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-400">{driver.efficiency}%</p>
                  <p className="text-sm text-slate-400">{driver.bins} bins</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h2 className="text-xl font-bold mb-4">Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Full Bins', value: data.metrics.fullBins || 15 },
                  { name: 'Normal Bins', value: (data.metrics.totalBins || 100) - (data.metrics.fullBins || 15) },
                  { name: 'Open Reports', value: data.metrics.openReports || 23 }
                ]}
                cx="50%" cy="50%" outerRadius={80}
                dataKey="value"
              >
                {data => (
                  <Cell key={`cell-${data.index}`} fill={COLORS[data.index % COLORS.length]} />
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
