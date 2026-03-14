import React, { useState, useEffect } from 'react';
import { ChevronLeft, Truck, User, Award, Calendar, BarChart3, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { getDriverProfile, getDriverHistory } from '../lib/api';


export default function DriverProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    driverId: 'DRV-001',
    name: 'John Ramirez',
    vehicle: 'Truck T-456',
    license: 'DL-789012',
    totalRoutes: 247,
    totalCollections: 2847,
    efficiency: 97.8,
    avgTimePerBin: '4m 32s',
    currentStreak: 28,
    rating: 4.92
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Mock API calls for hackathon demo - backend ready if needed
        setProfile(profile);
        setHistory(generateDummyHistory());

      } catch {
        setHistory(generateDummyHistory());
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const generateDummyHistory = () => [
    { date: 'Today', bins: 12, distance: '18.4km', time: '2h 45m', efficiency: 98.2 },
    { date: 'Yesterday', bins: 15, distance: '22.1km', time: '3h 12m', efficiency: 96.8 },
    { date: 'Oct 10', bins: 14, distance: '20.5km', time: '2h 58m', efficiency: 99.1 },
    { date: 'Oct 9', bins: 11, distance: '16.3km', time: '2h 18m', efficiency: 95.4 },
    { date: 'Oct 8', bins: 13, distance: '19.7km', time: '2h 41m', efficiency: 97.6 },
  ];


  const goBack = () => navigate('/driver');

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center animate-pulse">
          <BarChart3 className="w-20 h-20 text-slate-500 mx-auto mb-6 opacity-50" />
          <p className="text-xl text-slate-500">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-8 border-b border-slate-700/50 backdrop-blur-md relative overflow-hidden">
        <button onClick={goBack} className="absolute left-8 top-8 p-3 bg-slate-800/30 hover:bg-slate-700/50 rounded-2xl backdrop-blur-sm border border-slate-700/30 transition-all">
          <ChevronLeft className="w-6 h-6 text-slate-400" />
        </button>
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-3 rounded-full mb-6 backdrop-blur-sm border border-white/10">
            <Award className="w-6 h-6 text-yellow-400" />
            <span className="font-bold text-lg text-white drop-shadow-lg">Top 1% Driver</span>
          </div>
          <div className="w-32 h-32 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full mx-auto mb-6 relative border-8 border-slate-800/50 shadow-2xl">
            <div className="absolute inset-8 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full shadow-lg" />
            <User className="absolute inset-0 w-full h-full p-12 text-white drop-shadow-2xl" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-2">
            {profile.name}
          </h1>
          <p className="text-slate-400 font-mono text-xl">ID: {profile.driverId}</p>
        </div>
      </div>

      <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="group p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-cyan-400/50 hover:shadow-cyan-500/10 transition-all">
            <Truck className="w-12 h-12 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-slate-400 uppercase font-bold tracking-wide mb-1">Vehicle</p>
            <p className="text-2xl font-bold text-white font-mono">{profile.vehicle}</p>
          </div>
          <div className="group p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-emerald-400/50 hover:shadow-emerald-500/10 transition-all">
            <CheckCircle className="w-12 h-12 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-slate-400 uppercase font-bold tracking-wide mb-1">Total Bins</p>
            <p className="text-2xl font-bold text-white">{profile.totalCollections.toLocaleString()}</p>
          </div>
          <div className="group p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-orange-400/50 hover:shadow-orange-500/10 transition-all">
            <BarChart3 className="w-12 h-12 text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-slate-400 uppercase font-bold tracking-wide mb-1">Efficiency</p>
            <p className="text-2xl font-bold text-white">{profile.efficiency}%</p>
          </div>
          <div className="group p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-blue-400/50 hover:shadow-blue-500/10 transition-all">
            <Clock className="w-12 h-12 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-slate-400 uppercase font-bold tracking-wide mb-1">Avg/Bin</p>
            <p className="text-2xl font-bold text-white font-mono">{profile.avgTimePerBin}</p>
          </div>
          <div className="group p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-purple-400/50 hover:shadow-purple-500/10 transition-all">
            <Award className="w-12 h-12 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-slate-400 uppercase font-bold tracking-wide mb-1">Rating</p>
            <p className="text-2xl font-bold text-white">{profile.rating}</p>
          </div>
          <div className="group p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-yellow-400/50 hover:shadow-yellow-500/10 transition-all">
            <Calendar className="w-12 h-12 text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-slate-400 uppercase font-bold tracking-wide mb-1">Streak</p>
            <p className="text-2xl font-bold text-white">{profile.currentStreak} days</p>
          </div>
        </div>

        {/* Route History */}
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-slate-400" />
            Recent Routes
          </h3>
          <div className="space-y-3">
            {history.map((route, index) => (
              <div key={index} className="group p-6 rounded-2xl border border-slate-700/50 hover:border-cyan-400/50 backdrop-blur-sm hover:shadow-lg transition-all bg-slate-800/30">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg font-bold text-white">{route.date}</p>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                    <span className="font-mono text-sm font-bold">{route.efficiency}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>{route.bins} bins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <span>{route.distance}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    <span>{route.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
