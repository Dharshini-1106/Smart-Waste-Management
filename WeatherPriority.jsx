import React, { useState, useEffect } from 'react';
import { CloudRain, Thermometer, AlertTriangle, Leaf } from 'lucide-react';

export default function WeatherPriority() {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // 5 min
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      const res = await fetch('/api/admin/weather', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setWeather(await res.json());
    } catch (err) {
      console.error('Error fetching weather', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <CloudRain className="text-blue-400" />
        Weather Priority System
      </h1>

      {/* Current Weather */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 p-8 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <Thermometer className="w-12 h-12 text-blue-400" />
            <div>
              <p className="text-slate-400 text-sm">Temperature</p>
              <p className="text-4xl font-bold text-white">{weather.current?.temp || 0}°C</p>
            </div>
          </div>
          <p className="text-slate-300">{weather.current?.condition || 'Loading...'}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 p-8 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <Leaf className="w-12 h-12 text-emerald-400" />
            <div>
              <p className="text-slate-400 text-sm">Organic Priority</p>
              <p className="text-4xl font-bold text-white">{weather.priorityAdjustments?.organicPriorityBoost || 0}%</p>
            </div>
          </div>
          <p className="text-slate-300">Boost due to heat</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 p-8 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <AlertTriangle className="w-12 h-12 text-orange-400" />
            <div>
              <p className="text-slate-400 text-sm">Methane Risk</p>
              <p className="text-4xl font-bold text-white">{weather.methaneRisk || 'Normal'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {weather.alerts && weather.alerts.length > 0 && (
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-400">
            <AlertTriangle className="w-6 h-6" />
            Active Weather Alerts
          </h3>
          <div className="space-y-2">
            {weather.alerts.map((alert, index) => (
              <div key={index} className="bg-orange-500/20 p-3 rounded-xl border border-orange-500/50">
                {alert}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Adjustments Table */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-xl font-bold mb-6">Priority Adjustments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-slate-400 mb-2">Organic Bins</p>
            <p className="text-2xl font-bold text-emerald-400">+{weather.priorityAdjustments?.organicPriorityBoost || 0}%</p>
          </div>
          <div>
            <p className="text-slate-400 mb-2">Plastic Bins</p>
            <p className="text-2xl font-bold text-blue-400">+10%</p>
          </div>
          <div>
            <p className="text-slate-400 mb-2">Hazardous Bins</p>
            <p className="text-2xl font-bold text-red-400">High Priority</p>
          </div>
        </div>
      </div>

      <div className="text-center text-slate-400">
        Last updated: {new Date().toLocaleTimeString()}
        <button onClick={fetchWeather} className="ml-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm">
          Refresh
        </button>
      </div>
    </div>
  );
