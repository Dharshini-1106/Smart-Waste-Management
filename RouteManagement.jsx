import React, { useState, useEffect } from 'react';
import { Search, Activity, Truck, Map, Play, Stop, Plus } from 'lucide-react';

export default function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoutes();
    fetchDrivers();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await fetch('/api/admin/routes', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setRoutes(data);
    } catch (err) {
      console.error('Error fetching routes', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await fetch('/api/admin/users?role=Truck Driver', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setDrivers(data);
    } catch (err) {
      console.error('Error fetching drivers', err);
    }
  };

  const generateRoute = async () => {
    const criticalBins = []; // Fetch critical bins logic
    const selectedDriver = drivers[0]?._id;
    try {
      await fetch('/api/admin/routes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ driverId: selectedDriver, bins: criticalBins })
      });
      fetchRoutes();
    } catch (err) {
      console.error('Error generating route', err);
    }
  };

  const startRoute = async (routeId) => {
    try {
      // Update route status to active (add PUT endpoint if needed)
      fetchRoutes();
    } catch (err) {
      console.error('Error starting route', err);
    }
  };

  const filteredRoutes = routes.filter(route => 
    route.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (route.driverId && route.driverId.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-slate-500/20 text-slate-400',
      active: 'bg-emerald-500/20 text-emerald-400',
      completed: 'bg-blue-500/20 text-blue-400'
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400';
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700 p-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="text-emerald-400" />
          Route Management
        </h1>
        <p className="text-slate-400">Optimize and assign driver routes</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <input 
              type="search" 
              placeholder="Search routes by driver or status..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-emerald-500"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <button 
            onClick={generateRoute}
            className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Generate Route
          </button>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <div className="grid grid-cols-[40px_1fr_120px_100px_120px] gap-4 text-sm font-bold text-slate-400">
              <span>#</span>
              <span>Driver</span>
              <span>Bin Count</span>
              <span>ETA</span>
              <span>Status / Actions</span>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading routes...</div>
            ) : filteredRoutes.map((route, index) => (
              <div key={route._id} className="p-6 border-t border-slate-700 hover:bg-slate-900/50 transition-colors grid grid-cols-[40px_1fr_120px_100px_120px] gap-4 items-center">
                <span className="font-mono font-bold">{index + 1}</span>
                <div>
                  <p className="font-bold">{route.driverId?.email || 'Unassigned'}</p>
                  <p className="text-sm text-slate-400">{route.driverId?.assignedVehicle || '-'}</p>
                </div>
                <span>{route.bins?.length || 0}</span>
                <span>{route.eta} min ({route.distance} km)</span>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(route.status)}`}>
                    {route.status.toUpperCase()}
                  </span>
                  {route.status === 'pending' && (
                    <button onClick={() => startRoute(route._id)} className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg">
                      <Play className="w-4 h-4 text-emerald-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Selection for Route Generation */}
        {drivers.length > 0 && (
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h3 className="text-lg font-bold mb-4">Available Drivers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {drivers.map((driver) => (
                <div key={driver._id} className="bg-slate-900 p-4 rounded-xl border border-slate-700 hover:border-emerald-500 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Truck className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold">{driver.email}</span>
                  </div>
                  <p className="text-sm text-slate-400">{driver.assignedVehicle || 'No vehicle'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
