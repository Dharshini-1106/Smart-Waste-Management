import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Map3D from './Map3D';
import { Activity, AlertTriangle, Truck } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [bins, setBins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticRes, binRes] = await Promise.all([
          axios.get('http://localhost:5000/api/bins/analytics'),
          axios.get('http://localhost:5000/api/bins')
        ]);
        setData(analyticRes.data);
        setBins(binRes.data);
      } catch (err) {
        console.error("Error fetching admin data", err);
      }
    };
    
    fetchData();
    const int = setInterval(fetchData, 10000);
    return () => clearInterval(int);
  }, []);

  const criticalBins = bins.filter(b => b.fillLevel > 80);
  const totalVolume = data.reduce((acc, curr) => acc + curr.volume, 0);

  return (
    <div className="flex-1 flex flex-col p-6 animate-fade-in w-full h-[calc(100vh-76px)] overflow-hidden">
        <header className="mb-6 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                     <Activity className="text-cyan-400" /> City Admin Command Center
                </h1>
                <p className="text-slate-400">Real-time Digital Twin & Analytics</p>
            </div>
            
            <div className="flex gap-4">
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 min-w-[150px]">
                    <p className="text-slate-400 text-sm">Critical Bins</p>
                    <p className="text-2xl font-bold text-red-400 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> {criticalBins.length}
                    </p>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 min-w-[150px]">
                    <p className="text-slate-400 text-sm">Active Trucks</p>
                    <p className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                        <Truck className="w-5 h-5" /> 12
                    </p>
                </div>
            </div>
        </header>
        
        <div className="flex-1 grid lg:grid-cols-3 gap-6 h-full min-h-0">
            {/* Map Area */}
            <div className="lg:col-span-2 h-full min-h-[400px]">
                <Map3D mode="admin" />
            </div>

            {/* Analytics Area */}
            <div className="h-full flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Chart Section */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex-1 min-h-[300px]">
                    <h2 className="text-xl font-bold mb-4">Volume by District</h2>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                            <Bar dataKey="volume" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Priority Alerts */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 max-h-[40%] overflow-y-auto custom-scrollbar">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-400">
                         Priority Interventions
                    </h2>
                    <div className="space-y-3">
                        {criticalBins.length === 0 ? (
                            <p className="text-slate-400 text-center py-4">No critical bins at the moment.</p>
                        ) : criticalBins.map(bin => (
                            <div key={bin._id} className="bg-slate-900 border border-red-500/30 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-white">Bin ID: {bin._id.substring(18)}</p>
                                    <p className="text-sm text-slate-400">{bin.neighborhood}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-red-400 font-bold">{Math.round(bin.fillLevel)}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
            .custom-scrollbar::-webkit-scrollbar { width: 8px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        `}} />
    </div>
  );
}
