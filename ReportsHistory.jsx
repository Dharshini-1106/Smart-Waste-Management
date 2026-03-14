import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';
import { api, getUserReports } from '../lib/api';

export default function ReportsHistory() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await getUserReports();
      setReports(res.data || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
      // Stub data
      setReports([
        {
          _id: '1',
          issueType: 'Broken Lid',
          status: 'Resolved',
          location: { coordinates: [40.7128, -74.0060] },
          photo: null,
          createdAt: '2024-10-10T14:30:00Z'
        },
        {
          _id: '2',
          issueType: 'Illegal Dumping',
          status: 'In Progress',
          location: { coordinates: [40.7138, -74.0070] },
          photo: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8A',
          createdAt: '2024-10-09T09:15:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'In Progress': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span>Loading reports...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/citizen')}
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-8">
            My Reports
          </h1>

          {reports.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-20 h-20 text-slate-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-300 mb-2">No reports yet</h3>
              <p className="text-slate-500 mb-8">Help keep your neighborhood clean by reporting issues!</p>
              <button
                onClick={() => navigate('/citizen')}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-8 py-3 rounded-xl font-bold transition-all"
              >
                Explore Map
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report._id} className="group bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-2xl p-6 transition-all hover:bg-slate-800/70 hover:shadow-emerald-500/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(report.status)}`}>
                      {report.status}
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatDate(report.createdAt)}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 capitalize">{report.issueType}</h3>

                  <div className="flex items-center gap-3 text-slate-400 mb-6 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{report.location.coordinates[1].toFixed(4)}, {report.location.coordinates[0].toFixed(4)}</span>
                  </div>

                  {report.photo && (
                    <div className="mb-6">
                      <img 
                        src={report.photo} 
                        alt="Report photo" 
                        className="w-full max-h-64 object-cover rounded-xl border border-slate-700 shadow-lg group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-4 border-t border-slate-700">
                    <Clock className="w-4 h-4" />
                    Reported by you
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
