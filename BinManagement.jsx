
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, Filter, MapPin } from 'lucide-react';

export default function BinManagement() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
// const [editingBin, setEditingBin] = useState(null);
  const [newBin, setNewBin] = useState({ id: '', neighborhood: '', location: [40.7128, -74.006] });

  useEffect(() => {
    fetchBins();
  }, []);

  const fetchBins = async () => {
    try {
      const res = await fetch('/api/admin/bins', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setBins(data);
    } catch (err) {
      console.error('Error fetching bins', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBins = bins.filter(bin => 
    bin.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bin.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addBin = async () => {
    try {
      await fetch('/api/admin/bins', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newBin)
      });
      setShowAddModal(false);
      fetchBins();
    } catch (err) {
      console.error('Error adding bin', err);
    }
  };

  const deleteBin = async (id) => {
    if (confirm('Delete this bin?')) {
      try {
        await fetch(`/api/admin/bins/${id}`, { method: 'DELETE' });
        fetchBins();
      } catch (err) {
        console.error('Error deleting bin', err);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700 p-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <MapPin className="text-emerald-400" />
          Bin Management
        </h1>
        <p className="text-slate-400">Manage all waste bins across the city</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Search & Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <input 
              type="search" 
              placeholder="Search bins by ID or neighborhood..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Bin
          </button>
        </div>

        {/* Bins Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
              <span className="w-8 text-center">#</span>
              <span className="flex-1">ID</span>
              <span className="w-32">Neighborhood</span>
              <span className="w-24">Fill Level</span>
              <span className="w-32">Location</span>
              <span className="w-24 text-center">Actions</span>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading bins...</div>
            ) : filteredBins.map((bin, index) => (
              <div key={bin._id} className="p-6 border-t border-slate-700 hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center font-mono font-bold">{index + 1}</span>
                  <span className="flex-1 font-mono font-bold">{bin._id?.substring(18)}</span>
                  <span className="w-32">{bin.neighborhood}</span>
                  <span className="w-24 font-bold text-emerald-400">{bin.fillLevel}%</span>
                  <span className="w-32 text-sm text-slate-400">{bin.location.coordinates[1].toFixed(4)}, {bin.location.coordinates[0].toFixed(4)}</span>
                  <div className="w-24 flex gap-2 justify-end">
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4 text-amber-400" />
                    </button>
                    <button onClick={() => deleteBin(bin._id)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Add New Bin</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 mb-2">Bin ID</label>
                  <input 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                    value={newBin.id}
                    onChange={(e) => setNewBin({...newBin, id: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-2">Neighborhood</label>
                  <input 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                    value={newBin.neighborhood}
                    onChange={(e) => setNewBin({...newBin, neighborhood: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="number" 
                    placeholder="Lat"
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                    value={newBin.location[1]}
                    onChange={(e) => setNewBin({...newBin, location: [newBin.location[0], parseFloat(e.target.value)]})}
                  />
                  <input 
                    type="number" 
                    placeholder="Lng"
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
                    value={newBin.location[0]}
                    onChange={(e) => setNewBin({...newBin, location: [parseFloat(e.target.value), newBin.location[1]]})}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={addBin} className="flex-1 bg-emerald-500 hover:bg-emerald-600 py-3 rounded-xl font-bold">
                    Add Bin
                  </button>
                  <button onClick={() => setShowAddModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

