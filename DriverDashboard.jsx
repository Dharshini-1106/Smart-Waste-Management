import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Truck, MapPin, Clock, CheckCircle, AlertCircle, Award } from 'lucide-react';

export default function DriverDashboard() {
  const navigate = useNavigate();
  // Mock data for dashboard - real data from DriverView context if passed
  const bins = [
    { fillLevel: 92 },
    { fillLevel: 85 },
    { fillLevel: 78 },
    { fillLevel: 95 }
  ];

  const totalBins = 12;
  const completed = 4;
  const priorityHigh = 3;

  const routeDistance = '12.4 km';
  const eta = '2h 15m';
  const progress = totalBins > 0 ? (completed / totalBins * 100).toFixed(0) : 0;

  const startRoute = () => navigate('/driver/map');

  return (
    <div className="h-full p-8 flex flex-col">
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Truck className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Today's Collection Route
        </h1>
        <p className="text-slate-400 text-lg">Optimized for efficiency and priority bins ({totalBins} total)</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm rounded-2xl p-6 group hover:border-cyan-500/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase font-bold tracking-wide">Total Bins</p>
              <p className="text-2xl font-bold text-white">{totalBins}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm rounded-2xl p-6 group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase font-bold tracking-wide">Completed</p>
              <p className="text-2xl font-bold text-white">{completed}</p>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full transition-all duration-1000" style={{width: `${progress}%`}} />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm rounded-2xl p-6 group hover:border-orange-500/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase font-bold tracking-wide">High Priority</p>
              <p className="text-2xl font-bold text-white">{priorityHigh}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm rounded-2xl p-6 group hover:border-blue-500/50 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase font-bold tracking-wide">ETA</p>
              <p className="text-2xl font-bold text-white">{eta}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">Distance: {routeDistance}</p>
        </div>
      </div>

      {/* Start Route Button */}
      <div className="flex justify-center">
        <button 
          onClick={startRoute}
          className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-6 px-12 rounded-2xl text-xl shadow-2xl hover:shadow-cyan-500/25 hover:scale-[1.02] transition-all duration-300 flex items-center gap-3"
        >
          <Award className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          Start Optimized Route
        </button>
      </div>
    </div>
  );
}
