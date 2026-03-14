import React, { useState, useEffect, useRef } from 'react';
import Map3D from './Map3D';
import { Navigation, Truck, MapPin, Activity, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDriverBins } from '../lib/api';

export default function RouteMap() {
  const navigate = useNavigate();
  const [truckLocation, setTruckLocation] = useState([-74.006, 40.7128]);
  const [routeProgress, setRouteProgress] = useState(35);
  const [currentStop, setCurrentStop] = useState(3);
  const [totalStops, setTotalStops] = useState(8);
  const [directions, setDirections] = useState('Turn left onto Main St in 200m');
  const [bins, setBins] = useState([]);

  useEffect(() => {
    const loadRouteData = async () => {
      try {
        const res = await getDriverBins('route');
        setBins(res.data);
        setTotalStops(res.data.length || 8);
      } catch {
        // Fallback
      }
    };
    loadRouteData();
  }, []);

  useEffect(() => {
    // Mock GPS update
    const interval = setInterval(() => {
      setRouteProgress(prev => Math.min(prev + 1, 100));
      setTruckLocation(prev => [prev[0] + (Math.random() - 0.5) * 0.001, prev[1] + (Math.random() - 0.5) * 0.001]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const goBack = () => navigate(-1);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700 p-4 flex items-center gap-4">
        <button onClick={goBack} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-400" />
        </button>
        <div className="flex items-center gap-3">
          <Navigation className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-xl font-bold">Optimized Route</h1>
            <p className="text-slate-400 text-sm">Stop {currentStop}/{totalStops}</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <Map3D 
          mode="driver" 
          truckLocation={truckLocation}
          highlightedStops={bins.slice(0, currentStop)}
          routeProgress={routeProgress}
        />
        
        {/* Truck Location Indicator Overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3 shadow-2xl animate-pulse">
          <Truck className="w-8 h-8 text-emerald-400 drop-shadow-lg" />
        </div>

        {/* Stops Progress */}
        <div className="absolute top-4 left-4 bg-slate-900/95 border border-slate-700 rounded-2xl p-4 shadow-2xl max-w-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse" />
            <span className="font-mono text-sm text-slate-400">Route Progress</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 mb-3">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-3 rounded-full shadow-md transition-all duration-1000" 
              style={{ width: `${routeProgress}%` }}
            />
          </div>
          <p className="text-lg font-bold text-cyan-400">{routeProgress}% Complete</p>
        </div>
      </div>

      {/* Turn-by-Turn Directions */}
      <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-orange-400 animate-spin" />
          <div>
            <p className="font-bold text-white text-lg">Next: Stop {currentStop}</p>
            <p className="text-slate-400 text-sm">Bin {bins[currentStop - 1]?.id || 'B102'}</p>
          </div>
        </div>
        <p className="text-slate-300 text-lg leading-relaxed">{directions}</p>
        <div className="flex gap-2 mt-4">
          <button className="flex-1 bg-emerald-500/90 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl border border-emerald-500/50 transition-all">
            Mark Complete
          </button>
          <button className="px-6 bg-slate-700/50 hover:bg-slate-600 text-slate-300 py-3 rounded-xl border border-slate-600 transition-all">
            Recalculate
          </button>
        </div>
      </div>
    </div>
  );
}
