import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, Filter, Trash2, AlertCircle, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getDriverBins } from '../lib/api';

const priorityColors = {
  'High': 'border-red-500 bg-red-500/10 text-red-400',
  'Medium': 'border-orange-500 bg-orange-500/10 text-orange-400',
  'Low': 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
};

export default function CollectionList() {
  const navigate = useNavigate();
  const [bins, setBins] = useState([]);
  const [sortBy, setSortBy] = useState('fill');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBins = async () => {
      try {
        const res = await getDriverBins(sortBy);
        setBins(res.data || generateDummyBins());
      } catch {
        setBins(generateDummyBins());
      } finally {
        setLoading(false);
      }
    };
    loadBins();
  }, [sortBy]);

  const generateDummyBins = () => [
    { id: 'B102', fill: 92, type: 'Organic', priority: 'High', reports: 2, neighborhood: 'Downtown', location: [-74.006, 40.712] },
    { id: 'B210', fill: 85, type: 'General', priority: 'Medium', reports: 0, neighborhood: 'Midtown', location: [-74.000, 40.715] },
    { id: 'B345', fill: 78, type: 'Recyclable', priority: 'High', reports: 1, neighborhood: 'East Village', location: [-73.990, 40.710] },
    { id: 'B167', fill: 95, type: 'Organic', priority: 'High', reports: 5, neighborhood: 'Harlem', location: [-73.945, 40.805] },
    { id: 'B289', fill: 63, type: 'General', priority: 'Low', reports: 0, neighborhood: 'Brooklyn', location: [-73.950, 40.700] },
  ];

  const filteredBins = bins.filter(bin => 
    bin?.id?.toLowerCase()?.includes(searchTerm.toLowerCase()) || 
    bin?.neighborhood?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  const goBack = () => navigate(-1);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-500 mx-auto mb-4 animate-spin-slow" />
          <p className="text-slate-400">Loading collection list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700 p-6 flex items-center gap-4">
        <button onClick={goBack} className="p-2 hover:bg-slate-800 rounded-xl">
          <ChevronLeft className="w-6 h-6 text-slate-400" />
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trash2 className="text-orange-400" />
          Collection List ({filteredBins.length})
        </h1>
      </div>

      {/* Search & Filter */}
      <div className="p-6 border-b border-slate-700 bg-slate-900/50">
        <div className="flex gap-3 max-w-md">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text"
              placeholder="Search bins or neighborhoods..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-cyan-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="fill">Fill Level</option>
            <option value="priority">Priority</option>
            <option value="reports">Reports</option>
            <option value="weather">Weather</option>
            <option value="route">Route Order</option>
          </select>
        </div>
      </div>

      {/* Bin List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {filteredBins.map((bin, index) => (
          <Link 
            key={bin.id} 
            to={`/driver/collect/${bin.id}`}
            className={`group block p-6 rounded-2xl border-2 transition-all hover:scale-[1.01] hover:shadow-2xl hover:border-cyan-400 ${priorityColors[bin.priority]}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-slate-900 border-2 border-current rounded-lg flex items-center justify-center font-mono font-bold text-sm">
                  {index + 1}
                </span>
                <div className="font-mono text-2xl font-bold">{bin.id}</div>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-2 shadow-lg">
                  {bin.fill}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div><span className="text-slate-400">Type:</span> {bin.type}</div>
              <div><span className="text-slate-400">Priority:</span> <span className="font-bold uppercase px-2 py-1 rounded-full text-xs bg-current/10">{bin.priority}</span></div>
              <div><span className="text-slate-400">Neighborhood:</span> {bin.neighborhood}</div>
              <div className="md:col-span-2"><span className="text-slate-400">Reports:</span> <span className={`font-bold ${bin.reports > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>{bin.reports}</span></div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-current/20 group-hover:bg-slate-800/50 rounded-xl p-3 transition-all">
              <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <span className="text-slate-300 truncate">{bin.neighborhood}, Tap for navigation</span>
              <div className="ml-auto flex items-center gap-1 text-xs bg-slate-800 px-3 py-1 rounded-full">
                <Filter className="w-3 h-3" />
                {bin.priority}
              </div>
            </div>
          </Link>
        ))}
        {filteredBins.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500">
            <Trash2 className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">No bins match your search</p>
            <p className="text-sm mt-1">Try adjusting filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}
