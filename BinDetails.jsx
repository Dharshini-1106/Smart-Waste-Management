import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Camera, MapPin, Battery, Thermometer, Calendar } from 'lucide-react';
import { api } from '../lib/api';

export default function BinDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bin, setBin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBin();
  }, [id]);

  const fetchBin = async () => {
    try {
      const res = await getBinById(id);
      setBin({
        ...res.data,
        // Stub missing fields if backend doesn't have them
        type: res.data.type || 'Organic',
        gasLevel: res.data.gasLevel || Math.random() * 100,
        lastCollected: res.data.lastCollected || '2024-10-01T10:00:00Z',
        batteryLevel: res.data.batteryLevel || Math.random() * 100
      });
    } catch (err) {
      console.error('Error fetching bin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReportIssue = () => {
    navigate(`/report?binId=${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (!bin) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 flex items-center justify-center">
        <div className="text-center text-slate-400">Bin not found</div>
      </div>
    );
  }

  const getTypeColor = (type) => {
    const colors = {
      'Organic': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Recyclable': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'General': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      'Hazardous': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[type] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getFillColor = (level) => {
    if (level > 80) return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (level >= 50) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-green-400 bg-green-500/10 border-green-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <button 
          onClick={() => navigate('/citizen')}
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Bin {bin._id?.slice(-6)}
            </h1>
            <p className="text-slate-400 text-lg">Neighborhood: {bin.neighborhood}</p>
          </div>
          <div className={`px-6 py-3 rounded-2xl font-bold ${getFillColor(bin.fillLevel)} border`}>
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5" />
              {Math.round(bin.fillLevel)}%
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Core Stats */}
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${getTypeColor(bin.type)}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  {/* Type icon stub */}
                  <div className={`w-6 h-6 rounded-sm ${bin.type === 'Organic' ? 'bg-green-500' : bin.type === 'Hazardous' ? 'bg-red-500' : 'bg-blue-500'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Bin Type</h3>
                  <p className="text-slate-400 capitalize">{bin.type}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
                <Battery className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-400">{Math.round(bin.batteryLevel || 0)}%</p>
                <p className="text-sm text-slate-400 mt-1">Sensor Battery</p>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
                <Thermometer className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-400">{Math.round(bin.gasLevel || 0)}%</p>
                <p className="text-sm text-slate-400 mt-1">Gas/Odor Level</p>
              </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-slate-400" />
                <p className="text-slate-400">Last Collected</p>
              </div>
              <p className="text-xl font-mono text-emerald-400">
                {new Date(bin.lastCollected).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Right Column - Location & Reports */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-emerald-400" />
                <h3 className="font-bold text-xl">Location</h3>
              </div>
              <div className="text-sm space-y-1">
                <p><span className="text-slate-400">Lat:</span> {bin.location.coordinates[1].toFixed(4)}</p>
                <p><span className="text-slate-400">Lng:</span> {bin.location.coordinates[0].toFixed(4)}</p>
              </div>
            </div>

            {bin.reports && bin.reports.length > 0 && (
              <div className="bg-purple-500/10 border border-purple-500/30 p-6 rounded-xl">
                <h3 className="font-bold text-xl text-purple-400 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Active Reports ({bin.reports.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {bin.reports.slice(0,3).map((report, i) => (
                    <div key={i} className="bg-purple-500/20 p-3 rounded-lg text-sm">
                      {report.issueType || 'Issue'} - {report.status || 'Pending'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Report Issue Button */}
        <div className="text-center">
          <button
            onClick={handleReportIssue}
            className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-red-500/25 transition-all transform hover:-translate-y-1 flex items-center gap-3 mx-auto"
          >
            <AlertTriangle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
}
